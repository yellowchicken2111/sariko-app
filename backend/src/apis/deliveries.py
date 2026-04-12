import logging
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Depends, Request, status

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
            pickup_address=seller.get("address", ""),
            dropoff_lat=body.delivery_lat,
            dropoff_lon=body.delivery_lon,
            dropoff_address="",
        )

        return {
            "success": True,
            "quotation_id": result.quotation_id,
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
# GET /deliveries/{order_id}/status — poll delivery status (buyer)
# --------------------------------------------------------------------------
@router.get("/{order_id}/status")
def get_delivery_status(order_id: str, user=Depends(verify_token)):
    try:
        # Verify the order belongs to this user
        dao_orders = DAOOrders()
        order = dao_orders.read_order_by_id(order_id, user["id"])
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        dao_deliveries = DAODeliveries()
        delivery = dao_deliveries.read_delivery_by_order_id(order_id)
        if not delivery:
            return {"success": True, "delivery": None}

        # In mock mode, compute status from elapsed time
        service = get_lalamove_service()
        lalamove_order_id = delivery.get("lalamove_order_id")
        created_at_str = delivery.get("created_at")

        if lalamove_order_id and created_at_str:
            if isinstance(created_at_str, str):
                created_at = datetime.fromisoformat(created_at_str.replace("Z", "+00:00"))
            else:
                created_at = created_at_str

            result = service.get_order(lalamove_order_id, created_at)

            # Update delivery row with latest status
            update_data = {"status": result.status}
            if result.driver_name:
                update_data["driver_name"] = result.driver_name
            if result.driver_phone:
                update_data["driver_phone"] = result.driver_phone
            if result.driver_plate:
                update_data["driver_plate"] = result.driver_plate
            if result.tracking_url:
                update_data["tracking_url"] = result.tracking_url
            if result.share_link:
                update_data["share_link"] = result.share_link

            dao_deliveries.update_delivery(delivery["id"], update_data)

            # If completed, also mark order as done
            if result.status == "COMPLETED" and order.get("status") != "done":
                dao_orders.update_order_status(order_id, "done")

            return {
                "success": True,
                "delivery": {
                    "status": result.status,
                    "driver_name": result.driver_name,
                    "driver_phone": result.driver_phone,
                    "driver_plate": result.driver_plate,
                    "tracking_url": result.tracking_url,
                    "share_link": result.share_link,
                }
            }

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
# POST /deliveries/webhook — Lalamove status callback (public)
# --------------------------------------------------------------------------
@router.post("/webhook")
async def delivery_webhook(request: Request):
    try:
        body = await request.json()
        lalamove_order_id = body.get("orderId")
        new_status = body.get("status")

        if not lalamove_order_id or not new_status:
            raise HTTPException(status_code=400, detail="Missing orderId or status")

        dao_deliveries = DAODeliveries()
        delivery = dao_deliveries.read_delivery_by_lalamove_order_id(lalamove_order_id)
        if not delivery:
            logger.warning(f"Webhook: delivery not found for lalamove_order_id={lalamove_order_id}")
            return {"success": False, "detail": "Delivery not found"}

        # Extract driver info from webhook payload
        driver_data = body.get("data", {})
        driver_info = driver_data.get("driver", {})

        update_data = {"status": new_status}
        if driver_info.get("name"):
            update_data["driver_name"] = driver_info["name"]
        if driver_info.get("phone"):
            update_data["driver_phone"] = driver_info["phone"]
        if driver_info.get("plateNumber"):
            update_data["driver_plate"] = driver_info["plateNumber"]
        if driver_data.get("shareLink"):
            update_data["share_link"] = driver_data["shareLink"]
        if driver_data.get("trackingUrl"):
            update_data["tracking_url"] = driver_data["trackingUrl"]

        dao_deliveries.update_delivery(delivery["id"], update_data)

        # If completed, mark order as done
        if new_status == "COMPLETED":
            dao_orders = DAOOrders()
            dao_orders.update_order_status(delivery["order_id"], "done")

        return {"success": True}

    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Exception in POST /deliveries/webhook: {e}")
        raise HTTPException(status_code=500, detail=str(e))


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
