<script>
export default {}
</script>

<template>
    <div class="background">

        <div class="header-section">
            <slot name="Header" />
        </div>

        <q-scroll-area class="list-section">
            <div class="list-content">
                <slot name="List" />
            </div>
        </q-scroll-area>

    </div>
</template>

<style lang="scss" scoped>
.background {
    height: 100vh;
    height: 100dvh;
    font-family: $quetoi-font-family-secondary;
    background: var(--bg-main);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.header-section {
    position: sticky;
    top: 0;
    z-index: 50;
    flex-shrink: 0;
    padding: 15px;
}

.list-section {
    flex: 1;
}

.list-content {
    padding: 0px 12px;
    padding-bottom: var(--bottom-nav-height, 80px);
}
</style>
