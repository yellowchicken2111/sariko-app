<template>
    <div class="order-review-page">

        <div class="breadcrumbs-section">
            <slot name="Breadcrumbs" />
        </div>

        <div class="scroll-section">
            <div class="overall-section">
                <slot name="Overall" />
            </div>

            <div class="items-section">
                <slot name="Items" />
            </div>
        </div>

        <div class="submit-section">
            <slot name="Submit" />
        </div>

    </div>
</template>

<style lang="scss" scoped>
.order-review-page {
    height: 100vh;
    height: 100dvh;
    font-family: $sariko-font-family-secondary;
    display: flex;
    flex-direction: column;
}

.breadcrumbs-section {
    padding: 15px;
    flex-shrink: 0;
}

/* The submit bar stays pinned while the dish list scrolls, so a long order never
   hides the only way to finish. */
.scroll-section {
    flex: 1;
    overflow-y: auto;
}

.overall-section {
    padding: 12px 16px 28px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.items-section {
    padding: 24px 16px 32px;
}

.submit-section {
    flex-shrink: 0;
    padding: 14px 16px calc(14px + env(safe-area-inset-bottom));
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    background-color: var(--bg-surface);
}
</style>
