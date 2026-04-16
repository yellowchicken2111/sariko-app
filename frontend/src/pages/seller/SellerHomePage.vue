<script>
import { mapActions } from 'pinia';
import { useDashboardStore } from '@/stores/seller/dashboardStore';
import { useAuthStore } from '@/stores/auth/authStore';
import { supabase } from '@/lib/supabase';
import LayoutSellerHome from '@/layouts/seller/LayoutSellerHome.vue';
import SellerGreeting from '@/components/seller-home/SellerGreeting.vue';
import SellerStatsGrid from '@/components/seller-home/SellerStatsGrid.vue';
import ActionOrdersList from '@/components/seller-home/ActionOrdersList.vue';

export default {
    name: 'SellerHomePage',

    components: { LayoutSellerHome, SellerGreeting, SellerStatsGrid, ActionOrdersList },

    data() {
        return {
            channel: null,
            fetchDebounceTimer: null,
            activeFilter: 'all',
        }
    },

    computed: {
        allActionOrders() {
            return useDashboardStore().orders.filter(o => o.status === 'pending' || o.status === 'confirmed')
        },

        filteredActionOrders() {
            if (this.activeFilter === 'pending')   return this.allActionOrders.filter(o => o.status === 'pending')
            if (this.activeFilter === 'confirmed') return this.allActionOrders.filter(o => o.status === 'confirmed')
            return this.allActionOrders
        },

        filterOptions() {
            return [
                { key: 'all',       label: 'All',       count: this.allActionOrders.length },
                { key: 'pending',   label: 'New',       count: this.allActionOrders.filter(o => o.status === 'pending').length },
                { key: 'confirmed', label: 'Preparing', count: this.allActionOrders.filter(o => o.status === 'confirmed').length },
            ]
        },

        activeFilterLabel() {
            return this.filterOptions.find(f => f.key === this.activeFilter)?.label || 'All'
        },

        isLoading() {
            return useDashboardStore().isLoading
        },
    },

    methods: {
        ...mapActions(useDashboardStore, ['fetchOrders']),

        debouncedFetch() {
            if (this.fetchDebounceTimer) return
            this.fetchDebounceTimer = setTimeout(async () => {
                await this.fetchOrders()
                this.fetchDebounceTimer = null
            }, 500)
        },

        listenOrders() {
            const sellerId = useAuthStore().sellerId
            if (!sellerId) return
            this.channel = supabase
                .channel(`seller-home-${sellerId}`)
                .on('postgres_changes', {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders',
                    filter: `seller_id=eq.${sellerId}`
                }, () => this.debouncedFetch())
                .subscribe()
        },

        cleanup() {
            if (this.channel) supabase.removeChannel(this.channel)
            if (this.fetchDebounceTimer) clearTimeout(this.fetchDebounceTimer)
        },
    },

    async mounted() {
        await this.fetchOrders()
        this.listenOrders()
    },

    beforeUnmount() {
        this.cleanup()
    },
}
</script>

<template>
    <LayoutSellerHome>

        <template #Header>
            <SellerGreeting />
        </template>

        <template #Stats>
            <SellerStatsGrid />
        </template>

        <template #ActionOrders>
            <div class="section-header">
                <div class="section-title">
                    {{ $t('seller_home.section_needs_action') }}
                    <span v-if="allActionOrders.length > 0" class="count-badge">{{ allActionOrders.length }}</span>
                </div>
                <q-btn-dropdown
                    flat dense no-caps
                    class="filter-dropdown"
                    :label="activeFilterLabel"
                    dropdown-icon="expand_more"
                >
                    <q-list class="dropdown-list">
                        <q-item
                            v-for="opt in filterOptions"
                            :key="opt.key"
                            clickable v-close-popup
                            :active="activeFilter === opt.key"
                            active-class="dropdown-active"
                            @click="activeFilter = opt.key"
                        >
                            <q-item-section>{{ opt.label }}</q-item-section>
                            <q-item-section side>
                                <q-badge :label="opt.count" color="grey-8" text-color="white" />
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-btn-dropdown>
            </div>

            <div v-if="isLoading" class="skeleton-list">
                <q-skeleton v-for="n in 2" :key="n" type="rect" height="160px" style="border-radius:16px;" animation="pulse" />
            </div>
            <ActionOrdersList v-else :orders="filteredActionOrders" />
        </template>

    </LayoutSellerHome>
</template>

<style lang="scss" scoped>
.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    padding-top: 4px;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 700;
    color: var(--text-primary);
    font-family: $sariko-font-family-secondary;
}

.count-badge {
    font-size: 12px;
    font-weight: 700;
    background: var(--color-accent);
    color: #121b2f;
    border-radius: 10px;
    padding: 1px 7px;
    line-height: 1.6;
}

.filter-dropdown {
    color: var(--text-secondary);
    font-size: 13px;
    font-weight: 600;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    padding: 2px 8px;
}

.dropdown-list {
    background: #1f2940;
    min-width: 160px;
}

.dropdown-active {
    color: var(--color-accent);
}

.skeleton-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
</style>
