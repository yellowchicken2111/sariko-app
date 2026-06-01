import { apiClient } from "@/lib/axiosPolicy.js"

export const apiSearch = {

    search: async (q) => {
        try {
            const response = await apiClient.get(`/v1/search`, { params: { q } })
            return response
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Failed to search')
        }
    }
}

export default apiSearch
