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
- 🛒 Smart cart with delivery cost estimation
- 💳 Payment processing integration
- 📍 Address selection & mapping
- 🌐 Multi-language support (English, Vietnamese)
- 🚀 Progressive Web App (offline-ready, installable)
- 📱 Real-time order tracking

### Seller Dashboard
- 📊 Order management & workflow
- 📋 Order status tracking
- 🚚 Delivery integration
- 📈 Basic analytics

### Admin Panel (Separate Repo)
- 💰 **Seller Payout System** — Commission management, withdrawal processing
- 📊 **Analytics Dashboard** — Key marketplace metrics
- ⚙️ **Settings** — Configuration management

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Vue 3 (Options API)
- **Build**: Vite
- **UI**: Quasar Framework
- **State**: Pinia
- **Routing**: Vue Router
- **i18n**: Multi-language support
- **Icons**: Lucide Vue Next
- **PWA**: Progressive Web App ready

### Backend
- **API**: FastAPI (Python 3.10+)
- **Database**: PostgreSQL
- **Auth**: JWT-based authentication
- **Integration**: Payment processing, delivery logistics, mapping services

---

## 📂 Project Structure

```
sariko-app/
├── frontend/                    # Vue 3 + Quasar PWA
│   ├── src/
│   │   ├── pages/              # Page components
│   │   ├── components/         # Reusable components
│   │   ├── stores/             # State management
│   │   ├── router/             # Routing
│   │   ├── services/           # API client & utilities
│   │   ├── i18n/               # Translations
│   │   └── assets/             # Styles & resources
│   └── vite.config.js
│
├── backend/                     # FastAPI backend
│   ├── src/
│   │   ├── main.py
│   │   ├── apis/               # API routes
│   │   ├── dao/                # Data access layer
│   │   ├── schemas/            # Request/response models
│   │   ├── sql/                # Database migrations
│   │   └── services/           # Business logic
│   └── requirements.txt
│
├── CLAUDE.md                    # Development guidelines
└── README.md                    # This file
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
git clone https://github.com/yellowchicken2111/sariko-app.git
cd sariko-app

# Frontend
cd frontend && npm install

# Backend
cd ../backend && pip install -r requirements.txt
```

**2. Environment Setup**

Copy `.env.example` files and fill in your configuration:

```bash
cp frontend/.env.example frontend/.env.development
cp backend/src/envs/.env.example backend/src/envs/.env.local
```

Then update with your database credentials, API keys, and service configurations. See documentation for details.

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

## 📡 API

The backend provides a RESTful API for:
- User authentication (signup, login)
- Seller discovery & menu browsing
- Order management (create, view, cancel)
- Payment processing
- Delivery tracking

API documentation is available in `CLAUDE.md` for development team members.

---

## 🗄 Database

PostgreSQL database with schema for:
- User accounts & authentication
- Seller information & menus
- Shopping carts & orders
- Payments & delivery tracking
- Reviews & ratings

Database migrations are in `backend/src/sql/`

---

## 🌍 Deployment

Frontend and backend are deployed to separate production environments.

### Build
```bash
# Frontend
npm run build

# Backend
docker build -t sariko-backend .
```

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

- **Quasar Framework** for Vue 3 components
- **FastAPI** for Python backend framework
- **Vite** for fast frontend build tooling

---

**Built by Sariko Team**  
HCMC, Vietnam 🇻 🇳
