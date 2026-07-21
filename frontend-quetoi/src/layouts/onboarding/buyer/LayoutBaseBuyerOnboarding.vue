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

            <div class="preferred-language-section">
                <slot name="PreferredLanguageSection" />
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
    height: 100dvh;
    background-color: var(--bg-main);

    font-family: $quetoi-font-family-secondary;
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50px 30px 0px 30px;
}

.header-greeting-text {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 10px;
}

.header-greeting-subtext {
    font-size: 14px;
    color: var(--text-muted);
    margin-bottom: 30px;
}

.phone-number-section {
    width: 100%;
    margin-bottom: 30px;
}

.delivery-address-section {
    width: 100%;
    margin-bottom: 30px;
}

.preferred-language-section {
    width: 100%;
    margin-bottom: 40px;
}

.button-group-section {
    width: 100%;
}
</style>