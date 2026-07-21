<script>
export default {
    mounted() {
        const height = this.$refs.refContent?.offsetHeight || 0
        document.documentElement.style.setProperty('--page-home-comp-banner-height', `${height}px`)
    }
}
</script>

<template>

    <div ref="refContent" class="container">

        <div class="banner-text">

            <span class="line-1">🏪 {{ $t('home_page.section_banner.banner_text_line_1') }}</span>
            <br>
            <span class="line-2">{{ $t('home_page.section_banner.banner_text_line_2') }}</span>
            <br>
            <span class="line-3">{{ $t('home_page.section_banner.banner_text_line_3') }}</span>

        </div>

    </div>



</template>

<style lang="scss" scoped>
.container {
    font-family: $quetoi-font-family-secondary;
    line-height: 1.25;
    background-color: var(--bg-shell);
    height: 100%;
    padding: 0;
    border-radius: 0.75rem;
    padding: 5px 0px 10px 20px;
}

.line-1 {
    font-weight: 700;
    font-size: 9px; 
    color: $accent;
}

.line-2 {
    font-weight: 700;
    font-size: 13px;
    color: var(--text-on-shell);
}

.line-3 {
    font-weight: 700;
    font-size: 10px;
    color: rgba(245, 240, 232, 0.65);
}
</style>