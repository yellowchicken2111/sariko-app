<script>
import { CheckSquare } from 'lucide-vue-next';
import apiSellerDashboard from '@/apis/sellers/apiSellerDashboard';

const STATUS_DISPLAY = {
    pending: 'Pending',
    confirmed: 'Preparing',
    ready: 'Ready',
    done: 'Delivered',
    cancelled: 'Cancelled',
}

const STATUS_NEXT = {
    pending: 'confirmed',
    confirmed: 'ready',
    ready: 'done',
}

export default {
    components: { CheckSquare },

    data() {
        return {
            orders: [],
            isLoading: true,
        }
    },

    computed: {
        recentOrders() {
            return this.orders.slice(0, 20).map(order => ({
                ...order,
                displayStatus: STATUS_DISPLAY[order.status] || order.status,
                customerName: order.users?.name || order.users?.email || 'Customer',
                itemsText: (order.order_items || []).map(i => i.name_snapshot).join(', '),
                time: new Date(order.created_at).toLocaleString(),
            }))
        }
    },

    async mounted() {
        await this.fetchOrders()
    },

    methods: {
        async fetchOrders() {
            this.isLoading = true
            try {
                const res = await apiSellerDashboard.getOrders()
                this.orders = res.orders || []
            } catch (e) {
                console.error('Failed to fetch seller orders:', e)
            } finally {
                this.isLoading = false
            }
        },

        getStatusClass(displayStatus) {
            const map = {
                'Pending': 'status-pending',
                'Preparing': 'status-preparing',
                'Ready': 'status-ready',
                'Delivered': 'status-delivered',
                'Cancelled': 'status-cancelled',
            }
            return map[displayStatus] || 'status-pending'
        },

        async updateStatus(order) {
            const nextStatus = STATUS_NEXT[order.status]
            if (!nextStatus) return

            try {
                await apiSellerDashboard.updateOrderStatus(order.id, nextStatus)
                order.status = nextStatus
                order.displayStatus = STATUS_DISPLAY[nextStatus]
                this.$q.notify({
                    type: 'positive',
                    message: `Order updated to ${STATUS_DISPLAY[nextStatus]}`,
                    position: 'bottom',
                })
            } catch (e) {
                console.error('Failed to update order status:', e)
                this.$q.notify({
                    type: 'negative',
                    message: 'Failed to update order status',
                    position: 'bottom',
                })
            }
        },
    }
}
</script>

<template>
    <section>
        <h2 class="section-title">Recent Orders</h2>

        <div v-if="isLoading" class="orders-list">
            <q-skeleton v-for="n in 3" :key="n" type="rect" height="80px" style="border-radius: 16px;" animation="pulse" />
        </div>

        <div v-else-if="recentOrders.length === 0" class="empty-state">
            <p>No orders yet</p>
        </div>

        <div v-else class="orders-list">
            <div v-for="order in recentOrders" :key="order.id" class="order-item">
                <div class="order-info">
                    <h4 class="customer-name">{{ order.customerName }}</h4>
                    <p class="order-items-text">{{ order.itemsText }}</p>
                    <span class="order-time">{{ order.time }}</span>
                </div>
                <div class="order-actions">
                    <span class="order-status" :class="getStatusClass(order.displayStatus)">
                        {{ order.displayStatus }}
                    </span>
                    <q-btn
                        v-if="order.status !== 'done' && order.status !== 'cancelled'"
                        class="action-btn"
                        round dense no-caps
                        size="sm"
                        @click="updateStatus(order)"
                    >
                        <CheckSquare :size="18" />
                    </q-btn>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.section-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 16px;
}

.orders-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.order-item {
    background: var(--bg-surface);
    border-radius: 16px;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
}

.order-info {
    flex: 1;
    min-width: 0;
}

.customer-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 4px;
}

.order-items-text {
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 6px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.order-time {
    font-size: 12px;
    color: var(--text-muted);
}

.order-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
}

.order-status {
    font-size: 11px;
    font-weight: 600;
    padding: 5px 10px;
    border-radius: 12px;
}

.status-pending {
    background: rgba(245, 158, 11, 0.1);
    color: var(--color-warning);
}

.status-preparing {
    background: rgba(59, 130, 246, 0.1);
    color: var(--color-info);
}

.status-ready {
    background: rgba(34, 197, 94, 0.1);
    color: var(--color-success);
}

.status-delivered {
    background: var(--bg-card-hover);
    color: var(--text-secondary);
}

.status-cancelled {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
}

.action-btn {
    width: 44px;
    height: 44px;
    background: var(--bg-card-hover);
    color: var(--text-primary);
}

.empty-state {
    text-align: center;
    color: var(--text-secondary);
    padding: 40px 0;
}
</style>
