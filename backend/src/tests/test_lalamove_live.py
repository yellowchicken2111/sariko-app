"""
Lalamove Live Integration Test
================================
Chạy lệnh (từ backend/src):
    LALAMOVE_MODE=live \
    LALAMOVE_API_KEY=your_key \
    LALAMOVE_API_SECRET=your_secret \
    LALAMOVE_BASE_URL=https://rest.lalamove.com \
    LALAMOVE_MARKET=VN \
    python tests/test_lalamove_live.py

Hoặc set creds vào .env.local rồi chạy:
    python tests/test_lalamove_live.py

Test flow:
  1. get_quotation  — lấy báo giá từ pickup → dropoff
  2. place_order    — đặt đơn với quotation_id vừa lấy
  3. get_order      — kiểm tra trạng thái đơn
  4. cancel_order   — huỷ đơn (dọn dẹp)
"""

import os
import sys
import time
from pathlib import Path
from datetime import datetime, timezone

# Load .env.local nếu có
env_path = os.path.join("..", "envs", ".env.local")
print(env_path)
if os.path.exists(env_path):
    from dotenv import load_dotenv
    load_dotenv(env_path)
    print(f"Loaded env from {env_path}\n")

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from services.lalamove_service import LalamoveService

# ------------------------------------------------------------------
# Test coordinates — HCMC
# ------------------------------------------------------------------
# Pickup: Bến Thành Market (trung tâm Q.1)
PICKUP_LAT  = 10.7685537850001
PICKUP_LON  = 106.661857962
PICKUP_ADDR = "Chợ Bến Thành, Quận 1, TP.HCM"

# Dropoff: Thảo Điền, Q.2 (~6km)
DROPOFF_LAT  = 10.738793
DROPOFF_LON  = 106.719837
DROPOFF_ADDR = "Thảo Điền, Quận 2, TP.HCM"

# Sender / recipient (test info)
SENDER_NAME    = "Sariko Test"
SENDER_PHONE   = "+84901234567"
RECIPIENT_NAME  = "Test Customer"
RECIPIENT_PHONE = "+84909876543"

# ------------------------------------------------------------------

def sep(title=""):
    print("\n" + "─" * 50)
    if title:
        print(f"  {title}")
    print("─" * 50)

def check_env():
    key    = os.getenv("LALAMOVE_API_KEY", "")
    secret = os.getenv("LALAMOVE_API_SECRET", "")
    mode   = os.getenv("LALAMOVE_MODE", "mock")
    base   = os.getenv("LALAMOVE_BASE_URL", "https://rest.lalamove.com")
    market = os.getenv("LALAMOVE_MARKET", "VN")

    print("=== Lalamove Live Test ===\n")
    print(f"  MODE   : {mode}")
    print(f"  BASE   : {base}")
    print(f"  MARKET : {market}")
    print(f"  API_KEY: {'✓ set (' + key[:6] + '...)' if key else '✗ MISSING'}")
    print(f"  SECRET : {'✓ set' if secret else '✗ MISSING'}")

    if not key or not secret:
        print("\n❌ Credentials missing. Set LALAMOVE_API_KEY and LALAMOVE_API_SECRET.")
        sys.exit(1)
    if mode != "live":
        print("\n⚠️  LALAMOVE_MODE is not 'live'. Set LALAMOVE_MODE=live to use real API.")
        sys.exit(1)

def run():
    check_env()
    svc = LalamoveService()
    quotation_id = None
    lalamove_order_id = '3474689909917717420'

    # # ── Step 1: Quotation ──────────────────────────────────────────
    # sep("Step 1: get_quotation")
    # try:
    #     result = svc.get_quotation(
    #         pickup_lat=PICKUP_LAT,
    #         pickup_lon=PICKUP_LON,
    #         pickup_address=PICKUP_ADDR,
    #         dropoff_lat=DROPOFF_LAT,
    #         dropoff_lon=DROPOFF_LON,
    #         dropoff_address=DROPOFF_ADDR,
    #     )
    #     quotation_id = result.quotation_id
    #     print(f"  ✓ quotation_id : {quotation_id}")
    #     print(f"  ✓ total_fee    : {result.total_fee:,} {result.currency}")
    #     print(f"  ✓ distance     : {result.distance_km} km")
    # except Exception as e:
    #     print(f"  ✗ FAILED: {e}")
    #     sys.exit(1)

    # # ── Step 2: Place order ────────────────────────────────────────
    # sep("Step 2: place_order")
    # try:
    #     result = svc.place_order(
    #         quotation_id=quotation_id,
    #         stop_id_0=result.stop_id_0,
    #         stop_id_1=result.stop_id_1,
    #         sender_name=SENDER_NAME,
    #         sender_phone=SENDER_PHONE,
    #         recipient_name=RECIPIENT_NAME,
    #         recipient_phone=RECIPIENT_PHONE,
    #         recipient_remarks="Test order — will be cancelled immediately",
    #     )
    #     lalamove_order_id = result.lalamove_order_id
    #     print(f"  ✓ order_id  : {lalamove_order_id}")
    #     print(f"  ✓ status    : {result.status}")
    #     print(f"  ✓ share_link: {result.share_link}")
    # except Exception as e:
    #     print(f"  ✗ FAILED: {e}")
    #     sys.exit(1)

    # # ── Step 3: Get order status ───────────────────────────────────
    # sep("Step 3: get_order")
    # try:
    #     time.sleep(2)  # nhỏ delay để Lalamove xử lý
    #     result = svc.get_order(
    #         lalamove_order_id=lalamove_order_id,
    #         created_at=datetime.now(timezone.utc),
    #     )
    #     print(f"  ✓ status      : {result.status}")
    #     print(f"  ✓ driver_name : {result.driver_name or '(not assigned yet)'}")
    #     print(f"  ✓ driver_phone: {result.driver_phone or '—'}")
    #     print(f"  ✓ driver_plate: {result.driver_plate or '—'}")
    #     print(f"  ✓ share_link  : {result.share_link or '—'}")
    # except Exception as e:
    #     print(f"  ✗ FAILED: {e}")
    #     # vẫn tiếp tục để cancel

    # ── Step 4: Cancel order ───────────────────────────────────────
    sep("Step 4: cancel_order")
    try:
        ok = svc.cancel_order(lalamove_order_id)
        if ok:
            print(f"  ✓ Order {lalamove_order_id} cancelled successfully")
        else:
            print(f"  ⚠️  cancel returned False (order may already be assigned/completed)")
    except Exception as e:
        print(f"  ✗ FAILED: {e}")

    sep()
    print("✅ All steps completed.\n")

if __name__ == "__main__":
    run()
