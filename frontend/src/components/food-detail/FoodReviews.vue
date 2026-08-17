<script>
import { User } from 'lucide-vue-next';
import StarRating from '@/components/shared/StarRating.vue';
import { useReviewStore } from '@/stores/review/reviewStore.js';

export default {
    components: { User, StarRating },

    computed: {
        reviewStore() {
            return useReviewStore()
        },
        reviews() {
            return this.reviewStore.foodReviews
        },
        loading() {
            return this.reviewStore.loadingFoodReviews
        }
    },

    methods: {
        // The API masks the name and returns null when there is none, leaving the
        // wording to i18n.
        displayName(review) {
            return review.reviewer_name || this.$t('food_detail_page.review_anonymous')
        },
        dateText(isoStr) {
            return new Date(isoStr).toLocaleDateString('vi-VN', {
                day: '2-digit', month: '2-digit', year: 'numeric'
            })
        }
    }
}
</script>

<template>
    <div class="reviews">
        <div class="reviews-title">{{ $t('food_detail_page.reviews_title') }}</div>

        <template v-if="loading">
            <q-skeleton type="text" width="60%" animation="pulse" />
            <q-skeleton type="text" width="80%" animation="pulse" />
        </template>

        <div v-else-if="!reviews.length" class="reviews-empty">
            {{ $t('food_detail_page.reviews_empty') }}
        </div>

        <div v-else class="review-list">
            <div v-for="review in reviews" :key="review.id" class="review">
                <q-avatar size="32px" class="review-avatar">
                    <img v-if="review.reviewer_avatar_url" :src="review.reviewer_avatar_url" />
                    <User v-else :size="16" />
                </q-avatar>

                <div class="review-body">
                    <div class="review-head">
                        <span class="review-name">{{ displayName(review) }}</span>
                        <span class="review-date">{{ dateText(review.created_at) }}</span>
                    </div>
                    <StarRating :model-value="review.rating" :size="13" :gap="2" readonly />
                    <p v-if="review.comment" class="review-comment">{{ review.comment }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.reviews {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.reviews-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.reviews-empty {
    font-size: 13px;
    color: var(--text-muted);
}

.review-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.review {
    display: flex;
    gap: 10px;
}

.review-avatar {
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.08);
    color: var(--text-secondary);
}

.review-body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.review-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 10px;
}

.review-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
}

.review-date {
    font-size: 11px;
    color: var(--text-muted);
    white-space: nowrap;
}

.review-comment {
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.5;
    margin: 2px 0 0;
    white-space: pre-line;
}
</style>
