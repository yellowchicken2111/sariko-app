<script>
import LayoutBaseSettings from '@/layouts/account/LayoutBaseSettings.vue';
import ProfileForm from '@/components/account/ProfileForm.vue';

export default {
    name: 'EditProfilePage',
    components: {
        LayoutBaseSettings,
        ProfileForm,
    }
}
</script>

<template>
    <LayoutBaseSettings :title="$t('breadcrumbs.edit_profile_page')" back-to="/account">
        <template #Content>
            <ProfileForm />
        </template>
    </LayoutBaseSettings>
</template>
