<script>
import BottomNavigation from '@/components/nav/BottomNavigation.vue'
import { setUpAxiosPolicy } from "@/lib/axiosPolicy.js";

export default {
    name: 'App',
    components: {
        BottomNavigation
    },

    setup() {        
        setUpAxiosPolicy();
    },

    data() {
        return {}
    },
    computed: {
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
        <BottomNavigation v-if="showNavigation" />
    </div>    
</template>

<style scoped>

.app-container {
    min-height: 100vh;
    max-width: 800px;
    width: 100%;
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