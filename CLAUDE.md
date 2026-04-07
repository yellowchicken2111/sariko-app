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
- **API layer**: Axios with interceptors in `lib/axiosPolicy.js` — auto-injects Supabase access token, handles 401 refresh
- **Auth**: Supabase JS client (`lib/supabase.js`), session managed in `stores/auth/authStore.js`
- **Stores**: Domain-split Pinia stores — `authStore`, `cartStore`, `orderStore`, `homeStore`, `sellerStore`
- **Components read/write stores directly** (not via props/events). This is a deliberate decision for this project.
- **i18n**: vue-i18n with Filipino/English, locale persisted in localStorage
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

#### Users (`/users`)
- `GET /users/info/me` — Current user profile

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

See `backend/src/sql/create_tables.sql` for full schema.

## Design System

- Dark theme: bg-main #121b2f, surface #1f2940
- Accent: gold #facc15 / #f5A623
- Fonts: "Lora" (headings), "Plus Jakarta Sans" (body)
- SCSS variables in `frontend/src/assets/variables.scss`
- Border radius: 16px ($radius-base)
- Quasar components + Lucide icons

## Current Status (as of Apr 8, 2026)

### Done
- Home page (browse sellers, founding sellers with skeleton, featured dishes with 6-item limit)
- Seller page (info, menu, category filter, section-level skeleton loading, empty menu state)
- Cart page (add/remove, qty +/-, single-seller conflict modal, note, delivery address, place order — merged cart+checkout like ShopeeFood)
- Auth (signin, signup with Enter key support, loading states, session restore, cart preload on login, cart clear on signout)
- Buyer onboarding (phone, delivery address with Leaflet map + GPS, language preference) — wired into signup flow
- Backend: Cart APIs (add with duplicate check, update with qty>0 validation, remove, clear)
- Backend: Order APIs (create with rollback + idempotency guard, list, detail, cancel)
- Order confirmation/detail page (status-aware: pending/confirmed/ready/done/cancelled, cancel button with dialog)
- Order history page (layout, breadcrumbs, filter tabs, order cards — wired to real GET /orders API)

### TODO (MVP required)
- Seller Dashboard + order management (backend + frontend — no seller-side APIs exist yet)
- Payment (bank transfer QR at minimum)
- VNPay sandbox integration (creds expected Apr 8)
- Vietnamese localization
- Policy pages
- Production deployment

### Known Issues (from code review)
- Onboarding data not persisted to backend (no PATCH /users/me/profile endpoint)
- No route guards (authenticated pages accessible without login)
- `delivery_method` hardcoded to 'delivery' — no UI to choose pickup
- `refreshCart()` causes brief flash of empty state before data loads
- Order confirmation uses stale store data when navigating from place order (items/seller missing from POST response)
