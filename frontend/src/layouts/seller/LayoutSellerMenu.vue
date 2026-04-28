<template>
    <div class="seller-menu-page">
        <div class="header-section">
            <slot name="Header" />
        </div>
        <div class="content-section">
            <slot name="Content" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.seller-menu-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    min-height: 100dvh;
    background: var(--bg-main);
    font-family: $sariko-font-family-secondary;
}

.header-section {
    flex-shrink: 0;
    padding-top: calc(8px + env(safe-area-inset-top, 0));
}

.content-section {
    flex: 1;
    overflow-y: auto;
    padding: 0 16px;
    padding-bottom: calc(var(--bottom-nav-height, 72px) + 24px);
}
</style>
