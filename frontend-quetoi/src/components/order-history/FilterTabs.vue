<script>
import { mapState, mapWritableState } from 'pinia';
import { useOrderStore } from '@/stores/order/orderStore';

export default {
    computed: {
        ...mapState(useOrderStore, ['orders']),
        ...mapWritableState(useOrderStore, ['selectedFilter']),

        tabs() {
            const source = this.orders
            const all = source.length
            const unpaid = source.filter(o => o.payment_status === 'pending' && o.status === 'pending').length
            const active = source.filter(o => ['pending', 'confirmed', 'ready'].includes(o.status) && !(o.payment_status === 'pending' && o.status === 'pending')).length
            const completed = source.filter(o => o.status === 'done').length
            const cancelled = source.filter(o => o.status === 'cancelled').length

            return [
                { key: 'all', label: this.$t('orders_page.tab_all'), count: all },
                { key: 'unpaid', label: this.$t('orders_page.tab_unpaid'), count: unpaid },
                { key: 'active', label: this.$t('orders_page.tab_active'), count: active },
                { key: 'completed', label: this.$t('orders_page.tab_completed'), count: completed },
                { key: 'cancelled', label: this.$t('orders_page.tab_cancelled'), count: cancelled },
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
    <div class="filter-tabs">
        <div
            v-for="tab in tabs"
            :key="tab.key"
            class="tab"
            :class="{ active: selectedFilter === tab.key }"
            @click="select(tab.key)"
        >
            {{ tab.label }} <span class="count">({{ tab.count }})</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.filter-tabs {
    display: flex;
    gap: 8px;
    padding: 10px 0;
}

.tab {
    flex-shrink: 0;
    padding: 8px 18px;
    border-radius: 100px;
    font-size: 13px;
    font-weight: 600;
    border: 1px solid var(--border-color);
    background-color: var(--bg-surface);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;

    &:active {
        transform: scale(0.96);
    }

    &.active {
        background-color: var(--color-primary);
        color: var(--text-on-shell);
        border-color: var(--color-primary);
        box-shadow: 0 2px 12px rgba(29, 107, 74, 0.25);
    }
}

.count {
    font-size: 11px;
    opacity: 0.7;
}

.tab.active .count {
    opacity: 0.8;
}
</style>
