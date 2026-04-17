<script>
import { Check, X, AlertTriangle, RefreshCw } from 'lucide-vue-next';
import { useDashboardStore } from '@/stores/seller/dashboardStore';
import apiSellerDashboard from '@/apis/sellers/apiSellerDashboard';
import apiDeliveries from '@/apis/deliveries/apiDeliveries';

const STATUS_DISPLAY_KEY = {
    pending: 'seller_home.status_new',
    confirmed: 'seller_home.status_preparing',
}

const STATUS_NEXT = {
    pending: 'confirmed',
    confirmed: 'ready',
}

const REJECT_REASONS = [
    'out_of_ingredients',
    'too_busy',
    'store_closing',
    'other',
]

export default {
    name: 'ActionOrdersList',

    components: { Check, X, AlertTriangle, RefreshCw },

    props: {
        orders: {
            type: Array,
            default: () => []
        }
    },

    data() {
        return {
            showRejectDialog: false,
            rejectingOrder: null,
            selectedReason: '',
            customReason: '',
            rejecting: false,
            orderErrors: {},      // { [orderId]: string[] }
            loadingOrders: {},    // { [orderId]: true }
            deliveryStatuses: {}, // { [orderId]: { status, rebook_count } | 'loading' | 'error' }
            rebookingOrders: {},  // { [orderId]: true }
            rebookErrors: {},     // { [orderId]: 'max_attempts'|'error' }
        }
    },

    computed: {
        sellerInfo() {
            return useDashboardStore().sellerInfo
        },

        displayOrders() {
            return this.orders
                .filter(order => {
                    if (order.status !== 'ready') return true
                    // For ready orders: only show if delivery is confirmed CANCELLED (needs rebook)
                    const ds = this.deliveryStatuses[order.id]
                    return ['CANCELED', 'REJECTED', 'EXPIRED'].includes(ds?.status)
                })
                .map(order => ({
                    ...order,
                    displayStatus: STATUS_DISPLAY_KEY[order.status] ? this.$t(STATUS_DISPLAY_KEY[order.status]) : order.status,
                    customerName: order.users?.name || order.users?.email || 'Customer',
                    items: order.order_items || [],
                    totalText: new Intl.NumberFormat('vi-VN').format(order.total_amount || 0) + ' ₫',
                    time: new Date(order.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                    nextLabel: STATUS_NEXT[order.status] === 'confirmed' ? this.$t('seller_home.action_accept') : this.$t('seller_home.action_ready_delivery'),
                }))
        },

        rejectReasonOptions() {
            return REJECT_REASONS.map(key => ({
                key,
                label: this.$t(`seller_dashboard.reject_reason_${key}`),
            }))
        },

        rejectReasonText() {
            if (this.selectedReason === 'other') return this.customReason
            return this.rejectReasonOptions.find(o => o.key === this.selectedReason)?.label || ''
        },

        canConfirmReject() {
            if (!this.selectedReason) return false
            if (this.selectedReason === 'other' && !this.customReason.trim()) return false
            return !this.rejecting
        },
    },

    watch: {
        orders: {
            handler(newOrders) {
                newOrders
                    .filter(o => o.status === 'ready' && o.delivery_method === 'delivery')
                    .forEach(o => {
                        if (!this.deliveryStatuses[o.id]) this.fetchDeliveryStatus(o.id)
                    })
            },
            immediate: true,
        },
    },

    methods: {
        t(key, fallback) {
            if (typeof this.$t === 'function') return this.$t(key)
            return fallback || key
        },

        checkSellerReadiness() {
            const missing = []
            if (!this.sellerInfo?.has_address) missing.push(this.t('seller_home.missing_address', 'Store address is missing'))
            if (!this.sellerInfo?.has_phone) missing.push(this.t('seller_home.missing_phone', 'Phone number is missing'))
            return missing
        },

        clearError(orderId) {
            delete this.orderErrors[orderId]
        },

        async fetchDeliveryStatus(orderId) {
            this.deliveryStatuses = { ...this.deliveryStatuses, [orderId]: 'loading' }
            try {
                const data = await apiDeliveries.getSellerDeliveryStatus(orderId)
                this.deliveryStatuses = { ...this.deliveryStatuses, [orderId]: data.delivery }
            } catch (e) {
                this.deliveryStatuses = { ...this.deliveryStatuses, [orderId]: 'error' }
            }
        },

        async onRebook(order) {
            if (this.rebookingOrders[order.id]) return
            this.rebookErrors = { ...this.rebookErrors, [order.id]: null }
            this.rebookingOrders = { ...this.rebookingOrders, [order.id]: true }
            try {
                await apiDeliveries.rebookDelivery(order.id)
                this.deliveryStatuses = {
                    ...this.deliveryStatuses,
                    [order.id]: { status: 'ASSIGNING_DRIVER', rebook_count: (this.deliveryStatuses[order.id]?.rebook_count || 0) + 1 },
                }
                this.$q.notify({ classes: 'quasar-notify-positive', message: this.$t('seller_home.toast_rebook_success'), position: 'bottom', timeout: 1500 })
            } catch (e) {
                console.error('ActionOrdersList - onRebook -', e)
                const detail = e?.response?.data?.detail || ''
                const errorType = detail.includes('rebook_count') ? 'max_attempts' : 'error'
                this.rebookErrors = { ...this.rebookErrors, [order.id]: errorType }
            } finally {
                const { [order.id]: _, ...rest } = this.rebookingOrders
                this.rebookingOrders = rest
            }
        },

        async onAccept(order) {
            const nextStatus = STATUS_NEXT[order.status]
            if (!nextStatus) return
            if (this.loadingOrders[order.id]) return

            // Pre-flight check: when marking ready (triggers Lalamove), validate seller info
            if (nextStatus === 'ready' && order.delivery_method === 'delivery') {
                const missing = this.checkSellerReadiness()
                if (missing.length > 0) {
                    this.orderErrors = { ...this.orderErrors, [order.id]: missing }
                    return
                }
            }
            this.clearError(order.id)
            this.loadingOrders = { ...this.loadingOrders, [order.id]: true }

            try {
                await apiSellerDashboard.updateOrderStatus(order.id, nextStatus)
                useDashboardStore().updateOrderLocally(order.id, nextStatus)
                this.$q.notify({
                    classes: 'quasar-notify-positive',
                    message: nextStatus === 'confirmed'
                        ? this.t('seller_home.toast_order_accepted', 'Order accepted!')
                        : this.t('seller_home.toast_order_ready', 'Delivery booked!'),
                    position: 'bottom',
                    timeout: 1500,
                })
            } catch (e) {
                console.error('ActionOrdersList - onAccept -', e)
                const errorMsg = e?.response?.data?.detail || this.t('seller_home.toast_update_failed', 'Failed to update order')
                this.orderErrors = { ...this.orderErrors, [order.id]: [errorMsg] }
            } finally {
                const { [order.id]: _, ...rest } = this.loadingOrders
                this.loadingOrders = rest
            }
        },

        fmt(amount) {
            return new Intl.NumberFormat('vi-VN').format(amount || 0) + ' ₫'
        },

        openRejectDialog(order) {
            this.rejectingOrder = order
            this.selectedReason = ''
            this.customReason = ''
            this.showRejectDialog = true
        },

        async confirmReject() {
            if (!this.canConfirmReject || !this.rejectingOrder) return
            this.rejecting = true
            try {
                await apiSellerDashboard.updateOrderStatus(this.rejectingOrder.id, 'cancelled', this.rejectReasonText)
                useDashboardStore().updateOrderLocally(this.rejectingOrder.id, 'cancelled')
                this.showRejectDialog = false
                this.$q.notify({
                    classes: 'quasar-notify-positive',
                    message: this.t('seller_home.toast_order_rejected', 'Order rejected.'),
                    position: 'bottom',
                    timeout: 1500,
                })
            } catch (e) {
                console.error('ActionOrdersList - confirmReject -', e)
                this.$q.notify({
                    type: 'negative',
                    message: this.t('seller_home.toast_reject_failed', 'Failed to reject order'),
                    position: 'bottom',
                })
            } finally {
                this.rejecting = false
            }
        },
    },
}
</script>

<template>
    <div>
        <!-- Empty state -->
        <div v-if="orders.length === 0" class="empty-state">
            <div class="empty-icon">🎉</div>
            <div class="empty-text">{{ $t('seller_home.empty_all_caught_up') }}</div>
            <div class="empty-sub">{{ $t('seller_home.empty_all_caught_up_sub') }}</div>
        </div>

        <!-- Order cards -->
        <div v-else class="orders-list">
            <div v-for="order in displayOrders" :key="order.id" class="order-card">
                <div class="order-header">
                    <div>
                        <div class="customer-name">{{ order.customerName }}</div>
                        <div class="order-time">{{ order.time }}</div>
                    </div>
                    <span class="status-badge" :class="order.status === 'pending' ? 'badge-new' : 'badge-preparing'">
                        {{ order.displayStatus }}
                    </span>
                </div>

                <q-separator style="background: rgba(255,255,255,0.08); margin: 10px 0;" />

                <!-- Items list -->
                <div v-for="item in order.items" :key="item.id" class="item-row">
                    <div class="item-left">
                        <span class="item-qty">{{ item.quantity }}</span>
                        <span class="item-sep">×</span>
                        <span class="item-name">{{ item.name_snapshot }}</span>
                    </div>
                    <span class="item-price">{{ fmt(item.price_snapshot * item.quantity) }}</span>
                </div>

                <q-separator style="background: rgba(255,255,255,0.08); margin: 10px 0;" />

                <!-- Total -->
                <div class="total-row">
                    <span class="total-label">Total</span>
                    <span class="total-value">{{ order.totalText }}</span>
                </div>

                <!-- Inline error card -->
                <div v-if="orderErrors[order.id]" class="error-card">
                    <div class="error-card__header">
                        <AlertTriangle :size="16" />
                        <span>{{ $t('seller_home.error_missing_info') }}</span>
                    </div>
                    <ul class="error-card__list">
                        <li v-for="(msg, i) in orderErrors[order.id]" :key="i">{{ msg }}</li>
                    </ul>
                </div>

                <!-- ready + delivery CANCELLED: rebook action -->
                <template v-if="order.status === 'ready'">
                    <div v-if="rebookErrors[order.id] === 'max_attempts' || rebookErrors[order.id] === 'error'" class="rebook-admin-notice">
                        {{ $t('seller_home.contact_admin_notice') }}
                    </div>
                    <div class="delivery-rebook-row">
                        <button class="btn-delivery-issue" @click="$router.push({ name: 'seller-order-detail', params: { orderId: order.id } })">
                            <AlertTriangle :size="13" />
                            {{ $t('seller_home.delivery_issue_details') }}
                        </button>
                        <q-btn
                            v-if="rebookErrors[order.id] !== 'max_attempts'"
                            unelevated dense no-caps
                            class="btn-rebook"
                            :loading="!!rebookingOrders[order.id]"
                            @click="onRebook(order)"
                        >
                            <RefreshCw :size="12" style="margin-right:4px;" />
                            {{ $t('seller_home.action_rebook') }}
                        </q-btn>
                    </div>
                </template>

                <div v-else class="order-actions">
                    <q-btn flat dense no-caps class="btn-reject" :disable="!!loadingOrders[order.id]" @click="openRejectDialog(order)">
                        <X :size="14" style="margin-right: 4px;" /> {{ $t('seller_home.action_reject') }}
                    </q-btn>
                    <q-btn unelevated dense no-caps class="btn-accept" :loading="!!loadingOrders[order.id]" @click="onAccept(order)">
                        <Check :size="14" style="margin-right: 4px;" /> {{ order.nextLabel }}
                    </q-btn>
                </div>
            </div>
        </div>

        <!-- Reject Dialog -->
        <q-dialog v-model="showRejectDialog">
            <q-card class="reject-dialog">
                <q-card-section>
                    <div class="dialog-title">{{ $t('seller_home.reject_dialog_title') }}</div>
                    <div class="dialog-sub">{{ $t('seller_home.reject_dialog_sub') }}</div>
                    <div class="reason-options">
                        <button
                            v-for="opt in rejectReasonOptions"
                            :key="opt.key"
                            class="reason-chip"
                            :class="{ active: selectedReason === opt.key }"
                            @click="selectedReason = opt.key"
                        >
                            {{ opt.label }}
                        </button>
                    </div>
                    <q-input
                        v-if="selectedReason === 'other'"
                        v-model="customReason"
                        dense outlined dark autofocus
                        :placeholder="$t('seller_home.reject_reason_placeholder')"
                        class="custom-reason-input"
                    />
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn flat no-caps :label="$t('common.button_label_cancel')" v-close-popup />
                    <q-btn flat no-caps color="negative" :label="$t('seller_home.reject_confirm')"
                        :disable="!canConfirmReject" :loading="rejecting" @click="confirmReject" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<style lang="scss" scoped>
.empty-state {
    text-align: center;
    padding: 40px 0;
    color: var(--text-secondary);
}

.empty-icon {
    font-size: 40px;
    margin-bottom: 12px;
}

.empty-text {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 4px;
}

.empty-sub {
    font-size: 13px;
}

.orders-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.order-card {
    background: rgba(255, 255, 255, 0.07);
    border-radius: 16px;
    padding: 16px;
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.customer-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
}

.order-time {
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 2px;
}

.status-badge {
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 12px;
    flex-shrink: 0;
}

.badge-new {
    background: rgba(245, 158, 11, 0.15);
    color: var(--color-warning);
}

.badge-preparing {
    background: rgba(59, 130, 246, 0.15);
    color: var(--color-info);
}

.item-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
}

.item-left {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: var(--text-secondary);
}

.item-qty {
    font-weight: 700;
    color: var(--text-primary);
}

.item-sep {
    color: var(--text-muted);
    font-size: 11px;
}

.item-name {
    font-weight: 600;
    color: var(--text-primary);
}

.item-price {
    font-size: 13px;
    color: var(--text-secondary);
}

.total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.total-label {
    font-size: 13px;
    color: var(--text-muted);
    font-weight: 500;
}

.total-value {
    font-size: 15px;
    font-weight: 700;
    color: var(--text-primary);
}

/* Inline error card */
.error-card {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.25);
    border-radius: 12px;
    padding: 12px 14px;
    margin-bottom: 12px;
}

.error-card__header {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #ef4444;
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 6px;
}

.error-card__list {
    margin: 0;
    padding-left: 20px;
    color: rgba(255, 255, 255, 0.65);
    font-size: 12px;
    line-height: 1.6;
}

.delivery-rebook-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 8px 12px;
    background: rgba(245, 158, 11, 0.1);
    border: 1px solid rgba(245, 158, 11, 0.3);
    border-radius: 10px;
    margin-top: 4px;
}

.btn-delivery-issue {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--color-warning);
    font-size: 12px;
    font-weight: 600;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-family: inherit;
    text-align: left;
}

.btn-rebook {
    background: rgba(245, 158, 11, 0.2);
    color: var(--color-warning);
    border: 1px solid rgba(245, 158, 11, 0.4);
    font-size: 12px;
    font-weight: 600;
    border-radius: 8px;
    padding: 4px 10px;
    flex-shrink: 0;
}

.rebook-admin-notice {
    font-size: 11px;
    color: #ef4444;
    background: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 8px;
    padding: 6px 10px;
    margin-bottom: 6px;
    line-height: 1.5;
}

.order-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
}

.btn-accept {
    background: var(--color-accent);
    color: #121b2f;
    font-weight: 600;
    font-size: 13px;
    padding: 8px 16px;
    border-radius: 10px;
}

.btn-reject {
    color: #ef4444;
    font-size: 13px;
    padding: 8px 12px;
    border-radius: 10px;
}

.reject-dialog {
    background: #1f2940;
    border-radius: 16px;
    min-width: 300px;
    color: var(--text-primary);
}

.dialog-title {
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 4px;
}

.dialog-sub {
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 16px;
}

.reason-options {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
}

.reason-chip {
    padding: 8px 14px;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-primary);
    font-size: 13px;
    cursor: pointer;
    font-family: inherit;
}

.reason-chip.active {
    border-color: var(--color-accent);
    background: rgba(245, 166, 35, 0.15);
    color: var(--color-accent);
}

.custom-reason-input {
    margin-top: 8px;
}
</style>
