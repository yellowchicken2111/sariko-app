<script>
import LayoutBaseCheckout from '@/layouts/checkout/LayoutBaseCheckout.vue'
import CheckoutHeader from '@/components/checkout/CheckoutHeader.vue'
import DeliveryMethodSelector from '@/components/checkout/DeliveryMethodSelector.vue'
import DeliveryAddressInput from '@/components/checkout/DeliveryAddressInput.vue'
import OrderSummary from '@/components/checkout/OrderSummary.vue'
import NoteInput from '@/components/checkout/NoteInput.vue'
import PaymentMethodCard from '@/components/checkout/PaymentMethodCard.vue'
import CheckoutFooter from '@/components/checkout/CheckoutFooter.vue'
import { useCartStore } from '@/stores/cart/cartStore.js'
import { useCheckoutStore } from '@/stores/checkout/checkoutStore.js'

export default {
    name: 'CheckoutPage',

    components: {
        LayoutBaseCheckout,
        CheckoutHeader,
        DeliveryMethodSelector,
        DeliveryAddressInput,
        OrderSummary,
        NoteInput,
        PaymentMethodCard,
        CheckoutFooter
    },

    computed: {
        showAddress() {
            const checkoutStore = useCheckoutStore()
            return checkoutStore.deliveryMethod === 'delivery'
        }
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
    <LayoutBaseCheckout>

        <template #Header>
            <CheckoutHeader @back="$router.back()" />
        </template>

        <template #DeliveryMethod>
            <DeliveryMethodSelector />
        </template>

        <template #DeliveryAddress>
            <DeliveryAddressInput v-if="showAddress" />
        </template>

        <template #OrderSummary>
            <OrderSummary />
        </template>

        <template #Note>
            <NoteInput />
        </template>

        <template #PaymentMethod>
            <PaymentMethodCard />
        </template>

        <template #Footer>
            <CheckoutFooter />
        </template>

    </LayoutBaseCheckout>
</template>

<style scoped>
</style>
