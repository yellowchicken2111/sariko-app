<script>
import { Minus, Plus, ShoppingBasket } from 'lucide-vue-next';
import { useSellerStore } from '@/stores/seller/sellerStore';
import { useCartStore } from '@/stores/cart/cartStore';

export default {
    components: { Minus, Plus, ShoppingBasket },

    data() {
        return { loading: false }
    },

    computed: {
        sellerStore() {
            return useSellerStore()
        },
        food() {
            return this.sellerStore.currentFood
        },
        seller() {
            return this.sellerStore.currentSeller
        },
        quantity() {
            return this.sellerStore.foodQuantity || 1
        },
        canDecrease() {
            return !!this.food && this.quantity > 1
        },
        canAdd() {
            return !!this.food && !!this.seller && !this.loading
        },
        totalPriceText() {
            if (!this.food) return '—'
            const total = this.food.price * this.quantity
            return new Intl.NumberFormat('vi-VN').format(total) + ' ₫'
        }
    },

    methods: {
        decrease() {
            if (!this.canDecrease) return
            this.sellerStore.foodQuantity = this.quantity - 1
        },
        increase() {
            if (!this.food) return
            this.sellerStore.foodQuantity = this.quantity + 1
        },
        async addToCart() {
            if (!this.canAdd) return
            this.loading = true
            const cartStore = useCartStore()
            try {
                await cartStore.addItem(this.seller.id, this.food.id, this.seller.store_name)
                if (cartStore.isShowModalCartConflict) {
                    this.loading = false
                    return
                }
                if (this.quantity > 1) {
                    await cartStore.updateQuantity(this.food.id, this.quantity)
                }
                this.$q.notify({
                    classes: 'quasar-notify-positive',
                    message: `✔️ ${this.$t('food_detail_page.toast_added_to_cart', { name: this.food.name })}`,
                    position: 'bottom',
                    timeout: 1500,
                })
                this.$router.back()
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<template>
    <div class="action-bar">
        <!-- Total price row -->
        <div class="total-row">
            <span class="total-row__label">{{ $t('food_detail_page.label_total_price') }}</span>
            <span class="total-row__value">{{ totalPriceText }}</span>
        </div>

        <!-- Controls row: quantity pill + CTA -->
        <div class="controls-row">
            <div class="qty-pill" role="group" :aria-label="$t('food_detail_page.label_quantity')">
                <button
                    class="qty-pill__btn"
                    :disabled="!canDecrease"
                    :aria-label="$t('food_detail_page.button_decrease') || 'Decrease quantity'"
                    @click="decrease"
                >
                    <Minus :size="16" />
                </button>
                <span class="qty-pill__value" aria-live="polite">{{ quantity }}</span>
                <button
                    class="qty-pill__btn"
                    :disabled="!food"
                    :aria-label="$t('food_detail_page.button_increase') || 'Increase quantity'"
                    @click="increase"
                >
                    <Plus :size="16" />
                </button>
            </div>

            <button
                class="cta"
                :disabled="!canAdd"
                :aria-busy="loading"
                :aria-label="food
                    ? `${$t('food_detail_page.button_add_to_cart')} — ${food.name}`
                    : $t('food_detail_page.button_add_to_cart')"
                @click="addToCart"
            >
                <span v-if="loading" class="cta__spinner" aria-hidden="true"></span>
                <ShoppingBasket v-else :size="20" />
                <span class="cta__label">{{ $t('food_detail_page.button_add_to_cart') }}</span>
            </button>
        </div>
    </div>
</template>

<style scoped>
.action-bar {
    display: flex;
    flex-direction: column;
    gap: 14px;
    width: 100%;
    font-family: "Plus Jakarta Sans", sans-serif;
}

/* Total price row */
.total-row {
    display: flex;
    align-items: baseline;
    justify-content: flex-end;
    gap: 12px;
    padding: 0 4px;
}

.total-row__label {
    font-size: 12px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 0.2px;
}

.total-row__value {
    font-size: 22px;
    font-weight: 800;
    color: var(--text-primary);
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.01em;
    line-height: 1;
}

/* Controls row */
.controls-row {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
}

/* Quantity pill */
.qty-pill {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    height: 56px;
    padding: 0 8px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    flex: 0 0 auto;
}

.qty-pill__btn {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #ffffff;
    cursor: pointer;
    transition: transform 100ms ease, background 160ms ease, opacity 160ms ease;
}

.qty-pill__btn:hover {
    background: rgba(255, 255, 255, 0.1);
}

.qty-pill__btn:active {
    transform: scale(0.9);
}

.qty-pill__btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.qty-pill__btn:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
}

.qty-pill__value {
    min-width: 22px;
    text-align: center;
    font-size: 16px;
    font-weight: 700;
    line-height: 1;
    color: #ffffff;
    font-variant-numeric: tabular-nums;
}

/* CTA */
.cta {
    flex: 1 1 auto;
    height: 56px;
    border-radius: 999px;
    background: var(--color-accent);
    color: var(--bg-main);
    border: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-family: "Plus Jakarta Sans", sans-serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.01em;
    line-height: 1;
    box-shadow: var(--cta-shadow);
    cursor: pointer;
    transition: transform 120ms ease, box-shadow 160ms ease, filter 160ms ease, opacity 160ms ease;
}

.cta:hover {
    filter: brightness(1.05);
}

.cta:active {
    transform: scale(0.98);
    box-shadow: var(--cta-shadow-active);
}

.cta:disabled {
    opacity: 0.55;
    box-shadow: none;
    pointer-events: none;
}

.cta:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 3px;
}

.cta__label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.cta__spinner {
    width: 18px;
    height: 18px;
    border-radius: 999px;
    border: 2px solid rgba(4, 10, 20, 0.25);
    border-top-color: #040A14;
    animation: cta-spin 720ms linear infinite;
}

@keyframes cta-spin {
    to { transform: rotate(360deg); }
}

@media (max-width: 360px) {
    .total-row__value { font-size: 20px; }
    .qty-pill { height: 52px; }
    .qty-pill__btn { width: 34px; height: 34px; }
    .cta { height: 52px; font-size: 14px; }
}

@media (prefers-reduced-motion: reduce) {
    .qty-pill__btn:active,
    .cta:active { transform: none; }
    .cta__spinner { animation-duration: 1.5s; }
}
</style>
