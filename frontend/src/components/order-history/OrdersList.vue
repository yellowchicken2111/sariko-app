<script>
import { mapState } from 'pinia';
import { useOrderStore } from '@/stores/order/orderStore';
import OrderCard from '@/components/order-history/OrderCard.vue';

export default {
    components: {
        OrderCard
    },

    computed: {
        ...mapState(useOrderStore, ['orders', 'selectedFilter']),

        filteredOrders() {
            if (this.selectedFilter === 'all') return this.orders
            if (this.selectedFilter === 'unpaid') {
                return this.orders.filter(o => o.payment_status === 'pending' && o.status !== 'cancelled')
            }
            if (this.selectedFilter === 'active') {
                return this.orders.filter(o => o.payment_status === 'paid' && ['pending', 'confirmed', 'ready'].includes(o.status))
            }
            if (this.selectedFilter === 'completed') {
                return this.orders.filter(o => o.status === 'done')
            }
            if (this.selectedFilter === 'cancelled') {
                return this.orders.filter(o => o.status === 'cancelled')
            }
            return this.orders
        }
    },

    mounted() {
        const orderStore = useOrderStore()
        orderStore.getOrders()
    }
}
</script>

<template>
    <div class="orders-list">
        <OrderCard
            v-for="order in filteredOrders"
            :key="order.id"
            :order="order"
        />
    </div>
</template>

<style lang="scss" scoped>
.orders-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 12px;
}
</style>
