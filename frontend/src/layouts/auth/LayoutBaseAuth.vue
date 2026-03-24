<script>
</script>

<template>
    <div class="background">

        <div class="container">

            <div class="section-auth-header">
                <slot name="AuthHeader" />
            </div>

            <div class="section-auth-button-group">
                <slot name="AuthButtonGroup" />
            </div>

            <div class="section-auth-input-fields">
                <slot name="AuthInputFields" />
            </div>

        </div>

    </div>
</template>

<style scoped>

.background {
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 10%;
    background-color: #1B2A4A;
}

.container {
    width: 100%;
}

.section-auth-header {
    margin-bottom: 40px;
}

.section-auth-button-group {
    width: 100%;
}
</style>