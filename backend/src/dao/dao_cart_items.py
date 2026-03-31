from typing import Optional
import logging

from postgrest.exceptions import APIError as PostgrestExceptionAPIError

from dao.dao_base import DAOBase

logger = logging.getLogger(__name__)

class DAOCartItems(DAOBase):
    
    def __init__(self):
        super().__init__()
        self._table_name = "cart_items"
        
        
    def read_cart_items_by_user_id(self, user_id: str):
        
        try:
            result = self._supabase_client.table("carts") \
                .select("id, cart_items(quantity, food_items(id, name, price_text, price, image_url, menu_categories(name)))") \
                .eq("user_id", user_id) \
                .maybe_single() \
                .execute()

            if result and result.data:
                return result.data

            return None

        except PostgrestExceptionAPIError as e:
            raise Exception(f"Supabase error - read_cart_items with user_id {user_id}: {e}")
                
        except Exception as e:
            raise Exception(f"error read_cart_items with user_id {user_id}: {e}")        
        
        
        
    def update_food_item_by_cart_id(self, cart_id: str, food_item_id: str):
        
        try:
        
            query = self._supabase_client.table(self._table_name)
            query = query.insert({"cart_id": cart_id, "food_item_id": food_item_id, "quantity": 1})
    
            result = query.execute()
            
            if result and result.data:
                return result.data
            
            return None

        except PostgrestExceptionAPIError as e:
            raise Exception(f"Supabase error - update_food_item_by_cart_id with cart_id {cart_id} and food_item_id {food_item_id}: {e}")
                
        except Exception as e:
            raise Exception(f"error update_food_item_by_cart_id with cart_id {cart_id} and food_item_id {food_item_id}: {e}")        