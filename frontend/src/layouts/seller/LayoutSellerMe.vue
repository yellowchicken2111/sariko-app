<template>
    <div class="seller-me-page">

        <div class="profile-section">
            <slot name="ProfileHeader" />
        </div>

        <div class="promote-section">
            <slot name="Promote" />
        </div>

        <div class="settings-section">
            <slot name="Settings" />
        </div>

        <div class="earnings-section">
            <slot name="Earnings" />
        </div>

        <div class="reviews-section">
            <slot name="Reviews" />
        </div>

        <div class="signout-section">
            <slot name="SignOut" />
        </div>

        <div class="version-section">
            <slot name="Version" />
        </div>

    </div>
</template>

<style scoped>
.seller-me-page {
    min-height: 100vh;
    background: var(--bg-main);
    padding: 16px;
    padding-top: calc(24px + env(safe-area-inset-top, 0));
    padding-bottom: calc(100px + env(safe-area-inset-bottom, 0));
}

.profile-section {
    margin-bottom: 20px;
}

.promote-section {
    margin-bottom: 20px;
}

.settings-section {
    margin-bottom: 20px;
}

.earnings-section {
    margin-bottom: 20px;
}

.reviews-section {
    margin-bottom: 20px;
}

.signout-section {
    margin-bottom: 20px;
}

.version-section {
    margin-bottom: 8px;
}
</style>
