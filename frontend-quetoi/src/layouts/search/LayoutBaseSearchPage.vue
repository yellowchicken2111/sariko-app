<template>
    <div class="search-page">

        <div class="header-section">
            <slot name="Header" />
        </div>

        <div class="filters-section">
            <slot name="Filters" />
        </div>

        <div class="results-section">
            <slot name="FoodResults" />
        </div>

        <div class="results-section">
            <slot name="CategoryResults" />
        </div>

    </div>
</template>

<style scoped>
.search-page {
    min-height: 100vh;
    min-height: 100dvh;
    background: var(--bg-main);
    color: var(--text-primary);
    padding-bottom: calc(80px + env(safe-area-inset-bottom, 0));
}

.header-section {
    position: sticky;
    top: 0;
    background: var(--bg-main);
    padding: 16px;
    padding-top: calc(16px + env(safe-area-inset-top, 0));
    border-bottom: 1px solid var(--border-color);
    z-index: 10;
}

.filters-section {
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-color);
}

.results-section {
    padding: 16px;
    border-bottom: 1px solid var(--border-color);
}
</style>
