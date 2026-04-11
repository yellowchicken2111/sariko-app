import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth/authStore'

let _bootstrapped = false

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/dummy',
        name: 'dummy',
        component: () => import('@/pages/OrdersPage.vue')
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('@/pages/HomePage.vue')
    },
    {
        path: '/signin',
        name: 'signin',
        component: () => import('@/pages/auth/AuthPage.vue'),
        meta: { guestOnly: true }
    },
    {
        path: '/signup',
        name: 'signup',
        component: () => import('@/pages/auth/AuthPage.vue'),
        meta: { guestOnly: true }
    },
    {
        path: '/onboarding',
        name: 'onboarding',
        component: () => import('@/pages/Onboarding.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/sellers',
        name: 'all-sellers',
        component: () => import('@/pages/AllSellersPage.vue'),
    },
    {
        path: '/seller/:slugName',
        name: 'seller',
        component: () => import('@/pages/SellerPage.vue'),
        props: true
    },
    {
        path: '/food/:sellerSlug/:foodId',
        name: 'food-detail',
        component: () => import('@/pages/FoodDetailPage.vue'),
        props: true
    },
    {
        path: '/cart',
        name: 'cart',
        component: () => import('@/pages/CartPage.vue'),
        meta: { requiresAuth: true }
    },
    // {
    //     path: '/checkout',
    //     name: 'checkout',
    //     component: () => import('@/pages/CheckoutPage.vue')
    // },
    {
        path: '/payment/return',
        name: 'payment-return',
        component: () => import('@/pages/PaymentReturnPage.vue')
    },
    {
        path: '/orders',
        name: 'orders',
        component: () => import('@/pages/OrdersPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/orders/:orderId',
        name: 'order-confirmation',
        component: () => import('@/pages/OrderConfirmationPage.vue'),
        props: true,
        meta: { requiresAuth: true }
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/pages/SellerDashboard.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/account',
        name: 'account',
        component: () => import('@/pages/AccountPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/account/profile',
        name: 'account-profile',
        component: () => import('@/pages/EditProfilePage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/account/address',
        name: 'account-address',
        component: () => import('@/pages/DeliveryAddressPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/account/language',
        name: 'account-language',
        component: () => import('@/pages/LanguagePage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/account/terms',
        name: 'account-terms',
        component: () => import('@/pages/TermsPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/account/privacy',
        name: 'account-privacy',
        component: () => import('@/pages/PrivacyPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/notifications',
        name: 'notifications',
        component: () => import('@/pages/NotificationsPage.vue'),
        meta: { requiresAuth: true }
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    }
})

router.beforeEach(async (to) => {
    const authStore = useAuthStore()

    if (!_bootstrapped) {
        await authStore.bootstrap()
        _bootstrapped = true
    }

    const isLoggedIn = !!authStore.user

    if (to.meta.requiresAuth && !isLoggedIn) {
        return { name: 'signin', query: { redirect: to.fullPath } }
    }

    if (to.meta.guestOnly && isLoggedIn) {
        return { name: 'home' }
    }
})

export default function useRouterPlugin(app) {
    console.log("Loaded Vue Router plugin")
    app.use(router);
}

