import { apiClient } from "@/lib/axiosPolicy.js"

export const apiChat = {

    createConversation: async (sellerSlug) => {
        try {
            const response = await apiClient.post('/v1/chat/conversations', { seller_slug: sellerSlug })
            return response
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Failed to create conversation')
        }
    },

    getConversations: async (asSeller = false) => {
        try {
            const response = await apiClient.get('/v1/chat/conversations', { params: { as_seller: asSeller } })
            return response
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Failed to get conversations')
        }
    },

    markRead: async (conversationId) => {
        try {
            const response = await apiClient.patch(`/v1/chat/conversations/${conversationId}/read`)
            return response
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Failed to mark conversation read')
        }
    },

    setPinned: async (conversationId, pinned) => {
        try {
            const response = await apiClient.patch(`/v1/chat/conversations/${conversationId}/pin`, { pinned })
            return response
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Failed to pin conversation')
        }
    },

    deleteConversation: async (conversationId) => {
        try {
            const response = await apiClient.delete(`/v1/chat/conversations/${conversationId}`)
            return response
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Failed to delete conversation')
        }
    },
}

export default apiChat
