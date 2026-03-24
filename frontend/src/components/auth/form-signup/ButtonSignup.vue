<script>
import { UserRoundPlus } from 'lucide-vue-next';

export default {
    components: {
        UserRoundPlus
    }
}
</script>

<template>
    <q-btn flat no-caps class="button-signup">
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