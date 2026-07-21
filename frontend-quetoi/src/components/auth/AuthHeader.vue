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
            src="/logo/quetoi/logo-que-toi-white-bg.jpg"
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
    width: 45%;
    border-radius: var(--border-radius-lg);
    overflow: hidden;
    border: 1px solid var(--border-color);
}

.logo-subtitle {
    margin-top: 20px;
    font-family: $quetoi-font-family-secondary;
    font-weight: 700;
    font-size: 12px;
    color: var(--text-secondary);
    z-index: 1;
}

</style>