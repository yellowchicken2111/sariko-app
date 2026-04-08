# Security Rules

## Authentication
- All buyer/seller endpoints must use `Depends(verify_token)`
- Public endpoints: health check, VNPay IPN, VNPay return URL
- Route guards in `router.js`: `requiresAuth` for protected pages, `guestOnly` for auth pages

## API
- Never trust client-side data for payment verification — use IPN (server-to-server)
- VNPay return URL is display-only, never update DB from return URL
- CORS: must restrict origins before production deployment

## Secrets
- Frontend env: `.env.development`, `.env.production` (prefixed `VITE_`)
- Backend env: `backend/src/envs/.env.local` (loaded via python-dotenv)
- Never commit `.env` files, API keys, or Supabase service keys
