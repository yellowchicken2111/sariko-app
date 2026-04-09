<script>
import { ArrowLeft } from 'lucide-vue-next';
import { useSellerStore } from '@/stores/seller/sellerStore';

export default {
    components: { ArrowLeft },

    computed: {
        food() {
            return useSellerStore().currentFood
        }
    }
}
</script>

<template>
    <div class="hero">
        <img v-if="food" :src="food.image" :alt="food.name" class="hero-image" />
        <button class="back-btn" @click="$router.back()">
            <ArrowLeft :size="24" />
        </button>
    </div>
</template>

<style scoped>
.hero {
    position: relative;
    height: 100%;
}

.hero-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.back-btn {
    position: absolute;
    top: calc(16px + env(safe-area-inset-top, 0));
    left: 16px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--bg-surface);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: var(--shadow-card);
    z-index: 10;
    color: var(--text-primary);
}

.back-btn:active {
    transform: scale(0.95);
}
</style>
