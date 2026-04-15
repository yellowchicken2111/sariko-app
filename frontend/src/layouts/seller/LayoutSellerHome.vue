<template>
    <div class="seller-home-page">
        <div class="header-section">
            <slot name="Header" />
        </div>
        <div class="stats-section">
            <slot name="Stats" />
        </div>
        <div class="action-section">
            <slot name="ActionOrders" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.seller-home-page {
    min-height: 100vh;
    background: var(--bg-main);
    padding: 20px 16px;
    padding-top: calc(20px + env(safe-area-inset-top, 0));
    padding-bottom: calc(var(--bottom-nav-height, 72px) + 16px);
    font-family: $sariko-font-family-secondary;
}

.header-section {
    margin-bottom: 20px;
}

.stats-section {
    margin-bottom: 28px;
}

.action-section {}
</style>
