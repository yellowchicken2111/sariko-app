<template>
    <div class="seller-home-page">

        <!-- Fixed top: greeting + stats -->
        <div class="top-fixed">
            <div class="header-section">
                <slot name="Header" />
            </div>
            <div class="stats-section">
                <slot name="Stats" />
            </div>
        </div>

        <!-- Scrollable action area -->
        <div class="action-section">
            <q-scroll-area class="action-scroll">
                <slot name="ActionOrders" />
            </q-scroll-area>
        </div>

    </div>
</template>

<style lang="scss" scoped>
.seller-home-page {
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--bg-main);
    font-family: $sariko-font-family-secondary;
}

.top-fixed {
    flex-shrink: 0;
    padding: 20px 16px 0;
    padding-top: calc(20px + env(safe-area-inset-top, 0));
}

.header-section {
    margin-bottom: 20px;
}

.stats-section {
    margin-bottom: 20px;
}

.action-section {
    flex: 1;
    overflow: hidden;
}

.action-scroll {
    height: 100%;
    padding: 0 16px;
    padding-bottom: calc(var(--bottom-nav-height, 72px) + 16px);
}
</style>
