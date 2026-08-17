<script>
import LayoutBaseFoodDetail from '@/layouts/food-detail/LayoutBaseFoodDetail.vue';
import HeroImage from '@/components/food-detail/HeroImage.vue';
import FoodInfo from '@/components/food-detail/FoodInfo.vue';
import FoodReviews from '@/components/food-detail/FoodReviews.vue';
import BottomActionBar from '@/components/food-detail/BottomActionBar.vue';
import { useSellerStore } from '@/stores/seller/sellerStore';
import { useReviewStore } from '@/stores/review/reviewStore';

export default {
    name: 'FoodDetailPage',

    components: {
        LayoutBaseFoodDetail,
        HeroImage,
        FoodInfo,
        FoodReviews,
        BottomActionBar,
    },

    props: {
        sellerSlug: { type: String, required: true },
        foodId: { type: String, required: true },
    },

    mounted() {
        const sellerStore = useSellerStore()
        sellerStore.loadFoodDetail(this.sellerSlug, this.foodId)

        // Public endpoint keyed by foodId alone, so it does not wait on the menu fetch
        // that loadFoodDetail needs to resolve the dish.
        useReviewStore().getFoodReviews(this.foodId)
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

        <template #FoodReviews>
            <FoodReviews />
        </template>

        <template #BottomActionBar>
            <BottomActionBar />
        </template>

    </LayoutBaseFoodDetail>
</template>
