<template>
    <div class="dashboard-page">
        <!-- Header -->
        <header class="header">
            <h1 class="page-title">Seller Dashboard</h1>
            <p class="welcome-text">Welcome back!</p>
        </header>

        <!-- Stats Cards -->
        <div class="stats-section">
            <div class="stat-card">
                <div class="stat-icon orders">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                </div>
                <div class="stat-content">
                    <span class="stat-value">{{ dashboardData.totalOrders }}</span>
                    <span class="stat-label">Total Orders</span>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon revenue">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                </div>
                <div class="stat-content">
                    <span class="stat-value">₱{{ formattedRevenue }}</span>
                    <span class="stat-label">Revenue</span>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon pending">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                </div>
                <div class="stat-content">
                    <span class="stat-value">{{ dashboardData.pendingOrders }}</span>
                    <span class="stat-label">Pending Orders</span>
                </div>
            </div>
        </div>

        <!-- Recent Orders -->
        <section class="recent-orders-section">
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
                        <button
                            v-if="order.status !== 'done' && order.status !== 'cancelled'"
                            class="action-btn"
                            @click="updateStatus(order)"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <polyline points="9 11 12 14 22 4"></polyline>
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import apiSellerDashboard from '@/apis/sellers/apiSellerDashboard'
import { Notify } from 'quasar'

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
    name: 'SellerDashboard',
    data() {
        return {
            orders: [],
            isLoading: true,
        }
    },
    computed: {
        dashboardData() {
            const totalOrders = this.orders.length
            const revenue = this.orders
                .filter(o => o.status !== 'cancelled')
                .reduce((sum, o) => sum + (o.total_amount || 0), 0)
            const pendingOrders = this.orders.filter(o => o.status === 'pending').length

            return { totalOrders, revenue, pendingOrders }
        },
        formattedRevenue() {
            return this.dashboardData.revenue.toLocaleString()
        },
        recentOrders() {
            return this.orders.slice(0, 20).map(order => ({
                ...order,
                displayStatus: STATUS_DISPLAY[order.status] || order.status,
                customerName: order.users?.name || order.users?.email || 'Customer',
                itemsText: (order.order_items || []).map(i => i.name_snapshot).join(', '),
                time: new Date(order.created_at).toLocaleString(),
            }))
        },
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
            const statusMap = {
                'Pending': 'status-pending',
                'Preparing': 'status-preparing',
                'Ready': 'status-ready',
                'Delivered': 'status-delivered',
                'Cancelled': 'status-cancelled',
            }
            return statusMap[displayStatus] || 'status-pending'
        },
        async updateStatus(order) {
            const nextStatus = STATUS_NEXT[order.status]
            if (!nextStatus) return

            try {
                await apiSellerDashboard.updateOrderStatus(order.id, nextStatus)
                order.status = nextStatus
                Notify.create({
                    classes: 'quasar-notify-positive',
                    message: `Order updated to ${STATUS_DISPLAY[nextStatus]}`,
                    progress: true,
                    position: 'bottom',
                })
            } catch (e) {
                console.error('Failed to update order status:', e)
                Notify.create({
                    classes: 'quasar-notify-negative',
                    message: 'Failed to update order status',
                    progress: true,
                    position: 'bottom',
                })
            }
        },
    },
}
</script>

<style scoped>
.dashboard-page {
    min-height: 100vh;
    background: var(--bg-main);
    padding: 16px;
    padding-top: calc(16px + env(safe-area-inset-top, 0));
}

.header {
    margin-bottom: 24px;
}

.page-title {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
}

.welcome-text {
    font-size: 14px;
    color: var(--text-secondary);
    margin-top: 4px;
}

.stats-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
    margin-bottom: 28px;
}

.stat-card {
    background: var(--bg-surface);
    border-radius: 16px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.stat-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.stat-icon.orders {
    background: rgba(37, 99, 235, 0.1);
    color: var(--color-info);
}

.stat-icon.revenue {
    background: rgba(34, 197, 94, 0.1);
    color: var(--color-success);
}

.stat-icon.pending {
    background: rgba(245, 158, 11, 0.1);
    color: var(--color-warning);
}

.stat-content {
    display: flex;
    flex-direction: column;
}

.stat-value {
    font-size: 22px;
    font-weight: 700;
    color: var(--text-primary);
}

.stat-label {
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 2px;
}

.recent-orders-section {
    margin-bottom: 24px;
}

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

.action-btn {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: var(--bg-card-hover);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--text-primary);
    transition: background 0.2s ease;
}

.action-btn:hover {
    background: var(--border-color);
}

.toast {
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--text-primary);
    color: var(--bg-main);
    padding: 12px 24px;
    border-radius: 24px;
    font-size: 14px;
    font-weight: 500;
    z-index: 1001;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
}
</style>
