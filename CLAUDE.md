# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sariko — a community marketplace for Filipino homemade food in HCMC, Vietnam. Vue 3 frontend (PWA, mobile-first) + FastAPI backend, both backed by Supabase (PostgreSQL + Auth).

**MVP Deadline:** April 18, 2026

## Development Commands

### Frontend (from `/frontend`)
```bash
npm run dev        # Dev server on :8081, proxies /rest → localhost:5000
npm run build      # Production build
npm run preview    # Preview production build
```

### Backend (from `/backend/src`)
```bash
python main.py     # Uvicorn on :5000
```

Both must run simultaneously for local development. No test runner or linter is configured.

## Architecture

### Frontend (`/frontend/src`)
- **Framework**: Vue 3 + Vite + Quasar UI + Pinia
- **Style**: Options API (not Composition API)
- **Routing**: Vue Router with lazy-loaded pages
- **Pattern**: Page = Layout (slots) + Components. Layout handles positioning/CSS, Components handle logic/store access.
- **Full guide**: See `FRONTEND_GUIDE.md` for complete file inventory, pattern rules with examples, routes table, styling conventions, and shared components.
- **API layer**: Axios with interceptors in `lib/axiosPolicy.js` — auto-injects Supabase access token, handles 401 refresh
- **Auth**: Supabase JS client (`lib/supabase.js`), session managed in `stores/auth/authStore.js`
- **Stores**: Domain-split Pinia stores — `authStore`, `cartStore`, `orderStore`, `homeStore`, `sellerStore`, `dashboardStore`, `deliveryStore`
- **Components read/write stores directly** (not via props/events). This is a deliberate decision for this project.
- **i18n**: vue-i18n with Filipino/English + Vietnamese (`en-PH`, `vi`), locale persisted in localStorage
- **Icons**: Lucide Vue Next
- **Maps**: Leaflet (for delivery address)

### Backend (`/backend/src`)
- **Framework**: FastAPI, entry point `main.py`
- **Layering**: API routers (`apis/`) → DAOs (`dao/`) → Supabase client
- **Auth**: JWT verification via Supabase JWKS (`core/auth.py`), injected with `Depends(verify_token)`
- **Schemas**: Pydantic models in `schemas/` for request validation
- **Database**: Supabase PostgreSQL via PostgREST (no ORM)

### API Contract
- All endpoints prefixed `/rest/v1/`
- Vite dev proxy: `/rest` → `http://localhost:5000`
- Production base URL is set in `.env.production`

### API Endpoints

#### Cart (`/cart`)
- `GET /cart` — Get user's cart with items
- `POST /cart/add` — Add item (validates single-seller, increments qty if exists)
- `PATCH /cart/update` — Update item quantity (qty must be > 0)
- `DELETE /cart/remove/{food_item_id}` — Remove item
- `DELETE /cart/clear` — Clear entire cart

#### Orders (`/orders`)
- `POST /orders` — Create order from cart (snapshot items, clear cart); accepts `delivery_lat`, `delivery_lon`, `delivery_fee`, `quotation_id`
- `GET /orders` — List orders for buyer
- `GET /orders/{order_id}` — Order detail with items (includes `cancellation_reason`)
- `PATCH /orders/{order_id}/cancel` — Cancel order (pending only)

#### Sellers (`/sellers`)
- `GET /sellers/founding` — Founding sellers list
- `GET /sellers/{slug_name}` — Seller profile
- `GET /sellers/{slug_name}/menu` — Full menu grouped by category

#### Seller Dashboard (`/sellers/me`)
- `GET /sellers/me/orders` — List orders for authenticated seller
- `GET /sellers/me/orders/{order_id}` — Seller order detail with items
- `PATCH /sellers/me/orders/{order_id}/status` — Update order status (pending→confirmed→ready→done + cancellation with reason); auto-books Lalamove when transitioning to "ready" with delivery_method=delivery

#### Users (`/users`)
- `GET /users/info/me` — Current user profile
- `GET /users/me/address` — Get user's default delivery address
- `PATCH /users/me/profile` — Update user profile + upsert delivery address

#### Payments (`/payments`)
- `POST /payments/vnpay/create` — Create VNPay payment URL (HMAC-SHA512 signed)
- `GET /payments/vnpay/ipn` — VNPay server-to-server IPN callback (verifies hash, updates payment status)
- `GET /payments/vnpay/return` — VNPay browser return URL (read-only hash validation)

#### Deliveries (`/deliveries`)
- `POST /deliveries/quotation` — Get delivery fee quote from Lalamove (mock or live via `LALAMOVE_MODE` env)
- `GET /deliveries/{order_id}/status` — Poll delivery status for buyer (driver info, tracking link)
- `POST /deliveries/webhook` — Lalamove status callback (HMAC-verified in live mode)
- `DELETE /deliveries/{order_id}/cancel` — Cancel delivery

#### Address (`/address`) — Goong Maps proxy, keeps API key server-side
- `GET /address/search?q=...` — Autocomplete suggestions
- `GET /address/detail?place_id=...` — Place detail (lat/lon)
- `GET /address/reverse?lat=...&lon=...` — Reverse geocode

#### Dev (`/dev`) — DEV ONLY, remove before production
- `PATCH /dev/orders/{id}/force-pay` — Force payment status to paid
- `PATCH /dev/orders/{id}/force-status` — Force order status to any value

## Environment Setup

Frontend env files: `.env.development`, `.env.production` — keys prefixed `VITE_`
Backend env file: `backend/src/envs/.env.local` — loaded via python-dotenv

Required env vars:
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (frontend)
- `SUPABASE_URL`, `SUPABASE_API_KEY`, `SUPABASE_JWKS_URL` (backend)
- `GOONG_API_KEY` (backend — Goong Maps, proxied to frontend)
- `LALAMOVE_MODE` (`mock` or `live`), `LALAMOVE_API_KEY`, `LALAMOVE_API_SECRET`, `LALAMOVE_BASE_URL`, `LALAMOVE_MARKET` (backend)

## Git Conventions

Commit messages use conventional prefixes: `feat:`, `fix:`, `refactor:`

## Key Patterns

- **Layout + Components**: Each page uses a layout (defines slot positions) + components (fill slots). See `HomePage.vue` as reference.
- **DAO pattern**: All database queries go through DAO classes, never directly in route handlers.
- **Token injection**: `axiosPolicy.js` attaches Supabase session token to every API request.
- **Cart**: Single-seller constraint. When user adds item from different seller, a conflict modal appears with options to go to cart, clear & add, or cancel.
- **Cart = Checkout**: Cart and checkout are merged into one page (like ShopeeFood). No separate checkout route.
- **Cart preload**: Cart data loads on auth bootstrap/signin, not just on cart page visit.
- **Order flow**: Cart → Place Order (from cart page) → POST /orders (snapshot items, clear cart) → Order Confirmation page.
- **Mobile-first**: Max-width 430px for prototypes, responsive for actual pages.
- **Skeleton loading**: Use section-level blocks (not per-element), Quasar `q-skeleton` with `animation="pulse"`.
- **Prototype workflow**: UI designs go to `frontend/.prototype/` as HTML files for review before coding.

## Database Schema (12 tables)

users, seller_profiles, menu_categories, food_items, carts, cart_items, orders, order_items, reviews, payments, user_addresses, deliveries

See `backend/src/sql/create_tables.sql` for full schema (consolidated from v1+v2).
Legacy files `create_tables_v1.sql` and `create_tables_v2.sql` are kept for reference only.

## Design System

- Dark theme: bg-main #121b2f, surface #1f2940
- Accent: gold #facc15 / #f5A623
- Fonts: "Lora" (headings), "Plus Jakarta Sans" (body)
- SCSS variables in `frontend/src/assets/variables.scss`
- Border radius: 16px ($radius-base)
- Quasar components + Lucide icons

## Current Status (as of Apr 13, 2026)

### Done (Buyer-side)
- Home page (browse sellers, founding sellers with skeleton, featured dishes with 6-item limit)
- Seller page (info, menu, category filter, section-level skeleton loading, empty menu state)
- Food detail page (product info, qty selector, add to cart with toast notification)
- Cart page (add/remove, qty +/-, single-seller conflict modal, note, delivery address, place order — merged cart+checkout like ShopeeFood)
- Cart address wired to user's saved address (not hardcoded); pen icon → `/account/address`; empty state prompt
- Cart delivery fee: fetches quotation from Lalamove mock on mount, shows real fee, passes `quotation_id` + `delivery_fee` to order creation
- Auth (signin, signup with Enter key support, loading states, session restore, cart preload on login, cart clear on signout)
- Auth bootstrap: fetches profile (name, phone, avatar), default address, and cart on session restore
- Buyer onboarding (phone, delivery address with Goong autocomplete search + reverse geocode + map visualize, language preference) — UI + backend persist via PATCH /users/me/profile
- Order confirmation/detail page (status-aware: pending/confirmed/ready/done/cancelled; correct `isPaymentPending` logic — only shows for status=pending; cancel button with dialog, Pay Now retry button, VND formatting)
- Order detail shows `cancellation_reason` when seller rejects
- Order detail shows DeliveryTracker component (status timeline + driver card + tracking link) when order is ready/done with delivery method
- Order history page (filter tabs: All/Unpaid/Active/Completed/Cancelled; fixed `isUnpaid` logic; order cards with Unpaid badge; wired to real GET /orders API)
- Account page — full settings hub: profile header (vertical layout with info rows), edit profile, delivery address, language, terms, privacy, sign out, seller mode switcher
- Avatar logic: guest → User icon; logged in no URL → initials; logged in with URL → image. Consistent across HomePage header + AccountPage
- Account sub-pages: `/account/profile` (EditProfilePage), `/account/address` (DeliveryAddressPage), `/account/language` (LanguagePage), `/account/terms` (TermsPage), `/account/privacy` (PrivacyPage) — all wired with real APIs
- New layout: `LayoutBaseSettings.vue` used by all account sub-pages (breadcrumb + content slot)
- New components: `ProfileForm.vue`, `AddressForm.vue` (Goong Maps autocomplete), `LanguageOptions.vue`
- Address autocomplete uses Goong Maps via backend proxy — two-step: autocomplete → place_id → `/detail` for lat/lon
- FoodCard add-to-cart UX: loading spinner state + toast notification on success (suppressed when cart-conflict modal opens); auth guard redirects to `/signin` if not logged in
- BottomActionBar (food detail) add-to-cart: auth guard redirects to `/signin` if not logged in
- FoodCard quantity bug fixed: full chain from BottomActionBar → cartStore → apiCart → backend DAO now passes correct quantity
- Vietnamese localization (vi.json 100% in sync with en-PH.json, vue-i18n configured)
- Route guards (beforeEach: requiresAuth for cart/orders/dashboard/account/onboarding, guestOnly for signin/signup, redirect preserved)
- Bottom nav hidden on order detail pages, payment return, cart, auth, onboarding, account sub-pages
- Backend: Sellers APIs (founding list, by slug, full menu by slug)
- Backend: Cart APIs (add with duplicate check + single-seller constraint, update with qty>0 validation, remove, clear)
- Backend: Order APIs (create with rollback + idempotency guard + delivery fields, list, detail with cancellation_reason, cancel — buyer-side)
- Backend: VNPay payment gateway (create payment URL with full UUID txn_ref, IPN webhook with idempotency check, return URL verification — return endpoint is public/no auth)
- Frontend: VNPay redirect flow (place order → VNPay gateway → payment return page, Pay Now retry on order detail)
- Frontend: Payment return page (success/failed states, filters vnp_* params only)

### Done (Seller-side)
- Backend: Seller Dashboard APIs (GET /sellers/me/orders filtered to paid orders only, GET .../orders/{id}, PATCH .../status with state machine: pending→confirmed→ready→done + cancellation with `cancellation_reason`)
- Backend: Auto-book Lalamove when seller marks order "ready" and delivery_method=delivery — creates `deliveries` row with ASSIGNING_DRIVER status
- Frontend: SellerDashboard.vue wired to real APIs; uses PageBreadcrumbs
- Frontend: RecentOrders — Accept/Reject buttons; reject dialog with reason input; q-btn-dropdown filter (All/New/Preparing/Ready/Done/Cancelled) inline with section header
- Frontend: `dashboardStore.js` shared between DashboardStats + RecentOrders — eliminates duplicate API calls; `selectedFilter` getter for order filtering
- Route guard: `/dashboard` requires `requiresSeller: true` — non-sellers redirected to home
- Backend: core/sellers.py get_seller_full_menu() complete

### Done (Delivery / Lalamove)
- `backend/src/services/lalamove_service.py` — factory pattern, `LALAMOVE_MODE=mock` vs `live`
- Mock service: time-based status progression from delivery `created_at` (0–60s: ASSIGNING_DRIVER → 60–120s: ON_GOING → 120–180s: PICKED_UP → 180s+: COMPLETED)
- `backend/src/dao/dao_deliveries.py` — CRUD for deliveries table
- `backend/src/apis/deliveries.py` — quotation, status poll, webhook, cancel
- `frontend/src/stores/delivery/deliveryStore.js` — quotation fetch + 15s polling with auto-stop on COMPLETED
- `frontend/src/components/order-details/DeliveryTracker.vue` — status timeline stepper + driver card + tracking link
- SQL migrations needed in Supabase: `ALTER TABLE orders ADD COLUMN IF NOT EXISTS quotation_id text; ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancellation_reason text; ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS share_link text; ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS driver_plate text; ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS lalamove_order_id text;`

### Done (Address / Goong Maps)
- `backend/src/apis/address.py` — proxy for Goong Maps (search, detail, reverse); keeps `GOONG_API_KEY` server-side
- `frontend/src/components/account/AddressForm.vue` — uses backend proxy for autocomplete; displays `main_text` / `secondary_text` from Goong response
- `GET /users/me/address` endpoint + `dao_user_addresses.read_default_address()` — fetch user's default address
- `authStore.bootstrap()` fetches and sets `inputAddress`, `inputAddressDetails`, `inputLat`, `inputLon` from backend on session restore

### Done (Dev Tools)
- `backend/src/apis/dev.py` — `PATCH /dev/orders/{id}/force-pay`, `PATCH /dev/orders/{id}/force-status` (DEV ONLY — remove before production)
- `frontend/src/components/dev/HackerPanel.vue` — Ctrl+Shift+Q toggles terminal-style dev panel (force-pay, force-status, env info); mounted via teleport in `App.vue`

### Done (Architecture / Code Quality)
- All pages follow Page + Layout + Components pattern
- Shared `PageBreadcrumbs` component used across Cart, My Orders, Order Detail, Seller Dashboard
- FoodDetailPage layout fixed: added `display: flex; flex-direction: column` to prevent scroll area collapse
- `LayoutBaseOrderDetail.vue` added `#DeliveryTracking` slot between StatusHeader and OrderInfo

### Partial / Stub
- `sellerStore.js` initializes with mock data from `data.js` for browse pages (overwritten by API calls at runtime — cosmetic issue)
- Backend: `GET /sellers/` — stub (just `pass`, not used by any frontend page)
- VNPay — backend endpoints done, sandbox testing in progress
- Lalamove live mode: `LiveLalamoveService` methods stub with `NotImplementedError` — implement when credentials arrive
- Notifications page is empty state placeholder only

### TODO (MVP required)
- Run SQL migrations listed above in Supabase dashboard
- Policy pages exist as placeholders (Terms + Privacy at `/account/terms`, `/account/privacy`) — legal fills content Apr 14
- Production deployment to AWS EC2, nginx + certbot SSL, backend live at https://api.sariko.store
- Restrict CORS origins for production
- Remove `/dev` router from `main.py` before production

### Known Issues
- `delivery_method` hardcoded to 'delivery' — no UI to choose pickup
- `refreshCart()` causes brief flash of empty state before data loads
- Backend CORS allows all origins (should restrict in production)
- "Help Center" in SupportMenu not linked (no page exists)
- Terms + Privacy pages exist but content is placeholder text (waiting on legal)
