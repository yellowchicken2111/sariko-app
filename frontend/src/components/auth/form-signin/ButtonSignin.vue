<script>
import { LogIn } from 'lucide-vue-next';
import { mapActions, mapState } from 'pinia';
import { useAuthStore } from '@/stores/auth/authStore';

export default {
    components: {
        LogIn
    },

    computed: {
        ...mapState(useAuthStore, [
            "errors",
            "inputSignInEmail",
            "inputSignInPassword",
            "isLoading"
        ])
    }
}
</script>

<template>
    <q-btn flat no-caps
    type="submit"
    class="button-signin"
    :loading="isLoading"
    :disable="Object.values(errors).some((e) => !!e) || !inputSignInEmail || !inputSignInPassword"
    >
        <LogIn class="icon"/> {{ $t('auth_page.auth_input_fields.signin.button_label_text_signin') }}
    </q-btn>
</template>

<style lang="scss" scoped>

.icon {
    margin-right: 10px;
}

.button-signin {
    background-color: $accent;
    color: var(--bg-main);
    font-weight: 700;
    border-radius: 1.5rem;
    padding: 10px 0px;
}

</style>