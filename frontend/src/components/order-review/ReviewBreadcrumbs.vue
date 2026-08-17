<script>
import PageBreadcrumbs from '@/components/shared/PageBreadcrumbs.vue';

export default {
    components: { PageBreadcrumbs },

    computed: {
        backTo() {
            return `/orders/${this.$route.params.orderId}`
        }
    }
}
</script>

<template>
    <PageBreadcrumbs :title="$t('order_review.title')" :backTo="backTo" />
</template>
