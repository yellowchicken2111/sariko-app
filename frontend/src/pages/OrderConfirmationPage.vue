<script>
import { CircleCheckBig, ShoppingBag, ChevronLeft } from 'lucide-vue-next';
import { useOrderStore } from '@/stores/order/orderStore.js';

export default {
    components: {
        CircleCheckBig, ShoppingBag, ChevronLeft
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
        }
    },

    async mounted() {
        const orderStore = useOrderStore()

        if (orderStore.currentOrder?.id === this.orderId) {
            this.order = orderStore.currentOrder
            this.loading = false
        } else {
            await orderStore.getOrderDetail(this.orderId)
            this.order = orderStore.currentOrder
            this.loading = false
        }
    },

    methods: {
        formatPrice(value) {
            return new Intl.NumberFormat('vi-VN').format(value) + ' ₫'
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
            <div class="header-title">Order Confirmation</div>
            <div style="width: 40px" />
        </div>

        <div v-if="loading" class="loading-state">
            <q-spinner color="amber" size="40px" />
        </div>

        <div v-else-if="order" class="content">

            <div class="success-icon">
                <CircleCheckBig :size="64" color="#10b981" />
            </div>

            <div class="success-text">Order Placed!</div>
            <div class="success-subtext">
                Your order has been placed successfully.
                The seller will confirm your order shortly.
            </div>

            <div class="order-card">
                <div class="order-row">
                    <span class="label">Status</span>
                    <q-badge :color="order.status === 'pending' ? 'amber' : 'positive'" text-color="black">
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

            <div class="actions">
                <q-btn class="btn-orders" dense no-caps @click="$router.push('/orders')">
                    <ShoppingBag style="margin-right: 8px" :size="18" />
                    View My Orders
                </q-btn>
                <q-btn class="btn-home" flat dense no-caps @click="$router.push('/home')">
                    Back to Home
                </q-btn>
            </div>

        </div>

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

.success-icon {
    margin-bottom: 16px;
}

.success-text {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 8px;
}

.success-subtext {
    font-size: 14px;
    color: rgba(255,255,255,0.5);
    text-align: center;
    margin-bottom: 28px;
    line-height: 1.5;
}

.order-card {
    width: 100%;
    background-color: rgba(255,255,255,0.05);
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
</style>
