<script>
import LayoutSellerOrders from '@/layouts/seller/LayoutSellerOrders.vue';
import SellerOrdersList from '@/components/seller-orders/SellerOrdersList.vue';

export default {
    name: 'SellerOrdersPage',

    components: { LayoutSellerOrders, SellerOrdersList },
}
</script>

<template>
    <LayoutSellerOrders>
        <template #Filters>
            <!-- SellerOrdersList owns filter chips internally -->
        </template>
        <template #List>
            <SellerOrdersList />
        </template>
    </LayoutSellerOrders>
</template>
