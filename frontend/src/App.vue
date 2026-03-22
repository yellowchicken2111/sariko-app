<script>
import BottomNavigation from '@/components/nav/BottomNavigation.vue'

export default {
    name: 'App',
    components: {
        BottomNavigation
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
    <div class="app-container">
        <router-view/>
        <!-- <router-view v-slot="{ Component }"> -->
            <!-- <transition name="fade" mode="out-in">
                <component :is="Component" />
            </transition> -->
        <!-- </router-view> -->
        <BottomNavigation v-if="showNavigation" />
    </div>
</template>

<style scoped>
.app-container {
    min-height: 100vh;
    max-width: 1200px;
    width: 100%;
    display: flex;
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
