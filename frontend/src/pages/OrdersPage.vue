<template>
    <div class="orders-page">
        <!-- Header -->
        <header class="header">
            <h1 class="page-title">Your Orders</h1>
        </header>

        <!-- Orders List -->
        <div class="orders-content" v-if="orders.length > 0">
            <div class="orders-list">
                <OrderCard v-for="order in orders" :key="order.id" :order="order" />
            </div>
        </div>

        <!-- Empty State -->
        <div class="empty-state" v-else>
            <div class="empty-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
            </div>
            <h2 class="empty-title">No orders yet</h2>
            <p class="empty-description">Start ordering delicious food from our community sellers!</p>
            <button class="browse-btn" @click="goHome">Start Ordering</button>
        </div>
    </div>
</template>

<script>
import OrderCard from '../components/OrderCard.vue'
import { orders } from '../stores/data'

export default {
    name: 'OrdersPage',
    components: {
        OrderCard
    },
    data() {
        return {
            orders: orders
        }
    },
    methods: {
        goHome() {
            this.$router.push('/')
        }
    }
}
</script>

<style lang="scss" scoped>
.orders-page {
    min-height: 100vh;
    background: var(--bg-main);
    padding: 16px;
    padding-top: calc(16px + env(safe-area-inset-top, 0));
    font-family: $sariko-font-family-secondary;
}

.header {
    margin-bottom: 24px;
}

.page-title {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
}

.orders-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;
}

.empty-icon {
    color: var(--border-color);
    margin-bottom: 20px;
}

.empty-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 8px;
}

.empty-description {
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 24px;
}

.browse-btn {
    background: var(--color-primary);
    color: #ffffff;
    border: none;
    padding: 14px 28px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;
    min-height: 48px;
}

.browse-btn:hover {
    background: var(--color-primary-dark);
}
</style>
