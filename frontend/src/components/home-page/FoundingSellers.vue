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
        <!-- Skeleton -->
        <div v-if="foundingSellers.length === 0" class="skeleton-row">
            <div v-for="i in 3" :key="i" class="skeleton-card">
                <q-skeleton type="circle" size="48px" animation="pulse" />
                <div class="skeleton-text">
                    <q-skeleton type="text" width="80px" height="10px" animation="pulse" />
                    <q-skeleton type="text" width="60px" height="8px" animation="pulse" style="margin-top: 4px;" />
                </div>
            </div>
        </div>

        <!-- Real data -->
        <div v-else>
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

.skeleton-row {
    display: flex;
    gap: 15px;
    overflow: hidden;
}

.skeleton-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: .75rem;
    flex-shrink: 0;
}

.skeleton-text {
    display: flex;
    flex-direction: column;
}
</style>