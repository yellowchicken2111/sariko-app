<script>
import { Truck, Store } from 'lucide-vue-next';
import { mapState } from 'pinia';
import { useCheckoutStore } from '@/stores/checkout/checkoutStore.js';

export default {
    components: {
        Truck, Store
    },

    computed: {
        ...mapState(useCheckoutStore, ['deliveryMethod'])
    },

    methods: {
        select(method) {
            const checkoutStore = useCheckoutStore()
            checkoutStore.deliveryMethod = method
        }
    }
}
</script>

<template>
    <div class="delivery-method-selector">
        <div class="section-label">Delivery Method</div>
        <div class="options">
            <div
                class="option-card"
                :class="{ active: deliveryMethod === 'delivery' }"
                @click="select('delivery')"
            >
                <Truck :size="22" />
                <span class="option-label">Delivery</span>
            </div>
            <div
                class="option-card"
                :class="{ active: deliveryMethod === 'pickup' }"
                @click="select('pickup')"
            >
                <Store :size="22" />
                <span class="option-label">Pickup</span>
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

.options {
    display: flex;
    gap: 12px;
}

.option-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 18px 14px;
    border-radius: $radius-base;
    border: 1.5px solid rgba(255, 255, 255, 0.12);
    background-color: $bg-surface;
    cursor: pointer;
    font-family: $sariko-font-family-secondary;
    font-weight: 500;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    transition: all 0.2s ease;

    &:active {
        transform: scale(0.97);
    }

    &.active {
        border-color: $accent;
        background-color: rgba($accent, 0.08);
        color: $accent;
    }
}

.option-label {
    font-weight: 600;
}
</style>
