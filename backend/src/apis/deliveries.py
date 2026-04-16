import hashlib
import hmac
import json
import logging
import os
from fastapi import APIRouter, HTTPException, Depends, Request

from core.auth import verify_token
from dao.dao_deliveries import DAODeliveries
from dao.dao_orders import DAOOrders
from dao.dao_seller_profiles import DAOSellerProfiles
from schemas.delivery_schemas import RequestQuotation
from services.lalamove_service import get_lalamove_service

router = APIRouter(prefix="/deliveries")
logger = logging.getLogger(__name__)


# --------------------------------------------------------------------------
# POST /deliveries/quotation — get delivery fee estimate
# --------------------------------------------------------------------------
@router.post("/quotation")
def get_quotation(body: RequestQuotation, user=Depends(verify_token)):
    try:
        dao_sellers = DAOSellerProfiles()
        seller = dao_sellers.read_seller_coords_by_id(body.seller_id)
        if not seller:
            raise HTTPException(status_code=404, detail="Seller not found")

        seller_lat = seller.get("lat")
        seller_lon = seller.get("lon")
        if not seller_lat or not seller_lon:
            raise HTTPException(status_code=400, detail="Seller location not configured")

        service = get_lalamove_service()
        result = service.get_quotation(
            pickup_lat=float(seller_lat),
            pickup_lon=float(seller_lon),
            pickup_address=seller.get("address") or "Pickup",
            dropoff_lat=body.delivery_lat,
            dropoff_lon=body.delivery_lon,
            dropoff_address=body.delivery_address,
        )

        return {
            "success": True,
            "quotation_id": result.quotation_id,
            "stop_id_0": result.stop_id_0,
            "stop_id_1": result.stop_id_1,
            "total_fee": result.total_fee,
            "currency": result.currency,
            "distance_km": result.distance_km,
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Exception in POST /deliveries/quotation: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# --------------------------------------------------------------------------
# GET /deliveries/{order_id}/status — read delivery status from DB (buyer)
# Webhook updates the DB; frontend uses Supabase realtime — no Lalamove API call needed here
# --------------------------------------------------------------------------
@router.get("/{order_id}/status")
def get_delivery_status(order_id: str, user=Depends(verify_token)):
    try:
        dao_orders = DAOOrders()
        order = dao_orders.read_order_by_id(order_id, user["id"])
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        dao_deliveries = DAODeliveries()
        delivery = dao_deliveries.read_delivery_by_order_id(order_id)
        if not delivery:
            return {"success": True, "delivery": None}

        return {
            "success": True,
            "delivery": {
                "status": delivery.get("status"),
                "driver_name": delivery.get("driver_name"),
                "driver_phone": delivery.get("driver_phone"),
                "driver_plate": delivery.get("driver_plate"),
                "tracking_url": delivery.get("tracking_url"),
                "share_link": delivery.get("share_link"),
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Exception in GET /deliveries/{order_id}/status: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# --------------------------------------------------------------------------
# POST /deliveries/webhook — Lalamove status callback (public, v3)
# --------------------------------------------------------------------------
@router.post("/webhook")
async def delivery_webhook(request: Request):
    try:
        # Read raw bytes first — needed for exact HMAC verification
        raw_body = await request.body()
        body = json.loads(raw_body)

        api_key    = body.get("apiKey", "")
        timestamp  = body.get("timestamp", 0)
        signature  = body.get("signature", "")
        event_type = body.get("eventType", "")
        data       = body.get("data", {})

        # Signature validation — extract raw data substring to avoid re-serialize issues
        api_secret = os.getenv("LALAMOVE_API_SECRET", "")
        if api_secret:
            if api_key != os.getenv("LALAMOVE_API_KEY", ""):
                logger.warning(f"Webhook: apiKey mismatch ({api_key[:10]}...)")
                return {"success": False, "detail": "Invalid apiKey"}

            # Extract the raw "data" value from the original body bytes
            # so we sign exactly what Lalamove signed (no re-serialization risk)
            raw_str   = raw_body.decode("utf-8")
            data_start = raw_str.index('"data"') + len('"data"')
            # skip whitespace and ':'
            i = data_start
            while i < len(raw_str) and raw_str[i] in ' \t\r\n:':
                i += 1
            # extract balanced JSON object/array
            depth, in_str, escape = 0, False, False
            start = i
            while i < len(raw_str):
                c = raw_str[i]
                if escape:
                    escape = False
                elif c == '\\' and in_str:
                    escape = True
                elif c == '"':
                    in_str = not in_str
                elif not in_str:
                    if c in '{[':
                        depth += 1
                    elif c in '}]':
                        depth -= 1
                        if depth == 0:
                            break
                i += 1
            raw_data_str = raw_str[start:i + 1]

            path = request.url.path
            raw  = f"{timestamp}\r\nPOST\r\n{path}\r\n\r\n{raw_data_str}"
            expected = hmac.new(api_secret.encode(), raw.encode(), hashlib.sha256).hexdigest()
            if not hmac.compare_digest(expected, signature):
                logger.warning(f"Webhook: signature mismatch. path={path}")
                return {"success": False, "detail": "Invalid signature"}

        # v3 payload: data.order holds the order fields
        order_data  = data.get("order", {})
        driver_data = data.get("driver", {})

        lalamove_order_id = order_data.get("orderId")
        new_status        = order_data.get("status")

        if not lalamove_order_id or not new_status:
            logger.warning(f"Webhook: missing orderId or status in payload (eventType={event_type})")
            return {"success": True}  # 200 so Lalamove doesn't retry malformed events

        dao_deliveries = DAODeliveries()
        delivery = dao_deliveries.read_delivery_by_lalamove_order_id(lalamove_order_id)
        if not delivery:
            logger.warning(f"Webhook: no delivery row for lalamove_order_id={lalamove_order_id}")
            return {"success": True}  # 200 — unknown order, don't retry

        update_data = {"status": new_status}

        # Driver info present in DRIVER_ASSIGNED and some ORDER_STATUS_CHANGED events
        if driver_data.get("name"):
            update_data["driver_name"] = driver_data["name"]
        if driver_data.get("phone"):
            update_data["driver_phone"] = driver_data["phone"]
        if driver_data.get("plateNumber"):
            update_data["driver_plate"] = driver_data["plateNumber"]
        if order_data.get("shareLink"):
            update_data["share_link"] = order_data["shareLink"]

        dao_deliveries.update_delivery(delivery["id"], update_data)
        logger.warning(f"[Webhook] {event_type} → order={lalamove_order_id} status={new_status}")

        # Terminal status → update our order
        if new_status == "COMPLETED":
            dao_orders = DAOOrders()
            dao_orders.update_order_status(delivery["order_id"], "done")
        elif new_status in ("CANCELED", "CANCELLED", "REJECTED", "EXPIRED"):
            dao_deliveries.update_delivery(delivery["id"], {"status": "CANCELLED"})

        return {"success": True}

    except Exception as e:
        logger.exception(f"Exception in POST /deliveries/webhook: {e}")
        # Still return 200 to avoid Lalamove retry storms on our own bugs
        return {"success": False, "detail": "Internal error"}


# --------------------------------------------------------------------------
# DELETE /deliveries/{order_id}/cancel — cancel delivery
# --------------------------------------------------------------------------
@router.delete("/{order_id}/cancel")
def cancel_delivery(order_id: str, user=Depends(verify_token)):
    try:
        dao_orders = DAOOrders()
        order = dao_orders.read_order_by_id(order_id, user["id"])
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        dao_deliveries = DAODeliveries()
        delivery = dao_deliveries.read_delivery_by_order_id(order_id)
        if not delivery:
            raise HTTPException(status_code=404, detail="No delivery found for this order")

        service = get_lalamove_service()
        lalamove_order_id = delivery.get("lalamove_order_id")
        if lalamove_order_id:
            service.cancel_order(lalamove_order_id)

        dao_deliveries.update_delivery(delivery["id"], {"status": "CANCELLED"})

        return {"success": True}

    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Exception in DELETE /deliveries/{order_id}/cancel: {e}")
        raise HTTPException(status_code=500, detail=str(e))
