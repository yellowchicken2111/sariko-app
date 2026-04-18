<script>
import LayoutBaseOrderDetail from '@/layouts/order/order-details/LayoutBaseOrderDetail.vue';
import OrderBreadcrumbs from '@/components/order-details/OrderBreadcrumbs.vue';
import OrderStatusHeader from '@/components/order-details/OrderStatusHeader.vue';
import OrderInfoCard from '@/components/order-details/OrderInfoCard.vue';
import OrderActions from '@/components/order-details/OrderActions.vue';
import DeliveryTracker from '@/components/order-details/DeliveryTracker.vue';
import { useOrderStore } from '@/stores/order/orderStore.js';
import { useDeliveryStore } from '@/stores/delivery/deliveryStore.js';
import { supabase } from '@/lib/supabase';

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

    data() {
        return {
            _orderChannel: null,
        }
    },

    computed: {
        order() {
            return useOrderStore().currentOrder
        },
        shouldShowTracker() {
            if (!this.order) return false
            return this.order.delivery_method === 'delivery'
                && ['confirmed', 'ready', 'done'].includes(this.order.status)
        },
        shouldWatchDelivery() {
            if (!this.order) return false
            return this.order.delivery_method === 'delivery'
                && ['ready', 'done'].includes(this.order.status)
        },
    },

    watch: {
        shouldWatchDelivery(val) {
            if (val) {
                useDeliveryStore().startWatching(this.orderId)
            } else {
                useDeliveryStore().stopWatching()
            }
        }
    },

    methods: {
        listenOrder() {
            const channelName = `order-${this.orderId}-${Math.random().toString(36).slice(2, 8)}`
            this._orderChannel = supabase
                .channel(channelName)
                .on('postgres_changes', {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders',
                    filter: `id=eq.${this.orderId}`,
                }, (payload) => {
                    useOrderStore().currentOrder = { ...useOrderStore().currentOrder, ...payload.new }
                })
                .subscribe((status, err) => {
                    console.log(`Realtime channel ${channelName} status: `, status)
                    if (err) console.log(`Realtime channel ${channelName} error: `, err)
                })
        },
    },

    async mounted() {
        const orderStore = useOrderStore()
        await orderStore.getOrderDetail(this.orderId)
        this.listenOrder()

        if (this.shouldWatchDelivery) {
            useDeliveryStore().startWatching(this.orderId)
        }
    },

    beforeUnmount() {
        if (this._orderChannel) supabase.removeChannel(this._orderChannel)
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
            <DeliveryTracker v-if="shouldShowTracker" :order-status="order?.status" />
        </template>

        <template #OrderInfo>
            <OrderInfoCard />
        </template>

        <template #Actions>
            <OrderActions />
        </template>

    </LayoutBaseOrderDetail>
</template>
