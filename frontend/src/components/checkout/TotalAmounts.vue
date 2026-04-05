<script>
import { ScanBarcode } from 'lucide-vue-next';
import { mapState, mapGetters } from 'pinia';
import { useCartStore } from '@/stores/cart/cartStore.js';

export default {
    components: {
        ScanBarcode
    },

    computed: {
        ...mapGetters(useCartStore, ['subtotalText'])
    },

    mounted() {
        const heightTotalAmounts = this.$refs?.totalAmountsRef?.offsetHeight || 0
        document.documentElement.style.setProperty('--total-amount-height', `${heightTotalAmounts}px`)
    }
}
</script>

<template>
    <div ref='totalAmountsRef' class="container">
        <div class="subtotal-section">
            <div class="title sub-color">
                {{ $t('cart_page.section_total_amount.title_subtotal')  }}
            </div>
            <div class="price-text">
                {{ subtotalText }}
            </div>
        </div>

        <div class="subtotal-section">
            <div class="title sub-color">
                {{ $t('cart_page.section_total_amount.title_estimated_delivery_fee')  }}
            </div>
            <div class="price-text sub-color">
                --
            </div>
        </div>

        <div class="dashed-line" />

        <div class="subtotal-section">
            <div class="title-total">
                {{ $t('cart_page.section_total_amount.title_total_amount')  }}
            </div>
            <div class="price-text">
                {{ subtotalText }}
            </div>
        </div>

        <div class="button-checkout">
            <q-btn class="button" dense no-caps @click="$router.push('/checkout')">
                <ScanBarcode class="icon" /> Checkout · {{ subtotalText }}
            </q-btn>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.container {
    width: 100%;
    // padding: 15px 15px 40px 15px;
    padding: 15px 15px 15px 15px;
    font-family: $sariko-font-family-secondary;
    background-color: rgba(59, 59, 59, 0.5);
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
}
.subtotal-section {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    font-weight: 600;
}

.title {
    font-size: 14px;
    font-weight: 400;
}

.sub-color {
    color: rgb(255, 255, 255, 0.5)
}

.dashed-line {
    height: 1px;
    background: repeating-linear-gradient(
        to right,
        #454545 0px,
        #454545 10px,
        transparent 2px,
        transparent 15px
    );
    margin-top: 30px;
    margin-bottom: 15px;
}

.button {
    width: 100%;
    background-color: $accent;
    color: var(--bg-main);
    padding: 12px 0px;
    border-radius: 2rem;
    font-weight: 600;
    font-size: 18px;
}
.icon {
    margin-right: 12px;
}
</style>