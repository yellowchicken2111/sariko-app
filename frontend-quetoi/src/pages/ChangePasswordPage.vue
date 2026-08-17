<script>
import LayoutBaseSettings from '@/layouts/account/LayoutBaseSettings.vue';
import ChangePasswordForm from '@/components/account/ChangePasswordForm.vue';

export default {
    name: 'ChangePasswordPage',
    components: { LayoutBaseSettings, ChangePasswordForm }
}
</script>

<template>
    <LayoutBaseSettings :title="$t('breadcrumbs.change_password_page')" back-to="/account">
        <template #Content>
            <ChangePasswordForm />
        </template>
    </LayoutBaseSettings>
</template>
