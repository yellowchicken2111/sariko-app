<script>
import { Check } from 'lucide-vue-next';
import apiUsers from '@/apis/users/apiUsers';

export default {
    components: { Check },

    data() {
        return {
            currentLocale: 'en_ph',
        }
    },

    computed: {
        options() {
            return [
                {
                    locale: 'en_ph',
                    label: this.$t('language_page.option_en'),
                    flag: '🇵🇭',
                    backendValue: 'English',
                },
                {
                    locale: 'vi',
                    label: this.$t('language_page.option_vi'),
                    flag: '🇻🇳',
                    backendValue: 'Tiếng Việt',
                },
            ]
        }
    },

    mounted() {
        this.currentLocale = localStorage.getItem('lang') || this.$i18n.locale || 'en_ph'
    },

    methods: {
        async onSelect(option) {
            if (this.currentLocale === option.locale) return

            // Optimistic UI: apply locally first
            this.currentLocale = option.locale
            this.$i18n.locale = option.locale
            localStorage.setItem('lang', option.locale)

            // Fire-and-forget backend persist
            try {
                await apiUsers.updateProfile({
                    preferred_language: option.backendValue,
                })
                this.$q.notify({
                    classes: 'quasar-notify-positive',
                    message: `✔️ ${this.$t('common.toast_update_success')}`,
                    position: 'bottom',
                    timeout: 1200,
                })
            } catch (e) {
                console.warn('LanguageOptions - persist failed, keeping local change:', e)
            }
        }
    }
}
</script>

<template>
    <div class="language-list">
        <div class="subtitle">{{ $t('language_page.subtitle') }}</div>

        <button
            v-for="option in options"
            :key="option.locale"
            class="language-card"
            :class="{ active: currentLocale === option.locale }"
            @click="onSelect(option)"
        >
            <span class="flag">{{ option.flag }}</span>
            <span class="label">{{ option.label }}</span>
            <span v-if="currentLocale === option.locale" class="check">
                <Check :size="18" />
            </span>
        </button>
    </div>
</template>

<style scoped>
.language-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.subtitle {
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 8px;
    padding-left: 4px;
}

.language-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 18px;
    background: var(--bg-surface);
    border: 1px solid transparent;
    border-radius: 12px;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.15s ease;
    font-family: inherit;
    text-align: left;
    width: 100%;
}

.language-card:hover {
    background: var(--bg-card-hover);
}

.language-card.active {
    border-color: var(--color-accent, #f5A623);
    background: rgba(245, 166, 35, 0.1);
}

.flag {
    font-size: 24px;
    flex-shrink: 0;
}

.label {
    flex: 1;
    font-size: 15px;
    font-weight: 600;
}

.check {
    color: var(--color-accent, #f5A623);
    flex-shrink: 0;
}
</style>
