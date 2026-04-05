<script>
import LayoutBaseCheckoutPage from '@/layouts/checkout/LayoutBaseCheckoutPage.vue';
import BreadCrums from '@/components/checkout/BreadCrums.vue';
import DeliveryAddress from '@/components/checkout/DeliveryAddress.vue';
import CartReview from '@/components/checkout/CartReview.vue';
import TotalAmounts from '@/components/checkout/TotalAmounts.vue';

export default {
    name: 'CheckoutPage',
    components: {
        LayoutBaseCheckoutPage,
        BreadCrums,
        DeliveryAddress,
        CartReview,
        TotalAmounts
    }
}
</script>

<template>
    <LayoutBaseCheckoutPage>

        <template #Breadcrumbs>
            <BreadCrums />
        </template>

        <template #DeliveryAddress>
            <DeliveryAddress />
        </template>

        <template #CartPreview>
            <CartReview />
        </template>

        <template #TotalAmounts>
            <TotalAmounts />
        </template>

    </LayoutBaseCheckoutPage>
</template>

<style scoped>
</style>
