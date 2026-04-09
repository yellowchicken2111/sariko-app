import { apiClient } from "@/lib/axiosPolicy.js"

export const apiSellerDashboard = {

    getOrders: async () => {
        const response = await apiClient.get('/v1/sellers/me/orders')
        return response.data
    },

    getOrderDetail: async (orderId) => {
        const response = await apiClient.get(`/v1/sellers/me/orders/${orderId}`)
        return response.data
    },

    updateOrderStatus: async (orderId, newStatus) => {
        const response = await apiClient.patch(`/v1/sellers/me/orders/${orderId}/status`, {
            status: newStatus,
        })
        return response.data
    },

}

export default apiSellerDashboard
