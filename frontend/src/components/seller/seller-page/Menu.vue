<script>
import { mapState } from 'pinia';
import { useSellerStore } from '@/stores/seller/seller-store'; 
import FoodCard from '@/components/seller/seller-page/FoodCard.vue'

export default {
    components: {
        FoodCard,
    },
    computed: {
        ...mapState(useSellerStore, [
            "menu",
            "selectedCategoryMenu"
        ])
    }
}
</script>

<template>

    <div class="background">

        <div class="container">
            <q-scroll-area style="height: 550px; white-space: nowrap;">
                <div class="row q-gutter-md" style="justify-content: center;">
                    <div v-for="food in menu" class="col-6" style="width: 45%;">
                        <FoodCard
                        :name="food.name"
                        :price="food.price_text"
                        :imgSrc="food.image_url"
                        />
                    </div>
                </div>
            </q-scroll-area>
        </div>

    </div>

</template>

<style lang="scss" scoped>
.background {
    padding: 0px 10px;
}
</style>