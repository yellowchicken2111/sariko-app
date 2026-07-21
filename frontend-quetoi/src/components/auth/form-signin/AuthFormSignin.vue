<script>
import { mapActions, mapState, mapWritableState } from 'pinia';
import { useAuthStore } from '@/stores/auth/authStore';
import { Mail, LockKeyhole } from 'lucide-vue-next';
import ButtonSignin from '@/components/auth/form-signin/ButtonSignin.vue'

export default {

    components: {
        Mail,
        LockKeyhole,
        ButtonSignin
    },

    data() {
        return {

        }
    },

    computed: {
        ...mapWritableState(useAuthStore, [
            "inputSignInEmail",
            "inputSignInPassword",
            "errors"
        ])
    },

    methods: {
        ...mapActions(useAuthStore, [
            "validateField",
            "onClickedSignin"
        ])
    }
}
</script>

<template>

    <q-form class="container" @submit.prevent="onClickedSignin">

        <div class="greeting">
            <div class="text-greeting">
                {{ $t('auth_page.auth_input_fields.signin.greeting_text_signin') }} 👋
            </div>
            <div class="subtext-greeting">
                {{ $t('auth_page.auth_input_fields.signin.greeting_subtext_signin') }}
            </div>
        </div>

        <div class="input-label">
            {{ $t('auth_page.auth_input_fields.common.input_label_email') }}
        </div>

        <div class="input-container">
            <q-input
            dense
            outlined
            type="text"
            class="input"
            bg-color="bgInputField"
            :placeholder="$t('auth_page.auth_input_fields.common.placeholder_email')"
            :error="!!errors.inputSignInEmail"
            :error-message="errors.inputSignInEmail"
            @blur="validateField('inputSignInEmail')"
            v-model="inputSignInEmail"
            >
                <template v-slot:prepend>
                    <Mail color="#1A2A20" class="icon"/>
                </template>

                <template v-slot:hint>
                    <span class="hint-text">{{ $t('auth_page.auth_input_fields.common.hint_email_example') }}</span>
                </template>

            </q-input>
        </div>

        <div class="input-label-row">
            <span>{{ $t('auth_page.auth_input_fields.common.input_label_password') }}</span>
            <router-link to="/forgot-password" class="link-forgot">
                {{ $t('forgot_password_page.link_forgot_password') }}
            </router-link>
        </div>

        <div class="input-container">
            <q-input
            dense
            outlined
            type="password"
            class="input"
            bg-color="bgInputField"
            :placeholder="$t('auth_page.auth_input_fields.common.placeholder_password')"
            :error="!!errors.inputSignInPassword"
            :error-message="errors.inputSignInPassword"
            @blur="validateField('inputSignInPassword')"
            v-model="inputSignInPassword"
            >
                <template v-slot:prepend>
                    <LockKeyhole color="#1A2A20" class="icon"/>
                </template>

                <template v-slot:hint>
                    <span class="hint-text">{{ $t('auth_page.auth_input_fields.common.hint_password_min') }}</span>
                </template>
            </q-input>
        </div>

        <div class="button-signin">
            <ButtonSignin />
        </div>

        <router-link to="/home" class="link-home">
            {{ $t('auth_page.link_back_to_home') }}
        </router-link>
    </q-form>

</template>

<style lang="scss" scoped>

.container {
    font-family: $quetoi-font-family-secondary;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 80%;
    margin: auto;
}

.greeting {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-bottom: 20px;
}

.text-greeting {
    font-family: $quetoi-font-family-primary;
    font-weight: 700;
    font-size: 22px;
}

.subtext-greeting {
    font-family: $quetoi-font-family-secondary;
    font-weight: 700;
    font-size: 10px;
    color: var(--text-secondary);
}

.input-label {
    font-weight: 700;
    font-size: 10px;
    margin-bottom: 5px;
}

.input-container {
    display: flex;
    align-items: center;
    width: 100%;
    // background-color: var(--bg-main);
    // background-color: #121b2e;
    border-radius: .75rem;
    margin-bottom: 10px;;
}

.icon {
    margin-right: 10px;
}

.input {
    width: 100%;
    border-radius: 0.75rem;
}

.button-signin {
    margin-top: 5px;
    width: 100%;
}

.input-label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-weight: 700;
    font-size: 10px;
    margin-bottom: 5px;
}

.link-forgot {
    font-size: 10px;
    font-weight: 600;
    color: var(--color-primary);
    text-decoration: none;
}

.link-home {
    display: block;
    text-align: center;
    width: 100%;
    margin-top: 12px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-muted);
    text-decoration: none;
}

:deep(.q-field__native::placeholder) {
    font-family: $quetoi-font-family-secondary;
    font-size: 12px;
    color: rgba(26, 42, 32, 0.4);
}

:deep(.q-field__native) {
    color: var(--text-primary);
}

:deep(.q-field__control) {
    border-radius: 0.75rem;
}

.hint-text {
    color: var(--text-secondary)
}
</style>