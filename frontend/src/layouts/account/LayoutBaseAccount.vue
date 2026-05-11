<template>
    <div class="account-page">

        <div class="profile-section">
            <slot name="ProfileHeader" />
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
    min-height: 100dvh;
    background: var(--bg-main);
    padding: 16px;
    padding-top: calc(24px + env(safe-area-inset-top, 0));
    padding-bottom: calc(80px + env(safe-area-inset-bottom, 0));
}

.profile-section {
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
