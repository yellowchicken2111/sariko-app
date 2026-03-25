import { defineStore } from "pinia";
import { router } from "@/plugins/router";
import { Notify } from "quasar";
import { supabase } from "@/lib/supabase";
import apiAuth from "@/apis/auth/apiAuth";

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
            isSelectedSignUpRoleSeller: false,

            // errors state
            errors: {
                inputSignInEmail: null,
                inputSignInPassword: null,
                inputSignUpFullName: null,
                inputSignUpEmail: null,
                inputSignUpPassword: null
            },

            // user object
            session: null,
            user: null,

            //
            _authSub: null,
        }
    },

    actions: {

        _setFromSession(session) {
            this.session = session;
            if (session?.user) {
                const meta = session.user.user_metadata || {};
                this.user = {
                    avatar: `${meta.first_name?.[0]?.toUpperCase() ?? ""}${
                        meta.last_name?.[0]?.toUpperCase() ?? ""
                    }`,
                    firstName: meta.first_name,
                    lastName: meta.last_name,
                    fullName:
                        meta.full_name ||
                        `${meta.first_name || ""} ${
                            meta.last_name || ""
                        }`.trim(),
                    email: session.user.email,
                };
            } else {
                this.user = null;
            }
        },

        async bootstrap() {
            if (this._authSub) return
            try {
                const res = await apiAuth.authGetSession()

                if (!res.session) return null;

                const session = res.session
                this._setFromSession(session);

                const {
                    data: { subscription },
                } = supabase.auth.onAuthStateChange((_event, session) => {
                    this._setFromSession(session);
                });

                this._authSub = subscription;   

            } catch (e) {
                console.error(`Store use-auth-store Error - bootstrap - ${error}`);
            }
        },

        async getValidAccessToken() {
            const res = await apiAuth.authGetSession();

            if (!(res.session)) return null;

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

        async init() {
            try {
                const res = await apiAuth.authGetSession();
                if (res && res.session) {
                    const userMeta = res.session.user.user_metadata;
                    this.session = res.session;
                    this.user = {
                        avatar: `${userMeta.first_name[0]?.toUpperCase() ?? ""}${userMeta.last_name[0]?.toUpperCase() ?? ""}`,
                        firstName: userMeta.first_name,
                        lastName: userMeta.last_name,
                        fullName: userMeta.full_name || `${userMeta.first_name} ${userMeta.last_name}`,
                        email: res.session.user.email,
                    };
                }
            } catch (error) {
                console.error(`Store use-auth-store Error - init - ${error}`);
            }
        },

        validateField(field) {
            switch (field) {
                case "inputSignInEmail":
                    const inputSignInEmail = this.inputSignInEmail?.trim();
                    this.errors.inputSignInEmail = !inputSignInEmail
                        ? "Email is required."
                        : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputSignInEmail)
                        ? null
                        : "Invalid email format.";
                    break;

                case "inputSignInPassword":
                    const inputSignInPassword = this.inputSignInPassword;
                    this.errors.inputSignInPassword = !inputSignInPassword
                        ? "Password is required."
                        : inputSignInPassword.length < 6
                        ? "Password must be at least 6 characters."
                        : null;
                    break;

                
                case "inputSignUpEmail":
                    const inputSignUpEmail = this.inputSignUpEmail.trim();
                    this.errors.inputSignUpEmail = !inputSignUpEmail
                        ? "Email is required."
                        : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputSignUpEmail)
                        ? null
                        : "Invalid email format.";
                    break;

                case "inputSignUpPassword":
                    const inputSignUpPassword = this.inputSignUpPassword;
                    this.errors.inputSignUpPassword = !inputSignUpPassword
                        ? "Password is required."
                        : inputSignUpPassword.length < 6
                        ? "Password must be at least 6 characters."
                        : null;
                    break;

                case "inputSignUpFullName":
                    this.errors.inputSignUpFullName = !this.inputSignUpFullName
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
            
            const hasError = Object.values(this.errors).some((e) => !!e);
            return !hasError;
        },

        async onClickedSignin() {
            const isValid = this.validateAllFields("signin");
            if (!isValid) return;

            this.isLoading = true;
            try {
                const res = await apiAuth.authSignin(
                    this.inputSignInEmail,
                    this.inputSignInPassword
                );
                if (res?.session && res?.user) {
                    const { session, user } = res;
                    const meta = user.user_metadata || {};
                    this.session = res.session;
                    this.user = {
                        avatar: '',
                        fullName: meta.full_name,
                        email: user.email,
                    };
                    router.push('/home');
                } else {
                    this.user = null;
                    this.session = null;
                    throw new Error("No user data");
                }

            } catch (error) {
                console.error(
                    `Store use-auth-store Error - onClickedSignin - ${error}`
                );
                let errorMessage = null;
                if (error?.code == "validation_failed") {    
                    errorMessage = "An account with this email already exists. Please sign in or use a different email.";
                } else if (error.code == "invalid_credentials") {
                    errorMessage = "Incorrect email or password. Please try again.";
                }

                Notify.create({
                    type: "negative",
                    message:
                        errorMessage || "An unexpected error has occured. Please try again.",
                    progress: true,
                    position: "top-right",
                });

            } finally {
                this.isLoading = false;
            }
        },

        async onClickedSignup() {
            const isValid = this.validateAllFields("signup");
            if (!isValid) return;

            try {
                const res = await apiAuth.apiSignup(
                    this.inputSignUpEmail,
                    this.inputSignUpPassword,
                    this.inputSignUpFullName,
                    this.isSelectedSignUpRoleSeller,
                );
                if (res?.session && res?.user) {
                    Notify.create({
                        type: "positive",
                        message:
                            "Account created successfully. You can now sign in.",
                        progress: true,
                        position: "bottom",
                    });
                    router.push({ name: "signin", path: "/signin" });
                }
            } catch (error) {
                console.error(
                    `Store use-auth-store Error - onClickedSignup - ${error.code - error}`
                );
                let errorMessage = null;
                if (error?.code == "user_already_exists") {
                    const errorMessage =
                        "An account with this email already exists. Please sign in or use a different email.";
                }

                Notify.create({
                    type: "negative",
                    message:
                        errorMessage ||
                        "An unexpected error has occured. Please try again.",
                    progress: true,
                    position: "top-right",
                });
            }
        },

        async onClickedSignout() {
            try {
                const res = await apiAuth.authSignout();
                this.session = null;
                this.user = null;
                Notify.create({
                    type: "positive",
                    message: "Signed out successfully.",
                    position: "bottom",
                });
                router.push('/home');
            } catch (error) {
                console.error(
                    `Store use-auth-store Error - onClickedSignout - ${error}`
                );
            }
        },

        // for the case with no authorization
        async signOutRedirectSignIn() {
            try {
                const res = await apiAuth.authSignout();
                this.session = null;
                this.user = null;
                $q.notify({
                    type: "negative",
                    timeout: 3000,
                    message: "Session expired. Please log in again.",
                });
                router.push("/signin");
            } catch (error) {
                console.error(
                    `Store use-auth-store Error - signOutRedirectSignIn - ${error}`
                );
            }
        },
    }
})