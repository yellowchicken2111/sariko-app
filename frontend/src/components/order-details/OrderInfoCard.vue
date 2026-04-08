<script>
import { useOrderStore } from '@/stores/order/orderStore.js';

export default {
    computed: {
        order() {
            return useOrderStore().currentOrder
        },
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
            if (this.order?.payment_status === 'pending' && this.order?.status !== 'cancelled') return 'orange'
            const map = {
                pending: 'amber',
                confirmed: 'info',
                ready: 'positive',
                done: 'positive',
                cancelled: 'negative',
            }
            return map[this.order?.status] || 'grey'
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
    <div v-if="order" class="order-card">
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
</template>

<style lang="scss" scoped>
.order-card {
    width: 100%;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 16px;
    padding: 20px;
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
    color: rgba(255, 255, 255, 0.5);
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
</style>
