<script>
import StarRating from '@/components/shared/StarRating.vue';
import { useReviewStore } from '@/stores/review/reviewStore.js';

export default {
    components: { StarRating },

    computed: {
        reviewStore() {
            return useReviewStore()
        },
        rating: {
            get() {
                return this.reviewStore.overallRating
            },
            set(value) {
                this.reviewStore.overallRating = value
            }
        },
        ratingLabel() {
            if (!this.rating) return this.$t('order_review.overall_hint')
            return this.$t(`order_review.rating_label_${this.rating}`)
        }
    }
}
</script>

<template>
    <div class="overall">
        <div class="overall-title">{{ $t('order_review.overall_title') }}</div>
        <StarRating v-model="rating" :size="38" :gap="10" />
        <div class="overall-label" :class="{ placeholder: !rating }">{{ ratingLabel }}</div>
    </div>
</template>

<style scoped>
.overall {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
}

.overall-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-primary);
}

.overall-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-active);
    min-height: 20px;
}

.overall-label.placeholder {
    font-weight: 400;
    color: var(--text-secondary);
}
</style>
