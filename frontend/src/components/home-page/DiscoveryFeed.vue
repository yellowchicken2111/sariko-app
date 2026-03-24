<script>
import { mapState } from 'pinia';
import { useSellerStore } from '@/stores/seller/seller-store';
// import SellersNearby from '@/components/seller/seller-list/SellersNearby.vue'
// import SellersPopular from '@/components/seller/seller-list/SellersPopular.vue';
// import SellersNew from '@/components/seller/seller-list/SellersNew.vue'
import FoundingSellers from '@/components/home-page/FoundingSellers.vue';
import FeaturedDishes from '@/components/home-page/FeaturedDishes.vue';
import { sellers } from '@/stores/data';

export default {
    data() {
        return {
            sellers: sellers
        }
    },

    components: {
        // SellersNearby,
        // SellersPopular,
        // SellersNew,
        FoundingSellers,
        FeaturedDishes,
    },

    computed: {
        ...mapState(useSellerStore, [
            "filteredSellers"
        ])
    }
}

</script>

<template>

    <div class="discovery-feed" v-if="sellers.length > 0">

        <!-- <div class="section-nearby-sellers">
            <SellersNearby />
        </div>

        <div class="section-popular-sellers">
            <SellersPopular />
        </div>

        <div class="section-new-sellers">
            <SellersNew />
        </div> -->
        
        <div class="section-founding-sellers">
            <FoundingSellers />
        </div>

        <div class="section-featured-dishes">
            <FeaturedDishes />
        </div>

    </div>

    <div v-else class="empty-state">
        <p>No sellers or food items match your search.</p>
    </div>

</template>

.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: var(--text-secondary);
    font-size: 15px;
}
<style scoped>
</style>