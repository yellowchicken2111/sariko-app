<script>
import { ChevronLeft, EllipsisVertical } from 'lucide-vue-next';

export default {
    components: {
        ChevronLeft,
        EllipsisVertical
    },

    mounted() {        
        const heightBreadCrumbs = this.$refs.breadcrumbsRef.offsetHeight || 0
        document.documentElement.style.setProperty('--breadcrumbs-height', `${heightBreadCrumbs}px`)
    }
}
</script>

<template>

    <div ref="breadcrumbsRef" class="breadcrumbs">
        <div>
            <q-btn class="button" round dense no-caps size="12px" @click="$router.back()">
                <ChevronLeft :size="18" />
            </q-btn>
        </div>
        <div class="title">
            {{ $t('breadcrumbs.cart_page') }}
        </div>
        <div>
            <q-btn class="button" round dense no-caps size="12px" @click="">
                <EllipsisVertical :size="18" />
            </q-btn>
        </div>
    </div>

</template>

<style lang="scss" scoped>
.breadcrumbs {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
}

.button {
    background-color: rgb(255, 255, 255, 0.2);
}

.title {
    font-family: $sariko-font-family-secondary;
    font-size: 20px;
    font-weight: 700;
}
</style>