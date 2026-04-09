<script>
import { mapState } from 'pinia';
import { useSellerStore } from '@/stores/seller/sellerStore';
import LayoutBaseSellerPage from '@/layouts/seller/LayoutBaseSellerPage.vue';
import SellerInfo from '@/components/seller/seller-page/SellerInfo.vue';
import Banner from '@/components/seller/seller-page/Banner.vue';
import BannerFeatured from '@/components/seller/seller-page/BannerFeatured.vue'
import Categories from '@/components/seller/seller-page/Categories.vue';
import Menu from '@/components/seller/seller-page/Menu.vue';
import SellerPageSkeleton from '@/components/seller/seller-page/SellerPageSkeleton.vue';

export default {
    components: {
        LayoutBaseSellerPage,
        SellerInfo,
        Banner,
        BannerFeatured,
        Categories,
        Menu,
        SellerPageSkeleton
    },

    computed: {
        ...mapState(useSellerStore, ['seller'])
    },

    mounted() {
        const sellerStore = useSellerStore()
        sellerStore.seller = null
        sellerStore.menus = []
        sellerStore.menuCategories = []
        sellerStore.selectedCategoryMenu = null
        const slugName = this.$route.params.slugName
        sellerStore.getSellerbySlugName(slugName)
    }
}
</script>

<template>

    <SellerPageSkeleton v-if="!seller" />

    <LayoutBaseSellerPage v-else>

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