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
        <q-img v-if="food" :src="food.image_url || '/images/default-food-image.webp'" :alt="food.name" class="hero-image" />
        <q-skeleton v-else class="hero-skeleton" animation="pulse" />
        <div class="hero-overlay"></div>
        <button class="back-btn" :aria-label="$t('food_detail_page.button_back') || 'Go back'" @click="$router.back()">
            <ArrowLeft :size="22" />
        </button>
    </div>
</template>

<style scoped>
.hero {
    position: relative;
    height: 100%;
    overflow: hidden;
    background: var(--bg-surface);
}

.hero-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.hero-skeleton {
    width: 100%;
    height: 100%;
    border-radius: 0;
}

.hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
        180deg,
        rgba(4, 10, 20, 0.45) 0%,
        rgba(4, 10, 20, 0) 35%,
        rgba(4, 10, 20, 0) 65%,
        rgba(4, 10, 20, 0.85) 100%
    );
    pointer-events: none;
}

.back-btn {
    position: absolute;
    top: calc(14px + env(safe-area-inset-top, 0));
    left: 16px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(4, 10, 20, 0.55);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    color: #ffffff;
    transition: transform 0.15s ease;
}

.back-btn:active {
    transform: scale(0.92);
}
</style>
