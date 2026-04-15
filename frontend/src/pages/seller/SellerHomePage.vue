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
        }
    },

    computed: {
        actionOrders() {
            const store = useDashboardStore()
            return store.orders.filter(o => o.status === 'pending' || o.status === 'confirmed')
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
            <div class="section-title">{{ $t('seller_home.section_needs_action') }}</div>
            <div v-if="isLoading" class="skeleton-list">
                <q-skeleton v-for="n in 2" :key="n" type="rect" height="100px" style="border-radius:16px;" animation="pulse" />
            </div>
            <ActionOrdersList v-else :orders="actionOrders" />
        </template>

    </LayoutSellerHome>
</template>

<style lang="scss" scoped>
.section-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 12px;
    font-family: $sariko-font-family-secondary;
}

.skeleton-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
</style>
