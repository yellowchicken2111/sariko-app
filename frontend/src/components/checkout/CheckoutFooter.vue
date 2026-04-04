<script>
import { ScanBarcode } from 'lucide-vue-next';
import { mapState, mapGetters } from 'pinia';
import { useCheckoutStore } from '@/stores/checkout/checkoutStore.js';
import { useCartStore } from '@/stores/cart/cartStore.js';

export default {
    components: {
        ScanBarcode
    },

    computed: {
        ...mapState(useCheckoutStore, ['submitting', 'isFormValid']),
        ...mapGetters(useCartStore, ['subtotalText'])
    },

    methods: {
        async onPlaceOrder() {
            const checkoutStore = useCheckoutStore()
            await checkoutStore.placeOrder()
        }
    }
}
</script>

<template>
    <div class="checkout-footer">
        <div class="total-row">
            <span class="total-label">Total</span>
            <span class="total-value">{{ subtotalText }}</span>
        </div>
        <q-btn
            class="btn-place-order"
            dense
            no-caps
            :loading="submitting"
            :disable="!isFormValid"
            @click="onPlaceOrder"
        >
            <ScanBarcode :size="20" class="btn-icon" />
            Place Order
        </q-btn>
    </div>
</template>

<style lang="scss" scoped>
.checkout-footer {
    padding: 20px 16px 36px;
    background: linear-gradient(
        to bottom,
        rgba(31, 41, 64, 0.92),
        rgba(31, 41, 64, 0.98) 20%
    );
    border-top-left-radius: $radius-base;
    border-top-right-radius: $radius-base;
    backdrop-filter: blur(16px);
    font-family: $sariko-font-family-secondary;
}

.total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.total-label {
    font-size: 15px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.55);
}

.total-value {
    font-family: $sariko-font-family-primary;
    font-size: 22px;
    font-weight: 700;
    color: white;
    letter-spacing: -0.02em;
}

.btn-place-order {
    width: 100%;
    background-color: $accent;
    color: $bg-main;
    padding: 15px 0;
    border-radius: 2rem;
    font-weight: 700;
    font-size: 17px;
    letter-spacing: -0.01em;
    transition: all 0.2s ease;

    &:active {
        transform: scale(0.98);
    }

    &.disabled {
        opacity: 0.5;
    }
}

.btn-icon {
    margin-right: 10px;
}
</style>
