<template>
    <div class="food-detail-page">

        <div class="hero-section">
            <slot name="HeroImage" />
        </div>

        <div class="food-info-section">
            <slot name="FoodInfo" />
        </div>

        <div class="quantity-section">
            <slot name="QuantitySelector" />
        </div>

        <div class="add-to-cart-section">
            <slot name="AddToCartBar" />
        </div>

    </div>
</template>

<style scoped>
.food-detail-page {
    min-height: 100vh;
    background: var(--bg-main);
    padding-bottom: 120px;
}

.hero-section {
    position: relative;
    height: 300px;
}

.food-info-section {
    background: var(--bg-surface);
    margin-top: -24px;
    border-radius: 24px 24px 0 0;
    padding: 24px 20px;
    position: relative;
}

.quantity-section {
    background: var(--bg-surface);
    padding: 20px;
    margin-top: 8px;
}

.add-to-cart-section {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px;
    padding-bottom: calc(16px + env(safe-area-inset-bottom, 0));
    background: var(--bg-surface);
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.06);
}
</style>
