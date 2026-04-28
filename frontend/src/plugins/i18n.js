import { createI18n  } from 'vue-i18n'
import en_ph from '@/i18n/locales/en-PH.json'
import vi from '@/i18n/locales/vi.json'

const savedLang = localStorage.getItem("lang") || "en_ph";

export const i18n = createI18n({
    legacy: true,
    locale: savedLang,
    fallbackLocale: "en_ph",
    messages: {
        en_ph,
        vi,
    }
})

export default function useStorePlugin(app) {
    app.use(i18n)
    console.log("Loaded i18n plugin")
}