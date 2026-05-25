import { i18n } from '@/plugins/i18n'
import { useAuthStore } from '@/stores/auth/authStore'
import apiUsers from '@/apis/users/apiUsers'

const LOCALE_TO_BACKEND = {
    en_ph: 'English',
    vi: 'Tiếng Việt',
}

export const LANGUAGE_OPTIONS = [
    { locale: 'en_ph', label: 'English', flag: '🇵🇭', short: 'EN' },
    { locale: 'vi', label: 'Tiếng Việt', flag: '🇻🇳', short: 'VI' },
]

export function getCurrentLocale() {
    return localStorage.getItem('lang') || i18n.global.locale || 'en_ph'
}

export async function setLanguage(locale) {
    if (!LOCALE_TO_BACKEND[locale]) return
    i18n.global.locale = locale
    localStorage.setItem('lang', locale)

    const authStore = useAuthStore()
    if (!authStore.user) return

    try {
        await apiUsers.updateProfile({
            preferred_language: LOCALE_TO_BACKEND[locale],
        })
    } catch (e) {
        console.warn('setLanguage - backend persist failed, keeping local change:', e)
    }
}
