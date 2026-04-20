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

## Project
Sariko — Filipino homemade food marketplace in HCMC. Vue 3 PWA + FastAPI + Supabase.
**MVP Deadline:** April 18, 2026

## Dev Commands
```bash
# Frontend (from /frontend)
npm run dev        # :8081, proxies /rest → localhost:5000

# Backend (from /backend/src)
python main.py     # :5000
```

## Stack
- **Frontend**: Vue 3 + Vite + Quasar + Pinia, Options API, Vue Router
- **Backend**: FastAPI → DAOs (`dao/`) → Supabase PostgREST (no ORM)
- **Auth**: Supabase JS client (frontend), JWKS JWT verify (backend, `Depends(verify_token)`)
- **i18n**: `en-PH` + `vi` in `frontend/src/i18n/locales/`
- **Icons**: Lucide Vue Next | **Maps**: Goong Maps (proxied via backend)

## Key Patterns
- **Page = Layout + Components**: layout owns slots/CSS, components own logic/store access
- **Stores**: components read/write Pinia stores directly (no props/events)
- **DAO pattern**: never query DB in route handlers
- **Token injection**: `axiosPolicy.js` auto-attaches Supabase token
- **Cart = Checkout**: merged single page, single-seller constraint
- **Order flow**: Cart → POST /orders (snapshot + clear cart) → Order Confirmation → VNPay
- **Auth bootstrap**: on session restore fetches profile + address + cart + orders; signin does the same immediately
- **Skeleton**: section-level `q-skeleton animation="pulse"`, not per-element
- **VND format**: `new Intl.NumberFormat('vi-VN').format(amount) + ' ₫'`

## API Contract
All endpoints: `/rest/v1/` — Vite dev proxy `/rest` → `http://localhost:5000`

| Group | Key endpoints |
|-------|--------------|
| Cart | GET/POST/PATCH/DELETE `/cart` |
| Orders | POST `/orders`, GET `/orders/{id}`, PATCH `/{id}/cancel` (pending only) |
| Sellers | `/sellers/founding`, `/sellers/featured-dishes`, `/{slug}`, `/{slug}/menu` |
| Seller dashboard | GET/PATCH `/sellers/me/orders` (state machine: pending→confirmed→ready→done) |
| Users | GET `/users/info/me`, GET/PATCH `/users/me/address` |
| Payments | POST `/payments/vnpay/create/{order_id}`, GET `/payments/vnpay/ipn` (public), GET `/payments/vnpay/return` (public) |
| Deliveries | POST `/deliveries/quotation`, GET `/{order_id}/status`, POST `/webhook`, DELETE `/{order_id}/cancel` |
| Address | GET `/address/search`, `/address/detail`, `/address/reverse` |
| Dev (remove before prod) | PATCH `/dev/orders/{id}/force-pay`, `/force-status` |

## Environment
- Frontend: `.env.development` / `.env.production` (`VITE_` prefix)
- Backend: `backend/src/envs/.env.local`
- Key vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_API_KEY`, `SUPABASE_JWKS_URL`, `GOONG_API_KEY`, `LALAMOVE_MODE` (mock|live), `LALAMOVE_API_KEY/SECRET/BASE_URL/MARKET`

## Database (12 tables)
`users, seller_profiles, menu_categories, food_items, carts, cart_items, orders, order_items, reviews, payments, user_addresses, deliveries`
Full schema: `backend/src/sql/create_tables.sql`

**Pending Supabase migrations:**
```sql
ALTER TABLE orders ADD COLUMN IF NOT EXISTS quotation_id text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancellation_reason text;
ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS share_link text;
ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS driver_plate text;
ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS lalamove_order_id text;
ALTER TABLE food_items ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;
```

## Design System
- Dark theme: `#121b2f` (bg-main), `#1f2940` (surface)
- Accent: `#f5A623` / `#facc15` | Fonts: Lora (headings), Plus Jakarta Sans (body)
- SCSS vars: `frontend/src/assets/variables.scss` | Border radius: 16px

## Git
Commit prefixes: `feat:`, `fix:`, `refactor:`

---

## Status (Apr 17, 2026)

### Done — Buyer
- Home, Seller page, Food detail — full UI + skeleton + empty states
- Cart: add/remove/qty, single-seller conflict modal, delivery address, Lalamove quotation, checkout validation (blocks if phone/address missing)
- Auth: signin/signup, bootstrap (profile + address + cart + orders), session restore, first-login fix
- Onboarding: phone, delivery address (Goong autocomplete + map), language
- Order history: filter tabs, skeleton, empty state, real-time updates
- Order detail: status-aware, cancel (pending only), Pay Now retry, DeliveryTracker (hides driver info on REJECTED/CANCELLED/EXPIRED)
- Account: profile, address, language, terms, privacy — all wired
- VNPay: create URL → redirect → return page (success/failed)
- `total_amount` in DB = subtotal + delivery_fee (fixed)
- 404 NotFoundPage + catch-all route

### Done — Seller
- Dashboard: RecentOrders with Accept/Reject, filter dropdown, skeleton, empty state
- `/seller/orders`: grouped by date, filter chips, skeleton, empty state
- Order status machine: pending→confirmed→ready→done + cancel with reason
- Auto-book Lalamove when marking "ready" (delivery orders)

### Done — Delivery / Lalamove
- Mock service: time-based status progression (ASSIGNING→ON_GOING→PICKED_UP→COMPLETED)
- Webhook: updates status, clears driver fields on terminal statuses (REJECTED/CANCELLED/EXPIRED)
- DeliveryTracker: timeline + driver card + tracking link
- Buyer polling: 15s interval, auto-stop on COMPLETED

### Done — Infrastructure
- Goong Maps proxy (search, detail, reverse geocode)
- Dev panel: Ctrl+Shift+Q (force-pay, force-status)
- All pages: Page + Layout + Components pattern

### Partial / Stub
- Lalamove live mode: `LiveLalamoveService` stubs `NotImplementedError`
- VNPay: sandbox testing in progress
- Notifications page: empty placeholder
- `GET /sellers/`: stub, unused

### TODO (MVP required)
- Run SQL migrations above in Supabase
- Production: AWS EC2, nginx + certbot, `https://api.sariko.store`
- Restrict CORS origins
- Remove `/dev` router before production
- Terms + Privacy content (waiting on legal)

### Known Issues
- `delivery_method` hardcoded to `'delivery'` — no pickup UI
- `refreshCart()` flashes empty state briefly
- CORS allows all origins (fix before prod)

<!-- rtk-instructions v2 -->
# RTK (Rust Token Killer) - Token-Optimized Commands

## Golden Rule

**Always prefix commands with `rtk`**. If RTK has a dedicated filter, it uses it. If not, it passes through unchanged. This means RTK is always safe to use.

**Important**: Even in command chains with `&&`, use `rtk`:
```bash
# ❌ Wrong
git add . && git commit -m "msg" && git push

# ✅ Correct
rtk git add . && rtk git commit -m "msg" && rtk git push
```

## RTK Commands by Workflow

### Build & Compile (80-90% savings)
```bash
rtk cargo build         # Cargo build output
rtk cargo check         # Cargo check output
rtk cargo clippy        # Clippy warnings grouped by file (80%)
rtk tsc                 # TypeScript errors grouped by file/code (83%)
rtk lint                # ESLint/Biome violations grouped (84%)
rtk prettier --check    # Files needing format only (70%)
rtk next build          # Next.js build with route metrics (87%)
```

### Test (60-99% savings)
```bash
rtk cargo test          # Cargo test failures only (90%)
rtk go test             # Go test failures only (90%)
rtk jest                # Jest failures only (99.5%)
rtk vitest              # Vitest failures only (99.5%)
rtk playwright test     # Playwright failures only (94%)
rtk pytest              # Python test failures only (90%)
rtk rake test           # Ruby test failures only (90%)
rtk rspec               # RSpec test failures only (60%)
rtk test <cmd>          # Generic test wrapper - failures only
```

### Git (59-80% savings)
```bash
rtk git status          # Compact status
rtk git log             # Compact log (works with all git flags)
rtk git diff            # Compact diff (80%)
rtk git show            # Compact show (80%)
rtk git add             # Ultra-compact confirmations (59%)
rtk git commit          # Ultra-compact confirmations (59%)
rtk git push            # Ultra-compact confirmations
rtk git pull            # Ultra-compact confirmations
rtk git branch          # Compact branch list
rtk git fetch           # Compact fetch
rtk git stash           # Compact stash
rtk git worktree        # Compact worktree
```

Note: Git passthrough works for ALL subcommands, even those not explicitly listed.

### GitHub (26-87% savings)
```bash
rtk gh pr view <num>    # Compact PR view (87%)
rtk gh pr checks        # Compact PR checks (79%)
rtk gh run list         # Compact workflow runs (82%)
rtk gh issue list       # Compact issue list (80%)
rtk gh api              # Compact API responses (26%)
```

### JavaScript/TypeScript Tooling (70-90% savings)
```bash
rtk pnpm list           # Compact dependency tree (70%)
rtk pnpm outdated       # Compact outdated packages (80%)
rtk pnpm install        # Compact install output (90%)
rtk npm run <script>    # Compact npm script output
rtk npx <cmd>           # Compact npx command output
rtk prisma              # Prisma without ASCII art (88%)
```

### Files & Search (60-75% savings)
```bash
rtk ls <path>           # Tree format, compact (65%)
rtk read <file>         # Code reading with filtering (60%)
rtk grep <pattern>      # Search grouped by file (75%)
rtk find <pattern>      # Find grouped by directory (70%)
```

### Analysis & Debug (70-90% savings)
```bash
rtk err <cmd>           # Filter errors only from any command
rtk log <file>          # Deduplicated logs with counts
rtk json <file>         # JSON structure without values
rtk deps                # Dependency overview
rtk env                 # Environment variables compact
rtk summary <cmd>       # Smart summary of command output
rtk diff                # Ultra-compact diffs
```

### Infrastructure (85% savings)
```bash
rtk docker ps           # Compact container list
rtk docker images       # Compact image list
rtk docker logs <c>     # Deduplicated logs
rtk kubectl get         # Compact resource list
rtk kubectl logs        # Deduplicated pod logs
```

### Network (65-70% savings)
```bash
rtk curl <url>          # Compact HTTP responses (70%)
rtk wget <url>          # Compact download output (65%)
```

### Meta Commands
```bash
rtk gain                # View token savings statistics
rtk gain --history      # View command history with savings
rtk discover            # Analyze Claude Code sessions for missed RTK usage
rtk proxy <cmd>         # Run command without filtering (for debugging)
rtk init                # Add RTK instructions to CLAUDE.md
rtk init --global       # Add RTK to ~/.claude/CLAUDE.md
```

## Token Savings Overview

| Category | Commands | Typical Savings |
|----------|----------|-----------------|
| Tests | vitest, playwright, cargo test | 90-99% |
| Build | next, tsc, lint, prettier | 70-87% |
| Git | status, log, diff, add, commit | 59-80% |
| GitHub | gh pr, gh run, gh issue | 26-87% |
| Package Managers | pnpm, npm, npx | 70-90% |
| Files | ls, read, grep, find | 60-75% |
| Infrastructure | docker, kubectl | 85% |
| Network | curl, wget | 65-70% |

Overall average: **60-90% token reduction** on common development operations.
<!-- /rtk-instructions -->