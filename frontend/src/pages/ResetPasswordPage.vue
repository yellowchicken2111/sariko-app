<script>
import ResetPasswordForm from '@/components/auth/ResetPasswordForm.vue';
import { supabase } from '@/lib/supabase';

export default {
    name: 'ResetPasswordPage',
    components: { ResetPasswordForm },

    data() {
        return {
            ready: false,
            invalid: false,
        }
    },

    async created() {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') {
                this.ready = true
            }
        })
        this._authSubscription = subscription

        setTimeout(() => {
            if (!this.ready) this.invalid = true
        }, 3000)
    },

    beforeUnmount() {
        this._authSubscription?.unsubscribe()
    }
}
</script>

<template>
    <div class="background">
        <div class="container">
            <div v-if="invalid" class="invalid-box">
                <div class="invalid-text">{{ $t('reset_password_page.invalid_link') }}</div>
                <router-link to="/forgot-password" class="link-retry">
                    {{ $t('forgot_password_page.button_send') }}
                </router-link>
            </div>
            <div v-else-if="!ready" class="loading-box">
                <q-spinner color="accent" size="32px" />
            </div>
            <ResetPasswordForm v-else />
        </div>
    </div>
</template>

<style scoped>
.background {
    min-height: 100vh;
    min-height: 100dvh;
    background-color: #121b2f;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50px 0 100px;
}

.container {
    width: 100%;
    padding: 0 20px;
}

.loading-box {
    display: flex;
    justify-content: center;
    padding: 48px 0;
}

.invalid-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 48px 0;
    text-align: center;
}

.invalid-text {
    font-size: 14px;
    color: var(--text-secondary);
}

.link-retry {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-accent, #f5A623);
    text-decoration: none;
}
</style>
