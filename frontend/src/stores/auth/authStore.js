import { defineStore } from "pinia";
import { router } from "@/plugins/router";
import { Notify } from "quasar";
import { supabase } from "@/lib/supabase";
import apiAuth from "@/apis/auth/apiAuth";
import apiUsers from "@/apis/users/apiUsers";
import { useCartStore } from "@/stores/cart/cartStore";
import { useOrderStore } from "@/stores/order/orderStore";

export const useAuthStore = defineStore("authStore", {
    state() {
        return {
            // signin
            inputSignInEmail: '',
            inputSignInPassword: '',

            // signup
            inputSignUpFullName: '',
            inputSignUpEmail: '',
            inputSignUpPassword: '',
            isSelectedSignUpRoleSeller: false,

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
            viewMode: 'buyer', // 'buyer' | 'seller',
            sellerId: null,

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
                    id: session.user.id,
                    fullName: meta.fullname || '',
                    email: session.user.email,
                    phone: null,
                    isSeller: meta.is_seller || false,
                    avatarUrl: null,
                    sellerId: null
                };
                if (this.viewMode === 'buyer' && meta.is_seller) {
                    this.viewMode = 'seller'
                }
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
                        const profile = await apiUsers.getProfile()
                        if (profile?.user && this.user) {
                            if (profile.user.avatar_url) this.user.avatarUrl = profile.user.avatar_url
                            if (profile.user.name) this.user.fullName = profile.user.name
                            if (profile.user.phone) this.user.phone = profile.user.phone
                            if (profile.user.seller_id) this.sellerId = profile.user.seller_id
                        }
                    } catch (e) {
                        console.error(`authStore - bootstrap - profile fetch failed: ${e}`);
                    }

                    try {
                        const addrRes = await apiUsers.getDefaultAddress()
                        if (addrRes?.address) {
                            this.inputAddress = addrRes.address.address || null
                            this.inputAddressDetails = addrRes.address.label || null
                            this.inputLat = addrRes.address.lat || null
                            this.inputLon = addrRes.address.lon || null
                        }
                    } catch (e) {
                        console.error(`authStore - bootstrap - address fetch failed: ${e}`);
                    }

                    try {
                        const cartStore = useCartStore();
                        await cartStore.getCurrentCart();
                    } catch (e) {
                        console.error(`authStore - bootstrap - cart preload failed: ${e}`);
                    }

                    try {
                        const orderStore = useOrderStore();
                        await orderStore.getOrders();
                    } catch (e) {
                        console.error(`authStore - bootstrap - orders preload failed: ${e}`);
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

                try {
                    const orderStore = useOrderStore();
                    await orderStore.getOrders();
                } catch (e) {
                    console.error(`authStore - onClickedSignin - orders preload failed: ${e}`);
                }

                Notify.create({
                    classes: 'quasar-notify-positive',
                    message: "👋 Welcome to Sariko",
                    progress: true,
                    position: "bottom",
                });
                const redirect = router.currentRoute.value.query.redirect || '/home';
                router.push(redirect);

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
                    this._setFromSession(res.session);
                    Notify.create({
                        classes: 'quasar-notify-positive',
                        message: "Welcome to Sariko! Let's set up your profile.",
                        progress: true,
                        icon: 'fa-regular fa-circle-check',
                        position: "bottom",
                    });
                    router.push({ name: "onboarding" });
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
                useCartStore().$reset();
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

        switchViewMode() {
            this.viewMode = this.viewMode === 'buyer' ? 'seller' : 'buyer'
        },

        async signOutRedirectSignIn() {
            try {
                await apiAuth.authSignout();
                this.session = null;
                this.user = null;
                useCartStore().$reset();
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