import { defineStore } from "pinia";
import apiSellerDashboard from "@/apis/sellers/apiSellerDashboard";
import apiDeliveries from "@/apis/deliveries/apiDeliveries";

const DELIVERY_TERMINAL = ['COMPLETED', 'CANCELED', 'CANCELLED', 'REJECTED', 'EXPIRED']
const ORDER_TERMINAL = ['done', 'cancelled']

let _pollTimer = null
let _orderPollTimer = null

function _stopPolling() {
    if (_pollTimer) { clearInterval(_pollTimer); _pollTimer = null }
}

function _stopOrderPolling() {
    if (_orderPollTimer) { clearInterval(_orderPollTimer); _orderPollTimer = null }
}

export const useDashboardStore = defineStore("dashboardStore", {
    state() {
        return {
            sellerId: null,
            sellerInfo: null,   // { slug, store_name, address, phone, has_address, has_phone }
            orders: [],
            orderDetails: null,
            orderDelivery: null,
            deliveryStatuses: {}, // { [orderId]: { status, rebook_count } | 'loading' | 'error' }
            isLoading: false,
            hasLoadedOrders: false,
            orderDetailLoading: false,
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
        // Count of orders that actually appear in the "Need Your Action" list
        actionDisplayCount(state) {
            return state.orders.filter(order =>
                ['pending', 'confirmed', 'delivery_failed'].includes(order.status)
            ).length
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

        async fetchSellerInfo() {
            try {
                const res = await apiSellerDashboard.getSellerInfo()
                this.sellerId = res.seller_id
                this.sellerInfo = {
                    slug: res.slug,
                    store_name: res.store_name,
                    address: res.address,
                    phone: res.phone,
                    has_address: res.has_address,
                    has_phone: res.has_phone,
                }
            } catch (e) {
                console.error('dashboardStore - fetchSellerInfo -', e)
            }
        },

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
                this.hasLoadedOrders = true
            }
        },

        async loadOrderDetail(orderId) {
            this.orderDetailLoading = true
            try {
                const res = await apiSellerDashboard.getOrderDetail(orderId)
                this.orderDetails = res.order || null
                if (this.orderDetails?.status === 'ready' && this.orderDetails?.delivery_method === 'delivery') {
                    await this._fetchDelivery(orderId)
                    this._startPolling(orderId)
                }
            } catch (e) {
                console.error('dashboardStore - loadOrderDetail -', e)
            } finally {
                this.orderDetailLoading = false
            }
        },

        async _fetchDelivery(orderId) {
            try {
                const res = await apiDeliveries.getSellerDeliveryStatus(orderId)
                this.orderDelivery = res?.delivery || null
            } catch (e) {
                console.error('dashboardStore - _fetchDelivery -', e)
            }
        },

        async refreshOrderDetailSilent(orderId) {
            try {
                const res = await apiSellerDashboard.getOrderDetail(orderId)
                this.orderDetails = res.order || null
            } catch (e) {
                console.error('dashboardStore - refreshOrderDetailSilent -', e)
            }
        },

        async refreshDeliverySilent(orderId) {
            try {
                const res = await apiDeliveries.getSellerDeliveryStatus(orderId)
                this.orderDelivery = res?.delivery || null
            } catch (e) {
                console.error('dashboardStore - refreshDeliverySilent -', e)
            }
        },

        _startPolling(orderId) {
            _stopPolling()
            _pollTimer = setInterval(async () => {
                if (DELIVERY_TERMINAL.includes(this.orderDelivery?.status)) {
                    _stopPolling()
                    return
                }
                await this._fetchDelivery(orderId)
            }, 10_000)
        },

        clearOrderDetail() {
            _stopPolling()
            this.orderDetails = null
            this.orderDelivery = null
        },

        // Calls API, updates orderDetails + orders list, stops polling if no longer ready
        async setOrderStatus(orderId, newStatus, reason = null) {
            await apiSellerDashboard.updateOrderStatus(orderId, newStatus, reason)
            if (this.orderDetails?.id === orderId) {
                this.orderDetails.status = newStatus
                if (reason) this.orderDetails.cancellation_reason = reason
            }
            this.updateOrderLocally(orderId, newStatus)
            if (newStatus !== 'ready') _stopPolling()
        },

        // Calls rebook API, refreshes delivery state + restarts polling
        async doRebookDelivery(orderId) {
            await apiDeliveries.rebookDelivery(orderId)
            await this._fetchDelivery(orderId)
            this.updateOrderLocally(orderId, 'ready')
            if (this.orderDetails?.id === orderId) this.orderDetails.status = 'ready'
            this._startPolling(orderId)
        },

        async fetchDeliveryStatus(orderId) {
            this.deliveryStatuses = { ...this.deliveryStatuses, [orderId]: 'loading' }
            try {
                const res = await apiDeliveries.getSellerDeliveryStatus(orderId)
                this.deliveryStatuses = { ...this.deliveryStatuses, [orderId]: res.delivery }
            } catch (e) {
                this.deliveryStatuses = { ...this.deliveryStatuses, [orderId]: 'error' }
            }
        },

        setDeliveryStatus(orderId, statusObj) {
            this.deliveryStatuses = { ...this.deliveryStatuses, [orderId]: statusObj }
        },

        updateOrderLocally(orderId, newStatus) {
            const order = this.orders.find(o => o.id === orderId)
            if (order) order.status = newStatus
        },
    }
})
