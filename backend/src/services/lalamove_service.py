"""
Lalamove delivery service — mock/live mode controlled by LALAMOVE_MODE env var.

Mock mode: returns fake data with time-based status progression.
Live mode: calls Lalamove v3 API with HMAC auth. (Stub — implement when credentials arrive.)

Usage:
    from services.lalamove_service import get_lalamove_service
    service = get_lalamove_service()
    quote = service.get_quotation(...)
"""

import os
import uuid
import random
import logging
from abc import ABC, abstractmethod
from datetime import datetime, timezone
from typing import Optional

from pydantic import BaseModel

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Result models
# ---------------------------------------------------------------------------

class QuotationResult(BaseModel):
    quotation_id: str
    total_fee: int          # VND integer (e.g. 25000)
    currency: str           # "VND"
    distance_km: float      # e.g. 3.2

class PlaceOrderResult(BaseModel):
    lalamove_order_id: str
    status: str             # "ASSIGNING_DRIVER"
    share_link: str

class OrderStatusResult(BaseModel):
    status: str             # ASSIGNING_DRIVER | ON_GOING | PICKED_UP | COMPLETED | CANCELLED
    driver_name: Optional[str] = None
    driver_phone: Optional[str] = None
    driver_plate: Optional[str] = None
    tracking_url: Optional[str] = None
    share_link: Optional[str] = None

# ---------------------------------------------------------------------------
# Abstract interface
# ---------------------------------------------------------------------------

class LalamoveService(ABC):

    @abstractmethod
    def get_quotation(self, pickup_lat: float, pickup_lon: float, pickup_address: str,
                      dropoff_lat: float, dropoff_lon: float, dropoff_address: str) -> QuotationResult:
        ...

    @abstractmethod
    def place_order(self, quotation_id: str, sender_name: str, sender_phone: str,
                    recipient_name: str, recipient_phone: str,
                    recipient_remarks: str = "") -> PlaceOrderResult:
        ...

    @abstractmethod
    def get_order(self, lalamove_order_id: str, created_at: datetime) -> OrderStatusResult:
        ...

    @abstractmethod
    def cancel_order(self, lalamove_order_id: str) -> bool:
        ...

# ---------------------------------------------------------------------------
# Mock implementation
# ---------------------------------------------------------------------------

MOCK_DRIVER = {
    "name": "Nguyen Van A",
    "phone": "0901234567",
    "plate": "59-B1 12345",
}

class MockLalamoveService(LalamoveService):

    def get_quotation(self, pickup_lat, pickup_lon, pickup_address,
                      dropoff_lat, dropoff_lon, dropoff_address):
        qid = f"mock-q-{uuid.uuid4().hex[:8]}"
        fee = 15000 + random.randint(5, 25) * 1000   # 20,000 – 40,000 VND
        dist = round(random.uniform(1.5, 8.0), 1)
        logger.info(f"[MOCK] quotation {qid}: fee={fee} VND, dist={dist} km")
        return QuotationResult(
            quotation_id=qid,
            total_fee=fee,
            currency="VND",
            distance_km=dist,
        )

    def place_order(self, quotation_id, sender_name, sender_phone,
                    recipient_name, recipient_phone, recipient_remarks=""):
        oid = f"mock-o-{uuid.uuid4().hex[:8]}"
        link = f"https://share.lalamove.com/mock-{oid}"
        logger.info(f"[MOCK] place_order {oid} from quotation {quotation_id}")
        return PlaceOrderResult(
            lalamove_order_id=oid,
            status="ASSIGNING_DRIVER",
            share_link=link,
        )

    def get_order(self, lalamove_order_id, created_at):
        """Status progresses based on elapsed time since delivery creation."""
        now = datetime.now(timezone.utc)
        if created_at.tzinfo is None:
            created_at = created_at.replace(tzinfo=timezone.utc)
        elapsed = (now - created_at).total_seconds()

        if elapsed < 60:
            return OrderStatusResult(
                status="ASSIGNING_DRIVER",
                share_link=f"https://share.lalamove.com/mock-{lalamove_order_id}",
            )
        elif elapsed < 120:
            return OrderStatusResult(
                status="ON_GOING",
                driver_name=MOCK_DRIVER["name"],
                driver_phone=MOCK_DRIVER["phone"],
                driver_plate=MOCK_DRIVER["plate"],
                tracking_url=f"https://track.lalamove.com/mock-{lalamove_order_id}",
                share_link=f"https://share.lalamove.com/mock-{lalamove_order_id}",
            )
        elif elapsed < 180:
            return OrderStatusResult(
                status="PICKED_UP",
                driver_name=MOCK_DRIVER["name"],
                driver_phone=MOCK_DRIVER["phone"],
                driver_plate=MOCK_DRIVER["plate"],
                tracking_url=f"https://track.lalamove.com/mock-{lalamove_order_id}",
                share_link=f"https://share.lalamove.com/mock-{lalamove_order_id}",
            )
        else:
            return OrderStatusResult(
                status="COMPLETED",
                driver_name=MOCK_DRIVER["name"],
                driver_phone=MOCK_DRIVER["phone"],
                driver_plate=MOCK_DRIVER["plate"],
                tracking_url=f"https://track.lalamove.com/mock-{lalamove_order_id}",
                share_link=f"https://share.lalamove.com/mock-{lalamove_order_id}",
            )

    def cancel_order(self, lalamove_order_id):
        logger.info(f"[MOCK] cancel_order {lalamove_order_id}")
        return True

# ---------------------------------------------------------------------------
# Live implementation (stub — fill in when credentials arrive)
# ---------------------------------------------------------------------------

class LiveLalamoveService(LalamoveService):
    """
    Real Lalamove v3 API client.
    Requires LALAMOVE_API_KEY, LALAMOVE_API_SECRET, LALAMOVE_BASE_URL env vars.
    Uses HMAC-SHA256 auth: Authorization: hmac {key}:{timestamp}:{signature}
    """

    def __init__(self):
        self.api_key = os.getenv("LALAMOVE_API_KEY", "")
        self.api_secret = os.getenv("LALAMOVE_API_SECRET", "")
        self.base_url = os.getenv("LALAMOVE_BASE_URL", "https://rest.lalamove.com")
        self.market = os.getenv("LALAMOVE_MARKET", "VN")
        if not self.api_key or not self.api_secret:
            raise RuntimeError("LALAMOVE_API_KEY and LALAMOVE_API_SECRET must be set for live mode")

    def _sign(self, method: str, path: str, body: str, timestamp: str) -> str:
        import hmac
        import hashlib
        raw = f"{timestamp}\r\n{method}\r\n{path}\r\n\r\n{body}"
        return hmac.new(
            self.api_secret.encode(),
            raw.encode(),
            hashlib.sha256
        ).hexdigest()

    def get_quotation(self, pickup_lat, pickup_lon, pickup_address,
                      dropoff_lat, dropoff_lon, dropoff_address):
        raise NotImplementedError("Live Lalamove quotation not yet implemented — add credentials and implement")

    def place_order(self, quotation_id, sender_name, sender_phone,
                    recipient_name, recipient_phone, recipient_remarks=""):
        raise NotImplementedError("Live Lalamove place_order not yet implemented")

    def get_order(self, lalamove_order_id, created_at):
        raise NotImplementedError("Live Lalamove get_order not yet implemented")

    def cancel_order(self, lalamove_order_id):
        raise NotImplementedError("Live Lalamove cancel_order not yet implemented")

# ---------------------------------------------------------------------------
# Factory
# ---------------------------------------------------------------------------

_service_instance = None

def get_lalamove_service() -> LalamoveService:
    global _service_instance
    if _service_instance is None:
        mode = os.getenv("LALAMOVE_MODE", "mock")
        if mode == "live":
            _service_instance = LiveLalamoveService()
            logger.info("Lalamove service: LIVE mode")
        else:
            _service_instance = MockLalamoveService()
            logger.info("Lalamove service: MOCK mode")
    return _service_instance
