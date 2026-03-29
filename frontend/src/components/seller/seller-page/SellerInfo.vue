<script>
import { mapActions, mapState } from 'pinia';
import LayoutSellerInfo from '@/layouts/seller/LayoutSellerInfo.vue';
import { Check, Star, Flame } from 'lucide-vue-next';
import { useSellerStore } from '@/stores/seller/seller-store';
export default {
    
    components: {
        LayoutSellerInfo,
        Check, Flame, Star
    },

    data() {
        return {
        }
    },

    computed: {
        ...mapState(useSellerStore, [
            "seller"
        ])
    },

    methods: {
        ...mapActions(useSellerStore, [
            "getSellerbySlugName"
        ])
    },
    
    mounted() {
        const sellerSlugName = this.$route.params.slugName
        this.seller = this.getSellerbySlugName(sellerSlugName)
        // this.sellerIndex = this.foundingSellers.findIndex(seller => seller.slug == sellerSlugName)
    }
}

</script>

<template>

    <LayoutSellerInfo>

        <template #SellerAvatar>
            <q-avatar size="64px">
                <img :src="seller?.avatar_url">
            </q-avatar>
        </template>

        <template #SellerName>
            <div class="seller-name">
                {{ seller?.store_name }}
            </div>
        </template>

        <template #SellerAddress>
            <div class="seller-address">
                🏠 {{ seller?.address }}
            </div>
        </template>         

        <template #SellerTags>
            <div class="seller-tags">
                <q-chip
                class="tag-1"
                >
                    <Star size="12px" :stroke-width='3'/>
                    &nbsp Founding Seller
                </q-chip>

                <q-chip
                class="tag-2"
                >
                    <Check size="12px" :stroke-width='3'/>
                    &nbsp Verified
                </q-chip>

                <q-chip
                class="tag-3"
                >
                    <Flame size="12px" :stroke-width='3'/>
                    &nbsp Popular
                </q-chip>
            </div>
        </template>

    </LayoutSellerInfo>

</template>

<style lang="scss" scoped>
.seller-name {
    font-family: $sariko-font-family-primary;
    font-size: 18px;
    font-weight: 700;
}

.seller-address {
    font-family: $sariko-font-family-secondary;
    font-size: 10px;
    font-weight: 400;
    color: rgb(122, 140, 174)

}

.tag-1 {
    background-color: #46412a; 
    color: #ffd000; 
    font-weight: 600; 
    font-size: 10px;
}


.tag-2 {
    background-color: #174445; 
    color: #00ff6e; 
    font-weight: 600; 
    font-size: 10px;
}

.tag-3 {
    background-color: #532b42; 
    color: #e44622; 
    font-weight: 600;  
    font-size: 10px;
}
</style>