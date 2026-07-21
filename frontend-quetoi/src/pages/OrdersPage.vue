<script>
import LayoutBaseMyOrder from '@/layouts/order/my-orders/LayoutBaseMyOrder.vue';
import BreadCrumbs from '@/components/order-history/BreadCrumbs.vue';
import FilterTabs from '@/components/order-history/FilterTabs.vue';
import OrdersList from '@/components/order-history/OrdersList.vue';

export default {
    name: 'OrdersPage',
    components: {
        LayoutBaseMyOrder,
        BreadCrumbs,
        FilterTabs,
        OrdersList
    }
}
</script>

<template>
    <LayoutBaseMyOrder>

        <template #Breadcrumbs>
            <BreadCrumbs />
        </template>

        <template #FilterTabs>
            <FilterTabs />
        </template>

        <template #OrdersList>
            <OrdersList />
        </template>

        <template #EmptyState>
        </template>

    </LayoutBaseMyOrder>
</template>

<style scoped>
</style>
