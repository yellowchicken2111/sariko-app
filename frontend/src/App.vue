<script>
import BottomNavigation from '@/components/nav/BottomNavigation.vue'
import SellerBottomNav from '@/components/nav/SellerBottomNav.vue'
import HackerPanel from '@/components/dev/HackerPanel.vue'
import { setUpAxiosPolicy } from "@/lib/axiosPolicy.js";
import { useAuthStore } from '@/stores/auth/authStore';

export default {
    name: 'App',
    components: {
        BottomNavigation,
        SellerBottomNav,
        HackerPanel,
    },

    setup() {
        setUpAxiosPolicy();
    },

    data() {
        return {}
    },
    computed: {
        isSellerMode() {
            const authStore = useAuthStore()
            return authStore.user?.isSeller && authStore.viewMode === 'seller'
        },
        showNavigation() {
            const hiddenRoutes = ['food-detail']
            return !hiddenRoutes.includes(this.$route.name)
        }
    },
    methods: {}
}
</script>

<template>
    <div class="background">
        <div class="app-container">
            <router-view/>
            <!-- <router-view v-slot="{ Component }"> -->
                <!-- <transition name="fade" mode="out-in">
                    <component :is="Component" />
                </transition> -->
            <!-- </router-view> -->
        </div>
        <SellerBottomNav v-if="showNavigation && isSellerMode" />
        <BottomNavigation v-else-if="showNavigation" />
        <HackerPanel />
    </div>    
</template>

<style scoped>

.app-container {
    min-height: 100vh;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    margin: auto;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>