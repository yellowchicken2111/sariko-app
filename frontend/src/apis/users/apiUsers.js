import { apiClient } from "@/lib/axiosPolicy.js"

export const apiUsers = {

    getProfile: async () => {
        const response = await apiClient.get('/v1/users/info/me')
        return response.data
    },

    updateProfile: async (data) => {
        const response = await apiClient.patch('/v1/users/me/profile', data)
        return response.data
    },

    getDefaultAddress: async () => {
        const response = await apiClient.get('/v1/users/me/address')
        return response.data
    },

}

export default apiUsers
