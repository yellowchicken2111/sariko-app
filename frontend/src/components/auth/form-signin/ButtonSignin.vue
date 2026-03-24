<script>
import { LogIn } from 'lucide-vue-next';

export default {
    components: {
        LogIn
    }
}
</script>

<template>
    <q-btn flat no-caps class="button-signin">
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