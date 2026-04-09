<template>
    <div class="account-page">

        <div class="profile-section">
            <slot name="ProfileHeader" />
        </div>

        <div class="switch-mode-section">
            <slot name="SwitchMode" />
        </div>

        <div class="settings-section">
            <slot name="Settings" />
        </div>

        <div class="support-section">
            <slot name="Support" />
        </div>

        <div class="signout-section">
            <slot name="SignOut" />
        </div>

    </div>
</template>

<style scoped>
.account-page {
    min-height: 100vh;
    background: var(--bg-main);
    padding: 16px;
    padding-top: calc(24px + env(safe-area-inset-top, 0));
    padding-bottom: calc(80px + env(safe-area-inset-bottom, 0));
}

.profile-section {
    margin-bottom: 28px;
}

.switch-mode-section {
    margin-bottom: 20px;
}

.settings-section {
    margin-bottom: 20px;
}

.support-section {
    margin-bottom: 20px;
}

.signout-section {
    margin-bottom: 20px;
}
</style>
