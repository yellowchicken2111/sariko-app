from supabase import Client
from clients.supabase import get_supabase_client
class DAOBase:
    
    def __init__(self):
        self._supabase_client = get_supabase_client()