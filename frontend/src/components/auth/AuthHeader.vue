<script>

export default {
    methods: {
        onClickedToHome() {
            this.$router.push('/home')
        }
    }
}
</script>

<template>

    <div v-on:click="onClickedToHome" class="container">
        <div class="logo">
            <q-img
            ratio="1"
            src="/logo/sariko/sariko_logo_dark_bg-removebg.png" 
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
    width: 40%;
}

.logo-subtitle {
    margin-top: 20px;
    font-family: $sariko-font-family-secondary;
    font-weight: 700;
    font-size: 12px;
    color:rgb(122, 140, 174);
    z-index: 1;
}

</style>