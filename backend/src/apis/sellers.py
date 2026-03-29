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

router = APIRouter(prefix="/sellers")
logger = logging.getLogger(__name__)


@router.get("/")
def get_sellers(user=Depends(verify_token)):
    pass


@router.get("/founding")
def get_founding_sellers(user=Depends(verify_token)):
    
    dao_seller_profiles = DAOSellerProfiles()
    sellers = dao_seller_profiles.read_founding_sellers()
    
    return {"success": True, "founding_sellers": sellers}


@router.get("/{slug_name}")
def get_founding_sellers(slug_name, user=Depends(verify_token)):
    
    dao_seller_profiles = DAOSellerProfiles()
    seller = dao_seller_profiles.read_seller_by_slug_name(slug=slug_name)
    
    return {"success": True, "seller": seller}

        
@router.get("/{slug_name}/menu")
def get_seller_menu_food_items(slug_name: str, user=Depends(verify_token)):
    
    # get seller id
    dao_seller_profiles = DAOSellerProfiles()
    seller = dao_seller_profiles.read_seller_by_slug_name(slug=slug_name)
    seller_id = seller["id"]
    
    # get food items
    dao_food_items = DAOFoodItems()
    food_items = dao_food_items.read_food_items_by_seller_id(seller_id=seller_id)
    
    return {"success": True, "menus": food_items}