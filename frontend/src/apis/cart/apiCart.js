import { supabase } from '@/lib/supabase.js'
import { apiClient } from "@/lib/axiosPolicy.js"

export const apiCarts = {

    getCart: async() => {
        try {
            const response = await apiClient.get('/v1/cart')
            return response
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Failed to getCart')
        }
    }

}

export default apiCarts;