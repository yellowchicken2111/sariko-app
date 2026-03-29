from typing import Optional
import logging

from postgrest.exceptions import APIError as PostgrestExceptionAPIError

from dao.dao_base import DAOBase

logger = logging.getLogger(__name__)

class DAOUsers(DAOBase):
    
    def __init__(self):
        super().__init__()
        self._table_name = "users"
        
    def get_users(self, user_id: Optional[str] = None):
        
        try:
            logger.warning(f"user_id {user_id}")
            query = self._supabase_client.table(self._table_name)
            query = query.select("*")
            
            if user_id:
                query = query.eq("id", user_id)
            
            query = query.maybe_single()
            result = query.execute()
            if result and result.data:
                return result.data
            
            return None
    
        except PostgrestExceptionAPIError as e:
            raise Exception(f"Supabase error - get_users with user_id {user_id}: {e}")
                
        except Exception as e:
            raise Exception(f"error get_users with user_id {user_id}: {e}")
        