<script>
import { Check, ChevronDown } from 'lucide-vue-next';
import { setLanguage, getCurrentLocale, LANGUAGE_OPTIONS } from '@/composables/setLanguage';

export default {
    components: { Check, ChevronDown },

    data() {
        return {
            showSheet: false,
            currentLocale: getCurrentLocale(),
            options: LANGUAGE_OPTIONS,
        }
    },

    computed: {
        currentOption() {
            return this.options.find(o => o.locale === this.currentLocale) || this.options[0]
        }
    },

    methods: {
        openSheet() {
            this.currentLocale = getCurrentLocale()
            this.showSheet = true
        },

        async onSelect(option) {
            this.showSheet = false
            if (this.currentLocale === option.locale) return
            this.currentLocale = option.locale
            await setLanguage(option.locale)
        }
    }
}
</script>

<template>
    <div>
        <button type="button" class="lang-pill" @click="openSheet">
            <span class="flag">{{ currentOption.flag }}</span>
            <span class="short">{{ currentOption.short }}</span>
            <ChevronDown :size="12" />
        </button>

        <q-dialog v-model="showSheet" position="bottom">
            <q-card class="lang-sheet">
                <div class="sheet-title">{{ $t('language_page.title') }}</div>
                <button
                    v-for="option in options"
                    :key="option.locale"
                    type="button"
                    class="lang-row"
                    :class="{ active: currentLocale === option.locale }"
                    @click="onSelect(option)"
                >
                    <span class="row-flag">{{ option.flag }}</span>
                    <span class="row-label">{{ option.label }}</span>
                    <span v-if="currentLocale === option.locale" class="row-check">
                        <Check :size="18" />
                    </span>
                </button>
            </q-card>
        </q-dialog>
    </div>
</template>

<style scoped>
.lang-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    background: rgba(26, 42, 32, 0.06);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    color: var(--text-primary);
    font-size: 12px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: background 0.15s ease;
}

.lang-pill:hover {
    background: rgba(26, 42, 32, 0.08);
}

.flag {
    font-size: 14px;
    line-height: 1;
}

.short {
    letter-spacing: 0.3px;
}

.lang-sheet {
    background-color: var(--bg-surface);
    color: var(--text-primary);
    border-radius: 16px 16px 0 0;
    padding: 16px 12px calc(16px + env(safe-area-inset-bottom, 0));
    width: 100%;
    max-width: 480px;
}

.sheet-title {
    font-size: 15px;
    font-weight: 700;
    padding: 4px 8px 12px;
    color: var(--text-primary);
}

.lang-row {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    padding: 14px 12px;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 12px;
    color: var(--text-primary);
    font-family: inherit;
    text-align: left;
    cursor: pointer;
    transition: background 0.15s ease;
}

.lang-row:hover {
    background: rgba(26, 42, 32, 0.05);
}

.lang-row.active {
    border-color: rgba(29, 107, 74, 0.5);
    background: rgba(29, 107, 74, 0.1);
}

.row-flag {
    font-size: 22px;
    flex-shrink: 0;
}

.row-label {
    flex: 1;
    font-size: 15px;
    font-weight: 600;
}

.row-check {
    color: var(--color-primary);
    flex-shrink: 0;
}
</style>
