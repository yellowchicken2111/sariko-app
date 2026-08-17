<script>
import StarRating from '@/components/shared/StarRating.vue';
import { useReviewStore } from '@/stores/review/reviewStore.js';

export default {
    components: { StarRating },

    props: {
        item: { type: Object, required: true },
    },

    computed: {
        reviewStore() {
            return useReviewStore()
        },
        draft() {
            return this.reviewStore.itemDrafts[this.item.food_item_id] || { rating: 0, comment: '' }
        },
        rating: {
            get() {
                return this.draft.rating
            },
            set(value) {
                this.reviewStore.setItemRating(this.item.food_item_id, value)
            }
        },
        comment: {
            get() {
                return this.draft.comment
            },
            set(value) {
                this.reviewStore.setItemComment(this.item.food_item_id, value)
            }
        },
        priceText() {
            // price_snapshot is the price paid at order time, not today's menu price.
            return new Intl.NumberFormat('vi-VN').format(this.item.price_snapshot) + ' ₫'
        },
        imageSrc() {
            // Unlike name/price there is no image snapshot, so this comes from the live
            // menu row — absent if the seller has since deleted the dish.
            return this.item.food_items?.image_url || '/images/default-food-image.webp'
        }
    }
}
</script>

<template>
    <div class="item-card">
        <div class="item-head">
            <q-img :src="imageSrc" :alt="item.name_snapshot" class="item-thumb" />

            <div class="item-main">
                <div class="item-name">
                    {{ item.name_snapshot }}
                    <span v-if="item.quantity > 1" class="item-qty">×{{ item.quantity }}</span>
                </div>
                <div class="item-meta">
                    <StarRating v-model="rating" :size="24" />
                    <div class="item-price">{{ priceText }}</div>
                </div>
            </div>
        </div>

        <q-input
            v-model="comment"
            class="item-comment"
            type="textarea"
            autogrow
            dense
            dark
            borderless
            maxlength="500"
            :placeholder="$t('order_review.comment_placeholder')"
        />
    </div>
</template>

<style scoped>
.item-card {
    background: var(--bg-surface);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 16px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.item-head {
    display: flex;
    align-items: center;
    gap: 12px;
}

.item-thumb {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    flex-shrink: 0;
}

/* min-width:0 lets a long dish name wrap inside the column instead of forcing the
   flex row wider than the card. */
.item-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.item-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.item-name {
    font-size: 15px;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1.35;
}

.item-qty {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
    margin-left: 4px;
}

.item-price {
    font-size: 14px;
    font-weight: 700;
    color: var(--text-active);
    white-space: nowrap;
}

.item-comment {
    background: rgba(255, 255, 255, 0.04);
    border-radius: 12px;
    padding: 4px 12px;
    font-size: 14px;
}
</style>
