from typing import Optional
import logging

from postgrest.exceptions import APIError as PostgrestExceptionAPIError

from dao.dao_base import DAOBase

logger = logging.getLogger(__name__)

class DAOSellerProfiles(DAOBase):
    
    def __init__(self):
        super().__init__()
        self._table_name = "seller_profiles"
        
    
    def read_founding_sellers(self):
        try:
            query = self._supabase_client.table(self._table_name)
            query = query.select("id, user_id, store_name, slug, avatar_url").order("created_at")
            
            query = query
            result = query.execute()
            
            if result and result.data:
                return result.data
                
            return None
            
        # except PostgrestExceptionAPIError as e:
        #     raise Exception(f"Supabase error - read_seller_id_by_slug_name with slug {slug}: {e}")
                
        except Exception as e:
            raise Exception(f"error read_founding_sellers: {e}")
        
    
    def read_seller_by_slug_name(self, slug: str):
        try:
            query = self._supabase_client.table(self._table_name)
            query = query.select("id, store_name, slug, address, avatar_url").eq("slug", slug)         
            
            query = query.maybe_single()
            result = query.execute()
            
            if result and result.data:
                return result.data
                
            return None
            
        # except PostgrestExceptionAPIError as e:
        #     raise Exception(f"Supabase error - read_seller_id_by_slug_name with slug {slug}: {e}")
                
        except Exception as e:
            raise Exception(f"error read_seller_id_by_slug_name with slug {slug}: {e}")
            
        
    def read_seller_profile_by_user_id(self, user_id: str):
        try:
            result = (
                self._supabase_client
                .table(self._table_name)
                .select("id, store_name, slug, avatar_url")
                .eq("user_id", user_id)
                .maybe_single()
                .execute()
            )
            return result.data if result and result.data else None

        except Exception as e:
            raise Exception(f"error read_seller_profile_by_user_id: {e}")
    
    def read_seller_coords_by_id(self, seller_id: str):
        try:
            result = (
                self._supabase_client
                .table(self._table_name)
                .select("id, store_name, address, lat, lon")
                .eq("id", seller_id)
                .maybe_single()
                .execute()
            )
            return result.data if result and result.data else None

        except Exception as e:
            raise Exception(f"error read_seller_coords_by_id: {e}")

    def read_store_slug_name_by_seller_id(self, seller_id):
        
        try:
            query = self._supabase_client.table(self._table_name)
            query = query.select("slug").eq("id", seller_id)
            
            query = query.maybe_single()
            result = query.execute()
            if result and result.data:
                return result.data
                
            return None
        
        except PostgrestExceptionAPIError as e:
            raise Exception(f"Supabase error - read_store_slug_name_by_seller_id with seller_id {seller_id}: {e}")
                
        except Exception as e:
            raise Exception(f"error read_store_slug_name_by_seller_id with seller_id {seller_id}: {e}")
            
        