<script>
import { useSellerStore } from '@/stores/seller/sellerStore';
import { useCartStore } from '@/stores/cart/cartStore';

export default {
    computed: {
        sellerStore() {
            return useSellerStore()
        },
        food() {
            return this.sellerStore.currentFood
        },
        quantity() {
            return this.sellerStore.foodQuantity || 1
        },
        totalPrice() {
            if (!this.food) return ''
            return new Intl.NumberFormat('vi-VN').format(this.food.price * this.quantity) + ' ₫'
        }
    },

    methods: {
        async addToCart() {
            if (!this.food) return
            const cartStore = useCartStore()
            await cartStore.addItem(this.food.id, this.quantity)
            this.$q.notify({
                type: 'positive',
                message: 'Added to cart!',
                position: 'bottom',
                timeout: 1500,
            })
            this.$router.back()
        }
    }
}
</script>

<template>
    <button v-if="food" class="add-to-cart-btn" @click="addToCart">
        <span>Add to Cart</span>
        <span class="total-price">{{ totalPrice }}</span>
    </button>
</template>

<style scoped>
.add-to-cart-btn {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--color-primary);
    color: #ffffff;
    border: none;
    padding: 18px 24px;
    border-radius: 16px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    min-height: 56px;
    box-shadow: var(--shadow-button);
}

.add-to-cart-btn:active {
    transform: scale(0.98);
}

.total-price {
    font-weight: 700;
}
</style>
