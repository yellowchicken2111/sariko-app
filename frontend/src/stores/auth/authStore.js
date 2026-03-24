import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", {
    state() {
        return {
            isSignin: true
        }
    }
})