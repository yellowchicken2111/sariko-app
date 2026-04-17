<script>
import { mapState } from 'pinia';
import { supabase } from '@/lib/supabase';
import { useOrderStore } from '@/stores/order/orderStore';
import { useAuthStore } from '@/stores/auth/authStore';
import OrderCard from '@/components/order-history/OrderCard.vue';

const STATUS_DISPLAY = {
    pending: 'Waiting for seller',
    confirmed: 'Seller is preparing your order',
    ready: 'Your order is on the way',
    done: 'Delivered',
    cancelled: 'Cancelled by seller',
}

export default {
    components: {
        OrderCard
    },

    data() {
        return {
            channel: null,
            fetchDebounceTimer: null,
        }
    },

    computed: {
        ...mapState(useOrderStore, ['orders', 'selectedFilter', 'loading']),
        ...mapState(useAuthStore, { authUser: 'user' }),

        filteredOrders() {
            if (this.selectedFilter === 'all') return this.orders
            if (this.selectedFilter === 'unpaid') {
                return this.orders.filter(o => o.payment_status === 'pending' && o.status !== 'cancelled')
            }
            if (this.selectedFilter === 'active') {
                return this.orders.filter(o => o.payment_status === 'paid' && ['pending', 'confirmed', 'ready'].includes(o.status))
            }
            if (this.selectedFilter === 'completed') {
                return this.orders.filter(o => o.status === 'done')
            }
            if (this.selectedFilter === 'cancelled') {
                return this.orders.filter(o => o.status === 'cancelled')
            }
            return this.orders
        }
    },

    methods: {
        debouncedFetchOrders() {
            if (this.fetchDebounceTimer) return
            this.fetchDebounceTimer = setTimeout(async () => {
                await useOrderStore().getOrders()
                this.fetchDebounceTimer = null
            }, 500)
        },

        notifyStatusChange(newStatus, oldStatus) {
            if (newStatus === oldStatus) return
            const message = STATUS_DISPLAY[newStatus]
            if (!message) return

            const isCancelled = newStatus === 'cancelled'
            this.$q.notify({
                classes: isCancelled ? 'quasar-notify-negative' : 'quasar-notify-positive',
                message: `🔔 ${message}`,
                progress: true,
                position: 'bottom',
                timeout: 2500,
            })
        },

        listenOrders() {
            const userId = this.authUser?.id || useAuthStore().session?.user?.id
            if (!userId) return
            
            const channelName = `buyer-orders-${userId}-${Math.random().toString(36).slice(2, 8)}`
            this.channel = supabase
                .channel(channelName)
                .on('postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'orders',
                        filter: `user_id=eq.${userId}`
                    },
                    (payload) => {
                        console.log('[buyer realtime]', payload)
                        const newStatus = payload.new?.status
                        const oldStatus = payload.old?.status
                        this.notifyStatusChange(newStatus, oldStatus)
                        this.debouncedFetchOrders()
                    }
                )
                .subscribe((status, err) => {
                    console.log(`Realtime channel ${channelName} status: `, status)
                    if (err) console.log(`Realtime channel ${channelName} error: `, err)
                })
        },

        cleanup() {
            if (this.channel) supabase.removeChannel(this.channel)
            if (this.fetchDebounceTimer) {
                clearTimeout(this.fetchDebounceTimer)
                this.fetchDebounceTimer = null
            }
        },
    },

    mounted() {
        const orderStore = useOrderStore()
        orderStore.getOrders()
        this.listenOrders()
    },

    beforeUnmount() {
        this.cleanup()
    }
}
</script>

<template>
    <div class="orders-list">

        <!-- Skeleton -->
        <template v-if="loading">
            <div v-for="n in 3" :key="n" class="skeleton-card">
                <div class="sk-top">
                    <q-skeleton type="rect" width="42px" height="42px" style="border-radius:12px;" animation="pulse" />
                    <div class="sk-info">
                        <q-skeleton type="text" width="120px" height="15px" animation="pulse" />
                        <q-skeleton type="text" width="80px" height="12px" animation="pulse" style="margin-top:6px;" />
                    </div>
                    <q-skeleton type="rect" width="72px" height="24px" style="border-radius:100px;" animation="pulse" />
                </div>
                <div class="sk-divider" />
                <div class="sk-bottom">
                    <q-skeleton type="text" width="100px" height="16px" animation="pulse" />
                    <q-skeleton type="text" width="70px" height="14px" animation="pulse" />
                </div>
            </div>
        </template>

        <!-- Empty state -->
        <div v-else-if="filteredOrders.length === 0" class="empty-state">
            <div class="empty-icon">🛍️</div>
            <div class="empty-title">{{ $t('orders_page.empty_title') }}</div>
            <div class="empty-subtitle">{{ $t('orders_page.empty_subtitle') }}</div>
        </div>

        <!-- List -->
        <template v-else>
            <OrderCard
                v-for="order in filteredOrders"
                :key="order.id"
                :order="order"
            />
        </template>

    </div>
</template>

<style lang="scss" scoped>
.orders-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 12px;
}

/* Skeleton card mirrors OrderCard layout */
.skeleton-card {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 1rem;
    padding: 16px;
}

.sk-top {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
}

.sk-info {
    flex: 1;
}

.sk-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.06);
    margin: 0 -16px;
}

.sk-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
}

/* Empty state */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 20px;
    gap: 10px;
}

.empty-icon {
    font-size: 48px;
    margin-bottom: 4px;
}

.empty-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-primary);
}

.empty-subtitle {
    font-size: 13px;
    color: var(--text-muted);
    text-align: center;
}
</style>
