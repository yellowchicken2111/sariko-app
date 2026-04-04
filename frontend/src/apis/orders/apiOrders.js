import { apiClient } from "@/lib/axiosPolicy.js"

export const apiOrders = {

    createOrder: async(deliveryMethod, deliveryAddress, note) => {
        try {
            const payload = {
                "delivery_method": deliveryMethod,
                "delivery_address": deliveryAddress,
                "note": note
            }
            const response = await apiClient.post('/v1/orders', payload)
            return response
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Failed to create order')
        }
    },

    getOrders: async() => {
        try {
            const response = await apiClient.get('/v1/orders')
            return response
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Failed to get orders')
        }
    },

    getOrderDetail: async(orderId) => {
        try {
            const response = await apiClient.get(`/v1/orders/${orderId}`)
            return response
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Failed to get order detail')
        }
    },

    cancelOrder: async(orderId) => {
        try {
            const response = await apiClient.patch(`/v1/orders/${orderId}/cancel`)
            return response
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Failed to cancel order')
        }
    }
}

export default apiOrders
