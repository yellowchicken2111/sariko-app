<script>
import { CreditCard } from 'lucide-vue-next';
import { useOrderStore } from '@/stores/order/orderStore.js';
import apiPayments from '@/apis/payments/apiPayments.js';

export default {
    components: {
        CreditCard
    },

    data() {
        return {
            payingNow: false,
            cancelling: false,
            showCancelDialog: false,
        }
    },

    computed: {
        orderStore() {
            return useOrderStore()
        },
        order() {
            return this.orderStore.currentOrder
        },
        isPending() {
            return this.order?.status === 'pending'
        },
        isCancelled() {
            return this.order?.status === 'cancelled'
        },
        isPaymentPending() {
            return this.order?.payment_status === 'pending' && this.order?.status === 'pending'
        },
        totalText() {
            if (!this.order) return ''
            return '₩' + new Intl.NumberFormat('ko-KR').format(this.order.total_amount)
        },
        hasActions() {
            return this.isPaymentPending || this.isPending
        }
    },

    methods: {
        async onPayNow() {
            this.payingNow = true
            try {
                const res = await apiPayments.createVnpayPayment(this.order.id)
                if (res?.data?.payment_url) {
                    // window.open(res.data.payment_url, '_blank')
                    window.location.href = res.data.payment_url
                    return
                }
                this.$q.notify({ type: 'negative', message: this.$t('order_detail.error_payment_create'), position: 'top' })
            } catch (e) {
                console.error('Pay now failed:', e)
                this.$q.notify({ type: 'negative', message: this.$t('order_detail.error_payment_failed'), position: 'top' })
            } finally {
                this.payingNow = false
            }
        },

        async onCancelOrder() {
            this.cancelling = true
            try {
                await this.orderStore.cancelOrder(this.order.id)
                this.showCancelDialog = false
            } catch (e) {
                this.$q.notify({ type: 'negative', message: this.$t('order_detail.error_cancel_failed'), position: 'top' })
            } finally {
                this.cancelling = false
            }
        }
    }
}
</script>

<template>
    <div v-if="hasActions" class="actions">
        <q-btn v-if="isPaymentPending" class="btn-pay-now" dense no-caps :loading="payingNow" @click="onPayNow">
            <CreditCard style="margin-right: 8px" :size="18" />
            {{ $t('order_detail.btn_pay_now', { amount: totalText }) }}
        </q-btn>

        <q-btn v-if="isPending" class="btn-cancel" flat dense no-caps @click="showCancelDialog = true">
            {{ $t('order_detail.btn_cancel') }}
        </q-btn>

        <!-- Cancel Confirmation Dialog -->
        <q-dialog v-model="showCancelDialog">
            <q-card class="cancel-dialog">
                <q-card-section>
                    <div class="dialog-title">{{ $t('order_detail.dialog_cancel_title') }}</div>
                    <div class="dialog-text">{{ $t('order_detail.dialog_cancel_text') }}</div>
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn flat no-caps :label="$t('order_detail.dialog_keep')" v-close-popup />
                    <q-btn flat no-caps :label="$t('order_detail.dialog_confirm_cancel')" color="negative" :loading="cancelling" @click="onCancelOrder" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<style lang="scss" scoped>
.actions {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.btn-pay-now {
    width: 100%;
    background-color: var(--color-success);
    color: #fff;
    padding: 14px 0;
    border-radius: 2rem;
    font-weight: 600;
    font-size: 16px;
}

.btn-cancel {
    width: 100%;
    color: var(--color-error);
    font-weight: 500;
    font-size: 14px;
    padding: 10px 0;
}

.cancel-dialog {
    background-color: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    min-width: 280px;
}

.dialog-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
}

.dialog-text {
    font-size: 14px;
    color: var(--text-secondary);
}
</style>
