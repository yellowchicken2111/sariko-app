<script>
import { useAuthStore } from '@/stores/auth/authStore'
import apiUsers from '@/apis/users/apiUsers'

export default {
    data() {
        return {
            isSaving: false,
        }
    },
    methods: {
        async saveAndContinue() {
            const authStore = useAuthStore()
            this.isSaving = true

            const langMap = { 'Tiếng Việt': 'vi', 'English': 'en_ph', 'Fillipino': 'en_ph' }
            const locale = langMap[authStore.selectedPreferedLanguage] || 'en_ph'
            this.$i18n.locale = locale
            localStorage.setItem('lang', locale)

            try {
                await apiUsers.updateProfile({
                    phone: authStore.inputPhoneNumber,
                    preferred_language: authStore.selectedPreferedLanguage,
                    address: authStore.inputAddress,
                    address_details: authStore.inputAddressDetails,
                    lat: authStore.inputLat,
                    lon: authStore.inputLon,
                })
            } catch (e) {
                console.error('Failed to save onboarding profile:', e)
            } finally {
                this.isSaving = false
                const route = useAuthStore().user?.isSeller ? '/seller/home' : '/home'
                this.$router.push(route)
            }
        },
        skipOnboarding() {
            const authStore = useAuthStore()
            const route = authStore.user?.isSeller ? '/seller/home' : '/home'
            this.$router.push(route)
        }
    },
}
</script>

<template>
    <div class="button-container">

        <q-btn
        class="button-start-ordering"
        flat
        no-caps
        :loading="isSaving"
        @click="saveAndContinue"
        >
            {{ $t('onboarding_page.buyer.button_group.button_label_text_start_ordering') }}
        </q-btn>

        <q-btn
        class="button-skip"
        no-caps
        flat
        @click="skipOnboarding"
        >
            {{ $t('onboarding_page.buyer.button_group.button_label_text_skip_for_now') }}
        </q-btn>

    </div>
</template>

<style lang="scss" scoped>
.button-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.button-start-ordering {
    width: 100%;
    margin-bottom: 5px;
    background-color: $accent;
    color: var(--bg-main);
    font-weight: 600;
    font-size: 18px;
    border-radius: .75rem;
}

.button-skip {
    width: 100%;
    color: var(--text-muted);
    font-weight: 600;
    font-size: 14px;
}

</style>
