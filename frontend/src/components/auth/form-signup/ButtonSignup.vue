<script>
import { UserRoundPlus } from 'lucide-vue-next';
import { mapActions } from 'pinia';
import { useAuthStore } from '@/stores/auth/authStore';

export default {
    components: {
        UserRoundPlus
    },
    methods: {
        ...mapActions(useAuthStore, [
            "onClickedSignup"
        ])
    }
}
</script>

<template>
    <q-btn flat no-caps class="button-signup" @click="onClickedSignup">
        <UserRoundPlus class="icon" /> {{ $t('auth_page.auth_input_fields.signup.button_label_text_signup') }}
    </q-btn>
</template>

<style lang="scss" scoped>

.icon {
    margin-right: 10px;
}

.button-signup {
    background-color: $accent;
    color: var(--bg-main);
    font-weight: 700;
    border-radius: 1.5rem;
    padding: 10px 0px;
}

</style>