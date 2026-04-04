<script>
import { useI18n } from 'vue-i18n';
import { mapActions, mapState } from 'pinia';
import { useSellerStore } from '@/stores/seller/sellerStore';
import SellerCard from '@/components/seller/seller-list/SellerCard.vue';

export default {

    setup() {
        const {t, locale} = useI18n()
    },


    components: {
        SellerCard
    },

    computed: {
        ...mapState(useSellerStore, [
            "sellers",
            "foundingSellers"
        ])
    },

    methods: {
        ...mapActions(useSellerStore, [
            "getFoundingSellers"
        ])
    },

    created() {
        this.getFoundingSellers()
    }
}

</script>

<template>
    <div class="container">

        <div class="group-title">

            <div class="title">
                ⭐ {{ $t("home_page.section_founding_sellers.title") }}
            </div>
            <div class="button-see-all">
                <q-btn
                no-caps
                style="color: #bb8221; font-size: 12px; font-weight: 700;"
                :label="$t('home_page.section_founding_sellers.button_label_see_all')"
                />
            </div>

        </div>
        <div>
            <q-scroll-area style="height: 80px; white-space: nowrap;">
                <div class="row no-wrap">
                    
                    <div v-for="(seller, index) in foundingSellers" :key="seller.id" class="seller-card">
                        <SellerCard 
                        :seller-index="index+1"
                        :seller-name="seller.store_name",
                        :seller-slug-name="seller.slug"
                        :seller-avatar-image-u-r-l="seller.avatar_url"
                        :seller-featured-category="'Exclusive Dishes'"
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