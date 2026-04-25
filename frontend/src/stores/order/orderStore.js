import { defineStore } from "pinia";
import apiOrders from "@/apis/orders/apiOrders";

export const useOrderStore = defineStore("orderStore", {
    state() {
        return {
            orders: [],
            currentOrder: null,
            loading: false,
            selectedFilter: 'all',
        }
    },

    getters: {
        unpaidCount(state) {
            return state.orders.filter(
                o => o.payment_status === 'pending' && o.status !== 'cancelled'
            ).length
        }
    },

    actions: {
        async placeOrder(deliveryMethod, deliveryAddress, note, deliveryOpts = {}, deliveryAppointment = null) {
            try {
                this.loading = true
                const res = await apiOrders.createOrder(deliveryMethod, deliveryAddress, note, deliveryOpts, deliveryAppointment)
                if (res?.data?.success) {
                    this.currentOrder = res.data.order
                    return res.data.order
                }
                return null
            } catch (e) {
                console.error(`orderStore - placeOrder - ${e}`)
                throw e
            } finally {
                this.loading = false
            }
        },

        async getOrders() {
            try {
                this.loading = true
                const res = await apiOrders.getOrders()
                if (res?.data?.success) {
                    this.orders = res.data.orders
                }
            } catch (e) {
                console.error(`orderStore - getOrders - ${e}`)
            } finally {
                this.loading = false
            }
        },

        async getOrderDetail(orderId) {
            try {
                this.loading = true
                const res = await apiOrders.getOrderDetail(orderId)
                if (res?.data?.success) {
                    this.currentOrder = res.data.order
                }
            } catch (e) {
                console.error(`orderStore - getOrderDetail - ${e}`)
            } finally {
                this.loading = false
            }
        },

        async cancelOrder(orderId) {
            try {
                const res = await apiOrders.cancelOrder(orderId)
                if (res?.data?.success) {
                    if (this.currentOrder?.id === orderId) {
                        this.currentOrder.status = 'cancelled'
                    }
                    const idx = this.orders.findIndex(o => o.id === orderId)
                    if (idx !== -1) this.orders[idx].status = 'cancelled'
                }
            } catch (e) {
                console.error(`orderStore - cancelOrder - ${e}`)
                throw e
            }
        }
    }
})
