<template>
    <div class="payment-return-page">
        <div class="content-section">
            <slot name="PaymentResult" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.payment-return-page {
    width: 100%;
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    padding-top: 50%;
    justify-content: center;
    font-family: $sariko-font-family-secondary;
}

.content-section {
    width: 100%;
    max-width: 430px;
    padding: 40px 24px;
}
</style>
