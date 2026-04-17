<script>
import { CircleCheckBig, Clock, CircleX } from 'lucide-vue-next';
import { useOrderStore } from '@/stores/order/orderStore.js';

export default {
    components: {
        CircleCheckBig, Clock, CircleX
    },

    computed: {
        order() {
            return useOrderStore().currentOrder
        },
        isPaymentPending() {
            return this.order?.payment_status === 'pending' && this.order?.status === 'pending'
        },
        isPending() {
            return this.order?.status === 'pending'
        },
        isCancelled() {
            return this.order?.status === 'cancelled'
        },
        statusTitle() {
            if (this.isPaymentPending) return 'Awaiting Payment'
            const map = {
                pending: 'Order Placed!',
                confirmed: 'Order Confirmed',
                ready: 'Order Ready!',
                done: 'Order Completed',
                cancelled: 'Order Cancelled',
            }
            return map[this.order?.status] || 'Order'
        },
        cancellationReason() {
            return this.order?.cancellation_reason || null
        },
        statusSubtext() {
            if (this.isPaymentPending) return 'Complete your payment to send this order to the seller.'
            if (this.isCancelled && this.cancellationReason) {
                return `${this.$t('order_detail.cancelled_reason')}: ${this.cancellationReason}`
            }
            const map = {
                pending: 'Your order has been sent. The seller will confirm shortly.',
                confirmed: 'The seller is preparing your order.',
                ready: this.order?.delivery_method === 'delivery'
                    ? this.$t('delivery_tracker.status_subtext_ready')
                    : 'Your order is ready! Head to the store.',
                done: 'Enjoy your meal!',
                cancelled: 'This order has been cancelled.',
            }
            return map[this.order?.status] || ''
        },
        statusIconColor() {
            if (this.isPaymentPending) return '#f97316'
            const map = {
                pending: '#f59e0b',
                confirmed: '#3b82f6',
                ready: '#10b981',
                done: '#10b981',
                cancelled: '#ef4444',
            }
            return map[this.order?.status] || '#ffffff'
        }
    }
}
</script>

<template>
    <div v-if="order" class="status-header">
        <div class="status-icon">
            <CircleX v-if="isCancelled" :size="64" :color="statusIconColor" />
            <Clock v-else-if="isPending" :size="64" :color="statusIconColor" />
            <CircleCheckBig v-else :size="64" :color="statusIconColor" />
        </div>
        <div class="status-title">{{ statusTitle }}</div>
        <div class="status-subtext">{{ statusSubtext }}</div>
    </div>

    <div v-else class="loading-state">
        <q-spinner color="amber" size="40px" />
    </div>
</template>

<style lang="scss" scoped>
.status-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
}

.status-icon {
    margin-bottom: 16px;
}

.status-title {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 8px;
}

.status-subtext {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
    text-align: center;
    line-height: 1.5;
}

.loading-state {
    display: flex;
    justify-content: center;
    padding-top: 100px;
}
</style>
