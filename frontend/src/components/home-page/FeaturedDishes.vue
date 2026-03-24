<script>
import { mapState } from 'pinia';
import { useHomeStore } from '@/stores/homeStore';
import FeaturedDishCard from '@/components/home-page/FeaturedDishCard.vue';

export default {
    components: {
        FeaturedDishCard
    },

    computed: {
        ...mapState(useHomeStore, [
            "featuredDishes"
        ])
    }
}

</script>

<template>

<div class="container">

    <div class="group-title">

        <div class="title">
            🔥 {{ $t("home_page.section_featured_dishes.title") }}
        </div>
        <div class="button-see-all">
            <q-btn
            no-caps
            style="color: #bb8221; font-size: 12px; font-weight: 700;"
            :label="$t('home_page.section_featured_dishes.button_label_view_store')" 
            />
        </div>

    </div>
    <div>
        <q-scroll-area style="height: 400px; white-space: nowrap;">
            <div class="row q-gutter-md" style="justify-content: stretch;">
                <div v-for="(dish, index) in featuredDishes" class="col-6" style="width: 45%;">
                    <FeaturedDishCard
                    :name="dish.name"
                    :price="dish.price"
                    :imgSrc="dish.imgSrc"
                    />
                </div>

            </div>
        </q-scroll-area>
    </div>

</div>

</template>

<style lang="scss" scoped>
.container {
    font-family: $sariko-font-family-secondary;
}

.group-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;
}

.title {
    font-size: 13px;
    font-weight: 700;
}
</style>