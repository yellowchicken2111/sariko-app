<script>
export default {}
</script>

<template>
    <div class="background">

        <div class="breadcrumbs-section">
            <slot name="Breadcrumbs" />
        </div>

        <div class="filter-tabs-section">
            <slot name="FilterTabs" />
        </div>

        <q-scroll-area class="orders-list-section">
            <div class="orders-list-content">
                <slot name="OrdersList" />
                <slot name="EmptyState" />
            </div>
        </q-scroll-area>

    </div>
</template>

<style lang="scss" scoped>
.background {
    width: 100vw;
    height: 100vh;
    font-family: $sariko-font-family-secondary;
    background: var(--bg-main);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.breadcrumbs-section {
    position: sticky;
    top: 0;
    z-index: 50;
    flex-shrink: 0;
}

.filter-tabs-section {
    flex-shrink: 0;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding: 0px 20px;

    &::-webkit-scrollbar {
        display: none;
    }
}

.orders-list-section {
    flex: 1;
}

.orders-list-content {
    padding: 0px 20px;
    padding-bottom: var(--bottom-nav-height, 80px);
}
</style>
