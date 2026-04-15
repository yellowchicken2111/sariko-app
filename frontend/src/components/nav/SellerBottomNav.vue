<script>
import { House, ClipboardList, UtensilsCrossed, CircleUserRound } from 'lucide-vue-next';

export default {
    name: 'SellerBottomNav',

    components: { House, ClipboardList, UtensilsCrossed, CircleUserRound },

    computed: {
        isShow() {
            return this.$route.name !== 'seller-order-detail'
        }
    },

    methods: {
        isActive(path) {
            return this.$route.path === path || this.$route.path.startsWith(path + '/')
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
        <router-link to="/seller/home" class="nav-item" :class="{ active: isActive('/seller/home') }">
            <House size="18px" />
            <div class="nav-label">Today</div>
        </router-link>

        <router-link to="/seller/orders" class="nav-item" :class="{ active: isActive('/seller/orders') }">
            <ClipboardList size="18px" />
            <div class="nav-label">Orders</div>
        </router-link>

        <router-link to="/seller/menu" class="nav-item" :class="{ active: isActive('/seller/menu') }">
            <UtensilsCrossed size="18px" />
            <div class="nav-label">Menu</div>
        </router-link>

        <router-link to="/seller/me" class="nav-item" :class="{ active: isActive('/seller/me') }">
            <CircleUserRound size="18px" />
            <div class="nav-label">Me</div>
        </router-link>
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
    padding: 8px 16px;
    border-radius: 12px;
    transition: all 0.2s ease;
    min-width: 64px;
    min-height: 44px;
}

.nav-item.active {
    color: var(--color-accent);
    background-color: #2d271f;
}

.nav-label {
    margin-top: 5px;
    font-size: 10px;
    font-weight: 500;
}
</style>
