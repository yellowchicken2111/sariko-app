<script>
import LayoutBaseFoodDetail from '@/layouts/food-detail/LayoutBaseFoodDetail.vue';
import HeroImage from '@/components/food-detail/HeroImage.vue';
import FoodInfo from '@/components/food-detail/FoodInfo.vue';
import BottomActionBar from '@/components/food-detail/BottomActionBar.vue';
import { useSellerStore } from '@/stores/seller/sellerStore';

export default {
    name: 'FoodDetailPage',

    components: {
        LayoutBaseFoodDetail,
        HeroImage,
        FoodInfo,
        BottomActionBar,
    },

    props: {
        sellerSlug: { type: String, required: true },
        foodId: { type: String, required: true },
    },

    mounted() {
        const sellerStore = useSellerStore()
        sellerStore.loadFoodDetail(this.sellerSlug, this.foodId)
    }
}
</script>

<template>
    <LayoutBaseFoodDetail>

        <template #HeroImage>
            <HeroImage />
        </template>

        <template #FoodInfo>
            <FoodInfo />
        </template>

        <template #BottomActionBar>
            <BottomActionBar />
        </template>

    </LayoutBaseFoodDetail>
</template>
