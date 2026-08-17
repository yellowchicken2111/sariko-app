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
    min-height: 100vh;
    min-height: 100dvh;
    height: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--bg-main);
    padding: 50px 0px 100px 0px;
}

.container {
    width: 100%;
}

.section-auth-header {
    margin-bottom: 20px;
}

.section-auth-button-group {
    width: 100%;
    margin-bottom: 20px;
}
</style>