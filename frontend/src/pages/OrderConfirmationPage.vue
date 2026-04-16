<script>
import LayoutBaseOrderDetail from '@/layouts/order/order-details/LayoutBaseOrderDetail.vue';
import OrderBreadcrumbs from '@/components/order-details/OrderBreadcrumbs.vue';
import OrderStatusHeader from '@/components/order-details/OrderStatusHeader.vue';
import OrderInfoCard from '@/components/order-details/OrderInfoCard.vue';
import OrderActions from '@/components/order-details/OrderActions.vue';
import DeliveryTracker from '@/components/order-details/DeliveryTracker.vue';
import { useOrderStore } from '@/stores/order/orderStore.js';
import { useDeliveryStore } from '@/stores/delivery/deliveryStore.js';

export default {
    components: {
        LayoutBaseOrderDetail,
        OrderBreadcrumbs,
        OrderStatusHeader,
        OrderInfoCard,
        OrderActions,
        DeliveryTracker,
    },

    props: {
        orderId: {
            required: true,
            type: String
        }
    },

    computed: {
        order() {
            return useOrderStore().currentOrder
        },
        shouldTrackDelivery() {
            if (!this.order) return false
            return this.order.delivery_method === 'delivery'
                && (this.order.status === 'ready' || this.order.status === 'done')
        },
    },

    watch: {
        shouldTrackDelivery(val) {
            if (val) {
                useDeliveryStore().startWatching(this.orderId)
            } else {
                useDeliveryStore().stopWatching()
            }
        }
    },

    async mounted() {
        const orderStore = useOrderStore()
        await orderStore.getOrderDetail(this.orderId)

        if (this.shouldTrackDelivery) {
            useDeliveryStore().startWatching(this.orderId)
        }
    },

    beforeUnmount() {
        useDeliveryStore().stopWatching()
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

        <template #DeliveryTracking>
            <DeliveryTracker v-if="shouldTrackDelivery" />
        </template>

        <template #OrderInfo>
            <OrderInfoCard />
        </template>

        <template #Actions>
            <OrderActions />
        </template>

    </LayoutBaseOrderDetail>
</template>
