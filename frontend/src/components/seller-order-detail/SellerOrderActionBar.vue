<script>
import { useDashboardStore } from '@/stores/seller/dashboardStore';
import apiSellerDashboard from '@/apis/sellers/apiSellerDashboard';

const STATUS_NEXT = {
    pending:   'confirmed',
    confirmed: 'ready',
    ready:     'done',
}

const REJECT_REASONS = ['out_of_ingredients', 'too_busy', 'store_closing', 'other']

export default {
    name: 'SellerOrderActionBar',

    props: {
        order: {
            type: Object,
            required: true,
        }
    },

    emits: ['status-updated'],

    data() {
        return {
            showRejectDialog: false,
            selectedReason: '',
            customReason: '',
            rejecting: false,
            accepting: false,
        }
    },

    computed: {
        canAccept() { return !!STATUS_NEXT[this.order.status] },
        canReject()  { return ['pending', 'confirmed'].includes(this.order.status) },

        acceptLabel() {
            const map = {
                pending:   'seller_order_detail.action_accept_order',
                confirmed: 'seller_order_detail.action_mark_ready',
                ready:     'seller_order_detail.action_mark_done',
            }
            return map[this.order.status] ? this.$t(map[this.order.status]) : ''
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

    methods: {
        async onAccept() {
            const nextStatus = STATUS_NEXT[this.order.status]
            if (!nextStatus) return
            this.accepting = true
            try {
                await apiSellerDashboard.updateOrderStatus(this.order.id, nextStatus)
                useDashboardStore().updateOrderLocally(this.order.id, nextStatus)
                this.$emit('status-updated', nextStatus)
                this.$q.notify({ classes: 'quasar-notify-positive', message: this.$t('seller_order_detail.toast_order_updated'), position: 'bottom', timeout: 1500 })
            } catch (e) {
                console.error('SellerOrderActionBar - onAccept -', e)
                this.$q.notify({ type: 'negative', message: this.$t('seller_order_detail.toast_update_failed'), position: 'bottom' })
            } finally {
                this.accepting = false
            }
        },

        async confirmReject() {
            if (!this.canConfirmReject) return
            this.rejecting = true
            try {
                await apiSellerDashboard.updateOrderStatus(this.order.id, 'cancelled', this.rejectReasonText)
                useDashboardStore().updateOrderLocally(this.order.id, 'cancelled')
                this.$emit('status-updated', 'cancelled', this.rejectReasonText)
                this.showRejectDialog = false
                this.$q.notify({ classes: 'quasar-notify-positive', message: this.$t('seller_order_detail.toast_order_rejected'), position: 'bottom', timeout: 1500 })
            } catch (e) {
                console.error('SellerOrderActionBar - confirmReject -', e)
                this.$q.notify({ type: 'negative', message: this.$t('seller_order_detail.toast_reject_failed'), position: 'bottom' })
            } finally {
                this.rejecting = false
            }
        },
    },
}
</script>

<template>
    <div>
        <!-- Action buttons -->
        <div class="action-row">
            <template v-if="canAccept || canReject">
                <q-btn v-if="canReject" flat no-caps class="btn-reject" @click="showRejectDialog = true">
                    {{ $t('seller_order_detail.action_reject') }}
                </q-btn>
                <q-btn v-if="canAccept" unelevated no-caps class="btn-accept" :loading="accepting" @click="onAccept">
                    {{ acceptLabel }}
                </q-btn>
            </template>
            <div v-else-if="order.status === 'ready'"     class="status-message">{{ $t('seller_order_detail.action_bar_driver_on_way') }}</div>
            <div v-else-if="order.status === 'done'"      class="status-message">{{ $t('seller_order_detail.action_bar_completed') }}</div>
            <div v-else-if="order.status === 'cancelled'" class="status-message cancelled">{{ $t('seller_order_detail.action_bar_cancelled') }}</div>
        </div>

        <!-- Reject dialog -->
        <q-dialog v-model="showRejectDialog">
            <q-card class="reject-dialog">
                <q-card-section>
                    <div class="dialog-title">{{ $t('seller_order_detail.reject_dialog_title') }}</div>
                    <div class="dialog-sub">{{ $t('seller_order_detail.reject_dialog_sub') }}</div>
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
                        :placeholder="$t('seller_order_detail.reject_reason_placeholder')"
                        class="custom-reason-input"
                    />
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn flat no-caps :label="$t('common.button_label_cancel')" v-close-popup />
                    <q-btn flat no-caps color="negative" :label="$t('seller_order_detail.reject_confirm')"
                        :disable="!canConfirmReject" :loading="rejecting" @click="confirmReject" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<style lang="scss" scoped>
.action-row {
    display: flex;
    gap: 10px;
}

.btn-accept {
    flex: 1;
    background: var(--color-accent);
    color: #121b2f;
    font-weight: 700;
    font-size: 14px;
    border-radius: 12px;
    padding: 12px;
}

.btn-reject {
    color: #ef4444;
    font-size: 14px;
    padding: 12px 16px;
    border-radius: 12px;
    border: 1px solid rgba(239, 68, 68, 0.3);
}

.status-message {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: var(--text-secondary);
    padding: 12px 0;
}

.cancelled { color: #ef4444; }

.reject-dialog {
    background: #1f2940;
    border-radius: 16px;
    min-width: 300px;
    color: var(--text-primary);
}

.dialog-title { font-size: 17px; font-weight: 700; margin-bottom: 4px; }
.dialog-sub   { font-size: 13px; color: var(--text-secondary); margin-bottom: 16px; }

.reason-options {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
}

.reason-chip {
    padding: 8px 14px;
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.05);
    color: var(--text-primary);
    font-size: 13px;
    cursor: pointer;
    font-family: inherit;
    &.active {
        border-color: var(--color-accent);
        background: rgba(245,166,35,0.15);
        color: var(--color-accent);
    }
}

.custom-reason-input { margin-top: 8px; }
</style>
