import { apiClient } from "@/lib/axiosPolicy.js"

export const apiUsers = {

    updateProfile: async (data) => {
        const response = await apiClient.patch('/v1/users/me/profile', data)
        return response.data
    },

}

export default apiUsers
