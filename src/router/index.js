import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../pages/HomePage.vue'
import SellerPage from '../pages/SellerPage.vue'
import FoodDetailPage from '../pages/FoodDetailPage.vue'
import CartPage from '../pages/CartPage.vue'
import OrdersPage from '../pages/OrdersPage.vue'
import SellerDashboard from '../pages/SellerDashboard.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/seller/:id',
    name: 'seller',
    component: SellerPage,
    props: true
  },
  {
    path: '/food/:sellerId/:foodId',
    name: 'food-detail',
    component: FoodDetailPage,
    props: true
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartPage
  },
  {
    path: '/orders',
    name: 'orders',
    component: OrdersPage
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: SellerDashboard
  }
]

const router = createRouter({
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

export default router
