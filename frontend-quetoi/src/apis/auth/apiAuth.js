import { supabase } from '@/lib/supabase.js'
import { isMock, mockSession } from '@/lib/mock/index.js'

// In mock mode we never touch Supabase auth — a fake buyer session is returned
// so requiresAuth routes render for the demand-test demo.
export const apiAuth = {

    authGetSession: async() => {
        if (isMock) return { session: mockSession() }
        const { data, error } = await supabase.auth.getSession();
        if (error) throw new Error("Error in apiGetSession: ", error)
        return data
    },

    authSignin: async(email, password) => {
        if (isMock) return { session: mockSession(), user: mockSession().user }
        const { data, error } = await supabase.auth.signInWithPassword({ email: email, password: password })
        if (error) throw error
        return data
    },

    authSignup: async(email, password, fullname, isSeller) => {
        if (isMock) return { session: mockSession(), user: mockSession().user }
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    fullname: fullname,
                    is_seller: isSeller
                },
            },
        });
        if (error) throw error
        return data
    },

    authSignout: async() => {
        if (isMock) return { success: true }
        const { data, error } = await supabase.auth.signOut()
        if (error) throw error
        return data
    }
}

export default apiAuth;
