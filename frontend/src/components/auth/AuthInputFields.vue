<script>
import { mapState } from 'pinia';
import { useAuthStore } from '@/stores/auth/authStore';
import AuthFormSignin from '@/components/auth/form-signin/AuthFormSignin.vue';
import AuthFormSignup from '@/components/auth/form-signup/AuthFormSignup.vue';
import ButtonSignup from '@/components/auth/form-signup/ButtonSignup.vue';

export default {
    components: {
        AuthFormSignin,
        AuthFormSignup,
        ButtonSignup
    },

    computed: {
        ...mapState(useAuthStore, [
            "isSignin"
        ])
    },
}
</script>

<template>

    <div v-if="isSignin">
        <div class="input">
            <AuthFormSignin />
        </div>
        <div class="input">

        </div>
    </div>

    <div v-else class>
        <div class="input">
            <AuthFormSignup />
        </div>
    </div>

</template>

<style lang="scss" scoped>
</style>