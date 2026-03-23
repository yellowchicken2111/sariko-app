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
            <div class="categories-chips-section">
                <slot name="CategoryChips" />
            </div>
            <div class="discovery-feed-section">
                <slot name="DiscoveryFeed" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.background {
    max-width: 1200px;
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

.search-bar-section {
    width: 100%;
    margin-bottom: 24px;
}

.catergories-chips-section {
    margin-bottom: 32px;
}

.discovery-feed-section {
    
}

</style>