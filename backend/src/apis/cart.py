import datetime
import uuid
import traceback
from typing import List, Optional
import json
import logging

from dao.dao_cart_items import DAOCartItems
from dao.dao_carts import DAOCarts
from schemas.request_schemas import (
    RequestReadCartItems,
    RequestAddCartItem
)

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

router = APIRouter(prefix="/cart")
logger = logging.getLogger(__name__)

@router.get("/")
def get_current_cart(user=Depends(verify_token)):
        
    dao_cart_items = DAOCartItems()
    items = dao_cart_items.read_cart_items_by_user_id(user_id=user["id"])    
    return {"success": True, "items": items}


@router.post("/add")
def add_item_to_cart(request: RequestAddCartItem, user=Depends(verify_token)):
    
    user_id = user["id"]
    dao_cart = DAOCarts()    
    cart = dao_cart.read_cart_by_user_id_seller_id(user_id=user_id)
    if cart:
        cart_id = cart["id"]
        seller_id = cart["seller_id"]
        if not seller_id == request.seller_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Your cart contains items from another seller. Clear cart to add items from this seller.")
    else:    
        cart_id = dao_cart.create_cart(user_id=user_id, seller_id=request.seller_id)
        
    dao_cart_items = DAOCartItems()
    items = dao_cart_items.update_food_item_by_cart_id(cart_id=cart_id, food_item_id=request.food_item_id)
    
    return {"success": True}    

@router.patch("/update")
def update_food_item_quantity(user=Depends(verify_token)):
    pass

@router.get("/remove/{item_id}")
def remove_item_from_cart(user=Depends(verify_token)):
    pass

@router.delete("/clear")
def clear_cart(user=Depends(verify_token)):
    pass
