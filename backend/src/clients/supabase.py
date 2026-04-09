import os
from typing import Optional
from fastapi import FastAPI
from supabase import create_client, Client

class SupabaseService:
    def __init__(self):
        
        supabase_url = os.environ.get("SUPABASE_URL")
        supabase_key = os.environ.get("SUPABASE_API_KEY")

        if not supabase_url or not supabase_key:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in environment variables.")

        self.client: Client = create_client(supabase_url, supabase_key)
        
        
_service: Optional[SupabaseService] = None
def get_supabase_service() -> SupabaseService:
    global _service
    if _service is None:
        _service = SupabaseService()
    return _service

def get_supabase_client() -> Client:
    return get_supabase_service().client