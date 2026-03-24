<script>
</script>

<template>

    <div class="container">
        <div class="logo">
            <q-img
            ratio="1"
            src="/logo/sariko/sariko_logo_dark_bg.jpg" 
            />
        </div>

        <div class="logo-subtitle">
            {{ $t('auth_page.subtitle_text_header') }}
        </div>
    </div>

</template>

<style lang="scss" scoped>

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.logo {
    width: 60%;
    height: fit-content;
    z-index: 0;
}

.logo-subtitle {
    margin-top: -35px;
    font-family: $sariko-font-family-secondary;
    font-weight: 700;
    font-size: 12px;
    color:rgb(122, 140, 174);
    z-index: 1;
}

</style>