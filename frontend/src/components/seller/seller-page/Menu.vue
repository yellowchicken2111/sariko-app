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
            "menus",
            "selectedCategoryMenu"
        ])
    }
}
</script>

<template>

    <div class="background">

        <div class="main">
            <div class="row q-gutter-md" style="justify-content: center;">
                <div v-for="menu in menus[selectedCategoryMenu]" class="col-6" style="width: 45%;">
                    <FoodCard
                    :name="menu.name"
                    :price="menu.price"
                    :imgSrc="menu.imgSrc"
                    />
                </div>

            </div>
        </div>

    </div>

</template>

<style lang="scss" scoped>
.background {
    padding: 0px 10px;
}
</style>