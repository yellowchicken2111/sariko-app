import { defineStore } from "pinia";
import { router } from "@/plugins/router";
import { Notify } from "quasar";
import { supabase } from "@/lib/supabase";
import apiAuth from "@/apis/auth/apiAuth";
import { useCartStore } from "@/stores/cart/cartStore";

export const useAuthStore = defineStore("authStore", {
    state() {
        return {
            // signin
            inputSignInEmail: 'jack@sariko.store',
            inputSignInPassword: '123456',

            // signup
            inputSignUpFullName: 'Philippine BBQ Drinks',
            inputSignUpEmail: 'seller.philippinebbqdrinks@sariko.store',
            inputSignUpPassword: 'Dz9117&l51',
            isSelectedSignUpRoleSeller: true,

            // errors state
            errors: {
                inputSignInEmail: null,
                inputSignInPassword: null,
                inputSignUpFullName: null,
                inputSignUpEmail: null,
                inputSignUpPassword: null
            },

            // onborading user
            inputPhoneNumber: null,
            inputAddress: null,
            inputAddressDetails: null,
            inputLat: null,
            inputLon: null,
            selectedPreferedLanguage: 'English',

            // user & session
            session: null,
            user: null,
            isLoading: false,

            // auth subscription
            _authSub: null,
        }
    },

    actions: {

        _setFromSession(session) {
            this.session = session;
            if (session?.user) {
                const meta = session.user.user_metadata || {};
                this.user = {
                    fullName: meta.fullname || '',
                    email: session.user.email,
                    isSeller: meta.is_seller || false,
                };
            } else {
                this.session = null;
                this.user = null;
            }
        },

        async bootstrap() {
            if (this._authSub) return;
            try {
                const res = await apiAuth.authGetSession();
                if (res?.session) {
                    this._setFromSession(res.session);

                    try {
                        const cartStore = useCartStore();
                        await cartStore.getCurrentCart();
                    } catch (e) {
                        console.error(`authStore - bootstrap - cart preload failed: ${e}`);
                    }
                }

                const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                    this._setFromSession(session);
                });
                this._authSub = subscription;
            } catch (e) {
                console.error(`authStore - bootstrap - ${e}`);
            }
        },

        async getValidAccessToken() {
            const res = await apiAuth.authGetSession();
            if (!res?.session) return null;

            const now = Math.floor(Date.now() / 1000);
            const exp = res.session.expires_at ?? 0;

            if (exp - now < 30) {
                const { data, error } = await supabase.auth.refreshSession();
                if (error) throw error;
                this._setFromSession(data.session);
                return data.session?.access_token ?? null;
            }
            return res.session.access_token;
        },

        // validation
        validateField(field) {
            switch (field) {
                case "inputSignInEmail":
                case "inputSignUpEmail": {
                    const value = this[field]?.trim();
                    this.errors[field] = !value
                        ? "Email is required."
                        : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                        ? null
                        : "Invalid email format.";
                    break;
                }
                case "inputSignInPassword":
                case "inputSignUpPassword": {
                    const value = this[field];
                    this.errors[field] = !value
                        ? "Password is required."
                        : value.length < 6
                        ? "Password must be at least 6 characters."
                        : null;
                    break;
                }
                case "inputSignUpFullName":
                    this.errors.inputSignUpFullName = !this.inputSignUpFullName?.trim()
                        ? "Full name is required."
                        : null;
                    break;
            }
        },

        validateAllFields(mode = "signin") {
            if (mode === "signin") {
                this.validateField("inputSignInEmail");
                this.validateField("inputSignInPassword");
            } else {
                this.validateField("inputSignUpEmail");
                this.validateField("inputSignUpPassword");
                this.validateField("inputSignUpFullName");
            }
            return !Object.values(this.errors).some((e) => !!e);
        },

        // auth actions
        async onClickedSignin() {
            const isValid = this.validateAllFields("signin");
            if (!isValid) return;

            this.isLoading = true;
            try {
                const res = await apiAuth.authSignin(
                    this.inputSignInEmail,
                    this.inputSignInPassword
                );
                if (!res?.session || !res?.user) throw new Error("No user data");

                this._setFromSession(res.session);

                try {
                    const cartStore = useCartStore();
                    await cartStore.getCurrentCart();
                } catch (e) {
                    console.error(`authStore - onClickedSignin - cart preload failed: ${e}`);
                }

                Notify.create({
                    classes: 'quasar-notify-positive',
                    message: "👋 Welcome to Sariko",
                    progress: true,
                    position: "bottom",
                });
                router.push('/home');

            } catch (error) {
                console.error(`authStore - onClickedSignin - ${error}`);
                let errorMessage = null;
                if (error?.code === "invalid_credentials") {
                    errorMessage = "Incorrect email or password. Please try again.";
                }
                Notify.create({
                    classes: 'quasar-notify-negative',
                    message: errorMessage || "An unexpected error has occurred. Please try again.",
                    progress: true,
                    icon: 'fa-regular fa-circle-xmark',
                    position: "bottom",
                });
            } finally {
                this.isLoading = false;
            }
        },

        async onClickedSignup() {
            const isValid = this.validateAllFields("signup");
            if (!isValid) return;

            this.isLoading = true;
            try {
                const res = await apiAuth.authSignup(
                    this.inputSignUpEmail,
                    this.inputSignUpPassword,
                    this.inputSignUpFullName,
                    this.isSelectedSignUpRoleSeller,
                );
                if (res?.session && res?.user) {
                    Notify.create({
                        classes: 'quasar-notify-positive',
                        message: "Account created successfully. You can now sign in.",
                        progress: true,
                        icon: 'fa-regular fa-circle-check',
                        position: "bottom",
                    });
                    router.push({ name: "signin" });
                }
            } catch (error) {
                console.error(`authStore - onClickedSignup - ${error}`);
                let errorMessage = null;
                if (error?.code === "user_already_exists") {
                    errorMessage = "An account with this email already exists. Please sign in or use a different email.";
                }
                Notify.create({
                    classes: 'quasar-notify-negative',
                    message: errorMessage || "An unexpected error has occurred. Please try again.",
                    progress: true,
                    icon: 'fa-regular fa-circle-xmark',
                    position: "bottom",
                });
            } finally {
                this.isLoading = false;
            }
        },

        async onClickedSignout() {
            try {
                await apiAuth.authSignout();
                this.session = null;
                this.user = null;
                Notify.create({
                    classes: 'quasar-notify-positive',
                    message: "Signed out successfully.",
                    progress: true,
                    icon: 'fa-regular fa-circle-check',
                    position: "bottom",
                });
                router.push('/home');
            } catch (error) {
                console.error(`authStore - onClickedSignout - ${error}`);
            }
        },

        async signOutRedirectSignIn() {
            try {
                await apiAuth.authSignout();
                this.session = null;
                this.user = null;
                Notify.create({
                    classes: 'quasar-notify-negative',
                    message: "Session expired. Please log in again.",
                    progress: true,
                    icon: 'fa-regular fa-circle-xmark',
                    position: "bottom",
                });
                router.push("/signin");
            } catch (error) {
                console.error(`authStore - signOutRedirectSignIn - ${error}`);
            }
        },
    }
})