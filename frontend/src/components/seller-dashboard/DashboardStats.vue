<script>
import { FileText, DollarSign, Clock } from 'lucide-vue-next';
import { mapState } from 'pinia';
import { useDashboardStore } from '@/stores/seller/dashboardStore';

export default {
    components: { FileText, DollarSign, Clock },

    computed: {
        ...mapState(useDashboardStore, [
            'totalOrders',
            'revenue',
            'pendingOrders',
            'isLoading',
        ]),
        formattedRevenue() {
            return this.revenue
        },
    },

    mounted() {
        useDashboardStore().fetchOrders()
    }
}
</script>

<template>
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-icon orders">
                <FileText :size="18"/>
                <div class="stat-label">Total Orders</div>
            </div>
            <div class="stat-content">
                <span class="stat-value">{{ totalOrders }}</span>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-icon revenue">
                <DollarSign :size="24" />
                <div class="stat-label">Revenue</div>
            </div>
            <div class="stat-content">
                <span class="stat-value">{{ formattedRevenue }}</span>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-icon pending">
                <Clock :size="24" />
                <div class="stat-label">Pending Orders</div>
            </div>
            <div class="stat-content">
                <span class="stat-value">{{ pendingOrders }}</span>
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
    background-color: rgba(255, 255, 255, 0.07);
    border-radius: 16px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.stat-icon {
    display: flex;
    align-items: center;
    border-radius: 12px;
}

.stat-label {
    margin-left: 5px;
    font-size: 14px;
    font-weight: 600;
}

.stat-icon.orders {
    /* background: rgba(37, 99, 235, 0.1); */
    color: var(--color-info);
}

.stat-icon.revenue {
    /* background: rgba(34, 197, 94, 0.1); */
    color: var(--color-success);
}

.stat-icon.pending {
    /* background: rgba(245, 158, 11, 0.1); */
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
</style>
