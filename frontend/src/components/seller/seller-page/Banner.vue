<script>
import { Check, Star, Flame } from 'lucide-vue-next';
import { useSellerStore } from '@/stores/seller/sellerStore';
import { mapActions, mapState } from 'pinia';
export default {
    components: {
        Star
    },

    computed: {
        ...mapState(useSellerStore, [
            "totalItems"
        ])
    }
}

</script>

<template>

    <div class="row q-gutter-sm main">

        <div class="col card-info">
            <div style="color: rgb(245, 166, 35); font-weight: 800;">
                <Star size="15px" />
                4.9
            </div>
            <div style="font-size: 8px; font-weight: 600; color: rgb(122, 140, 174)">
                {{ $t('seller_page.section_banner.banner_card_rating_subtitle') }}
            </div>
        </div>

        <div class="col card-info">
            <div style="color: white; font-weight: 800;">
                {{ totalItems }}
            </div>
            <div style="font-size: 8px; font-weight: 600; color: rgb(122, 140, 174)">
                {{ $t('seller_page.section_banner.banner_card_orders_subtitle') }}
            </div>
        </div>

        <div class="col card-info">
            <div style="color: #48d77d; font-weight: 800;">
                {{ $t('seller_page.section_banner.banner_card_status_text_open') }}
            </div>
            <div style="font-size: 8px; font-weight: 600; color: rgb(122, 140, 174)">
                {{ $t('seller_page.section_banner.banner_card_status_subtitle') }}
            </div>
        </div>
    
    </div>

    <div class="banner">
        <div></div>
    </div>

</template>

<style lang="scss" scoped>

.main {
    display: flex;
    font-family: $sariko-font-family-secondary;
}

.card-info {
    border: solid 2px #2d3139;
    background-color: #181e2c;
    border-radius: .75rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px 20px;
}
</style>