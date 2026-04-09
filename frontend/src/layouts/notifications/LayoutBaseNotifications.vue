<template>
    <div class="notifications-page">

        <div class="header-section">
            <slot name="Header" />
        </div>

        <div class="content-section">
            <slot name="Content" />
        </div>

    </div>
</template>

<style scoped>
.notifications-page {
    min-height: 100vh;
    background: var(--bg-main);
    padding: 16px;
    padding-top: calc(24px + env(safe-area-inset-top, 0));
    padding-bottom: calc(80px + env(safe-area-inset-bottom, 0));
}

.header-section {
    margin-bottom: 32px;
}
</style>
