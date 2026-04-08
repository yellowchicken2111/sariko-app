<script>
import LayoutBaseFoodDetail from '@/layouts/food-detail/LayoutBaseFoodDetail.vue';
import HeroImage from '@/components/food-detail/HeroImage.vue';
import FoodInfo from '@/components/food-detail/FoodInfo.vue';
import QuantitySelector from '@/components/food-detail/QuantitySelector.vue';
import AddToCartBar from '@/components/food-detail/AddToCartBar.vue';
import { useSellerStore } from '@/stores/seller/sellerStore';

export default {
    name: 'FoodDetailPage',

    components: {
        LayoutBaseFoodDetail,
        HeroImage,
        FoodInfo,
        QuantitySelector,
        AddToCartBar,
    },

    props: {
        sellerId: { type: String, required: true },
        foodId: { type: String, required: true },
    },

    mounted() {
        const sellerStore = useSellerStore()
        sellerStore.loadFoodDetail(this.sellerId, this.foodId)
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

        <template #QuantitySelector>
            <QuantitySelector />
        </template>

        <template #AddToCartBar>
            <AddToCartBar />
        </template>

    </LayoutBaseFoodDetail>
</template>
