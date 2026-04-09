<script>
import { FileText, DollarSign, Clock } from 'lucide-vue-next';
import apiSellerDashboard from '@/apis/sellers/apiSellerDashboard';

export default {
    components: { FileText, DollarSign, Clock },

    data() {
        return {
            orders: []
        }
    },

    computed: {
        totalOrders() {
            return this.orders.length
        },
        revenue() {
            return this.orders
                .filter(o => o.status !== 'cancelled')
                .reduce((sum, o) => sum + (o.total_amount || 0), 0)
        },
        formattedRevenue() {
            return this.revenue.toLocaleString()
        },
        pendingOrders() {
            return this.orders.filter(o => o.status === 'pending').length
        }
    },

    async created() {
        try {
            const res = await apiSellerDashboard.getOrders()
            this.orders = res.orders || []
        } catch (e) {
            console.error('Failed to fetch stats:', e)
        }
    }
}
</script>

<template>
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-icon orders">
                <FileText :size="24" />
            </div>
            <div class="stat-content">
                <span class="stat-value">{{ totalOrders }}</span>
                <span class="stat-label">Total Orders</span>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-icon revenue">
                <DollarSign :size="24" />
            </div>
            <div class="stat-content">
                <span class="stat-value">₱{{ formattedRevenue }}</span>
                <span class="stat-label">Revenue</span>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-icon pending">
                <Clock :size="24" />
            </div>
            <div class="stat-content">
                <span class="stat-value">{{ pendingOrders }}</span>
                <span class="stat-label">Pending Orders</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
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
</style>
