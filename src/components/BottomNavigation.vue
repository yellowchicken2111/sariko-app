<template>
  <nav class="bottom-nav">
    <router-link 
      v-for="item in navItems" 
      :key="item.path"
      :to="item.path" 
      class="nav-item"
      :class="{ active: isActive(item.path) }"
    >
      <div class="nav-icon" v-html="item.icon"></div>
      <span class="nav-label">{{ item.label }}</span>
      <span v-if="item.badge && item.badge > 0" class="nav-badge">{{ item.badge }}</span>
    </router-link>
  </nav>
</template>

<script>
import { useCartStore } from '../stores/cartStore'

export default {
  name: 'BottomNavigation',
  setup() {
    const cartStore = useCartStore()
    return { cartStore }
  },
  data() {
    return {
      navItems: [
        {
          path: '/',
          label: 'Home',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`
        },
        {
          path: '/cart',
          label: 'Cart',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>`,
          badge: 0
        },
        {
          path: '/orders',
          label: 'Orders',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`
        },
        {
          path: '/dashboard',
          label: 'Seller',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>`
        }
      ]
    }
  },
  computed: {
    cartCount() {
      return this.cartStore.itemCount
    }
  },
  methods: {
    isActive(path) {
      if (path === '/') {
        return this.$route.path === '/'
      }
      return this.$route.path.startsWith(path)
    }
  },
  watch: {
    cartCount: {
      immediate: true,
      handler(newVal) {
        this.navItems[1].badge = newVal
      }
    }
  }
}
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 8px 0;
  padding-bottom: calc(8px + env(safe-area-inset-bottom, 0));
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #6B7280;
  padding: 8px 16px;
  border-radius: 12px;
  transition: all 0.2s ease;
  position: relative;
  min-width: 64px;
  min-height: 44px;
}

.nav-item.active {
  color: #16A34A;
}

.nav-item.active .nav-icon {
  transform: scale(1.1);
}

.nav-icon {
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
  transition: transform 0.2s ease;
}

.nav-label {
  font-size: 11px;
  font-weight: 500;
}

.nav-badge {
  position: absolute;
  top: 2px;
  right: 12px;
  background: #16A34A;
  color: white;
  font-size: 10px;
  font-weight: 600;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}
</style>
