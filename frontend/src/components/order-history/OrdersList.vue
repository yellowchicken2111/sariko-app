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
        ...mapState(useOrderStore, ['orders', 'selectedFilter']),
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
        <OrderCard
            v-for="order in filteredOrders"
            :key="order.id"
            :order="order"
        />
    </div>
</template>

<style lang="scss" scoped>
.orders-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 12px;
}
</style>
