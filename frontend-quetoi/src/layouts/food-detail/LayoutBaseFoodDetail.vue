<template>
    <div class="food-detail-page">

        <div class="hero-section">
            <slot name="HeroImage" />
        </div>

        <q-scroll-area class="scroll-area">
            <div class="food-info">
                <slot name="FoodInfo"/>
            </div>
        </q-scroll-area>

        <div class="action-zone">
            <slot name="BottomActionBar" />
        </div>

    </div>
</template>

<style lang="scss" scoped>
.food-detail-page {
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    font-family: $quetoi-font-family-secondary;
    max-width: 430px;
    margin: 0 auto;
    position: relative;
    display: flex;
    flex-direction: column;
}

.hero-section {
    position: relative;
    height: 320px;
    margin-bottom: -28px;
}

.scroll-area {
    border-top-left-radius: 2rem;
    border-top-right-radius: 2rem;
    box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.25);
    flex: 1;
    background-color: var(--bg-surface-2);
}


.food-info {
    height: 100%;
    padding: 28px 20px 24px;
}

.action-zone {
    padding: 20px 15px;
    border-top: 1px solid var(--border-color);
    box-shadow: 0 -12px 24px rgba(0, 0, 0, 0.35);
    background-color: rgba(59, 59, 59, 0.5);
    background-color: var(--bg-surface);
}
</style>
