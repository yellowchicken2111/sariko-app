<script>
import { mapState, mapWritableState } from 'pinia';
import { useSellerStore } from '@/stores/seller/sellerStore';
import { useCartStore } from '@/stores/cart/cartStore';
import FoodCard from '@/components/seller/seller-page/FoodCard.vue'
import MenuEmptyState from '@/components/seller/seller-page/MenuEmptyState.vue'
import ModalCartConflict from '@/components/order-cart/ModalCartConflict.vue';

export default {
    components: {
        FoodCard,
        MenuEmptyState,
        ModalCartConflict
    },

    computed: {
        ...mapState(useSellerStore, [
            "menu",
            "selectedCategoryMenu"
        ]),

        ...mapWritableState(useCartStore, [
            "isShowModalCartConflict"
        ])
    }
}
</script>

<template>

    <div class="background">

        <div class="container">
            <q-scroll-area v-if="menu.length > 0" style="height: 550px; white-space: nowrap;">
                <div class="row q-gutter-md" style="justify-content: center;">
                    <div v-for="food in menu" class="col-6" style="width: 45%;">
                        <FoodCard
                        :item-id="food.id"
                        :name="food.name"
                        :price="food.price_text"
                        :imgSrc="food.image_url ? food.image_url : '/images/default-food-image.webp'"
                        />
                    </div>
                </div>
            </q-scroll-area>
            <MenuEmptyState v-else />
        </div>

    </div>

    <q-dialog v-model="isShowModalCartConflict">
        <ModalCartConflict />
    </q-dialog>

</template>

<style lang="scss" scoped>
.background {
    padding: 0px 10px;
}
</style>