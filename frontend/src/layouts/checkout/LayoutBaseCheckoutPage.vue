<script>

export default {
    mounted() {
        const heighBottomSection = this.$refs.bottomSection.offsetHeight || 0
        document.documentElement.style.setProperty('--checkout-page-bottom-section-height', `${heighBottomSection}px`)

        const heightBreadScrumbs = this.$refs.breadscrumbsRef.offsetHeight || 0
        document.documentElement.style.setProperty('--checkout-page-breadcrumbs-height', `${heightBreadScrumbs}px`)
    }
}

</script>

<template>

    <div class="background">

        <div ref="breadscrumbsRef" class="breadcrumbs">
            <slot name="Breadcrumbs" />
        </div>

        <div class="checkout-page-container">

            <q-scroll-area class="scroll-area">
                <div class="checkout-content">
                    
                        <div class="delivery-adress-section">
                            <slot name="DeliveryAddress" />
                        </div>

                        <div class="cart-preview-section">
                            <slot name="CartPreview" />
                        </div>

                        <div class="intruction-section">
                            <slot name="Instruction" />
                        </div>
                </div>
            </q-scroll-area>
            
            <div ref="bottomSection" class="total-amount-section">
                <slot name="TotalAmounts" />
            </div>
        </div>        
    </div>

</template>

<style lang="scss" scoped>

.background {
    width: 100vw;
    height: 100vh;
    font-family: $sariko-font-family-secondary;
}

.checkout-page-container {
    height: calc(100vh - var(--checkout-page-breadcrumbs-height));
    display: flex;
    flex-direction: column;
}

.checkout-content {
    padding: 15px 15px 15px 15px;
}

.scroll-area {
    flex: 1;
}

.delivery-adress-section {
    margin-bottom: 20px;
}

.total-amount-section {
    margin-top: 20px;
    width: 100%;
}

</style>