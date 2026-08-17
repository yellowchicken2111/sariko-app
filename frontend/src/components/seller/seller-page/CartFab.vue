<script>
import { mapState } from 'pinia';
import { ShoppingCart } from 'lucide-vue-next';
import { useCartStore } from '@/stores/cart/cartStore';

export default {
    components: { ShoppingCart },

    computed: {
        ...mapState(useCartStore, ['itemCount'])
    },

    methods: {
        goCart() {
            this.$router.push({ name: 'cart' });
        }
    }
}
</script>

<template>
    <!-- wrapper keeps the FAB pinned to the 800px app container, not the viewport edge -->
    <div class="fab-zone">
        <button class="cart-fab" @click="goCart" :aria-label="$t('seller_page.btn_view_cart')">
            <ShoppingCart :size="22" />
            <span v-if="itemCount > 0" class="cart-badge">{{ itemCount }}</span>
        </button>
    </div>
</template>

<style lang="scss" scoped>
.fab-zone {
    position: fixed;
    inset: 0;
    z-index: 10;
    max-width: 800px;
    margin: auto;
    pointer-events: none;
}

.cart-fab {
    position: absolute;
    right: 16px;
    bottom: calc(16px + env(safe-area-inset-bottom, 0px));
    pointer-events: auto;
    width: 56px;
    height: 56px;
    border: none;
    border-radius: 50%;
    background: #f5A623;
    color: #121b2f;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 8px 20px -6px rgba(245, 166, 35, 0.6);
    transition: transform 0.1s ease, box-shadow 0.15s ease;

    &:active {
        transform: scale(0.94);
        box-shadow: 0 4px 12px -6px rgba(245, 166, 35, 0.6);
    }
}

.cart-badge {
    position: absolute;
    top: -2px;
    right: -2px;
    min-width: 20px;
    height: 20px;
    padding: 0 5px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ef4444;
    color: #fff;
    font-family: $sariko-font-family-secondary;
    font-size: 11px;
    font-weight: 700;
    border: 2px solid var(--bg-main, #121b2f);
}
</style>
