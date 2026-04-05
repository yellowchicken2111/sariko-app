<script>
import LayoutBaseOrderCart from '@/layouts/order-cart/LayoutBaseOrderCart.vue';
import BreadCrums from '@/components/order-cart/BreadCrums.vue';
import DeliveryAddress from '@/components/order-cart/DeliveryAddress.vue';
import CartItems from '@/components/order-cart/CartItems.vue';
import TotalAmounts from '@/components/order-cart/TotalAmounts.vue';
import EmptyState from '@/components/order-cart/EmptyState.vue';

export default {
    components: {
        LayoutBaseOrderCart,
        DeliveryAddress,
        BreadCrums,
        CartItems,
        TotalAmounts,
        EmptyState
    }
}
</script>

<template>

    <LayoutBaseOrderCart>

        <template #BreadCrums>
            <BreadCrums />
        </template>

        <template #DeliveryAddress>
            <DeliveryAddress />
        </template>

        <template #CartItems>
            <CartItems />
        </template>

        <template #TotalAmount>
            <TotalAmounts />
        </template>

        <template #EmptyState>
            <EmptyState />
        </template>

    </LayoutBaseOrderCart>

</template>
