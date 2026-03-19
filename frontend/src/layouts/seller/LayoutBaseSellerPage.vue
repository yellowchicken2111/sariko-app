<script>
</script>

<template>

    <div class="background">

        <div class="main">

            <div class="banner-header-section">
                <slot name="BannerHeader" />
            </div>

            <div class="seller-info-section">
                <slot name="SellerInfo" />
            </div>

            <div class="categories-section">
                <slot name="Categories" />
            </div>

            <div class="menu-section">
                <slot name="Menu" />
            </div>

            <div class="">

            </div>

        </div>

    </div>

</template>


<style scoped>
</style>