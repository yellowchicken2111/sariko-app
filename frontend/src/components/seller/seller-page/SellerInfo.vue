<script>
import { mapActions, mapState } from 'pinia';
import LayoutSellerInfo from '@/layouts/seller/LayoutSellerInfo.vue';
import { User, Check, Star, Flame } from 'lucide-vue-next';
import { useSellerStore } from '@/stores/seller/sellerStore'

export default {
    
    components: {
        LayoutSellerInfo,
        Check, Flame, Star, User
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
    }
}

</script>

<template>

    <LayoutSellerInfo>

        <template #SellerAvatar>
            <q-avatar v-if="seller?.avatarUrl" size="64px">
                <img :src="seller?.avatar_url">
            </q-avatar>
            <div v-else class="guest-icon">
                <User :size="28" />
            </div>
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

.guest-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.6);
}

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