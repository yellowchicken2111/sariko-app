<script>
import LayoutBaseOrderDetail from '@/layouts/order/order-details/LayoutBaseOrderDetail.vue';
import OrderBreadcrumbs from '@/components/order-details/OrderBreadcrumbs.vue';
import OrderStatusHeader from '@/components/order-details/OrderStatusHeader.vue';
import OrderInfoCard from '@/components/order-details/OrderInfoCard.vue';
import OrderActions from '@/components/order-details/OrderActions.vue';
import { useOrderStore } from '@/stores/order/orderStore.js';

export default {
    components: {
        LayoutBaseOrderDetail,
        OrderBreadcrumbs,
        OrderStatusHeader,
        OrderInfoCard,
        OrderActions,
    },

    props: {
        orderId: {
            required: true,
            type: String
        }
    },

    async mounted() {
        const orderStore = useOrderStore()
        await orderStore.getOrderDetail(this.orderId)
    }
}
</script>

<template>
    <LayoutBaseOrderDetail>

        <template #Breadcrumbs>
            <OrderBreadcrumbs />
        </template>

        <template #StatusHeader>
            <OrderStatusHeader />
        </template>

        <template #OrderInfo>
            <OrderInfoCard />
        </template>

        <template #Actions>
            <OrderActions />
        </template>

    </LayoutBaseOrderDetail>
</template>
