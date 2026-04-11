<template>
    <div class="food-detail-page">

        <div class="hero-section">
            <slot name="HeroImage" />
        </div>

        <div class="content-card">
            <div class="food-info">
                <slot name="FoodInfo"/>
            </div>
        </div>

        <div class="action-zone">
            <slot name="BottomActionBar" />
        </div>

    </div>
</template>

<style lang="scss" scoped>
.food-detail-page {
    width: 100vw;
    height: 100vh;
    // background: var(--bg-surface);
    // background-color: rgba(255, 255, 255, 0.05);
    font-family: $sariko-font-family-secondary;
    max-width: 430px;
    margin: 0 auto;
    position: relative;
}

.hero-section {
    position: relative;
    height: 320px;
    margin-bottom: -28px;
}

.content-card {
    overflow: hidden;
    height: 100%;
    border-top-left-radius: 2rem;
    border-top-right-radius: 2rem;
    background-color: var(--bg-main);
    position: relative;
    z-index: 2;
    box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.25);
    padding-bottom: calc(150px + env(safe-area-inset-bottom, 0));
}

.food-info {
    height: 100%;
    padding: 28px 20px 24px;
    background-color: rgba(255, 255, 255, 0.06);
}

.action-zone {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-width: 430px;
    margin: 0 auto;
    padding: 16px 16px 18px;
    padding-bottom: calc(18px + env(safe-area-inset-bottom, 0));
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    box-shadow: 0 -12px 24px rgba(0, 0, 0, 0.35);
    z-index: 20;
}
</style>
