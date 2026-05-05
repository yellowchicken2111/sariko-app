# Sariko — Deploy Smoke Test

**Khi nào chạy**: Trước mỗi deploy lên production. Mất ~5-10 phút.

**Cần chuẩn bị**:
- 1 buyer test account
- 1 seller test account (có ít nhất 1 món + đã set address + phone)
- 2 browser windows (incognito hoặc 2 browsers khác nhau)
- VNPay sandbox credentials available
- DevTools console mở để xem `[poll:*]` logs

---

## A. Buyer flow

- [ ] **A1** Mở `/auth` → signin buyer → redirect `/home` thành công
- [ ] **A2** Home page load: hero + sellers list hiện, không có error trong console
- [ ] **A3** Click 1 seller → seller page load đầy đủ (info + menu + skeleton biến mất)
- [ ] **A4** Click 1 món → food detail page load → click "Add to cart" thành công (badge cart tăng)
- [ ] **A5** Vào `/cart` → thấy món vừa add, qty đúng, total đúng (subtotal + delivery_fee)
- [ ] **A6** Verify button "Checkout" disabled nếu thiếu phone hoặc address (test bằng account thiếu info)
- [ ] **A7** Click Checkout → POST /orders thành công → redirect `/orders/:id/confirmation`
- [ ] **A8** Order Confirmation page hiện đúng order info, status "pending", payment "pending"
- [ ] **A9** Console: thấy `[poll:buyer-order-xxx] start 10000ms`
- [ ] **A10** Click "Pay Now" → redirect VNPay sandbox → chọn NCB → thanh toán test card
- [ ] **A11** Quay về `/payment/return` → thấy spinner "Confirming payment..."
- [ ] **A11.5** DevTools Network: requests `/payments/payment-status/<id>` có header `Authorization: Bearer ...` + status 200 (KHÔNG được 401/403)
- [ ] **A12** Sau ~3-10s → thấy "Payment successful" + button "View Orders"
- [ ] **A13** Vào `/orders` → console thấy `[poll:buyer-orders] start 15000ms`
- [ ] **A14** Order vừa pay hiện trong tab "Active", payment_status = paid

## B. Seller flow (cùng lúc, browser 2)

- [ ] **B1** Signin seller → redirect `/seller/home`
- [ ] **B2** Console: `[poll:seller-orders] start 10000ms`
- [ ] **B3** Trong vòng 15s sau khi buyer pay → thấy đơn mới hiện trong "Need Your Action" + nghe sound `new-order.mp3`
- [ ] **B4** Click order → `/seller/orders/:id` load → console `[poll:seller-order-detail-xxx] start`
- [ ] **B5** Click "Accept" → status đổi `confirmed`. Buyer browser thấy toast "Seller is preparing your order" trong 15s
- [ ] **B6** Click "Mark as Ready" (trên action bar) → status `ready` → trigger Lalamove book
- [ ] **B7** Mock mode: trong vài giây thấy delivery status đổi từ ASSIGNING → ON_GOING → PICKED_UP. Buyer order detail thấy DeliveryTracker với driver info
- [ ] **B8** Click back → console `[poll:seller-order-detail-xxx] stop`
- [ ] **B9** Switch tab khác 30s → quay lại seller home → polling resume + immediate fetch

## C. Edge cases

- [ ] **C1** Cancel pending order: vào order detail (chưa pay) → click cancel → status `cancelled`. Seller thấy update.
- [ ] **C2** Cancel paid order: status `cancelled` + tạo refund record (check DB).
- [ ] **C3** Buyer second order từ different seller khi cart có món seller A → modal "Different seller, clear cart?" hiện
- [ ] **C4** Reload trang `/seller/home` khi đang có đơn → list không bị mất, polling restart đúng
- [ ] **C5** Logout → login lại → bootstrap fetch profile + address + cart + orders thành công

## D. Smoke check non-functional

- [ ] **D1** Lighthouse mobile score ≥ 70 cho `/home` (đừng regress quá tệ)
- [ ] **D2** Browser console không có error đỏ ở các page chính
- [ ] **D3** Network tab: không có 401/403/500 ở các API call thường
- [ ] **D4** PWA service worker register thành công (DevTools → Application → Service Workers)

---

## Rollback criteria

Nếu **bất kỳ** item nào trong A, B, C fail → **DỪNG deploy**, fix trước.

Nếu D fail → log issue, có thể deploy nếu là minor regression non-blocking.

## Lịch sử lần gần nhất

| Date | Tester | Result | Notes |
|---|---|---|---|
| 2026-04-29 | Jack | FAILED | Realtime miss order — fixed bằng polling |
| 2026-04-30 | Jack | FAILED | `/payments/payment-status` 401 — frontend dùng axios thuần thay vì apiClient |
| | | | |
