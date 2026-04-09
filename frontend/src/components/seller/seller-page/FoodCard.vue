<script>
import { mapActions, mapState } from 'pinia';
import { useSellerStore } from '@/stores/seller/sellerStore';
import { useCartStore } from '@/stores/cart/cartStore';

export default {
    props: {

        itemId: {
            required: true,
            type: String
        },

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

    computed: {
        ...mapState(useSellerStore, [
            "seller"
        ])
    },

    methods: {
        ...mapActions(useCartStore, [
            "addItem"
        ])
    }

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
                @click="addItem(seller.id, itemId, seller.store_name)"
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