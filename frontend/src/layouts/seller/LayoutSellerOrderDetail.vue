<template>
    <div class="seller-order-detail-page">
        <div class="header-section">
            <slot name="Header" />
        </div>
        <div class="content-section">
            <slot name="Content" />
        </div>
        <div class="action-section">
            <slot name="Actions" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.seller-order-detail-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    height: 100dvh;
    background: var(--bg-main);
    font-family: $sariko-font-family-secondary;
}

.header-section {
    flex-shrink: 0;
    padding-top: calc(0px + env(safe-area-inset-top, 0));
}

.content-section {
    flex: 1;
    overflow-y: auto;
    padding: 0 16px 120px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.action-section {
    flex-shrink: 0;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-width: 800px;
    margin: auto;
    padding: 12px 16px;
    padding-bottom: calc(12px + env(safe-area-inset-bottom, 0));
    background: var(--bg-main);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
}
</style>
