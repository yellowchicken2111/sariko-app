from contextlib import asynccontextmanager
from fastapi import FastAPI
from clients.supabase import get_supabase_client

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Supabase client is ready.")
    app.state.supabase = get_supabase_client()
    yield
