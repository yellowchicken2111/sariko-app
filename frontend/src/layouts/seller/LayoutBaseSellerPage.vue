<script>
</script>

<template>

    <div class="background">

        <div class="main">

            <div class="seller-info-section">
                <slot name="SellerInfo" />
            </div>

            <div class="banner-header-section">
                <slot name="BannerHeader" />
            </div>

            <div class="banner-featured">
                <slot name="BannerFeatured" />
            </div>

            <q-separator class="seperator"/>

            <div class="categories-section">
                <slot name="Categories" />
            </div>

            <q-separator class="seperator"/>

            <div class="menu-section">
                <slot name="Menu" />
            </div>

            <div class="safe-area" style="height: 85px;" />

        </div>

    </div>

</template>


<style scoped>
.background {
    width: 100%;
    padding: 10px;
}

.seller-info-section {
    margin-bottom: 5px;
    padding: 0px 10px;
}

.banner-header-section {
    margin-bottom: 20px;
    padding: 0px 10px;
}

.banner-featured {
    margin-bottom: 10px;
}

.categories-section {
    margin-bottom: 0px;
}

.seperator {
    background-color: #373c45;
    margin-bottom: 5px;
}

.menu-section {
    margin-top: 20px;
}

</style>