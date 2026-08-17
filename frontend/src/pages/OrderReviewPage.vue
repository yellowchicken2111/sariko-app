<script>
import LayoutBaseOrderReview from '@/layouts/order/order-review/LayoutBaseOrderReview.vue';
import ReviewBreadcrumbs from '@/components/order-review/ReviewBreadcrumbs.vue';
import OverallRating from '@/components/order-review/OverallRating.vue';
import ReviewItemsList from '@/components/order-review/ReviewItemsList.vue';
import ReviewSubmitBar from '@/components/order-review/ReviewSubmitBar.vue';
import { useOrderStore } from '@/stores/order/orderStore.js';
import { useReviewStore } from '@/stores/review/reviewStore.js';

export default {
    components: {
        LayoutBaseOrderReview,
        ReviewBreadcrumbs,
        OverallRating,
        ReviewItemsList,
        ReviewSubmitBar,
    },

    props: {
        orderId: {
            required: true,
            type: String
        }
    },

    async mounted() {
        const orderStore = useOrderStore()
        const reviewStore = useReviewStore()

        // A draft left over from another order must not bleed into this one.
        reviewStore.resetDraft()

        await Promise.all([
            orderStore.getOrderDetail(this.orderId),
            reviewStore.checkOrderReview(this.orderId),
        ])

        // The backend rejects these cases anyway; bouncing here means the buyer never
        // fills in a form that is guaranteed to fail.
        const order = orderStore.currentOrder
        const reviewable = order?.status === 'done' && order?.payment_status === 'paid'
        if (!reviewable || reviewStore.orderReviewed) {
            this.$router.replace(`/orders/${this.orderId}`)
        }
    },

    beforeUnmount() {
        useReviewStore().resetDraft()
    }
}
</script>

<template>
    <LayoutBaseOrderReview>

        <template #Breadcrumbs>
            <ReviewBreadcrumbs />
        </template>

        <template #Overall>
            <OverallRating />
        </template>

        <template #Items>
            <ReviewItemsList />
        </template>

        <template #Submit>
            <ReviewSubmitBar />
        </template>

    </LayoutBaseOrderReview>
</template>
