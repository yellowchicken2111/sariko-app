<script>
import { Store, Truck, ChevronRight } from 'lucide-vue-next';

export default {
    components: {
        Store, Truck, ChevronRight
    },

    props: {
        order: {
            type: Object,
            required: true
        }
    },

    computed: {
        sellerName() {
            return this.order.seller_profiles?.store_name || 'Unknown'
        },
        totalText() {
            return new Intl.NumberFormat('vi-VN').format(this.order.total_amount)
        },
        dateText() {
            const d = new Date(this.order.created_at)
            return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        },
        statusClass() {
            return `status-${this.order.status}`
        },
        statusLabel() {
            const map = {
                pending: 'Pending',
                confirmed: 'Confirmed',
                ready: 'Ready',
                done: 'Completed',
                cancelled: 'Cancelled'
            }
            return map[this.order.status] || this.order.status
        }
    },

    methods: {
        goToDetail() {
            this.$router.push({ name: 'order-confirmation', params: { orderId: this.order.id } })
        }
    }
}
</script>

<template>
    <div class="order-card" @click="goToDetail">

        <div class="card-top">
            <div class="seller-avatar">
                <Store :size="20" />
            </div>
            <div class="seller-info">
                <div class="seller-name">{{ sellerName }}</div>
                <div class="order-date">{{ dateText }}</div>
            </div>
            <div class="status-badge" :class="statusClass">
                {{ statusLabel }}
            </div>
        </div>

        <div class="card-divider" />

        <div class="card-bottom">
            <div class="order-total">
                {{ totalText }} <span class="currency">₫</span>
            </div>
            <div class="order-meta">
                <div class="delivery-method">
                    <Truck v-if="order.delivery_method === 'delivery'" :size="14" />
                    <Store v-else :size="14" />
                    {{ order.delivery_method === 'delivery' ? 'Delivery' : 'Pickup' }}
                </div>
                <ChevronRight :size="18" class="chevron" />
            </div>
        </div>

    </div>
</template>

<style lang="scss" scoped>
.order-card {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 1rem;
    padding: 16px;
    cursor: pointer;
    transition: background 150ms ease;
    font-family: $sariko-font-family-secondary;

    &:hover {
        background: rgba(255, 255, 255, 0.05);
    }

    &:active {
        transform: scale(0.985);
    }
}

.card-top {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
}

.seller-avatar {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: rgba($accent, 0.1);
    border: 1px solid rgba($accent, 0.15);
    color: $accent;
}

.seller-info {
    flex: 1;
    min-width: 0;
}

.seller-name {
    font-size: 15px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.order-date {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.35);
    margin-top: 2px;
}

.status-badge {
    flex-shrink: 0;
    padding: 4px 10px;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.status-pending {
    background: rgba(245, 158, 11, 0.12);
    color: $warning;
}

.status-confirmed {
    background: rgba(59, 130, 246, 0.12);
    color: $info;
}

.status-ready {
    background: rgba(16, 185, 129, 0.12);
    color: $positive;
}

.status-done {
    background: rgba(16, 185, 129, 0.12);
    color: $positive;
}

.status-cancelled {
    background: rgba(239, 68, 68, 0.10);
    color: $negative;
}

.card-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.06);
    margin: 0 -16px;
}

.card-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
}

.order-total {
    font-size: 16px;
    font-weight: 700;
}

.currency {
    font-size: 12px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.5);
    margin-left: 2px;
}

.order-meta {
    display: flex;
    align-items: center;
    gap: 12px;
}

.delivery-method {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.35);
}

.chevron {
    color: rgba(255, 255, 255, 0.35);
}
</style>
