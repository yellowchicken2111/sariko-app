import datetime
import uuid
import traceback
from typing import List, Optional
import json
import logging

from dao.dao_menu_categories import DAOMenuCategories
from dao.dao_seller_profiles import DAOSellerProfiles
from dao.dao_food_items import DAOFoodItems

from fastapi import (
    APIRouter,
    HTTPException,
    Depends,
    status,
    Query, 
    Response
)

from core.auth import verify_token
from dao.dao_users import DAOUsers
from dao.dao_orders import DAOOrders
from schemas.request_schemas import RequestUpdateOrderStatus

router = APIRouter(prefix="/sellers")
logger = logging.getLogger(__name__)

VALID_STATUS_TRANSITIONS = {
    "pending": ["confirmed", "cancelled"],
    "confirmed": ["ready", "cancelled"],
    "ready": ["done"],
}


@router.get("/")
def get_sellers(user=Depends(verify_token)):
    pass


@router.get("/founding")
def get_founding_sellers():

    dao_seller_profiles = DAOSellerProfiles()
    sellers = dao_seller_profiles.read_founding_sellers()

    return {"success": True, "founding_sellers": sellers}


# ── Seller Dashboard Endpoints (must be before /{slug_name} wildcard) ──

def _get_seller_id(user):
    dao = DAOSellerProfiles()
    profile = dao.read_seller_profile_by_user_id(user["id"])
    if not profile:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User is not a seller")
    return profile["id"]


@router.get("/me/orders")
def get_seller_orders(user=Depends(verify_token)):
    try:
        seller_id = _get_seller_id(user)
        dao_orders = DAOOrders()
        orders = dao_orders.read_orders_by_seller_id(seller_id)
        return {"success": True, "orders": orders}
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Exception in GET /sellers/me/orders: {repr(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/me/orders/{order_id}")
def get_seller_order_detail(order_id: str, user=Depends(verify_token)):
    try:
        seller_id = _get_seller_id(user)
        dao_orders = DAOOrders()
        order = dao_orders.read_order_by_id_for_seller(order_id, seller_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        return {"success": True, "order": order}
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Exception in GET /sellers/me/orders/{order_id}: {repr(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/me/orders/{order_id}/status")
def update_seller_order_status(order_id: str, body: RequestUpdateOrderStatus, user=Depends(verify_token)):
    try:
        seller_id = _get_seller_id(user)
        dao_orders = DAOOrders()

        order = dao_orders.read_order_by_id_for_seller(order_id, seller_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        allowed = VALID_STATUS_TRANSITIONS.get(order["status"], [])
        if body.status not in allowed:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot transition from '{order['status']}' to '{body.status}'"
            )

        # Pass cancellation_reason when rejecting
        cancellation_reason = body.cancellation_reason if body.status == "cancelled" else None
        updated = dao_orders.update_order_status(order_id, body.status, cancellation_reason)

        # Auto-book Lalamove delivery when seller marks order "ready"
        if body.status == "ready" and order.get("delivery_method") == "delivery":
            try:
                from services.lalamove_service import get_lalamove_service
                from dao.dao_deliveries import DAODeliveries

                full_order = dao_orders.read_order_with_seller_coords(order_id)
                if full_order:
                    seller_profile = full_order.get("seller_profiles") or {}
                    buyer = full_order.get("users") or {}
                    quotation_id = full_order.get("quotation_id", "")

                    service = get_lalamove_service()
                    result = service.place_order(
                        quotation_id=quotation_id,
                        sender_name=seller_profile.get("store_name", "Seller"),
                        sender_phone="0900000000",
                        recipient_name=buyer.get("name") or buyer.get("email") or "Customer",
                        recipient_phone=buyer.get("phone") or "0900000000",
                        recipient_remarks=full_order.get("delivery_address") or "",
                    )

                    dao_deliveries = DAODeliveries()
                    dao_deliveries.create_delivery(
                        order_id=order_id,
                        provider="lalamove",
                        status=result.status,
                        lalamove_order_id=result.lalamove_order_id,
                        share_link=result.share_link,
                    )
                    logger.info(f"Auto-booked delivery for order {order_id}: {result.lalamove_order_id}")
            except Exception as delivery_err:
                logger.error(f"Failed to auto-book delivery for order {order_id}: {delivery_err}")

        return {"success": True, "order": updated}
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Exception in PATCH /sellers/me/orders/{order_id}/status: {repr(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ── Public Seller Endpoints (wildcard routes last) ──

@router.get("/{slug_name}")
def get_seller_by_slug_name(slug_name):

    dao_seller_profiles = DAOSellerProfiles()
    seller = dao_seller_profiles.read_seller_by_slug_name(slug=slug_name)
    if not seller:
        raise HTTPException(status_code=404, detail="Seller not found")

    return {"success": True, "seller": seller}


@router.get("/{slug_name}/menu")
def get_seller_menu_food_items(slug_name: str):

    dao_seller_profiles = DAOSellerProfiles()
    seller = dao_seller_profiles.read_seller_by_slug_name(slug=slug_name)
    if not seller:
        raise HTTPException(status_code=404, detail="Seller not found")

    dao_food_items = DAOFoodItems()
    food_items = dao_food_items.read_food_items_by_seller_id(seller_id=seller["id"])

    return {"success": True, "menus": food_items or []}