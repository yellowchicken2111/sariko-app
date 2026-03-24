<script>
import LayoutBaseSellerPage from '@/layouts/seller/LayoutBaseSellerPage.vue';
import SellerInfo from '@/components/seller/seller-page/SellerInfo.vue';
import Banner from '@/components/seller/seller-page/Banner.vue';
import BannerFeatured from '@/components/seller/seller-page/BannerFeatured.vue'
import Categories from '@/components/seller/seller-page/Categories.vue';
import Menu from '@/components/seller/seller-page/Menu.vue';

export default {
    components: {
        LayoutBaseSellerPage,
        SellerInfo,
        Banner,
        BannerFeatured,
        Categories,
        Menu
    }
}
</script>

<template>

    <LayoutBaseSellerPage>

        <template #SellerInfo>
            <SellerInfo />
        </template>

        <template #BannerHeader> 
            <Banner />
        </template>

        <template #BannerFeatured>
            <BannerFeatured />
        </template>

        <template #Categories>
            <Categories />
        </template>

        <template #Menu>
            <Menu />
        </template>

    </LayoutBaseSellerPage>

</template>

<style>
</style>