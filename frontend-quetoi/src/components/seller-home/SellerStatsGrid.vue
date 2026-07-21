<script>
import { mapState } from 'pinia';
import { useDashboardStore } from '@/stores/seller/dashboardStore';
import { BellRing, ChefHat, CheckCircle2, TrendingUp } from 'lucide-vue-next';

const CARD_CONFIGS = [
    { key: 'new',      icon: BellRing,      accent: '#1D6B4A', iconBg: 'rgba(29,107,74,0.12)' },
    { key: 'prep',     icon: ChefHat,       accent: '#2A8A5E', iconBg: 'rgba(42,138,94,0.12)' },
    { key: 'done',     icon: CheckCircle2,  accent: '#0F3D29', iconBg: 'rgba(15,61,41,0.12)' },
    { key: 'sales',    icon: TrendingUp,    accent: '#1D6B4A', iconBg: 'rgba(29,107,74,0.12)', isSales: true },
]

export default {
    name: 'SellerStatsGrid',

    components: { BellRing, ChefHat, CheckCircle2, TrendingUp },

    computed: {
        ...mapState(useDashboardStore, ['orders']),

        stats() {
            const doneOrders = this.orders.filter(o => o.status === 'done')
            const salesTotal = doneOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0)

            const values = [
                this.orders.filter(o => o.status === 'pending').length,
                this.orders.filter(o => o.status === 'confirmed').length,
                doneOrders.length,
                '₩' + new Intl.NumberFormat('ko-KR').format(salesTotal),
            ]
            const labelKeys = [
                'seller_home.stat_label_new',
                'seller_home.stat_label_preparing',
                'seller_home.stat_label_done',
                'seller_home.stat_label_sales',
            ]

            return CARD_CONFIGS.map((cfg, i) => ({
                ...cfg,
                value: values[i],
                label: this.$t(labelKeys[i]),
                nonZero: values[i] !== 0 && values[i] !== '₩0',
            }))
        },
    },
}
</script>

<template>
    <div class="stats-grid">
        <div
            v-for="stat in stats"
            :key="stat.key"
            class="stat-card"
            :style="{
                boxShadow: stat.nonZero
                    ? `0 2px 12px rgba(0,0,0,0.35), inset 0 0 0 1px ${stat.accent}26`
                    : '0 2px 12px rgba(0,0,0,0.35)',
            }"
        >
            <div class="stat-top">
                <div class="stat-icon-wrap" :style="{ background: stat.iconBg }">
                    <component :is="stat.icon" :size="16" :color="stat.accent" />
                </div>
                <span class="stat-label" :style="{color: stat.accent}">{{ stat.label }}</span>
            </div>
            <div class="stat-value" :class="{ 'stat-value--sales': stat.isSales }" :style="stat.isSales ? { color: stat.accent } : {}">
                {{ stat.value }}
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    font-family: $quetoi-font-family-secondary;
}

.stat-card {
    // background-color: var(--accent-dim);
    background-color: var(--bg-surface-2);
    border-radius: 0.75rem;
    border: solid 1px var(--border-color);
    padding: 16px;
    min-height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
}

.stat-top {
    display: flex;
    align-items: center;
    gap: 8px;
}

.stat-icon-wrap {
    width: 32px;
    height: 32px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.stat-label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.3px;
    text-transform: uppercase;
}

.stat-value {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1;
    word-break: break-word;
}

.stat-value--sales { font-size: 18px; }
</style>
