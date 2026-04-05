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
            <q-btn class="button" dense no-caps @click="$router.back()">
                <ChevronLeft class="icon" />
            </q-btn>
        </div>
        <div class="title">
            {{ $t('breadcrumbs.checkout_page') }}
        </div>
        <div>
            <q-btn class="button" dense no-caps @click="">
                <EllipsisVertical class="icon" />
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
    border-radius: 50%;
    padding: 10px;
}

.title {
    font-family: $sariko-font-family-secondary;
    font-size: 20px;
    font-weight: 700;
}
</style>