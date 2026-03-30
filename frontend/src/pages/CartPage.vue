<script>
import LayoutBaseOrderCart from '@/layouts/order-cart/LayoutBaseOrderCart.vue';
import CartItems from '@/components/order-cart/CartItems.vue';
import TotalAmounts from '@/components/order-cart/TotalAmounts.vue';

export default {
    components: {
        LayoutBaseOrderCart,
        CartItems,
        TotalAmounts
    }
}
</script>

<template>

    <LayoutBaseOrderCart>

        <template #CartItems>
            <CartItems />
        </template>

        <template #TotalAmount>
            <TotalAmounts />
        </template>

    </LayoutBaseOrderCart>

</template>
