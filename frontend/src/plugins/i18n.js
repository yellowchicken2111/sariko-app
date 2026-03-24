import { createI18n  } from 'vue-i18n'
import en_ph from '@/i18n/locales/en-PH.json'

const savedLang = localStorage.getItem("lang") || "en_ph";

const i18n = createI18n({
    legacy: true,
    locale: savedLang,
    fallbackLocale: "en_ph",
    messages: {
        en_ph,
    }
})

export default function useStorePlugin(app) {
    app.use(i18n)
    console.log("Loaded i18n plugin")
}