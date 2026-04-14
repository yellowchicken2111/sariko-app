from typing import Optional
import os
import logging
        
import asyncio
from realtime import AsyncRealtimeClient, RealtimeSubscribeStates

logger = logging.getLogger(__name__)

async def keep_realtime_alive():
    
    SUPABASE_PROJECT_ID = os.environ.get("SUPABASE_PROJECT_ID", None)
    SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", None)
    REALTIME_URL = f"wss://{SUPABASE_PROJECT_ID}.supabase.co/realtime/v1"
    
    if not SUPABASE_PROJECT_ID or not SUPABASE_ANON_KEY:
        raise ValueError("SUPABASE_PROJECT_ID and SUPABASE_ANON_KEY must be set in environment variables.")
    
    client = AsyncRealtimeClient(REALTIME_URL, SUPABASE_ANON_KEY)
    await client.connect()

    channel = client.channel("backend-keepalive")    
    channel.on_broadcast('ping', lambda payload: None)

    def _on_subscribe(status: RealtimeSubscribeStates, err: Optional[Exception]):
        if status == RealtimeSubscribeStates.SUBSCRIBED:
            logger.warning("Realtime keepalive: CONNECTED ✅")
        elif status == RealtimeSubscribeStates.CHANNEL_ERROR:
            logger.warning(f"Realtime keepalive: ERROR ❌ {err}")
        elif status == RealtimeSubscribeStates.TIMED_OUT:
            logger.warning("Realtime keepalive: TIMEOUT ❌")

    await channel.subscribe(_on_subscribe)

    while True:
        await channel.send_broadcast('ping', {})
        await asyncio.sleep(30)