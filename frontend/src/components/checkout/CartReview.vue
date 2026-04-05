<script>
import { ShoppingCart } from 'lucide-vue-next';
import { mapState, mapWritableState, mapActions } from 'pinia';
import { useCartStore } from '@/stores/cart/cartStore';

export default {

    components: {
        ShoppingCart
    },

    data() {
        return {
            isExpanded: false
        }
    },

    computed: {
        ...mapState(useCartStore, [
            "cartItems",
            "seller"
        ])
    },

    mounted() {
        if (!this.cartItems.length) {
            const cartStore = useCartStore()
            cartStore.getCurrentCart()
        }
    },
}
</script>

<template>
    <div class="cart-review-container">
        
        <div class="header" @click="isExpanded = !isExpanded">
            <div class="cart-info">
                <div class="cart-icon">
                    <ShoppingCart size="18px" class="icon" />
                </div>
                <div class="seller-info">
                    <div class="seller-name">
                    {{ cartItems[0]?.sellerStore }}
                    </div>
                    <div class="item-count">
                        {{ cartItems.length }} {{ $t('checkout_page.section_cart_review.text_item') }}
                    </div>
                </div>
            </div>

            <q-icon :name="isExpanded ? 'expand_less' : 'expand_more'" />
        </div>

        <div v-if="isExpanded" class="content">
            <div class="container">
                <div v-for="item in cartItems" class="item">
                    <div class="item-name-quantity">
                        <span class="item-quantity">{{item.quantity}}</span> x <span class="item-name">{{ item.name }}</span>
                    </div>
                    <div class="item-price">
                        {{ item.priceText }}
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<style lang="scss" scoped>

.cart-review-container {
    background-color: var(--bg-surface);
    border-radius: .75rem;
    padding: 10px 15px 10px 15px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}


.cart-icon {
    display: flex;
    background-color: var(--accent-dim);
    padding: 10px;
    border-radius: .75rem;
    border: 1px solid $accent;
    color: $accent;
}

.cart-info {
    display: flex;
    align-items: center;
}

.seller-info {
    margin-left: 10px;
}

.seller-name {
    font-weight: 600;
}

.item-count {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
}

.content {
    margin-top: 10px;
}

.item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
}

.item-quantity {
    font-weight: 600;
}

.item-name {
    color: var(--text-muted);
}

.item-price {
    font-weight: 600;
}
</style>