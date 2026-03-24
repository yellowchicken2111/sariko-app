<script>
</script>

<template>

    <div class="container">

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
    font-family: $sariko-font-family-secondary;
    line-height: 1.25;
    background-color:#121827;
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
}

.line-3 {
    font-weight: 700;
    font-size: 10px;
    color: rgb(122, 140, 174);
}
</style>