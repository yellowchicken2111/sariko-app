<script>
import { House, ShoppingCart, Clipboard, Bell, CircleUserRound, LayoutDashboard } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth/authStore';
import { useCartStore } from '@/stores/cart/cartStore';

export default {
    name: 'BottomNavigation',

    components: {
        House, ShoppingCart, Clipboard, Bell, CircleUserRound, LayoutDashboard
    },

    computed: {
        authStore() {
            return useAuthStore()
        },
        cartStore() {
            return useCartStore()
        },
        isSellerMode() {
            return this.authStore.user?.isSeller && this.authStore.viewMode === 'seller'
        },
        cartBadge() {
            return this.cartStore.itemCount
        },
        isShow() {
            const path = this.$route.path
            return path != '/signin'
                && path != '/signup'
                && path != '/cart'
                && path != '/dummy'
                && path != '/onboarding'
                && path != '/payment/return'
                && !path.match(/^\/orders\/[^/]+$/)
        }
    },
    methods: {
        isActive(path) {
            if (path === '/home') {
                return this.$route.path === '/' || this.$route.path === '/home'
            }
            return this.$route.path.startsWith(path)
        }
    },

    mounted() {
        const height = this.$refs.navRef?.offsetHeight || 0
        document.documentElement.style.setProperty('--bottom-nav-height', `${height}px`)
    }
}
</script>

<template>
    <nav ref="navRef" v-show="isShow" class="bottom-nav">
        <!-- Tab 1: Home (both modes) -->
        <router-link to="/home" class="nav-item" :class="{ active: isActive('/home') }">
            <House size="18px" />
            <div class="nav-label">{{ $t('bottom_nav.button_label_home') }}</div>
        </router-link>

        <!-- Tab 2: Dashboard (seller) / Orders (buyer) -->
        <router-link v-if="isSellerMode" to="/dashboard" class="nav-item" :class="{ active: isActive('/dashboard') }">
            <LayoutDashboard size="18px" />
            <div class="nav-label">{{ $t('bottom_nav.button_label_dashboard') }}</div>
        </router-link>
        <router-link v-else to="/orders" class="nav-item" :class="{ active: isActive('/orders') }">
            <Clipboard size="18px" />
            <div class="nav-label">{{ $t('bottom_nav.button_label_orders') }}</div>
        </router-link>

        <!-- Tab 3: Cart (buyer) / Orders (seller) -->
        <router-link v-if="isSellerMode" to="/orders" class="nav-item" :class="{ active: isActive('/orders') }">
            <Clipboard size="18px" />
            <div class="nav-label">{{ $t('bottom_nav.button_label_orders') }}</div>
        </router-link>
        <router-link v-else to="/cart" class="nav-item">
            <div class="icon-cart">
                <ShoppingCart size="18px" style="color: #2d271f"/>
                <span v-if="cartBadge > 0" class="cart-badge">{{ cartBadge }}</span>
            </div>
            <div class="nav-label">{{ $t('bottom_nav.button_label_cart') }}</div>
        </router-link>

        <!-- Tab 4: Notifications (both modes) — disabled, UI not designed yet -->
        <div class="nav-item disabled">
            <Bell size="18px" />
            <div class="nav-label">{{ $t('bottom_nav.button_label_notifications') }}</div>
        </div>

        <!-- Tab 5: Account (both modes) — disabled, UI not designed yet -->
        <div class="nav-item disabled">
            <CircleUserRound size="18px" />
            <div class="nav-label">{{ $t('bottom_nav.button_label_account') }}</div>
        </div>
    </nav>
</template>

<style scoped>
.bottom-nav {
    max-width: 800px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--bg-main);
    /* primary_background */
    display: flex;
    margin: auto;
    justify-content: space-around;
    align-items: center;
    padding: 8px 5px;
    padding-bottom: calc(8px + env(safe-area-inset-bottom, 0));
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
    z-index: 0;
}

.nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: var(--text-secondary);
    /* primary_text opacity 0.6 is close to text-secondary */
    padding: 8px 16px;
    border-radius: 12px;
    transition: all 0.2s ease;
    position: relative;
    min-width: 64px;
    min-height: 44px;
}

.icon-cart {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    position: relative;

    display: flex;
    align-items: center;
    justify-content: center;

    background: #f5A623;
}

.cart-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    background: #ef4444;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    min-width: 18px;
    height: 18px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    border: 2px solid var(--bg-main);
}

.nav-item.active {
    color: var(--color-accent);
    background-color: #2d271f;
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
    margin-top: 5px;
    font-size: 10px;
    font-weight: 500;
}

.nav-item.disabled {
    opacity: 0.35;
    pointer-events: none;
}

.nav-badge {
    position: absolute;
    top: 2px;
    right: 12px;
    background: var(--color-accent);
    color: var(--bg-main);
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
