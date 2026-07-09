<script>
export default {}
</script>

<template>
    <div class="background">

        <div class="header-section">
            <slot name="Header" />
        </div>

        <q-scroll-area ref="scroll" class="messages-section">
            <div class="messages-content">
                <slot name="Messages" />
            </div>
        </q-scroll-area>

        <div class="input-section">
            <slot name="Input" />
        </div>

    </div>
</template>

<style lang="scss" scoped>
.background {
    height: 100vh;
    height: 100dvh;
    font-family: $sariko-font-family-secondary;
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
    padding: 12px 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    background: var(--bg-main);
}

.messages-section {
    flex: 1;
}

.messages-content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.input-section {
    flex-shrink: 0;
    padding: 12px 12px;
    padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    background: var(--bg-main);
}
</style>
