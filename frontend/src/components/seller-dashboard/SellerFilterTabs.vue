<script>
import { mapState, mapWritableState } from 'pinia';
import { useDashboardStore } from '@/stores/seller/dashboardStore';

export default {
    computed: {
        ...mapState(useDashboardStore, ['orders']),
        ...mapWritableState(useDashboardStore, ['selectedFilter']),

        tabs() {
            const src = this.orders
            return [
                { key: 'all', label: this.$t('seller_dashboard.tab_all'), count: src.length },
                { key: 'new', label: this.$t('seller_dashboard.tab_new'), count: src.filter(o => o.status === 'pending').length },
                { key: 'preparing', label: this.$t('seller_dashboard.tab_preparing'), count: src.filter(o => o.status === 'confirmed').length },
                { key: 'ready', label: this.$t('seller_dashboard.tab_ready'), count: src.filter(o => o.status === 'ready').length },
                { key: 'completed', label: this.$t('seller_dashboard.tab_completed'), count: src.filter(o => o.status === 'done').length },
                { key: 'cancelled', label: this.$t('seller_dashboard.tab_cancelled'), count: src.filter(o => o.status === 'cancelled').length },
            ]
        }
    },

    methods: {
        select(key) {
            this.selectedFilter = key
        }
    }
}
</script>

<template>
    <div class="filter-tabs-scroll">
        <div class="filter-tabs">
            <div
                v-for="tab in tabs"
                :key="tab.key"
                class="tab"
                :class="{ active: selectedFilter === tab.key }"
                @click="select(tab.key)"
            >
                {{ tab.label }}
                <span v-if="tab.count > 0" class="count">{{ tab.count }}</span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.filter-tabs-scroll {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
}

.filter-tabs {
    display: flex;
    gap: 8px;
    padding: 4px 0;
}

.tab {
    flex-shrink: 0;
    padding: 8px 14px;
    border-radius: 100px;
    font-size: 13px;
    font-weight: 600;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background-color: var(--bg-surface);
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 6px;

    &:active {
        transform: scale(0.96);
    }

    &.active {
        background-color: $accent;
        color: #121b2f;
        border-color: $accent;
    }
}

.count {
    font-size: 11px;
    font-weight: 700;
    min-width: 18px;
    height: 18px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.15);
    padding: 0 5px;
}

.tab.active .count {
    background: rgba(0, 0, 0, 0.2);
}
</style>
