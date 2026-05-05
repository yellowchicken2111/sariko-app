import os
import logging
from typing import Optional
from fastapi import FastAPI
import httpx
from httpx import HTTPTransport
from supabase import create_client, Client

logger = logging.getLogger(__name__)


class _RetryOnDisconnectTransport(HTTPTransport):
    """Retry once when an idle pooled HTTP/2 connection is closed by the server.

    Why: PostgREST/CloudFront may close idle keep-alive connections; httpx hands
    out the stale connection and the next request fails with RemoteProtocolError
    ("Server disconnected"). A single retry lets httpcore evict the dead
    connection and open a fresh one.
    """

    def handle_request(self, request):
        try:
            return super().handle_request(request)
        except httpx.RemoteProtocolError as e:
            logger.warning(f"Supabase stale connection, retrying once: {e}")
            return super().handle_request(request)


class SupabaseService:
    def __init__(self):

        supabase_url = os.environ.get("SUPABASE_URL")
        supabase_key = os.environ.get("SUPABASE_API_KEY")

        if not supabase_url or not supabase_key:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in environment variables.")

        self.client: Client = create_client(supabase_url, supabase_key)
        self.client.postgrest.session._transport = _RetryOnDisconnectTransport(http2=True)
        
        
_service: Optional[SupabaseService] = None
def get_supabase_service() -> SupabaseService:
    global _service
    if _service is None:
        _service = SupabaseService()
    return _service

def get_supabase_client() -> Client:
    return get_supabase_service().client