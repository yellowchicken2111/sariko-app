<script>
</script>

<template>

    <div class="background">

        <div class="container">

            <div class="section-cart-items">
                <slot name="CartItems" />
            </div>

            <div class="section-total-amount">
                <slot name="TotalAmount" />
            </div>

        </div>

    </div>

</template>

<style lang="scss" scoped>

.background {
    background-color: blueviolet;
    width: 100vw;
    height: 100vh;
}

.container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding-bottom: var(--bottom-nav-height);
}

.section-cart-items {
    background-color: red;
}

.section-total-amount {
    background-color: red;
}

</style>