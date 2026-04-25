<script>
import { Store } from 'lucide-vue-next';
import { useSellerStore } from '@/stores/seller/sellerStore';

export default {
    components: { Store },

    computed: {
        sellerStore() {
            return useSellerStore()
        },
        food() {
            return this.sellerStore.currentFood
        },
        seller() {
            return this.sellerStore.currentSeller
        },
        priceText() {
            if (!this.food) return ''
            const base = new Intl.NumberFormat('vi-VN').format(this.food.price) + ' ₫'
            return this.food.unit_label ? `${base} / ${this.food.unit_label}` : base
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
    <div class="food-info">
        <template v-if="food">
            <h1 class="food-name">{{ food.name }}</h1>
            <span class="food-price">{{ priceText }}</span>
            <q-badge v-if="food.preorder_day > 0" color="amber-8" class="preorder-badge">Pre-order: {{ food.preorder_day }} ngày</q-badge>
            <div v-if="seller" class="seller-chip" @click="goToSeller">
                <Store :size="14" />
                <span>{{ seller.store_name || seller.name }}</span>
            </div>
            <p v-if="food.description" class="food-description">{{ food.description }}</p>
        </template>

        <template v-else>
            <q-skeleton type="text" width="70%" height="28px" animation="pulse" />
            <q-skeleton type="text" width="40%" height="24px" animation="pulse" class="q-mt-sm" />
            <q-skeleton type="text" width="50%" height="18px" animation="pulse" class="q-mt-md" />
            <q-skeleton type="text" width="100%" animation="pulse" class="q-mt-md" />
            <q-skeleton type="text" width="90%" animation="pulse" />
            <q-skeleton type="text" width="60%" animation="pulse" />
        </template>
    </div>
</template>

<style scoped>
.food-info {
    font-family: "Plus Jakarta Sans", sans-serif;
}

.food-name {
    font-size: 22px;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1.3;
    margin-bottom: 10px;
}

.food-price {
    display: block;
    font-size: 24px;
    font-weight: 800;
    color: var(--text-active);
    margin-bottom: 10px;
}

.preorder-badge {
    display: inline-block;
    margin-bottom: 14px;
    font-size: 12px;
}

.seller-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-active);
    background: var(--accent-dim);
    padding: 6px 12px;
    border-radius: 999px;
    margin-bottom: 18px;
    cursor: pointer;
    transition: transform 0.15s ease;
}

.seller-chip:active {
    transform: scale(0.97);
}

.food-description {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.6;
    white-space: pre-line;
}
</style>
