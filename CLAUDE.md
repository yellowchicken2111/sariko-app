# CLAUDE.md

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
- **Stores**: Domain-split Pinia stores — `authStore`, `cartStore`, `orderStore`, `homeStore`, `sellerStore`
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
- `POST /orders` — Create order from cart (snapshot items, clear cart)
- `GET /orders` — List orders for buyer
- `GET /orders/{order_id}` — Order detail with items
- `PATCH /orders/{order_id}/cancel` — Cancel order (pending only)

#### Sellers (`/sellers`)
- `GET /sellers/founding` — Founding sellers list
- `GET /sellers/{slug_name}` — Seller profile
- `GET /sellers/{slug_name}/menu` — Full menu grouped by category

#### Seller Dashboard (`/sellers/me`)
- `GET /sellers/me/orders` — List orders for authenticated seller
- `GET /sellers/me/orders/{order_id}` — Seller order detail with items
- `PATCH /sellers/me/orders/{order_id}/status` — Update order status (pending→confirmed→ready→done, with cancellation)

#### Users (`/users`)
- `GET /users/info/me` — Current user profile
- `PATCH /users/me/profile` — Update user profile + upsert delivery address

#### Payments (`/payments`)
- `POST /payments/vnpay/create` — Create VNPay payment URL (HMAC-SHA512 signed)
- `GET /payments/vnpay/ipn` — VNPay server-to-server IPN callback (verifies hash, updates payment status)
- `GET /payments/vnpay/return` — VNPay browser return URL (read-only hash validation)

## Environment Setup

Frontend env files: `.env.development`, `.env.production` — keys prefixed `VITE_`
Backend env file: `backend/src/envs/.env.local` — loaded via python-dotenv

Required env vars:
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (frontend)
- `SUPABASE_URL`, `SUPABASE_API_KEY`, `SUPABASE_JWKS_URL` (backend)

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

## Current Status (as of Apr 9, 2026)

### Done (Buyer-side)
- Home page (browse sellers, founding sellers with skeleton, featured dishes with 6-item limit)
- Seller page (info, menu, category filter, section-level skeleton loading, empty menu state)
- Food detail page (product info, qty selector, add to cart with toast notification)
- Cart page (add/remove, qty +/-, single-seller conflict modal, note, delivery address, place order — merged cart+checkout like ShopeeFood)
- Auth (signin, signup with Enter key support, loading states, session restore, cart preload on login, cart clear on signout)
- Buyer onboarding (phone, delivery address with Leaflet map + GPS, language preference) — UI + backend persist via PATCH /users/me/profile
- Order confirmation/detail page (status-aware: pending/confirmed/ready/done/cancelled + awaiting payment state, cancel button with dialog, Pay Now retry button, VND formatting)
- Order history page (filter tabs: All/Unpaid/Active/Completed/Cancelled, order cards with Unpaid badge, wired to real GET /orders API)
- Account page (profile header, seller badge, buyer/seller mode switcher, settings links, sign out)
- Vietnamese localization (vi.json 100% in sync with en-PH.json, vue-i18n configured)
- Route guards (beforeEach: requiresAuth for cart/orders/dashboard/account/onboarding, guestOnly for signin/signup, redirect preserved)
- Bottom nav hidden on order detail pages, payment return, cart, auth, onboarding
- Backend: Sellers APIs (founding list, by slug, full menu by slug)
- Backend: Cart APIs (add with duplicate check + single-seller constraint, update with qty>0 validation, remove, clear)
- Backend: Order APIs (create with rollback + idempotency guard, list, detail, cancel — buyer-side)
- Backend: VNPay payment gateway (create payment URL with full UUID txn_ref, IPN webhook with idempotency check, return URL verification — return endpoint is public/no auth)
- Frontend: VNPay redirect flow (place order → VNPay gateway → payment return page, Pay Now retry on order detail)
- Frontend: Payment return page (success/failed states, filters vnp_* params only)

### Done (Seller-side)
- Backend: Seller Dashboard APIs (GET /sellers/me/orders filtered to paid orders only, GET .../orders/{id}, PATCH .../status with state machine: pending→confirmed→ready→done + cancellation)
- Frontend: SellerDashboard.vue wired to real APIs (no mock data)
- Backend: core/sellers.py get_seller_full_menu() complete

### Done (Architecture / Code Quality)
- All 12 pages follow Page + Layout + Components pattern (see memory for rules)
- Shared `PageBreadcrumbs` component used across Cart, My Orders, Order Detail
- App.vue flex-direction fixed (column) for proper child layout rendering
- Padding responsibility moved to Layout layer (not Components)
- HomePage dead mock-data code cleaned up

### Partial / Stub
- `sellerStore.js` initializes with mock data from `data.js` for browse pages (overwritten by API calls at runtime — cosmetic issue)
- `FoodDetailPage` refactored to pattern but needs `sellerStore.loadFoodDetail()`, `currentFood`, `currentSeller`, `foodQuantity` wired in store (old version used deprecated `_cartStore` + mock `data.js`)
- Backend: `GET /sellers/` — stub (just `pass`, not used by any frontend page)
- VNPay — backend endpoints done, sandbox testing in progress
- Account page — UI done, but "Terms & Privacy Policy" menu item is not linked (no policy page exists)

### TODO (MVP required)
- Wire FoodDetailPage to real sellerStore (currently broken after refactor — needs store methods)
- Policy pages (Terms & Privacy)
- Production deployment
- Restrict CORS origins for production

### Known Issues
- `/dashboard` route only checks login, not seller role — any logged-in user can access
- No logic to consume `redirect` query param after successful signin
- `delivery_method` hardcoded to 'delivery' — no UI to choose pickup
- `refreshCart()` causes brief flash of empty state before data loads
- `lifespan.py` calls `get_redis_service()` which is not imported/implemented (latent bug — will crash if lifespan runs)
- Backend CORS allows all origins (should restrict in production)
- `DashboardStats` and `RecentOrders` both call `getOrders()` independently (duplicated API call — could share via store)
