import logging

from fastapi import (
    APIRouter,
    HTTPException,
    Depends,
    status,
)

from core.auth import verify_token
from dao.dao_carts import DAOCarts
from dao.dao_cart_items import DAOCartItems
from dao.dao_orders import DAOOrders
from dao.dao_order_items import DAOOrderItems
from schemas.request_schemas import RequestCreateOrder

router = APIRouter(prefix="/orders")
logger = logging.getLogger(__name__)


@router.post("")
def create_order(request: RequestCreateOrder, user=Depends(verify_token)):

    user_id = user["id"]

    # 1. Get user's cart with items
    dao_cart_items = DAOCartItems()
    cart = dao_cart_items.read_cart_items_by_user_id(user_id=user_id)

    if not cart or not cart.get("cart_items"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cart is empty")

    # Idempotency: check if user has a pending order from same seller created in last 60s
    dao_orders = DAOOrders()
    recent = dao_orders.read_orders_by_user_id(user_id=user_id)
    if recent:
        import datetime
        now = datetime.datetime.utcnow()
        for r in recent:
            if r["seller_id"] == cart["seller_id"] and r["status"] == "pending":
                created = datetime.datetime.fromisoformat(r["created_at"].replace("Z", "+00:00").replace("+00:00", ""))
                if (now - created).total_seconds() < 60:
                    raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Duplicate order detected. Please wait.")

    # 2. Calculate total
    cart_items = cart["cart_items"]
    total_amount = sum(
        item["food_items"]["price"] * item["quantity"]
        for item in cart_items
    )

    # 3. Create order
    order = dao_orders.create_order(
        user_id=user_id,
        seller_id=cart["seller_id"],
        total_amount=total_amount,
        delivery_method=request.delivery_method,
        delivery_address=request.delivery_address,
        note=request.note,
    )

    if not order:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create order")

    # 4. Copy cart items → order items (snapshot). Rollback order if fails.
    try:
        dao_order_items = DAOOrderItems()
        dao_order_items.create_order_items_from_cart(order_id=order["id"], cart_items=cart_items)
    except Exception as e:
        dao_orders.update_order_status(order_id=order["id"], status="cancelled")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create order items")

    # 5. Clear cart (best-effort — order already committed)
    try:
        dao_cart = DAOCarts()
        dao_cart.delete_cart(cart_id=cart["id"])
    except Exception as e:
        logger.warning(f"Failed to clear cart after order {order['id']}: {e}")

    return {"success": True, "order": order}


@router.get("")
def get_orders(user=Depends(verify_token)):

    dao_orders = DAOOrders()
    orders = dao_orders.read_orders_by_user_id(user_id=user["id"])

    return {"success": True, "orders": orders}


@router.get("/{order_id}")
def get_order_detail(order_id: str, user=Depends(verify_token)):

    dao_orders = DAOOrders()
    order = dao_orders.read_order_by_id(order_id=order_id, user_id=user["id"])

    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    return {"success": True, "order": order}


@router.patch("/{order_id}/cancel")
def cancel_order(order_id: str, user=Depends(verify_token)):

    dao_orders = DAOOrders()
    order = dao_orders.read_order_by_id(order_id=order_id, user_id=user["id"])

    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    if order["status"] != "pending":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only pending orders can be cancelled")

    dao_orders.update_order_status(order_id=order_id, status="cancelled")

    return {"success": True}
