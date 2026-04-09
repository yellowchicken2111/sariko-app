from typing import Optional
import logging

from postgrest.exceptions import APIError as PostgrestExceptionAPIError

from dao.dao_base import DAOBase

logger = logging.getLogger(__name__)

class DAOMenuCategories(DAOBase):
    
    def __init__(self):
        super().__init__()
        self._table_name = "menu_categories"
        
    def read_menu_categories_by_seller_id(self, seller_id):
        
        try:
            query = self._supabase_client.table(self._table_name)
            query = query.select("id, name").eq("seller_id", seller_id).order("sort_order")
            
            result = query.execute()
            
            if result and result.data:
                return result.data
                
            return None
            
        except PostgrestExceptionAPIError as e:
            raise Exception(f"Supabase error - read_menu_categories_by_seller_id with seller_id {seller_id}: {e}")
                
        except Exception as e:
            raise Exception(f"error read_menu_categories_by_seller_id with seller_id {seller_id}: {e}")
    
        