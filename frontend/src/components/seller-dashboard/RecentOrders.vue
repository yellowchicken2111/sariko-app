<script>
import { Check, X, Filter } from 'lucide-vue-next';
import { mapState, mapWritableState } from 'pinia';
import { useDashboardStore } from '@/stores/seller/dashboardStore';
import apiSellerDashboard from '@/apis/sellers/apiSellerDashboard';

const STATUS_DISPLAY = {
    pending: 'New Order',
    confirmed: 'Preparing',
    ready: 'Ready',
    done: 'Delivered',
    cancelled: 'Rejected',
}

const STATUS_NEXT = {
    pending: 'confirmed',
    confirmed: 'ready',
    ready: 'done',
}

const REJECT_REASONS = [
    'out_of_ingredients',
    'too_busy',
    'store_closing',
    'other',
]

export default {
    components: { Check, X, Filter },

    data() {
        return {
            showRejectDialog: false,
            rejectingOrder: null,
            selectedReason: '',
            customReason: '',
            rejecting: false,
        }
    },

    computed: {
        ...mapState(useDashboardStore, ['isLoading', 'orders']),
        ...mapWritableState(useDashboardStore, ['selectedFilter']),

        filterOptions() {
            const src = this.orders
            return [
                { key: 'all', label: this.$t('seller_dashboard.tab_all'), count: src.length },
                { key: 'new', label: this.$t('seller_dashboard.tab_new'), count: src.filter(o => o.status === 'pending').length },
                { key: 'preparing', label: this.$t('seller_dashboard.tab_preparing'), count: src.filter(o => o.status === 'confirmed').length },
                { key: 'ready', label: this.$t('seller_dashboard.tab_ready'), count: src.filter(o => o.status === 'ready').length },
                { key: 'completed', label: this.$t('seller_dashboard.tab_completed'), count: src.filter(o => o.status === 'done').length },
                { key: 'cancelled', label: this.$t('seller_dashboard.tab_cancelled'), count: src.filter(o => o.status === 'cancelled').length },
            ]
        },

        currentFilterLabel() {
            const opt = this.filterOptions.find(o => o.key === this.selectedFilter)
            return opt ? `${opt.label} (${opt.count})` : this.$t('seller_dashboard.tab_all')
        },

        recentOrders() {
            const store = useDashboardStore()
            console.log(store.filteredOrders)
            return store.filteredOrders.map(order => ({
                ...order,
                displayStatus: STATUS_DISPLAY[order.status] || order.status,
                customerName: order.users?.name || order.users?.email || 'Customer',
                // items: (order.order_items || []).map(i => `${i.quantity}x ${i.name_snapshot}`).join(', '),
                items: (order.order_items || []),
                totalText: new Intl.NumberFormat('vi-VN').format(order.total_amount || 0) + ' ₫',
                time: new Date(order.created_at).toLocaleString(),
                canAccept: !!STATUS_NEXT[order.status],
                canReject: order.status === 'pending' || order.status === 'confirmed',
                nextLabel: this.getNextLabel(order.status),
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
            const opt = this.rejectReasonOptions.find(o => o.key === this.selectedReason)
            return opt?.label || ''
        },

        canConfirmReject() {
            if (!this.selectedReason) return false
            if (this.selectedReason === 'other' && !this.customReason.trim()) return false
            return !this.rejecting
        },
    },

    methods: {

        getLocaleNumberFormat(number) {
            return new Intl.NumberFormat('vi-VN').format(number || 0) + ' ₫'
        },

        getNextLabel(status) {
            const map = {
                pending: this.$t('seller_dashboard.action_accept'),
                confirmed: this.$t('seller_dashboard.action_ready_to_deliver'),
                ready: this.$t('seller_dashboard.action_mark_done'),
            }
            return map[status] || ''
        },

        selectFilter(key) {
            this.selectedFilter = key
        },

        getStatusClass(status) {
            const map = {
                pending: 'status-pending',
                confirmed: 'status-preparing',
                ready: 'status-ready',
                done: 'status-delivered',
                cancelled: 'status-cancelled',
            }
            return map[status] || 'status-pending'
        },

        async onAccept(order) {
            const nextStatus = STATUS_NEXT[order.status]
            if (!nextStatus) return

            try {
                await apiSellerDashboard.updateOrderStatus(order.id, nextStatus)
                useDashboardStore().updateOrderLocally(order.id, nextStatus)
                this.$q.notify({
                    classes: 'quasar-notify-positive',
                    message: `✔️ Order updated to ${STATUS_DISPLAY[nextStatus]}`,
                    position: 'bottom',
                    timeout: 1500,
                })
            } catch (e) {
                console.error('Failed to accept order:', e)
                this.$q.notify({ type: 'negative', message: 'Failed to update order', position: 'bottom' })
            }
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
                await apiSellerDashboard.updateOrderStatus(
                    this.rejectingOrder.id,
                    'cancelled',
                    this.rejectReasonText,
                )
                useDashboardStore().updateOrderLocally(this.rejectingOrder.id, 'cancelled')
                this.showRejectDialog = false
                this.$q.notify({
                    classes: 'quasar-notify-positive',
                    message: this.$t('seller_dashboard.toast_order_rejected'),
                    position: 'bottom',
                    timeout: 1500,
                })
            } catch (e) {
                console.error('Failed to reject order:', e)
                this.$q.notify({ type: 'negative', message: 'Failed to reject order', position: 'bottom' })
            } finally {
                this.rejecting = false
            }
        },
    }
}
</script>

<template>
    <div class="recent-orders-container">
        <div class="section-header">
            <h2 class="section-title">{{ $t('seller_dashboard.section_recent_orders') }}</h2>
            <q-btn-dropdown
                class="filter-dropdown"
                flat
                dense
                no-caps
                :label="currentFilterLabel"
                dropdown-icon="expand_more"
            >
                <q-list class="dropdown-list">
                    <q-item
                        v-for="opt in filterOptions"
                        :key="opt.key"
                        clickable
                        v-close-popup
                        :active="selectedFilter === opt.key"
                        active-class="dropdown-active"
                        @click="selectFilter(opt.key)"
                    >
                        <q-item-section>
                            <q-item-label>{{ opt.label }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <q-badge :label="opt.count" color="grey-8" text-color="white" />
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-btn-dropdown>
        </div>

        <div v-if="isLoading" class="orders-list">
            <q-skeleton v-for="n in 3" :key="n" type="rect" height="100px" style="border-radius: 16px;" animation="pulse" />
        </div>

        <div v-else-if="recentOrders.length === 0" class="empty-state">
            <p>{{ $t('seller_dashboard.empty_orders') }}</p>
        </div>

        <div v-else class="orders-list">
            <div v-for="order in recentOrders" :key="order.id" class="order-card">
                <!-- Header: customer + status -->
                <div class="order-header">
                    <div class="order-customer">
                        <div class="customer-name">{{ order.customerName }}</div>
                        <div class="order-time">{{ order.time }}</div>
                    </div>
                    <span class="order-status" :class="getStatusClass(order.status)">
                        {{ order.displayStatus }}
                    </span>
                </div>

                <q-separator class="separator" />

                <!-- Items -->
                <div v-for="item in order.items" :key="item.id" class="order-items">
                    <div>
                        <div>
                            <span class="order-items__quantity">{{ item.quantity }}</span> &nbsp; x &nbsp; <span class="order-items__name">{{ item.name_snapshot }}</span>
                        </div>
                        <div class="order-items_price_per_pcs">
                            {{ getLocaleNumberFormat(item.price_snapshot * item.quantity )}} / pcs
                        </div>
                        
                    </div>
                    <div>
                        <span class="">{{ getLocaleNumberFormat(item.price_snapshot * item.quantity )}}</span>
                    </div>
                </div>

                <q-separator class="separator" />

                <!-- Total -->
                <div class="order-total">
                    <div class="order-total__title">Total</div>
                    <div class="order-total__number">{{ order.totalText }}</div>
                </div>

                <!-- Actions -->
                <div v-if="order.canAccept || order.canReject" class="order-actions">
                    <q-btn
                        v-if="order.canReject"
                        class="btn-reject"
                        flat
                        dense
                        no-caps
                        @click="openRejectDialog(order)"
                    >
                        <X :size="16" style="margin-right: 4px;" />
                        {{ $t('seller_dashboard.action_reject') }}
                    </q-btn>
                    <q-btn
                        v-if="order.canAccept"
                        class="btn-accept"
                        unelevated
                        dense
                        no-caps
                        @click="onAccept(order)"
                    >
                        <Check :size="16" style="margin-right: 4px;" />
                        {{ order.nextLabel }}
                    </q-btn>
                </div>
            </div>
        </div>

        <!-- Reject Reason Dialog -->
        <q-dialog v-model="showRejectDialog">
            <q-card class="reject-dialog">
                <q-card-section>
                    <div class="dialog-title">{{ $t('seller_dashboard.reject_dialog_title') }}</div>
                    <div class="dialog-subtitle">{{ $t('seller_dashboard.reject_dialog_subtitle') }}</div>

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
                        dense
                        outlined
                        dark
                        autofocus
                        :placeholder="$t('seller_dashboard.reject_reason_placeholder')"
                        class="custom-reason-input"
                    />
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat no-caps :label="$t('common.button_label_cancel')" v-close-popup />
                    <q-btn
                        flat
                        no-caps
                        color="negative"
                        :label="$t('seller_dashboard.action_confirm_reject')"
                        :disable="!canConfirmReject"
                        :loading="rejecting"
                        @click="confirmReject"
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<style lang="scss" scoped>

.recent-orders-container {
    font-family: $sariko-font-family-secondary;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.section-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
}

.filter-dropdown {
    color: var(--text-secondary);
    font-size: 13px;
    font-weight: 600;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 4px 8px;
}

.dropdown-list {
    background: #1f2940;
    min-width: 180px;
}

.dropdown-active {
    color: var(--color-accent);
}

.orders-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.order-card {
    background-color: rgba(255, 255, 255, 0.07);
    border-radius: 16px;
    padding: 16px;
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
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

.order-status {
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 12px;
    flex-shrink: 0;
}

.status-pending { background: rgba(245, 158, 11, 0.1); color: var(--color-warning); }
.status-preparing { background: rgba(59, 130, 246, 0.1); color: var(--color-info); }
.status-ready { background: rgba(34, 197, 94, 0.1); color: var(--color-success); }
.status-delivered { background: var(--bg-card-hover); color: var(--text-secondary); }
.status-cancelled { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

.order-items {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 6px;
    overflow: hidden;
    // background-color: red;
}

.separator {
    background-color: var(--border-color);
    margin-bottom: 10px;
}

.order-items__quantity {
    font-weight: 600;
    color: white;
}

.order-items__name {
    font-weight: 600;
    color: white;
}

.order-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 12px;
}

.order-total__title {
    font-weight: 500;
    color: var(--text-muted)
}

.order-items_price_per_pcs {
    font-size: 11px
}

.order-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
}

.btn-accept {
    background: var(--color-accent, #f5A623);
    color: #121b2f;
    font-weight: 600;
    font-size: 13px;
    padding: 8px 16px;
    border-radius: 10px;
}

.btn-reject {
    color: #ef4444;
    font-size: 13px;
    font-weight: 500;
    padding: 8px 12px;
    border-radius: 10px;
}

/* Reject Dialog */
.reject-dialog {
    background-color: #1f2940;
    border-radius: 16px;
    min-width: 300px;
    color: var(--text-primary);
}

.dialog-title {
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 4px;
}

.dialog-subtitle {
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

.empty-state {
    text-align: center;
    color: var(--text-secondary);
    padding: 40px 0;
}
</style>
