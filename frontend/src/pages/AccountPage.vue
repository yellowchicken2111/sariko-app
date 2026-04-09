<script>
import LayoutBaseAccount from '@/layouts/account/LayoutBaseAccount.vue';
import ProfileHeader from '@/components/account/ProfileHeader.vue';
import SwitchMode from '@/components/account/SwitchMode.vue';
import SettingsMenu from '@/components/account/SettingsMenu.vue';
import SupportMenu from '@/components/account/SupportMenu.vue';
import SignOutButton from '@/components/account/SignOutButton.vue';

export default {
    name: 'AccountPage',
    components: {
        LayoutBaseAccount,
        ProfileHeader,
        SwitchMode,
        SettingsMenu,
        SupportMenu,
        SignOutButton,
    }
}
</script>

<template>
    <LayoutBaseAccount>

        <template #ProfileHeader>
            <ProfileHeader />
        </template>

        <template #SwitchMode>
            <SwitchMode />
        </template>

        <template #Settings>
            <SettingsMenu />
        </template>

        <template #Support>
            <SupportMenu />
        </template>

        <template #SignOut>
            <SignOutButton />
        </template>

    </LayoutBaseAccount>
</template>
