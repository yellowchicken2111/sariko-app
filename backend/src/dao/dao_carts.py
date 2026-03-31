from typing import Optional
import logging

from postgrest.exceptions import APIError as PostgrestExceptionAPIError

from dao.dao_base import DAOBase

logger = logging.getLogger(__name__)

class DAOCarts(DAOBase):
    
    def __init__(self):
        super().__init__()
        self._table_name = "carts"
        
    def read_cart_by_user_id_seller_id(self, user_id):
        
        try:
        
            query = self._supabase_client.table(self._table_name)
            query = query.select('id, seller_id').eq("user_id", user_id)
            
            query = query.maybe_single()
            result = query.execute()
            
            if result and result.data:
                return result.data
            
            return None

        except PostgrestExceptionAPIError as e:
            raise Exception(f"Supabase error - read_cart_by_user_id_seller_id with user_id {user_id}: {e}")
                
        except Exception as e:
            raise Exception(f"error read_cart_by_user_id_seller_id with user_id {user_id}: {e}")
    
    
    
    def create_cart(self, user_id: str, seller_id: str):
        
        try:
        
            query = self._supabase_client.table(self._table_name)
            query = query.insert({"user_id": user_id, "seller_id": seller_id})
            result = query.execute()
            
            if result.data:
                return result.data[0]
            
            return None
    
        except PostgrestExceptionAPIError as e:
            raise Exception(f"Supabase error - create_cart with user_id {user_id} and seller id {seller_id}: {e}")
                
        except Exception as e:
            raise Exception(f"error create_cart with user_id {user_id} and seller id {seller_id}: {e}")

    
        