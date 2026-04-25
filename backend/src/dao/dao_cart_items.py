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
                .select("id, seller_id, seller_profiles(slug, store_name), cart_items(quantity, food_items(id, name, price_text, price, unit_label, preorder_day, image_url, menu_categories(name)))") \
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
        
        
        
    def find_item(self, cart_id: str, food_item_id: str):

        try:
            result = self._supabase_client.table(self._table_name) \
                .select("id, quantity") \
                .eq("cart_id", cart_id) \
                .eq("food_item_id", food_item_id) \
                .maybe_single() \
                .execute()

            if result and result.data:
                return result.data

            return None

        except PostgrestExceptionAPIError as e:
            raise Exception(f"Supabase error - find_item with cart_id {cart_id} and food_item_id {food_item_id}: {e}")
        except Exception as e:
            raise Exception(f"error find_item with cart_id {cart_id} and food_item_id {food_item_id}: {e}")

    def update_quantity(self, cart_id: str, food_item_id: str, quantity: int):

        try:
            result = self._supabase_client.table(self._table_name) \
                .update({"quantity": quantity}) \
                .eq("cart_id", cart_id) \
                .eq("food_item_id", food_item_id) \
                .execute()

            if result and result.data:
                return result.data

            return None

        except PostgrestExceptionAPIError as e:
            raise Exception(f"Supabase error - update_quantity with cart_id {cart_id} and food_item_id {food_item_id}: {e}")

        except Exception as e:
            raise Exception(f"error update_quantity with cart_id {cart_id} and food_item_id {food_item_id}: {e}")


    def remove_item(self, cart_id: str, food_item_id: str):

        try:
            result = self._supabase_client.table(self._table_name) \
                .delete() \
                .eq("cart_id", cart_id) \
                .eq("food_item_id", food_item_id) \
                .execute()

            return True

        except PostgrestExceptionAPIError as e:
            raise Exception(f"Supabase error - remove_item with cart_id {cart_id} and food_item_id {food_item_id}: {e}")

        except Exception as e:
            raise Exception(f"error remove_item with cart_id {cart_id} and food_item_id {food_item_id}: {e}")


    def update_food_item_by_cart_id(self, cart_id: str, food_item_id: str, quantity: int = 1):

        try:

            query = self._supabase_client.table(self._table_name)
            query = query.insert({"cart_id": cart_id, "food_item_id": food_item_id, "quantity": quantity})
    
            result = query.execute()
            
            if result and result.data:
                return result.data
            
            return None

        except PostgrestExceptionAPIError as e:
            raise Exception(f"Supabase error - update_food_item_by_cart_id with cart_id {cart_id} and food_item_id {food_item_id}: {e}")
                
        except Exception as e:
            raise Exception(f"error update_food_item_by_cart_id with cart_id {cart_id} and food_item_id {food_item_id}: {e}")        