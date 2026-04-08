# Code Style Rules

## Frontend (Vue 3)
- Use **Options API** (not Composition API)
- Every page follows **Page + Layout + Components** pattern (see `/FRONTEND_GUIDE.md`)
- Layout owns padding/positioning, Components own logic/store access
- Slot names: PascalCase (`#Header`, `#Actions`)
- Icons: Lucide Vue Next (not inline SVGs)
- Stores: access directly from components (not via props/events)
- Formatting VND: `new Intl.NumberFormat('vi-VN').format(amount) + ' ₫'`

## Backend (FastAPI)
- Layering: API routers (`apis/`) → DAOs (`dao/`) → Supabase client
- Never query DB directly in route handlers — always go through DAO
- Auth: `Depends(verify_token)` for protected endpoints
- Schemas: Pydantic models in `schemas/` for request validation

## Git
- Commit prefixes: `feat:`, `fix:`, `refactor:`
- No `.env` files or secrets in commits
