import datetime
import uuid
import traceback
from typing import List, Optional
import json
import logging

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
from dao.dao_user_addresses import DAOUserAddresses
from schemas.request_schemas import RequestUpdateProfile

router = APIRouter(prefix="/users")
logger = logging.getLogger(__name__)


@router.get("/info/me")
def get_current_user_profile(user=Depends(verify_token)):
    try:
        dao_users = DAOUsers()
        users = dao_users.get_users(user_id=user["id"])
    
        return {"success": True , "user": users}
    
    except HTTPException as e:
        logger.exception(f"Exception in /users/me: {repr(e)}")
        if e.status_code == 401:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid JWT token - {repr(e)}",
            )
    
    except Exception as e:
        logger.exception(f"Exception in /users/me: {repr(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"{repr(e)}",
        )
        
        
@router.patch("/me/profile")
def update_current_user_profile(body: RequestUpdateProfile, user=Depends(verify_token)):
    try:
        user_id = user["id"]
        dao_users = DAOUsers()
        updated_user = dao_users.update_user_profile(user_id, body.model_dump(exclude_none=True))

        if body.address:
            dao_addresses = DAOUserAddresses()
            dao_addresses.upsert_default_address(
                user_id=user_id,
                address=body.address,
                address_details=body.address_details,
                lat=body.lat,
                lon=body.lon,
            )

        return {"success": True, "user": updated_user}

    except Exception as e:
        logger.exception(f"Exception in PATCH /users/me/profile: {repr(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"{repr(e)}",
        )


@router.get("/me/address")
def get_default_address(user=Depends(verify_token)):
    try:
        dao_addresses = DAOUserAddresses()
        address = dao_addresses.read_default_address(user["id"])
        return {"success": True, "address": address}
    except Exception as e:
        logger.exception(f"Exception in GET /users/me/address: {repr(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"{repr(e)}",
        )


@router.get("/info/{user_id}")
def get_user_profile(user_id: str, user=Depends(verify_token)):
    pass