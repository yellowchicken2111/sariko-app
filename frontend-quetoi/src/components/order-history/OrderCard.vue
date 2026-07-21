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
            return new Intl.NumberFormat('ko-KR').format(this.order.total_amount)
        },
        dateText() {
            const d = new Date(this.order.created_at)
            return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        },
        isUnpaid() {
            return this.order.payment_status === 'pending' && this.order.status === 'pending'
        },
        statusClass() {
            if (this.isUnpaid) return 'status-unpaid'
            return `status-${this.order.status}`
        },
        statusLabel() {
            if (this.isUnpaid) return this.$t('orders_page.status_unpaid')
            const map = {
                pending: this.$t('orders_page.status_pending'),
                confirmed: this.$t('orders_page.status_confirmed'),
                ready: this.$t('orders_page.status_ready'),
                done: this.$t('orders_page.status_done'),
                cancelled: this.$t('orders_page.status_cancelled'),
                delivery_failed: this.$t('orders_page.status_delivery_failed'),
            }
            return map[this.order.status] || this.order.status
        },
        refundStatus() {
            return this.order.refunds?.[0]?.status || null
        },
        showRefundChip() {
            return this.refundStatus === 'pending'
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

        <div v-if="showRefundChip" class="refund-chip refund-pending">
            {{ $t('orders_page.refund_pending') }}
        </div>

        <div class="card-divider" />

        <div class="card-bottom">
            <div class="order-total">
                <span class="currency">₩</span>{{ totalText }}
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
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    padding: 16px;
    cursor: pointer;
    transition: background 150ms ease;
    font-family: $quetoi-font-family-secondary;

    &:hover {
        background: var(--bg-card-hover);
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
    background: rgba(29, 107, 74, 0.1);
    border: 1px solid rgba(29, 107, 74, 0.15);
    color: var(--color-primary);
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
    color: var(--text-muted);
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

.status-unpaid {
    background: rgba(201, 165, 90, 0.14);
    color: var(--color-warning);
}

.status-pending {
    background: rgba(201, 165, 90, 0.12);
    color: $warning;
}

.status-confirmed {
    background: rgba(42, 138, 94, 0.12);
    color: $info;
}

.status-ready {
    background: rgba(42, 138, 94, 0.12);
    color: $positive;
}

.status-done {
    background: rgba(42, 138, 94, 0.12);
    color: $positive;
}

.status-cancelled {
    background: rgba(192, 57, 43, 0.12);
    color: $negative;
}

.status-delivery_failed {
    background: rgba(201, 165, 90, 0.12);
    color: var(--color-warning);
}

.refund-chip {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 600;
    margin-bottom: 10px;
}

.refund-pending {
    background: rgba(201, 165, 90, 0.12);
    color: var(--color-warning);
}

.card-divider {
    height: 1px;
    background: var(--border-color);
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
    color: var(--text-muted);
    margin-right: 2px;
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
    color: var(--text-muted);
}

.chevron {
    color: var(--text-muted);
}
</style>
