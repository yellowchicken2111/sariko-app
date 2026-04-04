<script>
</script>

<template>

    <div class="background">

        <div class="container">

            <div class="header-greeting-text">
                <slot name="HeaderGreetingText" />
            </div>

            <div class="header-greeting-subtext">
                <slot name="HeaderGreetingSubText" />
            </div>
            
            <div class="phone-number-section">
                <slot name="PhoneNumberSection" />
            </div>

            <div class="delivery-address-section">
                <slot name="DeliveryAddressSection" />
            </div>

            <div class="prefred-language-section">
                <slot name="PreferedLanguageSection" />
            </div>

            <div class="button-group-section">
                <slot name="ButtonGroupSection" />
            </div>

        </div>
    </div>

</template>

<style lang="scss" scoped>

.background {
    width: 100vw;
    height: 100vh;
    background-color: #121b2f;

    font-family: $sariko-font-family-secondary;
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.header-greeting-text {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 10px;
}

.header-greeting-text {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 10px;
}

.phone-number-section {
    width: 100%;
}

.delivery-address-section {
    width: 100%;
}

.prefred-language-section {
    width: 100%;
}

.button-group-section {
    width: 100%;
}
</style>