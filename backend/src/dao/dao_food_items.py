from typing import Optional, List
import logging

from postgrest.exceptions import APIError as PostgrestExceptionAPIError

from dao.dao_base import DAOBase

logger = logging.getLogger(__name__)

class DAOFoodItems(DAOBase):
    
    def __init__(self):
        super().__init__()
        self._table_name = "food_items"
        
    def read_featured_dishes(self, limit: int = 12):
        query = self._supabase_client.table(self._table_name)
        query = query.select('id, name, price_text, image_url, seller_profiles(id, slug, store_name)')
        query = query.eq('is_featured', True).eq('is_available', True).limit(limit)
        result = query.execute()
        return result.data if result and result.data else []

    def read_food_items_by_seller_id(self, seller_id: str):
        
        # query = self._supabase_client.table(self._table_name)
        # query = query.select('*, menu_categories(name)').in_("category_id", menu_categories_ids)
        # result = query.execute()
        # if result and result.data:
        #     return result.data
        
        query = self._supabase_client.table('menu_categories')
        query = query.select('id, name, food_items(id, name, price_text, price, description, image_url)').order("sort_order").eq("seller_id", seller_id)
        result = query.execute()
        if result and result.data:
            return result.data
        
        return None
            
        