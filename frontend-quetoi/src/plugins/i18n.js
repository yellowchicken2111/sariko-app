import { createI18n  } from 'vue-i18n'
import en_ph from '@/i18n/locales/en-PH.json'
import vi from '@/i18n/locales/vi.json'
import ko from '@/i18n/locales/ko.json'

const savedLang = localStorage.getItem("lang") || "vi";

export const i18n = createI18n({
    legacy: true,
    locale: savedLang,
    fallbackLocale: "vi",
    messages: {
        en_ph,
        vi,
        ko,
    }
})

export default function useStorePlugin(app) {
    app.use(i18n)
    console.log("Loaded i18n plugin")
}