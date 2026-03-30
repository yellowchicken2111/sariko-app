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

router = APIRouter(prefix="/cart")
logger = logging.getLogger(__name__)

@router.get("/")
def get_current_cart(user=Depends(verify_token)):
    pass

@router.post("/add")
def add_item_to_cart(user=Depends(verify_token)):
    pass

@router.patch("/update")
def update_cart(
    user=Depends(verify_token)):
    pass

@router.get("/remove/{item_id}")
def remove_item_from_cart(user=Depends(verify_token)):
    pass

@router.delete("/clear")
def clear_cart(user=Depends(verify_token)):
    pass
