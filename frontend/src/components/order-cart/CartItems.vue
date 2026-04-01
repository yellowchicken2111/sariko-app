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
        const cartStore = useCartStore()
        cartStore.$reset()
        cartStore.getCurrentCart()
    }
}

</script>

<template>
    <div class="background">
        <div class="container">
            <div v-for="item in cartItems">
                <ItemCard 
                :item-id="item.id"
                :item-name="item.name"
                :item-price-text="item.priceText"
                :item-category="item.category"
                :item-img-src="item.imgSrc"
                :item-quantity="item.quantity"
                />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
</style>