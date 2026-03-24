<script>
import FeaturedDishCard from '@/components/home-page/FeaturedDishCard.vue';

export default {
    name: 'FeaturedDishCard',
    props: {
        name: {
            required: true,
            type: String
        },

        price: {
            required: true,
            type: String
        },

        imgSrc: {
            required: true,
            type: String
        }
    },
}
</script>

<template>
    <div class="card">

        <div class="food-image">
            <q-img
            :src="imgSrc"
            :ratio="16/9"
            />
        </div>

        <div class="food-info">

            <div class="">
                <div class="food-name">
                    {{ name }}
                </div>

                <div class="food-price">
                    ₫{{ price }}
                </div>
            </div>

            <div class="button-add-cart">
                <q-btn
                flat
                dense
                no-caps
                >
                    <q-icon name="fa-solid fa-circle-plus" style="color: #f5A623" />
                </q-btn>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.card {
    background-color:#121827;
    height: 100%;
    padding: 0;
    font-family: $sariko-font-family-secondary;
    overflow-x: hidden;
    border-radius: 0.75rem;
}


.food-info {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.food-name {
    font-size: 12px;
    font-weight: 700;
}

.food-price {
    font-weight: 600;
    color: var(--text-active);
}

</style>