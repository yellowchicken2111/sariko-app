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
        
        
@router.get("/info/{user_id}")
def get_user_profile(user_id: str, user=Depends(verify_token)):
    pass