<script>
import { Check } from 'lucide-vue-next';
import { setLanguage, getCurrentLocale, LANGUAGE_OPTIONS } from '@/composables/setLanguage';

export default {
    components: { Check },

    data() {
        return {
            currentLocale: getCurrentLocale(),
        }
    },

    computed: {
        options() {
            return LANGUAGE_OPTIONS.map(o => ({
                ...o,
                label: o.locale === 'en_ph'
                    ? this.$t('language_page.option_en')
                    : o.locale === 'ko'
                        ? this.$t('language_page.option_ko')
                        : this.$t('language_page.option_vi'),
            }))
        }
    },

    methods: {
        async onSelect(option) {
            if (this.currentLocale === option.locale) return
            this.currentLocale = option.locale
            await setLanguage(option.locale)
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
    border-color: var(--color-primary);
    background: rgba(29, 107, 74, 0.1);
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
    color: var(--color-primary);
    flex-shrink: 0;
}
</style>
