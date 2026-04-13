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
            return new Intl.NumberFormat('vi-VN').format(this.order.total_amount) + ' ₫'
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
                this.$q.notify({ type: 'negative', message: 'Could not create payment. Please try again.', position: 'top' })
            } catch (e) {
                console.error('Pay now failed:', e)
                this.$q.notify({ type: 'negative', message: 'Payment failed. Please try again.', position: 'top' })
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
                this.$q.notify({ type: 'negative', message: 'Failed to cancel order', position: 'top' })
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
            Pay Now · {{ totalText }}
        </q-btn>

        <q-btn v-if="isPending" class="btn-cancel" flat dense no-caps @click="showCancelDialog = true">
            Cancel Order
        </q-btn>

        <!-- Cancel Confirmation Dialog -->
        <q-dialog v-model="showCancelDialog">
            <q-card class="cancel-dialog">
                <q-card-section>
                    <div class="dialog-title">Cancel this order?</div>
                    <div class="dialog-text">This action cannot be undone.</div>
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn flat no-caps label="Keep Order" v-close-popup />
                    <q-btn flat no-caps label="Cancel Order" color="negative" :loading="cancelling" @click="onCancelOrder" />
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
    background-color: #10b981;
    color: #fff;
    padding: 14px 0;
    border-radius: 2rem;
    font-weight: 600;
    font-size: 16px;
}

.btn-cancel {
    width: 100%;
    color: rgba(239, 68, 68, 0.7);
    font-weight: 500;
    font-size: 14px;
    padding: 10px 0;
}

.cancel-dialog {
    background-color: #1f2940;
    border-radius: 16px;
    min-width: 280px;
}

.dialog-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
}

.dialog-text {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
}
</style>
