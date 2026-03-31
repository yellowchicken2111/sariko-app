import { supabase } from '@/lib/supabase.js'
import { apiClient } from "@/lib/axiosPolicy.js"

export const apiSellers = {

    getSellerbySlugName: async (slugName) => {
        try {
            const response = await apiClient.get(`/v1/sellers/${slugName}`)
            return response
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Failed to getSellerbySlugName')
        }
    },

    getFoundingSellers: async () => {
        try {
            const response = await apiClient.get(`/v1/sellers/founding`)
            return response
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Failed to getFoundingSellers')
        }
    },

    getSellerFullMenu: async (slugName) => {
        try {
            const response = await apiClient.get(`/v1/sellers/${slugName}/menu`)
            return response
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Failed to getSellerFullMenu')
        }
    }
}

export default apiSellers;