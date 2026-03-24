import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", {
    state() {
        return {

            // button group to choose action
            isSignin: true,

            // signin
            inputSignInEmail: null,
            inputSignInPassword: null,

            // signup
            inputSignUpFullName: null,
            inputSignUpEmail: null,
            inputSignUpPassword: null,
            isSelectedSignUpRoleSeller: false
        }
    }
})