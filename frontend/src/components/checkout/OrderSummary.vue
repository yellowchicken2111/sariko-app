<script>
import { mapState } from 'pinia';
import { useCartStore } from '@/stores/cart/cartStore.js';
import { useCheckoutStore } from '@/stores/checkout/checkoutStore.js';

export default {
    computed: {
        ...mapState(useCartStore, ['cartItems']),
        ...mapState(useCheckoutStore, ['sellerName'])
    },

    methods: {
        formatPrice(value) {
            return new Intl.NumberFormat('vi-VN').format(value) + ' \u20AB'
        }
    }
}
</script>

<template>
    <div class="order-summary">
        <div class="section-label">Order Summary</div>

        <div class="summary-card">
            <div class="seller-name" v-if="sellerName">
                {{ sellerName }}
            </div>

            <div class="items-list">
                <div
                    class="order-item"
                    v-for="item in cartItems"
                    :key="item.id"
                >
                    <div class="item-qty">{{ item.quantity }}x</div>
                    <div class="item-name">{{ item.name }}</div>
                    <div class="item-price">{{ formatPrice(item.price * item.quantity) }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.section-label {
    font-family: $sariko-font-family-primary;
    font-size: 15px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.55);
    margin-bottom: 10px;
    letter-spacing: -0.01em;
}

.summary-card {
    background-color: $bg-surface;
    border-radius: $radius-base;
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 16px;
}

.seller-name {
    font-family: $sariko-font-family-secondary;
    font-size: 13px;
    font-weight: 700;
    color: $info;
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.items-list {
    display: flex;
    flex-direction: column;
}

.order-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 0;
    font-family: $sariko-font-family-secondary;

    &:not(:last-child) {
        border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    }
}

.item-qty {
    color: $accent;
    font-weight: 700;
    font-size: 14px;
    min-width: 32px;
}

.item-name {
    flex: 1;
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.85);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.item-price {
    font-weight: 600;
    font-size: 14px;
    color: white;
    white-space: nowrap;
}
</style>
