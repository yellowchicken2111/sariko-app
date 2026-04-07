<script>
import { CircleCheckBig, Clock, CircleX, ShoppingBag, ChevronLeft } from 'lucide-vue-next';
import { useOrderStore } from '@/stores/order/orderStore.js';

export default {
    components: {
        CircleCheckBig, Clock, CircleX, ShoppingBag, ChevronLeft
    },

    props: {
        orderId: {
            required: true,
            type: String
        }
    },

    data() {
        return {
            order: null,
            loading: true,
            cancelling: false,
            showCancelDialog: false,
        }
    },

    computed: {
        totalText() {
            if (!this.order) return ''
            return new Intl.NumberFormat('vi-VN').format(this.order.total_amount) + ' ₫'
        },
        statusLabel() {
            const map = {
                pending: 'Pending',
                confirmed: 'Confirmed',
                ready: 'Ready',
                done: 'Completed',
                cancelled: 'Cancelled',
            }
            return map[this.order?.status] || this.order?.status
        },
        statusColor() {
            const map = {
                pending: 'amber',
                confirmed: 'info',
                ready: 'positive',
                done: 'positive',
                cancelled: 'negative',
            }
            return map[this.order?.status] || 'grey'
        },
        statusTitle() {
            const map = {
                pending: 'Order Placed!',
                confirmed: 'Order Confirmed',
                ready: 'Order Ready!',
                done: 'Order Completed',
                cancelled: 'Order Cancelled',
            }
            return map[this.order?.status] || 'Order'
        },
        statusSubtext() {
            const map = {
                pending: 'Your order has been sent. The seller will confirm shortly.',
                confirmed: 'The seller is preparing your order.',
                ready: this.order?.delivery_method === 'delivery'
                    ? 'Your order is ready for pickup by rider.'
                    : 'Your order is ready! Head to the store.',
                done: 'Enjoy your meal!',
                cancelled: 'This order has been cancelled.',
            }
            return map[this.order?.status] || ''
        },
        statusIconColor() {
            const map = {
                pending: '#f59e0b',
                confirmed: '#3b82f6',
                ready: '#10b981',
                done: '#10b981',
                cancelled: '#ef4444',
            }
            return map[this.order?.status] || '#ffffff'
        },
        isPending() {
            return this.order?.status === 'pending'
        },
        isDone() {
            return this.order?.status === 'done'
        },
        isCancelled() {
            return this.order?.status === 'cancelled'
        }
    },

    async mounted() {
        const orderStore = useOrderStore()
        await orderStore.getOrderDetail(this.orderId)
        this.order = orderStore.currentOrder
        this.loading = false
    },

    methods: {
        formatPrice(value) {
            return new Intl.NumberFormat('vi-VN').format(value) + ' ₫'
        },

        async onCancelOrder() {
            this.cancelling = true
            try {
                const orderStore = useOrderStore()
                await orderStore.cancelOrder(this.orderId)
                this.order = { ...this.order, status: 'cancelled' }
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
    <div class="confirmation-page">

        <div class="header">
            <q-btn flat round dense @click="$router.push('/orders')">
                <ChevronLeft />
            </q-btn>
            <div class="header-title">Order Detail</div>
            <div style="width: 40px" />
        </div>

        <div v-if="loading" class="loading-state">
            <q-spinner color="amber" size="40px" />
        </div>

        <div v-else-if="order" class="content">

            <!-- Status Icon -->
            <div class="status-icon">
                <CircleX v-if="isCancelled" :size="64" :color="statusIconColor" />
                <Clock v-else-if="isPending" :size="64" :color="statusIconColor" />
                <CircleCheckBig v-else :size="64" :color="statusIconColor" />
            </div>

            <div class="status-title">{{ statusTitle }}</div>
            <div class="status-subtext">{{ statusSubtext }}</div>

            <!-- Order Info Card -->
            <div class="order-card">
                <div class="order-row">
                    <span class="label">Status</span>
                    <q-badge :color="statusColor" text-color="black">
                        {{ statusLabel }}
                    </q-badge>
                </div>
                <div class="order-row">
                    <span class="label">Seller</span>
                    <span>{{ order.seller_profiles?.store_name }}</span>
                </div>
                <div class="order-row">
                    <span class="label">Delivery</span>
                    <span>{{ order.delivery_method === 'delivery' ? 'Delivery' : 'Pickup' }}</span>
                </div>
                <div class="order-row" v-if="order.delivery_address">
                    <span class="label">Address</span>
                    <span class="address-text">{{ order.delivery_address }}</span>
                </div>
                <div class="order-row" v-if="order.note">
                    <span class="label">Note</span>
                    <span>{{ order.note }}</span>
                </div>

                <div class="dashed-line" />

                <div class="order-row" v-for="item in order.order_items" :key="item.id">
                    <span>{{ item.quantity }}x {{ item.name_snapshot }}</span>
                    <span>{{ formatPrice(item.price_snapshot * item.quantity) }}</span>
                </div>

                <div class="dashed-line" />

                <div class="order-row total">
                    <span>Total</span>
                    <span>{{ totalText }}</span>
                </div>
            </div>

            <!-- Actions -->
            <div class="actions">
                <q-btn v-if="isPending" class="btn-cancel" flat dense no-caps @click="showCancelDialog = true">
                    Cancel Order
                </q-btn>

                <q-btn class="btn-orders" dense no-caps @click="$router.push('/orders')">
                    <ShoppingBag style="margin-right: 8px" :size="18" />
                    View My Orders
                </q-btn>
                <q-btn class="btn-home" flat dense no-caps @click="$router.push('/home')">
                    Back to Home
                </q-btn>
            </div>

        </div>

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

.confirmation-page {
    min-height: 100vh;
    font-family: $sariko-font-family-secondary;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 8px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
}

.header-title {
    font-size: 18px;
    font-weight: 600;
}

.loading-state {
    display: flex;
    justify-content: center;
    padding-top: 100px;
}

.content {
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
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
    color: rgba(255,255,255,0.5);
    text-align: center;
    margin-bottom: 28px;
    line-height: 1.5;
}

.order-card {
    width: 100%;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 28px;
}

.order-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 6px 0;
    font-size: 14px;

    &.total {
        font-weight: 700;
        font-size: 16px;
    }
}

.label {
    color: rgba(255,255,255,0.5);
    font-weight: 500;
}

.address-text {
    text-align: right;
    max-width: 60%;
}

.dashed-line {
    height: 1px;
    background: repeating-linear-gradient(
        to right, #454545 0px, #454545 10px, transparent 2px, transparent 15px
    );
    margin: 12px 0;
}

.actions {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.btn-cancel {
    width: 100%;
    color: $negative;
    border: 1px solid rgba($negative, 0.3);
    padding: 12px 0;
    border-radius: 2rem;
    font-weight: 600;
    font-size: 15px;
}

.btn-orders {
    width: 100%;
    background-color: $accent;
    color: var(--bg-main);
    padding: 14px 0;
    border-radius: 2rem;
    font-weight: 600;
    font-size: 16px;
}

.btn-home {
    width: 100%;
    color: rgba(255,255,255,0.6);
    font-size: 14px;
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
    color: rgba(255,255,255,0.5);
}
</style>
