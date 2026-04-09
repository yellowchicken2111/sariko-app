# Sariko MVP -- Sprint Plan Apr 7-13

## Situation Assessment (Apr 7)

We are 1-2 days behind. The following Week 1 items remain incomplete:
- OrdersPage.vue uses mock data from `stores/data.js` instead of the real `orderStore`
- SellerDashboard.vue uses mock data -- no backend seller APIs exist at all
- Order confirmation page exists but is untested
- No order detail/tracking page (the confirmation page doubles as detail, but only via direct navigation)
- No order cancellation UI (backend cancel endpoint exists)

External dependency status:
- VNPay sandbox creds: expected today (Apr 7)
- Lalamove sandbox creds: expected today (Apr 7)
- Policy content from Legal: Apr 14
- Demo seller data: Apr 16

## Key Decisions

### 1. Finish buyer-side order flow FIRST (Apr 7-8)
Rationale: This is the core user journey. A buyer must be able to place an order, see it in history, view details, and cancel. Without this, nothing else matters.

### 2. Seller dashboard is MVP-critical but can be simplified (Apr 9-10)
Rationale: Sellers need to see and manage orders. But the dashboard stats (revenue, total orders) are nice-to-have. The MVP minimum is: list incoming orders, accept/reject, mark ready/done.

### 3. Start VNPay only AFTER buyer order flow works (Apr 10-11)
Rationale: VNPay integration touches the order creation flow. If that flow is broken, VNPay work is wasted. Also, we may not have sandbox creds until mid-day Apr 7 at best.

### 4. Lalamove can be DEFERRED or stubbed (Apr 12-13)
Rationale: For MVP launch, delivery can be handled manually (seller arranges delivery). Lalamove quotation is a nice-to-have. If creds arrive, stub the UI with a "delivery fee estimate" display. Do not build full booking flow.

### 5. Vietnamese localization is a 1-day task, do it late (Apr 12)
Rationale: Translation is mechanical work that does not block anything. It is fastest to do after all UI strings are finalized.

### 6. Policy pages use Legal content arriving Apr 14 -- placeholder only this week
Rationale: Cannot write real content. Create the route and page shell, fill with placeholder text.

---

## Daily Plan

### DAY 1 -- Monday Apr 7: Buyer Order History + Detail

**Morning (3-4 hrs): Wire OrdersPage.vue to real API**

#### Task 1.1: Connect OrdersPage to orderStore
- **Description**: Replace mock data import (`from '../stores/data'`) with `useOrderStore`. Call `orderStore.getOrders()` on mount. Display real order data.
- **Acceptance Criteria**:
  - Page calls GET /v1/orders on mount
  - Shows loading skeleton while fetching
  - Displays order list with: seller name, status badge, total, date
  - Empty state still works when no orders
  - Each order card is tappable (navigates to detail)
- **Files**: `frontend/src/pages/OrdersPage.vue`, `frontend/src/components/OrderCard.vue`
- **Reference**: Backend already returns `seller_profiles(store_name)`, `status`, `total_amount`, `created_at`

#### Task 1.2: Create Order Detail page (or repurpose OrderConfirmationPage)
- **Description**: The existing OrderConfirmationPage already fetches order detail and displays items. Create an OrderDetailPage that reuses this layout but adds: cancel button (for pending orders), status timeline, and back-to-orders navigation. Alternatively, rename/extend OrderConfirmationPage to serve both purposes.
- **Acceptance Criteria**:
  - Route `/orders/:orderId` shows full order detail
  - Displays: status, seller, items with quantities and prices, total, delivery info, note
  - "Cancel Order" button visible only when status is "pending"
  - Back button returns to /orders
- **Files**: `frontend/src/pages/OrderConfirmationPage.vue` (extend) or new `OrderDetailPage.vue`
- **Route**: Already exists as `/orders/:orderId` -> OrderConfirmationPage

**Afternoon (3-4 hrs): Order Cancellation + Testing**

#### Task 1.3: Implement order cancellation UI
- **Description**: Add cancel button to order detail page. Use `orderStore.cancelOrder()` which already calls PATCH /orders/:id/cancel. Show confirmation dialog before cancelling. Update UI after cancel.
- **Acceptance Criteria**:
  - Cancel button only shows for "pending" orders
  - Confirmation dialog: "Cancel this order?"
  - On success: status updates to "cancelled", cancel button disappears
  - On error: show toast with error message
- **Files**: Order detail page, possibly a confirmation dialog component

#### Task 1.4: Test full buyer order flow end-to-end
- **Description**: Manually test: browse seller -> add to cart -> place order -> see confirmation -> go to orders list -> tap order -> see detail -> cancel order. Fix any bugs found.
- **Acceptance Criteria**:
  - Complete flow works without errors
  - Order appears in history immediately after placing
  - Order detail loads correctly from history
  - Cancel works and reflects in the list

---

### DAY 2 -- Tuesday Apr 8: Seller Backend APIs

#### Task 2.1: Create seller order list endpoint
- **Description**: GET /v1/seller/orders -- returns orders for the authenticated seller, with buyer info and order items. Filter by status query param.
- **Acceptance Criteria**:
  - Returns orders where seller_id matches authenticated user's seller profile
  - Includes: buyer name/phone, order items, total, status, created_at
  - Optional `?status=pending` query filter
  - Ordered by created_at desc
- **Files**: 
  - `backend/src/apis/seller_orders.py` (new router)
  - `backend/src/dao/dao_orders.py` (add `read_orders_by_seller_id`)
  - `backend/src/main.py` (register new router)

#### Task 2.2: Create seller order status update endpoint
- **Description**: PATCH /v1/seller/orders/:id/status -- allows seller to update order status. Valid transitions: pending->confirmed, confirmed->ready, ready->done. Also: pending->cancelled (seller reject).
- **Acceptance Criteria**:
  - Only the seller who owns the order can update it
  - Validates status transitions (no skipping steps, no backwards)
  - Returns updated order
  - 400 error for invalid transitions
- **Files**:
  - `backend/src/apis/seller_orders.py`
  - `backend/src/dao/dao_orders.py` (add validation or use existing `update_order_status`)
  - `backend/src/schemas/request_schemas.py` (add status update schema)

#### Task 2.3: Create seller dashboard summary endpoint
- **Description**: GET /v1/seller/dashboard -- returns summary stats: today's order count, pending count, today's revenue. Keep it simple.
- **Acceptance Criteria**:
  - Returns `{ today_orders: int, pending_orders: int, today_revenue: float }`
  - Only counts orders belonging to the authenticated seller
  - "Today" = current UTC date
- **Files**: `backend/src/apis/seller_orders.py` or separate `seller_dashboard.py`

---

### DAY 3 -- Wednesday Apr 9: Seller Dashboard Frontend

#### Task 3.1: Wire SellerDashboard to real APIs
- **Description**: Replace mock data in SellerDashboard.vue. Create a sellerOrderStore (or extend sellerStore). Fetch dashboard stats and recent orders from the new backend endpoints.
- **Acceptance Criteria**:
  - Dashboard shows real stats from GET /v1/seller/dashboard
  - Recent orders list fetches from GET /v1/seller/orders
  - Loading states while fetching
  - Empty state when no orders
- **Files**:
  - `frontend/src/pages/SellerDashboard.vue`
  - `frontend/src/stores/seller/sellerStore.js` (or new sellerOrderStore)
  - `frontend/src/apis/sellers/` (add seller order API calls)

#### Task 3.2: Implement seller order status management
- **Description**: Add status update buttons to each order card in the dashboard. Seller taps to advance: pending -> confirmed -> ready -> done. Add reject (cancel) option for pending orders.
- **Acceptance Criteria**:
  - Each order shows a primary action button based on current status
  - pending: "Accept" (green) + "Reject" (red)
  - confirmed: "Mark Ready"
  - ready: "Mark Done"
  - done: no action button
  - Status updates immediately in UI after API call
  - Toast confirmation on success
- **Files**: `frontend/src/pages/SellerDashboard.vue`, order card component

#### Task 3.3: Add seller order filtering
- **Description**: Add tab filters at top of order list: All / Pending / Confirmed / Ready / Done. Use the `?status=` query param.
- **Acceptance Criteria**:
  - Tabs filter the order list
  - "Pending" tab shows count badge
  - Filter persists during the session
- **Files**: `frontend/src/pages/SellerDashboard.vue`

---

### DAY 4 -- Thursday Apr 10: VNPay Integration (Backend)

**Prerequisite**: VNPay sandbox credentials received.

#### Task 4.1: VNPay payment initiation endpoint
- **Description**: POST /v1/payments/vnpay/create -- generates a VNPay payment URL for a given order. Redirects buyer to VNPay sandbox checkout.
- **Acceptance Criteria**:
  - Accepts order_id, returns VNPay redirect URL
  - Signs request with VNPay hash key
  - Includes order amount, description, return URL
  - Works with VNPay sandbox
- **Files**:
  - `backend/src/apis/payments.py` (new)
  - `backend/src/services/vnpay_service.py` (new)
  - `backend/src/main.py` (register router)
  - `.env.local` (add VNPay keys)

#### Task 4.2: VNPay return/callback handler
- **Description**: GET /v1/payments/vnpay/return -- VNPay redirects here after payment. Verify hash, update order payment_status to "paid" or "failed".
- **Acceptance Criteria**:
  - Verifies VNPay response hash
  - Updates order payment_status in database
  - Redirects buyer back to order confirmation page
  - Handles failure gracefully
- **Files**: `backend/src/apis/payments.py`, `backend/src/dao/dao_orders.py`

**FALLBACK if VNPay creds not received**: Skip to bank transfer (Task 5.1) and come back to VNPay when creds arrive.

---

### DAY 5 -- Friday Apr 11: Payment UI + Bank Transfer

#### Task 5.1: Bank transfer payment option
- **Description**: On the cart/checkout page, add payment method selector: "VNPay" or "Bank Transfer". For bank transfer: show QR code image (static) + bank details + upload proof button.
- **Acceptance Criteria**:
  - Payment method selector on checkout
  - Bank transfer shows: bank name, account number, QR code image
  - "Upload Payment Proof" button opens file picker (image only)
  - Uploaded proof is sent to backend (store in S3/Supabase storage)
  - Order is created with payment_method field
- **Files**:
  - `frontend/src/pages/CartPage.vue` (add payment section)
  - `backend/src/apis/payments.py` (upload endpoint)
  - Database: add `payment_method` column to orders if not present

#### Task 5.2: VNPay frontend flow (if creds available)
- **Description**: When buyer selects VNPay, call the create payment endpoint and redirect to VNPay URL. Handle return redirect back to order confirmation.
- **Acceptance Criteria**:
  - VNPay button initiates payment flow
  - Buyer is redirected to VNPay sandbox
  - After payment, buyer returns to order confirmation
  - Payment status shown on order detail
- **Files**: `frontend/src/pages/CartPage.vue`, order confirmation page

---

### DAY 6 -- Saturday Apr 12: Vietnamese Localization + Lalamove Stub

#### Task 6.1: Create vi.json locale file
- **Description**: Copy en-PH.json structure, translate all keys to Vietnamese. Cover all UI strings: navigation, buttons, labels, status names, empty states, error messages.
- **Acceptance Criteria**:
  - All existing en-PH keys have vi equivalents
  - No hardcoded English strings remain in components (audit and fix)
  - Vietnamese displays correctly (diacritics, tone marks)
- **Files**: `frontend/src/i18n/locales/vi.json` (new), update all components to use $t()

#### Task 6.2: Language switcher UI
- **Description**: Add language toggle (EN/VI) to the app. Persist selection in localStorage. Could be in settings/profile or a global toggle.
- **Acceptance Criteria**:
  - Toggle switches between English and Vietnamese
  - Selection persists across sessions
  - All visible text changes on toggle
- **Files**: Header/navigation component, i18n plugin config

#### Task 6.3: Lalamove delivery fee stub (if creds available)
- **Description**: If Lalamove sandbox creds are available: create a simple "Get Delivery Quote" button on checkout that calls Lalamove quotation API and displays the fee. If creds NOT available: show a static delivery fee based on seller's configured fee.
- **Acceptance Criteria (with creds)**:
  - Quotation API called with seller address -> buyer address
  - Delivery fee displayed on checkout
  - Fee included in order total
- **Acceptance Criteria (without creds)**:
  - Static delivery fee from seller profile displayed
  - Fee included in order total
- **Files**: `frontend/src/pages/CartPage.vue`, `backend/src/services/lalamove_service.py` (new, if creds available)

---

### DAY 7 -- Sunday Apr 13: Polish, Bug Fixes, Policy Stubs

#### Task 7.1: Policy page shells
- **Description**: Create placeholder pages for Terms of Service, Privacy Policy, Shipping Policy, Payment Policy. Use generic placeholder text. Route them. Link from footer or profile.
- **Acceptance Criteria**:
  - 4 policy pages accessible via routes
  - Placeholder content clearly marked as "Content pending"
  - Linked from appropriate location in app
- **Files**: New policy page components, router updates

#### Task 7.2: End-to-end testing and bug fixes
- **Description**: Test every user flow: buyer registration -> onboarding -> browse -> order -> pay -> view history -> cancel. Test seller: login -> dashboard -> accept order -> mark ready -> done. Fix all bugs found.
- **Acceptance Criteria**:
  - All critical paths work without errors
  - No console errors in production build
  - Mobile layout looks correct
- **Time**: Reserve 3-4 hours minimum

#### Task 7.3: Onboarding flow audit
- **Description**: Verify buyer onboarding captures phone and delivery address. These are needed for orders. Ensure the data flows correctly to order creation.
- **Acceptance Criteria**:
  - Onboarding data saved to user profile
  - Delivery address auto-fills on checkout
  - Phone number available for seller to contact buyer

---

## What Gets CUT if We Run Out of Time

Priority tiers (cut from bottom up):

**MUST HAVE (ship-blocking)**:
1. Buyer order history + detail (Day 1)
2. Seller order list + status update backend (Day 2)
3. Seller dashboard with real data (Day 3)
4. At least ONE payment method working (Day 5)

**SHOULD HAVE (launch quality)**:
5. VNPay integration (Day 4) -- fallback to bank transfer only
6. Vietnamese localization (Day 6)
7. Order cancellation UI (Day 1 afternoon)

**NICE TO HAVE (can launch without)**:
8. Lalamove integration -- use static delivery fees
9. Language switcher -- default to one language
10. Policy pages -- link to Google Doc instead
11. Dashboard stats (revenue, totals) -- just show order list

## Technical Notes

- **No i18n keys exist in components yet** -- en-PH.json exists but components use hardcoded strings. Full i18n retrofit is needed for Vietnamese support. This is more work than it looks.
- **Seller auth is unclear** -- the backend uses `verify_token` which gives user_id. Seller endpoints need to map user_id to seller_profile_id. Verify this mapping exists in the database.
- **OrderConfirmationPage can double as OrderDetailPage** -- it already fetches and displays order detail. Just needs: cancel button, better navigation from order history, and status-aware display (not just "Order Placed!" for every status).
- **Both OrdersPage and SellerDashboard import from `stores/data.js`** -- this mock data file should be removed once both pages are wired to real APIs.
- **Payment method column** -- check if `orders` table already has `payment_method`. If not, add via migration.
- **No Pinia persistence configured for orderStore** -- orders always re-fetch from API, which is fine.
