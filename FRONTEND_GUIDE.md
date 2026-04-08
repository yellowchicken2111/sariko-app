# Frontend Guide

This document describes the frontend architecture, code patterns, and file inventory for the Sariko project. It is the single source of truth for how frontend code should be organized.

## Page + Layout + Components Pattern

Every page **must** follow this 3-layer architecture:

```
Page (orchestrator)
 └── Layout (slot skeleton, CSS positioning/padding)
      └── Components (logic, Pinia store access, UI)
```

### Rules

1. **Page** (`pages/`) — thin orchestrator. Imports one Layout + N Components, wires them via `<template #SlotName>`. Data fetching happens here in `mounted()`. No CSS, no business logic.
2. **Layout** (`layouts/`) — defines named `<slot>`s wrapped in divs. Owns ALL CSS positioning, spacing, and padding. No logic, no store access.
3. **Components** (`components/`) — self-contained UI sections. Access Pinia stores directly (not via props/events from Page). Own their visual styles but NOT positioning/padding within the page.

### Conventions

- Slot names use **PascalCase**: `#Header`, `#StatusHeader`, `#Actions`
- Padding for sections belongs in the **Layout's** slot wrapper div, NOT inside Components
- Shared/reusable components go in `components/shared/`
- Each feature gets its own folder: `components/order-details/`, `layouts/order/order-details/`
- Reference: `HomePage.vue` is the canonical example

### Example

```vue
<!-- pages/OrderConfirmationPage.vue (Page) -->
<template>
    <LayoutBaseOrderDetail>
        <template #Breadcrumbs>
            <OrderBreadcrumbs />
        </template>
        <template #StatusHeader>
            <OrderStatusHeader />
        </template>
        <template #OrderInfo>
            <OrderInfoCard />
        </template>
        <template #Actions>
            <OrderActions />
        </template>
    </LayoutBaseOrderDetail>
</template>
```

```vue
<!-- layouts/order/order-details/LayoutBaseOrderDetail.vue (Layout) -->
<template>
    <div class="order-detail-page">
        <div class="breadcrumbs-section">       <!-- padding: 15px -->
            <slot name="Breadcrumbs" />
        </div>
        <div class="status-header-section">     <!-- padding: 24px 16px -->
            <slot name="StatusHeader" />
        </div>
        ...
    </div>
</template>
```

```vue
<!-- components/order-details/OrderStatusHeader.vue (Component) -->
<!-- Accesses useOrderStore() directly. No padding — Layout handles that. -->
```

## File Structure

```
frontend/src/
├── apis/                    # Axios API clients per feature
│   ├── auth/apiAuth.js
│   ├── cart/apiCart.js
│   ├── payments/apiPayments.js
│   └── sellers/
│       ├── apiSellers.js
│       └── apiSellerDashboard.js
├── assets/                  # SCSS variables, Quasar theme
├── components/              # Feature-organized components
│   ├── account/             # ProfileHeader, SwitchMode, SettingsMenu, SupportMenu, SignOutButton
│   ├── auth/                # AuthHeader, AuthButtonGroup, AuthInputFields
│   ├── food-detail/         # HeroImage, FoodInfo, QuantitySelector, AddToCartBar
│   ├── home-page/           # Header, SearchBar, Categories, FoundingSellers, FeaturedDishes, Banner
│   ├── nav/                 # BottomNavigation.vue
│   ├── notifications/       # EmptyState
│   ├── order-cart/          # BreadCrums, CartItems, DeliveryAddress, NoteInput, TotalAmounts, EmptyState
│   ├── order-details/       # OrderBreadcrumbs, OrderStatusHeader, OrderInfoCard, OrderActions
│   ├── order-history/       # BreadCrumbs, FilterTabs, OrdersList, OrderCard
│   ├── payment/             # PaymentResult
│   ├── seller/              # seller-page/, seller-list/
│   ├── seller-dashboard/    # DashboardHeader, DashboardStats, RecentOrders
│   └── shared/              # PageBreadcrumbs (title, backTo, cssHeightVar props)
├── i18n/locales/            # en-PH.json, vi.json (100% in sync)
├── layouts/                 # Slot-based layout skeletons
│   ├── account/             # LayoutBaseAccount (5 slots)
│   ├── auth/                # LayoutBaseAuth
│   ├── food-detail/         # LayoutBaseFoodDetail (4 slots)
│   ├── home-page/           # LayoutBaseHomePage (6 slots)
│   ├── notifications/       # LayoutBaseNotifications (2 slots)
│   ├── onboarding/buyer/    # LayoutBaseBuyerOnboarding
│   ├── order/
│   │   ├── my-orders/       # LayoutBaseMyOrder (3 slots)
│   │   └── order-details/   # LayoutBaseOrderDetail (4 slots)
│   ├── order-cart/          # LayoutBaseOrderCart
│   ├── payment/             # LayoutBasePaymentReturn (1 slot)
│   ├── seller/              # LayoutBaseSellerPage, LayoutSellerInfo
│   └── seller-dashboard/    # LayoutBaseSellerDashboard (3 slots)
├── lib/
│   ├── axiosPolicy.js       # Token injection, 401 refresh, error toasts
│   └── supabase.js          # Supabase client init
├── pages/                   # 12 pages, all follow pattern
│   ├── HomePage.vue
│   ├── auth/AuthPage.vue
│   ├── Onboarding.vue
│   ├── SellerPage.vue
│   ├── FoodDetailPage.vue
│   ├── CartPage.vue
│   ├── OrdersPage.vue
│   ├── OrderConfirmationPage.vue
│   ├── PaymentReturnPage.vue
│   ├── SellerDashboard.vue
│   ├── AccountPage.vue
│   └── NotificationsPage.vue
├── plugins/
│   ├── router.js            # Routes + beforeEach guard
│   ├── pinia.js
│   ├── quasar.js
│   └── i18n.js              # en_ph + vi locales
└── stores/
    ├── auth/authStore.js     # User session, bootstrap, signin/signup/signout, viewMode
    ├── cart/cartStore.js     # Cart CRUD, single-seller constraint
    ├── order/orderStore.js   # Orders list, detail, cancel, place order
    ├── seller/sellerStore.js # Seller browse + menu
    ├── home/homeStore.js     # Home search & featured dishes
    └── data.js               # Mock data (legacy, only used by sellerStore init)
```

## Routes

| Path | Page | Guard | Bottom Nav |
|------|------|-------|------------|
| `/home` | HomePage | public | show |
| `/signin` | AuthPage | guestOnly | hide |
| `/signup` | AuthPage | guestOnly | hide |
| `/onboarding` | Onboarding | requiresAuth | hide |
| `/seller/:slugName` | SellerPage | public | show |
| `/food/:sellerId/:foodId` | FoodDetailPage | public | hide |
| `/cart` | CartPage | requiresAuth | hide |
| `/payment/return` | PaymentReturnPage | public | hide |
| `/orders` | OrdersPage | requiresAuth | show |
| `/orders/:orderId` | OrderConfirmationPage | requiresAuth | hide |
| `/dashboard` | SellerDashboard | requiresAuth | show |
| `/account` | AccountPage | requiresAuth | show |
| `/notifications` | NotificationsPage | requiresAuth | show |

## App.vue

- Root wrapper: `.app-container` (flex column, max-width 800px, centered)
- Renders `<router-view>` + `<BottomNavigation>`
- BottomNavigation visibility controlled by `isShow` computed in BottomNavigation.vue

## Styling Conventions

- **Vue style:** Options API (not Composition API)
- **Dark theme:** bg-main `#121b2f`, surface `#1f2940`
- **Accent:** gold `#facc15` / `#f5A623`
- **Fonts:** "Lora" (headings), "Plus Jakarta Sans" (body)
- **SCSS variables:** `frontend/src/assets/variables.scss`
- **Border radius:** 16px (`$radius-base`)
- **VND formatting:** `new Intl.NumberFormat('vi-VN').format(amount) + ' ₫'`
- **Skeleton loading:** Quasar `q-skeleton` with `animation="pulse"`, section-level blocks
- **Icons:** Lucide Vue Next (not inline SVGs)

## Shared Components

| Component | Location | Props | Used By |
|-----------|----------|-------|---------|
| `PageBreadcrumbs` | `components/shared/` | `title` (required), `backTo` (optional, defaults to router.back), `cssHeightVar` (optional, measures height) | Cart, My Orders, Order Detail |
