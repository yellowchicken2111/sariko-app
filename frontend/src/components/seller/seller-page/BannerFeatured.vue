<script>
</script>

<template>

    <div class="container">

        <div class="banner-icon">
            🎁
        </div>

        <div class="banner-text">

            <span class="line-1">{{ $t('seller_page.section_banner_featured.banner_text_line_1') }}</span> &nbsp;
            <span class="line-2">{{ $t('seller_page.section_banner_featured.banner_text_line_2') }}</span>

        </div>

    </div>
</template>

<style lang="scss" scoped>
.container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 20px;
    border: 1px solid $accent;
    border-radius: .75rem;
    background-color: #2c261f;
    font-family: $sariko-font-family-secondary;
    line-height: 1;
}

.banner-icon {
    margin-right: 10px;
}

.line-1 {
    font-weight: 700;
    font-size: 9px; 
    color: $accent;
}

.line-2 {
    font-weight: 700;
    font-size: 9px; 
    color: rgb(122, 140, 174);
}
</style>