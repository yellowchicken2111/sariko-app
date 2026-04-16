<script>
import { mapState } from 'pinia';
import { useDashboardStore } from '@/stores/seller/dashboardStore';

export default {
    name: 'SellerStatsGrid',

    computed: {
        ...mapState(useDashboardStore, ['orders']),

        stats() {
            const today = new Date().toDateString()
            const todayOrders = this.orders.filter(o => new Date(o.created_at).toDateString() === today)
            const salesTotal = todayOrders
                .filter(o => o.status === 'done')
                .reduce((sum, o) => sum + (o.total_amount || 0), 0)
            return [
                { icon: '🔔', value: this.orders.filter(o => o.status === 'pending').length,   label: this.$t('seller_home.stat_label_new') },
                { icon: '🍳', value: this.orders.filter(o => o.status === 'confirmed').length, label: this.$t('seller_home.stat_label_preparing') },
                { icon: '✅', value: todayOrders.filter(o => o.status === 'done').length,      label: this.$t('seller_home.stat_label_done') },
                { icon: '💰', value: new Intl.NumberFormat('vi-VN').format(salesTotal) + ' ₫', label: this.$t('seller_home.stat_label_sales'), isSales: true },
            ]
        },
    },
}
</script>

<template>
    <div class="stats-grid">
        <div v-for="stat in stats" :key="stat.label" class="stat-card">
            <div class="stat-icon">{{ stat.icon }}</div>
            <div class="stat-value" :class="{ 'stat-value--sales': stat.isSales }">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.stat-card {
    background: rgba(255, 255, 255, 0.07);
    border-radius: 16px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.stat-icon { font-size: 20px; }

.stat-value {
    font-size: 22px;
    font-weight: 700;
    color: var(--text-primary);
}

.stat-value--sales { font-size: 16px; }

.stat-label {
    font-size: 12px;
    color: var(--text-muted);
}
</style>
