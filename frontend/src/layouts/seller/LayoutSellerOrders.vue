<template>
    <div class="seller-orders-page">
        <div class="filters-section">
            <slot name="Filters" />
        </div>
        <div class="list-section">
            <slot name="List" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.seller-orders-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--bg-main);
    font-family: $sariko-font-family-secondary;
}

.filters-section {
    flex-shrink: 0;
    padding-top: calc(8px + env(safe-area-inset-top, 0));
}

.list-section {
    flex: 1;
    overflow-y: auto;
    padding: 0 16px;
    padding-bottom: calc(var(--bottom-nav-height, 72px) + 16px);
}
</style>
