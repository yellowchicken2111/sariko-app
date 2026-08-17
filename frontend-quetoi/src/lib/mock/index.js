// Mock mode toggle for the QuêTôi soft-launch demand test.
// Enabled by VITE_MOCK=true (default in .env.development). Set to false to
// point the app at a real backend later — this whole folder becomes dead code.
import { mockAdapter } from './adapter.js'
import { db } from './data.js'

export const isMock = String(import.meta.env.VITE_MOCK) === 'true'

// Install the mock adapter onto an axios instance (apiClient).
export function installMockAdapter(instance) {
    if (!isMock) return
    instance.defaults.adapter = mockAdapter
    if (import.meta.env.DEV) console.info('[MOCK] QuêTôi mock backend active — no real API calls.')
}

// A fake, always-valid Supabase-style session so requiresAuth routes render
// without a real login. Expires far in the future so no refresh is attempted.
export function mockSession() {
    return {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
        token_type: 'bearer',
        user: {
            id: db.user.id,
            email: db.user.email,
            user_metadata: { fullname: db.user.name, is_seller: db.user.is_seller },
        },
    }
}
