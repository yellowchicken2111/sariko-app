<template>
    <div class="dashboard-page">

        <div class="header-section">
            <slot name="Header" />
        </div>

        <div class="stats-section">
            <slot name="Stats" />
        </div>

        <div class="orders-section">
            <slot name="RecentOrders" />
        </div>

    </div>
</template>

<style lang="scss" scoped>
.dashboard-page {
    min-height: 100vh;
    min-height: 100dvh;
    background: var(--bg-main);
    padding: 16px;
    padding-top: calc(16px + env(safe-area-inset-top, 0));
    padding-bottom: calc(80px + env(safe-area-inset-bottom, 0));
    font-family: $sariko-font-family-secondary;
}

.header-section {
    margin-bottom: 24px;
}

.stats-section {
    margin-bottom: 28px;
}

.orders-section {
    margin-bottom: 24px;
}
</style>
