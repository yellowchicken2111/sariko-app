"""
Shared pytest configuration for backend tests.

- Adds backend/src to sys.path so tests can import `apis.payments` etc.
- Sets stub env vars so modules don't crash on import (Supabase client, VNPay, Lalamove).
- Exposes fixtures: vnp_secret, lalamove_secret, fastapi_client.
"""
import os
import sys
from pathlib import Path

import pytest

# ─── sys.path: add backend/src ───────────────────────────────────────────────
BACKEND_SRC = Path(__file__).parent.parent.parent / "backend" / "src"
sys.path.insert(0, str(BACKEND_SRC))

# ─── env stubs (must be set BEFORE importing backend modules) ────────────────
os.environ.setdefault("VNPAY_TMN_CODE", "TEST_TMN")
os.environ.setdefault("VNPAY_HASH_SECRET", "TEST_HASH_SECRET_FOR_PYTEST_ONLY")
os.environ.setdefault("VNPAY_URL", "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html")
os.environ.setdefault("VNPAY_RETURN_URL", "http://localhost:8081/payment/return")
os.environ.setdefault("LALAMOVE_API_KEY", "test_api_key")
os.environ.setdefault("LALAMOVE_API_SECRET", "test_api_secret_for_pytest")
os.environ.setdefault("LALAMOVE_MODE", "mock")
os.environ.setdefault("LALAMOVE_BASE_URL", "https://rest.sandbox.lalamove.com")
os.environ.setdefault("LALAMOVE_MARKET", "VN")
os.environ.setdefault("SUPABASE_URL", "https://stub.supabase.co")
os.environ.setdefault("SUPABASE_API_KEY", "stub_anon_key")
os.environ.setdefault("SUPABASE_JWKS_URL", "https://stub.supabase.co/jwks")


# ─── fixtures ────────────────────────────────────────────────────────────────
@pytest.fixture
def vnp_secret():
    return os.environ["VNPAY_HASH_SECRET"]


@pytest.fixture
def lalamove_secret():
    return os.environ["LALAMOVE_API_SECRET"]


@pytest.fixture
def lalamove_api_key():
    return os.environ["LALAMOVE_API_KEY"]


@pytest.fixture
def fastapi_client():
    """FastAPI TestClient bound to the deliveries + payments routers only.

    We don't import main.py because it boots the full app (Supabase client init,
    JWKS fetch, etc). We mount only what the test needs.
    """
    from fastapi import FastAPI
    from fastapi.testclient import TestClient
    from apis import payments, deliveries

    app = FastAPI()
    app.include_router(payments.router)
    app.include_router(deliveries.router)
    return TestClient(app)
