<script>
import { mapState } from 'pinia';
import { useSellerStore } from '@/stores/seller/seller-store';
import SellerCard from '@/components/seller/seller-list/SellerCard.vue';

export default {

    components: {
        SellerCard
    },

    computed: {
        ...mapState(useSellerStore, [
            "sellers"
        ])
    }
}

</script>

<template>
    <div class="container">

        <div class="group-title">

            <div class="title">
                ⭐ Founding Sellers
            </div>
            <div class="button-see-all">
                <q-btn
                no-caps
                style="color: #bb8221; font-size: 12px; font-weight: 700;"
                label="See all" 
                />
            </div>

        </div>
        <div>
            <q-scroll-area style="height: 100px; white-space: nowrap;">
                <div class="row no-wrap">
                    
                    <div v-for="(seller, index) in sellers" class="seller-card">
                        <SellerCard 
                        :index="index+1"
                        :seller-name="seller.name"
                        :seller-avatar-image-u-r-l="seller.avatarImg"
                        :seller-featured-category="seller.name"
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
}

.title {
    font-size: 13px;
    font-weight: 700;
}
</style>