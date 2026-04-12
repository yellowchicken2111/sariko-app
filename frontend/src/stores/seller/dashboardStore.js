import { defineStore } from "pinia";
import apiSellerDashboard from "@/apis/sellers/apiSellerDashboard";

export const useDashboardStore = defineStore("dashboardStore", {
    state() {
        return {
            orders: [],
            isLoading: false,
            selectedFilter: 'new',
        }
    },

    getters: {
        totalOrders(state) {
            return state.orders.length
        },
        revenue(state) {
            const value = state.orders
                .filter(o => o.status !== 'cancelled')
                .reduce((sum, o) => sum + (o.total_amount || 0), 0)
            if (!value) return '—'
            return new Intl.NumberFormat('vi-VN').format(value) + ' ₫'

        },
        pendingOrders(state) {
            return state.orders.filter(o => o.status === 'pending').length
        },
        recentOrders(state) {
            return state.orders.slice(0, 20)
        },
        filteredOrders(state) {
            const filter = state.selectedFilter
            if (filter === 'all') return state.orders
            if (filter === 'new') return state.orders.filter(o => o.status === 'pending')
            if (filter === 'preparing') return state.orders.filter(o => o.status === 'confirmed')
            if (filter === 'ready') return state.orders.filter(o => o.status === 'ready')
            if (filter === 'completed') return state.orders.filter(o => o.status === 'done')
            if (filter === 'cancelled') return state.orders.filter(o => o.status === 'cancelled')
            return state.orders
        },
    },

    actions: {
        async fetchOrders() {
            if (this.isLoading) return
            this.isLoading = true
            try {
                const res = await apiSellerDashboard.getOrders()
                this.orders = res.orders || []
            } catch (e) {
                console.error('dashboardStore - fetchOrders -', e)
            } finally {
                this.isLoading = false
            }
        },

        updateOrderLocally(orderId, newStatus) {
            const order = this.orders.find(o => o.id === orderId)
            if (order) order.status = newStatus
        },
    }
})
