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
            "validateField"
        ])
    }
}
</script>

<template>

    <div class="container">

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
            placeholder="Please enter your email address"
            :error="!!errors.inputSignInEmail"
            :error-message="errors.inputSignInEmail"
            @blur="validateField('inputSignInEmail')"
            v-model="inputSignInEmail"
            >
                <template v-slot:prepend>
                    <Mail color="white" class="icon"/>
                </template>

                <template v-slot:hint>
                    <span class="hint-text">e.g. johndoe@gmail.com</span>
                </template>

            </q-input>
        </div>

        <div class="input-label">
            {{ $t('auth_page.auth_input_fields.common.input_label_password') }}
        </div>

        <div class="input-container">
            <q-input
            dense
            outlined
            type="password"
            class="input"
            bg-color="bgInputField"
            placeholder="Please enter your password"
            :error="!!errors.inputSignInPassword"
            :error-message="errors.inputSignInPassword"
            @blur="validateField('inputSignInPassword')"
            v-model="inputSignInPassword"
            >
                <template v-slot:prepend>
                    <LockKeyhole color="white" class="icon"/>
                </template>

                <template v-slot:hint>
                    <span class="hint-text">Min. 6 characters</span>
                </template>
            </q-input>
        </div>

        <div class="button-signin">
            <ButtonSignin />
        </div>
    </div>

</template>

<style lang="scss" scoped>

.container {
    font-family: $sariko-font-family-secondary;
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
    font-family: $sariko-font-family-primary;
    font-weight: 700;
    font-size: 22px;
}

.subtext-greeting {
    font-family: $sariko-font-family-secondary;
    font-weight: 700;
    font-size: 10px;
    color: rgb(122, 140, 174);
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

:deep(.q-field__native::placeholder) {
    font-family: $sariko-font-family-secondary; 
    font-size: 12px;
    color: rgba(255, 255, 255, 0.25);
}

:deep(.q-field__native) {
    color: #ffffff;
}

:deep(.q-field__control) {
    border-radius: 0.75rem;
}

.hint-text {
    color: rgb(255, 255, 255, 0.5)
}
</style>