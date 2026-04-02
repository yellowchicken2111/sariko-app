<script>
import { HandCoins, ScanBarcode } from 'lucide-vue-next';
export default {
    components: {
        HandCoins, ScanBarcode
    }
}
</script>

<template>
    <div class="container">
        <div class="subtotal-section">
            <div class="title sub-color">
                {{ $t('cart_page.section_total_amount.title_subtotal')  }}
            </div>
            <div class="price-text">
                1,030,000
            </div>
        </div>

        <div class="subtotal-section">
            <div class="title sub-color">
                {{ $t('cart_page.section_total_amount.title_estimated_delivery_fee')  }}
            </div>
            <div class="price-text">
                63,000
            </div>
        </div>

        <div class="dashed-line" />

        <div class="subtotal-section">
            <div class="title-total">
                {{ $t('cart_page.section_total_amount.title_total_amount')  }}
            </div>
            <div class="price-text">
                63,000
            </div>
        </div>        

        <div class="button-checkout">
            <q-btn class="button" dense no-caps>
                <ScanBarcode class="icon" /> Checkout
            </q-btn>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.container {
    width: 100%;
    padding: 30px 15px 40px 15px;
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
    margin-top: 20px;
}
.icon {
    margin-right: 12px;
}
</style>