# Sariko — Filipino Homemade Food Marketplace

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Status](https://img.shields.io/badge/Status-MVP-blue)
![Node](https://img.shields.io/badge/Node-18+-green)
![Python](https://img.shields.io/badge/Python-3.10+-green)

## 📱 Project Overview

**Sariko** is a multi-vendor marketplace platform for Filipino homemade food products in Ho Chi Minh City (HCMC). It connects food sellers with local buyers through an intuitive mobile-first PWA.

**This repository includes:**
1. **Buyer App** (`/frontend`) — Vue 3 PWA for browsing, ordering, and payment
2. **Seller Dashboard** (within buyer app) — Order management & analytics
3. **Admin Panel** (separate repo) — Seller payouts & marketplace analytics

## 🎯 Key Features

### Buyer App
- 🏪 Browse sellers & food items with live inventory
- 🛒 Smart cart (single-seller constraint, Lalamove delivery quotes)
- 💳 VNPay integration (sandbox + live)
- 📍 Goong Maps for address selection & reverse geocoding
- 🌐 Multi-language support (English, Vietnamese)
- 🚀 Progressive Web App (offline-ready, installable)
- 📱 Real-time order tracking with Lalamove integration

### Seller Dashboard
- 📊 Recent orders with accept/reject workflow
- 📋 Order status management (pending → confirmed → ready → done)
- 🚚 Auto-book Lalamove for delivery orders
- 📈 Basic analytics (order count, revenue)

### Admin Panel (Separate Repo)
- 💰 **Seller Payout System** — Calculate commissions, manage withdrawals, VAT configs
- 📊 **Analytics Dashboard** — Track revenue, top items, top sellers, order funnel
- ⚙️ **Settings** — Commission rate & VAT management

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Vue 3 (Options API)
- **Build**: Vite
- **UI**: Quasar Framework
- **State**: Pinia
- **Routing**: Vue Router
- **i18n**: Custom (en-PH, vi)
- **Maps**: Goong Maps (via proxy)
- **Icons**: Lucide Vue Next
- **PWA**: Workbox

### Backend (Main)
- **API**: FastAPI (Python 3.10+)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase JWT + JWKS verification
- **External APIs**: VNPay, Lalamove, Goong Maps
- **Deployment**: AWS EC2 + nginx

### Backend (Admin Panel — Separate)
- **API**: FastAPI
- **Database**: Shared Supabase
- **Batch Jobs**: APScheduler (payout calculation, analytics aggregation)
- **Deployment**: Separate container

---

## 📂 Project Structure

```
v0-pangea/
├── frontend/                    # Buyer app (Vue 3 + Quasar)
│   ├── src/
│   │   ├── pages/              # Page components (orchestrators)
│   │   ├── layouts/            # Layout wrappers
│   │   ├── components/         # Reusable components
│   │   ├── stores/             # Pinia stores (auth, cart, orders)
│   │   ├── router/             # Vue Router config
│   │   ├── services/           # API client, formatters
│   │   ├── i18n/               # Translations
│   │   └── assets/             # Styles, icons
│   ├── .env.development
│   ├── .env.production
│   └── vite.config.js
│
├── backend/                     # Main backend (FastAPI)
│   ├── src/
│   │   ├── main.py             # FastAPI app + routes
│   │   ├── apis/               # Route handlers (orders, sellers, etc.)
│   │   ├── dao/                # Data access objects (Supabase queries)
│   │   ├── schemas/            # Pydantic models
│   │   ├── sql/                # Database migrations
│   │   ├── services/           # External API clients (VNPay, Lalamove, Goong)
│   │   └── envs/               # Environment config
│   ├── requirements.txt
│   └── Dockerfile
│
├── CLAUDE.md                    # Development guidelines
├── README.md                    # This file
└── .env.example                 # Environment template
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (frontend)
- Python 3.10+ (backend)
- Supabase account (or self-hosted PostgreSQL)

### Installation

**1. Clone & install dependencies**
```bash
git clone https://github.com/yourorg/v0-pangea.git
cd v0-pangea

# Frontend
cd frontend && npm install

# Backend
cd ../backend && pip install -r requirements.txt
```

**2. Environment Setup**

Create `.env.development` in `frontend/`:
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyxx...
VITE_API_BASE=/rest
```

Create `backend/src/envs/.env.local`:
```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_API_KEY=eyxx... (service role)
SUPABASE_JWKS_URL=https://xxx.supabase.co/auth/v1/jwks
VNPAY_TMN_CODE=xxxxx
VNPAY_HASH_SECRET=xxxxx
VNPAY_API_URL=https://sandbox.vnpayment.vn
LALAMOVE_MODE=mock
LALAMOVE_API_KEY=xxxxx
LALAMOVE_API_SECRET=xxxxx
GOONG_API_KEY=xxxxx
```

**3. Database Setup**

Run migrations in Supabase:
```bash
# Via Supabase dashboard or CLI
supabase db push
```

### Development

**Terminal 1 — Frontend**
```bash
cd frontend
npm run dev
# Runs on http://localhost:8081
# Proxies /rest → http://localhost:5000
```

**Terminal 2 — Backend**
```bash
cd backend/src
python main.py
# Runs on http://localhost:5000
```

Open http://localhost:8081 in your browser.

---

## 📡 API Contract

### Base URL
- **Dev**: `http://localhost:5000/rest/v1/`
- **Prod**: `https://api.sariko.store/rest/v1/`

### Key Endpoints

| Group | Endpoint | Method | Auth |
|-------|----------|--------|------|
| **Auth** | `/auth/login` | POST | No |
| | `/auth/signup` | POST | No |
| | `/users/me` | GET | Yes |
| **Orders** | `/orders` | GET | Yes |
| | `/orders` | POST | Yes |
| | `/orders/{id}` | GET | Yes |
| | `/orders/{id}/cancel` | PATCH | Yes |
| **Cart** | `/cart` | GET | Yes |
| | `/cart` | POST | Yes |
| | `/cart/{item_id}` | DELETE | Yes |
| **Sellers** | `/sellers/{slug}` | GET | No |
| | `/sellers/{slug}/menu` | GET | No |
| | `/sellers/me/orders` | GET | Yes (seller) |
| **Payments** | `/payments/vnpay/create/{order_id}` | POST | Yes |
| | `/payments/vnpay/return` | GET | No |
| **Deliveries** | `/deliveries/quotation` | POST | Yes |
| | `/deliveries/{order_id}/status` | GET | Yes |

Full API docs: See `CLAUDE.md` → **API Contract** section

---

## 🗄 Database Schema

**Main Tables (12 total):**
- `users` — Buyer & seller accounts
- `seller_profiles` — Seller info, ratings, bank details
- `menu_categories` — Food categories per seller
- `food_items` — Individual menu items with pricing
- `carts` — Active shopping carts (one per user)
- `cart_items` — Items in cart with quantities
- `orders` — Order headers (buyer, seller, total, status)
- `order_items` — Items ordered (snapshot of menu at order time)
- `reviews` — Buyer ratings for sellers
- `payments` — Payment records (VNPay transactions)
- `user_addresses` — Delivery addresses per buyer
- `deliveries` — Lalamove tracking info per order

**Admin-specific tables** (in separate admin-panel repo):
- `admin_seller_payouts` — Seller balance tracking
- `admin_withdrawal_requests` — Withdrawal request queue
- `admin_payout_transactions` — Audit log for payouts
- `admin_payout_settings` — Commission & VAT configs
- `admin_analytics_snapshots` — Daily aggregated metrics

Full schema: `backend/src/sql/create_tables.sql`

---

## 🔐 Security

### Authentication
- **Frontend**: Supabase JS client (JWT in localStorage)
- **Backend**: JWKS verification on each request via `Depends(verify_token)`
- **Admin Panel**: Single admin email with role check

### Data Protection
- VNPay IPN validation (server-to-server only, not client)
- CORS restricted to allowed origins (configured pre-production)
- Seller bank details encrypted in database
- No sensitive data in API responses beyond user's own data

### Secrets
- `.env` files never committed (use `.env.example`)
- Environment vars configured per deployment
- Service role key stored securely (backend only)

---

## 🌍 Deployment

### Frontend
```bash
npm run build
# Output: dist/
# Deploy to Cloudflare Pages, Vercel, or AWS S3 + CloudFront
```

### Backend
```bash
docker build -t sariko-backend .
docker run -p 5000:5000 --env-file .env.local sariko-backend
# Or deploy to AWS ECS, DigitalOcean App Platform, etc.
```

### Production Checklist
- [ ] CORS origins restricted to `sariko.store` domains
- [ ] HTTPS enabled (SSL certificate)
- [ ] VNPay switched to live mode
- [ ] Lalamove switched to live mode
- [ ] Database backups configured
- [ ] Error logging & monitoring set up
- [ ] `/dev` routes disabled in backend
- [ ] Admin email credentials secured

---

## 📊 Status

**MVP Launch**: April 18, 2026

### Completed ✅
- Buyer app (home, seller page, cart, checkout)
- Auth (login, signup, session restore)
- Order management (create, view, cancel, history)
- VNPay integration (sandbox)
- Lalamove integration (mock + live stubs)
- Order tracking with real-time delivery status
- Seller dashboard (recent orders, status management)
- Address management with Goong Maps
- Notifications (order status updates via polling)
- Admin panel scaffolding

### In Progress 🔄
- VNPay sandbox → live transition
- Lalamove live testing
- Email notifications
- Analytics refinement

### Planned 📋
- Admin payout system (batch calculation, withdrawal approvals)
- Advanced analytics (funnel, cohort analysis)
- Seller onboarding wizard
- Customer support chat
- Loyalty program

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Commit with clear messages: `git commit -m "feat: add my feature"`
3. Open a pull request
4. Follow code style in `CLAUDE.md` and `.claude/rules/`

Commit prefixes: `feat:`, `fix:`, `refactor:`

---

## 📚 Documentation

- **[CLAUDE.md](CLAUDE.md)** — Development guidelines, patterns, architecture
- **[Frontend Guide](frontend/FRONTEND_GUIDE.md)** — Vue 3 patterns, Page/Layout/Component structure
- **[Backend Guide](backend/BACKEND_GUIDE.md)** — FastAPI patterns, DAO design, API docs
- **[Code Style](/.claude/rules/code-style.md)** — Frontend/Backend conventions
- **[Security Rules](/.claude/rules/security.md)** — Auth, data protection, secrets

---

## 🐛 Known Issues

- `delivery_method` hardcoded to 'delivery' (no pickup option yet)
- Cart refresh briefly shows empty state
- CORS not yet restricted to specific origins (fix before production)
- Admin panel in separate repo (will be integrated post-MVP)

---

## 📞 Support

For issues, questions, or feedback:
- Open an issue on GitHub
- Check existing issues before creating duplicates
- Follow the issue template

---

## 📝 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Quasar Framework** for excellent Vue 3 component library
- **Supabase** for managed PostgreSQL backend
- **VNPay** for payment processing in Vietnam
- **Lalamove** for delivery logistics
- **Goong Maps** for Vietnamese mapping services

---

**Built with ❤️ by Sariko Team**  
HCMC, Vietnam 🇻 🇳
