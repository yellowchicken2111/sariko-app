<script>
</script>

<template>
    <div class="background">
        <div class="main">
            <div class="header-section">
                <slot name="Header" />
            </div>
            <div class="search-bar-section">
                <slot name="SearchBar" />
            </div>
            <div class="categories-section">
                <slot name="Categories" />
            </div>
            <div class="discovery-feed-section">
                <slot name="DiscoveryFeed" />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.background {
    background-color: #f5f5f5;
    height: 100vh;
    width: 100vw;
}

.main {
    min-height: 100vh;
    background: var(--bg-main);
    padding: 16px;
    padding-top: calc(16px + env(safe-area-inset-top, 0));
    padding-bottom: 100px;
}
</style>