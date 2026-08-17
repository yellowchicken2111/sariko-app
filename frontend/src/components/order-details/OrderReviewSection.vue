<script>
import StarRating from '@/components/shared/StarRating.vue';
import { useOrderStore } from '@/stores/order/orderStore.js';
import { useReviewStore } from '@/stores/review/reviewStore.js';

export default {
    components: { StarRating },

    computed: {
        orderStore() {
            return useOrderStore()
        },
        reviewStore() {
            return useReviewStore()
        },
        order() {
            return this.orderStore.currentOrder
        },
        // Same gate the backend enforces, so the buyer is never offered a button that
        // would come back 400.
        isReviewable() {
            return this.order?.status === 'done' && this.order?.payment_status === 'paid'
        },
        // The review store is shared across orders; only trust its fields once they
        // are known to describe the order on screen.
        isLoaded() {
            return !!this.order && this.reviewStore.reviewedOrderId === this.order.id
        },
        hasReviewed() {
            return this.isLoaded && this.reviewStore.orderReviewed
        }
    },

    methods: {
        goToReview() {
            this.$router.push(`/orders/${this.order.id}/review`)
        }
    }
}
</script>

<template>
    <div v-if="isReviewable" class="review-section">

        <div v-if="hasReviewed" class="reviewed">
            <StarRating :model-value="reviewStore.orderOverallRating || 0" :size="20" :gap="4" readonly />
            <div class="reviewed-text">{{ $t('order_review.already_reviewed') }}</div>
        </div>

        <q-btn v-else-if="isLoaded" class="btn-review" dense no-caps @click="goToReview">
            {{ $t('order_review.btn_rate_order') }}
        </q-btn>

        <q-skeleton v-else height="48px" animation="pulse" style="border-radius: 2rem" />

    </div>
</template>

<style scoped>
.review-section {
    width: 100%;
}

.reviewed {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 14px 0;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 2rem;
}

.reviewed-text {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-secondary);
}

.btn-review {
    width: 100%;
    background-color: var(--color-accent);
    color: #121b2f;
    padding: 14px 0;
    border-radius: 2rem;
    font-weight: 700;
    font-size: 16px;
}
</style>
