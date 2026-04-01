<script>
import { House, Search, ShoppingCart, Clipboard, PanelsRightBottom } from 'lucide-vue-next';
import { routerKey } from 'vue-router';

export default {
    name: 'BottomNavigation',

    components: {
        House, Search, ShoppingCart, Clipboard, PanelsRightBottom
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
                    label: 'Hanapin',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>`,
                    badge: 0
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
        isShow() {
            return this.$route.path != '/signin' && this.$route.path != '/signup'
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
    // watch: {
    //     cartCount: {
    //         immediate: true,
    //         handler(newVal) {
    //             this.navItems[1].badge = newVal
    //         }
    //     }
    // },

    mounted() {
        const height = this.$refs.navRef?.offsetHeight || 0
        document.documentElement.style.setProperty('--bottom-nav-height', `${height}px`)
    }
}
</script>

<template>
    <nav ref="navRef" v-show="isShow" class="bottom-nav">
        <router-link to="/home" class="nav-item" :class="{ active: isActive('/home') }">
            <House size="18px" />
            <div class="nav-label">{{$t('bottom_nav.button_label_home')}}</div>
            <!-- <span v-if="item.badge && item.badge > 0" class="nav-badge">{{ item.badge }}</span> -->
        </router-link>

        <router-link to="/seller/teresa-canutba" class="nav-item" :class="{ active: isActive('/seller') }">
            <Search size="18px" />
            <div class="nav-label">{{$t('bottom_nav.button_label_search')}}</div>
            <!-- <span v-if="item.badge && item.badge > 0" class="nav-badge">{{ item.badge }}</span> -->
        </router-link>

        <router-link to="/cart" class="nav-item">
            <div class="icon-cart">
                <ShoppingCart size="18px" style="color: #2d271f"/>
            </div>
            <div class="nav-label">{{$t('bottom_nav.button_label_cart')}}</div>
            <!-- <span v-if="item.badge && item.badge > 0" class="nav-badge">{{ item.badge }}</span> -->
        </router-link>

        <router-link to="" class="nav-item" :class="{ active: isActive('/orders') }">
            <Clipboard size="18px" />
            <div class="nav-label">{{$t('bottom_nav.button_label_orders')}}</div>
            <!-- <span v-if="item.badge && item.badge > 0" class="nav-badge">{{ item.badge }}</span> -->
        </router-link>

        <router-link to="" class="nav-item" :class="{ active: isActive('/dashboard') }">
            <PanelsRightBottom size="18px" /> 
            <div class="nav-label">{{$t('bottom_nav.button_label_dashboard')}}</div>
            <!-- <span v-if="item.badge && item.badge > 0" class="nav-badge">{{ item.badge }}</span> -->
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

    display: flex;
    align-items: center;
    justify-content: center;

    background: #f5A623;
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
