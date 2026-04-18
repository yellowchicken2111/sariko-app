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
            if (this.isPaymentPending) return this.$t('order_detail.status_title_awaiting_payment')
            const map = {
                pending: 'status_title_pending',
                confirmed: 'status_title_confirmed',
                ready: 'status_title_ready',
                done: 'status_title_done',
                cancelled: 'status_title_cancelled',
            }
            const key = map[this.order?.status]
            return key ? this.$t(`order_detail.${key}`) : this.$t('order_detail.title')
        },
        cancellationReason() {
            return this.order?.cancellation_reason || null
        },
        statusSubtext() {
            if (this.isPaymentPending) return this.$t('order_detail.status_subtext_awaiting_payment')
            if (this.isCancelled && this.cancellationReason) {
                return `${this.$t('order_detail.cancelled_reason')}: ${this.cancellationReason}`
            }
            const map = {
                pending: 'status_subtext_pending',
                confirmed: 'status_subtext_confirmed',
                ready: this.order?.delivery_method === 'delivery'
                    ? 'delivery_tracker.status_subtext_ready'
                    : 'order_detail.status_subtext_ready_pickup',
                done: 'status_subtext_done',
                cancelled: 'status_subtext_cancelled',
            }
            const key = map[this.order?.status]
            if (!key) return ''
            if (this.order?.status === 'ready') return this.$t(key)
            return this.$t(`order_detail.${key}`)
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
