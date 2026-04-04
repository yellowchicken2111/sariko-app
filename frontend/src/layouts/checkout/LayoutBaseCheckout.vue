<script>
export default {
    name: 'LayoutBaseCheckout'
}
</script>

<template>
    <div class="background">
        <div class="container">

            <div class="header-section">
                <slot name="Header" />
            </div>

            <div class="scrollable-content">

                <div class="delivery-method-section">
                    <slot name="DeliveryMethod" />
                </div>

                <div class="delivery-address-section">
                    <slot name="DeliveryAddress" />
                </div>

                <div class="order-summary-section">
                    <slot name="OrderSummary" />
                </div>

                <div class="note-section">
                    <slot name="Note" />
                </div>

                <div class="payment-method-section">
                    <slot name="PaymentMethod" />
                </div>

            </div>

            <div class="footer-section">
                <slot name="Footer" />
            </div>

        </div>
    </div>
</template>

<style lang="scss" scoped>
.background {
    width: 100vw;
    min-height: 100vh;
    max-width: 800px;
    margin: 0 auto;
}

.container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--bg-main);
    font-family: $sariko-font-family-secondary;
}

.header-section {
    flex-shrink: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.scrollable-content {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    padding-bottom: 20px;
}

.delivery-method-section {
    margin-bottom: 24px;
}

.delivery-address-section {
    margin-bottom: 24px;
}

.order-summary-section {
    margin-bottom: 24px;
}

.note-section {
    margin-bottom: 24px;
}

.payment-method-section {
    margin-bottom: 24px;
}

.footer-section {
    flex-shrink: 0;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-width: 800px;
    margin: 0 auto;
    z-index: 10;
}
</style>
