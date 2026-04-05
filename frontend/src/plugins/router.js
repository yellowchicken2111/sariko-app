import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/dummy',
        name: 'dummy',
        component: () => import('@/pages/CheckoutPage.vue')
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('@/pages/HomePage.vue')
    },
    {
        path: '/signin',
        name: 'signin',
        component: () => import('@/pages/auth/AuthPage.vue')
    },
    {
        path: '/signup',
        name: 'signup',
        component: () => import('@/pages/auth/AuthPage.vue')
    },
    {
        path: '/seller/:slugName',
        name: 'seller',
        component: () => import('@/pages/SellerPage.vue'),
        props: true
    },
    {
        path: '/food/:sellerId/:foodId',
        name: 'food-detail',
        component: () => import('@/pages/FoodDetailPage.vue'),
        props: true
    },
    {
        path: '/cart',
        name: 'cart',
        component: () => import('@/pages/CartPage.vue')
    },
    {
        path: '/checkout',
        name: 'checkout',
        component: () => import('@/pages/CheckoutPage.vue')
    },
    {
        path: '/orders',
        name: 'orders',
        component: () => import('@/pages/OrdersPage.vue')
    },
    {
        path: '/orders/:orderId',
        name: 'order-confirmation',
        component: () => import('@/pages/OrderConfirmationPage.vue'),
        props: true
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/pages/SellerDashboard.vue')
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

export default function useRouterPlugin(app) {
    console.log("Loaded Vue Router plugin")
    app.use(router);
}

