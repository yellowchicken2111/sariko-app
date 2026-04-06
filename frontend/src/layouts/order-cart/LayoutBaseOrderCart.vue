<script>
import { mapActions, mapState } from 'pinia';
import { useCartStore } from '@/stores/cart/cartStore';

export default {
    computed: {
        ...mapState(useCartStore, [
            "cartItems"
        ])
    },

    mounted() {
        const cartStore = useCartStore()
        if (!cartStore.cartItems.length) {
            cartStore.getCurrentCart()
        }
    }
}

</script>

<template>

    <div class="background">

        <div ref="breadcrumbsRef" class="breadcrumbs">
            <slot name="BreadCrums" />
        </div>

        <div v-if="cartItems.length > 0" class="container">

            <q-scroll-area class="scroll-area">
                <div class="section-delivery-address">
                    <slot name="DeliveryAddress" />
                </div>

                <div class="section-cart-items">
                    <slot name="CartItems" />
                </div>

                <div class="section-note">
                    <slot name="NoteInput" />
                </div>
            </q-scroll-area>

            <div class="section-total-amount">
                <slot name="TotalAmount" />
            </div>
        </div>

        <div v-else>
            <slot name="EmptyState" />
        </div>

    </div>

</template>

<style lang="scss" scoped>

.background {
    width: 100vw;
    height: 100vh;
}

.breadcrumbs {
    // background-color: blue;
}

.container {
    height: calc(100vh - var(--breadcrumbs-height));
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
}

.scroll-area {
    flex: 1;
    width: 100%;
}

.section-delivery-address {
    width: 100%;
    padding: 0px 10px;
    margin-bottom: 20px;
}

.section-cart-items {
    width: 100%;
}

.section-note {
    width: 100%;
    padding: 20px 10px;
}

.section-total-amount {
    width: 100%;
    flex-shrink: 0;
}

</style>