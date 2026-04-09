<script>
import { Home } from 'lucide-vue-next';
import { useSellerStore } from '@/stores/seller/sellerStore';

export default {
    components: { Home },

    computed: {
        sellerStore() {
            return useSellerStore()
        },
        food() {
            return this.sellerStore.currentFood
        },
        seller() {
            return this.sellerStore.currentSeller
        }
    },

    methods: {
        goToSeller() {
            if (this.seller?.slug) {
                this.$router.push(`/seller/${this.seller.slug}`)
            }
        }
    }
}
</script>

<template>
    <div v-if="food">
        <h1 class="food-name">{{ food.name }}</h1>
        <span class="food-price">{{ new Intl.NumberFormat('vi-VN').format(food.price) }} ₫</span>
        <p v-if="seller" class="seller-name" @click="goToSeller">
            <Home :size="16" />
            {{ seller.store_name || seller.name }}
        </p>
        <p v-if="food.description" class="food-description">{{ food.description }}</p>
    </div>
</template>

<style scoped>
.food-name {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 8px;
}

.food-price {
    font-size: 22px;
    font-weight: 700;
    color: var(--color-primary);
    display: block;
    margin-bottom: 12px;
}

.seller-name {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 16px;
    cursor: pointer;
}

.seller-name:hover {
    color: var(--color-primary);
}

.food-description {
    font-size: 15px;
    color: var(--text-secondary);
    line-height: 1.6;
}
</style>
