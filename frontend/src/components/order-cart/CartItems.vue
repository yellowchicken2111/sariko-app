<script>
import { mapActions, mapState } from 'pinia';
import { useCartStore } from '@/stores/cart/cartStore.js';
import ItemCard from '@/components/order-cart/ItemCard.vue';

export default {

    components: {
        ItemCard
    },

    setup() {
        
    },

    computed: {
        ...mapState(useCartStore, [
            "cartItems"
        ])
    },

    mounted() {
        if (!this.cartItems.length) {
            const cartStore = useCartStore()
            cartStore.getCurrentCart()
        }
    }
}

</script>

<template>
    <div class="background">
        <div class="container">
            <q-scroll-area class="cart-items-scroll-area">
                <div v-for="item in cartItems">
                    <ItemCard 
                    :item-id="item.id"
                    :item-name="item.name"
                    :item-price-text="item.priceText"
                    :item-category="item.category"
                    :item-img-src="item.imgSrc"
                    :item-quantity="item.quantity"
                    :seller-store="item.sellerStore"
                    :seller-slug-name="item.sellerSlugName"
                    />
                </div>
            </q-scroll-area>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    padding: 0px 15px;
}

.cart-items-scroll-area {
    height: calc(100vh - var(--breadcrumbs-height) - var(--total-amount-height) - 20px);
    white-space: nowrap;
}
</style>