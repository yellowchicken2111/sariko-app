# VNPay Integration

## Flow
1. User places order → `POST /orders` (status: pending, payment_status: pending)
2. Frontend calls `POST /payments/vnpay/create/{order_id}` → backend builds signed URL
3. User redirected to VNPay gateway → enters bank/OTP
4. VNPay sends 2 callbacks simultaneously:
   - **IPN** (server-to-server): `GET /payments/vnpay/ipn` → verify hash → update payment_status to "paid"
   - **Return URL** (browser redirect): `GET /payments/vnpay/return` → display-only, NO DB updates

## Key Rules
- `vnp_TxnRef`: full UUID (no dashes) + `_HHMMSS` timestamp — unique per day
- `vnp_Amount`: actual amount × 100 (VNPay requirement)
- Hash: HMAC-SHA512, params sorted alphabetically, values URL-encoded
- IPN must be idempotent — check if already paid before updating
- Return URL endpoint is **public** (no auth) — user session may have expired after redirect
- Seller dashboard only shows orders with `payment_status = 'paid'`
- Buyer sees "Awaiting Payment" state with "Pay Now" retry button if unpaid

## Files
- Backend: `backend/src/apis/payments.py`
- DAO: `backend/src/dao/dao_orders.py` (`update_payment_status`, `read_order_by_id_raw`)
- Frontend API: `frontend/src/apis/payments/apiPayments.js`
- Frontend pages: `PaymentReturnPage.vue`, `OrderConfirmationPage.vue` (Pay Now button)

## Spec Reference
- `.idea/vnpay_intergrated.txt` — summarized VNPay spec
- `.idea/infographic.png` — VNPay flow diagram
