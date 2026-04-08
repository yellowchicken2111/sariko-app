<script>
import PageBreadcrumbs from '@/components/shared/PageBreadcrumbs.vue';

export default {
    components: { PageBreadcrumbs }
}
</script>

<template>
    <PageBreadcrumbs :title="$t('breadcrumbs.cart_page')" cssHeightVar="--breadcrumbs-height" />
</template>
