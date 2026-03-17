<template>
    <div class="cart-page">
        <!-- Header -->
        <header class="header">
            <h1 class="page-title">Your Cart</h1>
            <span class="item-count" v-if="cartItems.length > 0">{{ totalItems }} items</span>
        </header>

        <!-- Cart Items -->
        <div class="cart-content" v-if="cartItems.length > 0">
            <div class="cart-items">
                <CartItem v-for="item in cartItems" :key="`${item.sellerId}-${item.id}`" :item="item"
                    @updated="updateCart" @removed="handleItemRemoved" />
            </div>

            <!-- Cart Summary -->
            <div class="cart-summary">
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span>₱{{ subtotal }}</span>
                </div>
                <div class="summary-row">
                    <span>Delivery Fee</span>
                    <span>₱{{ deliveryFee }}</span>
                </div>
                <div class="summary-row total">
                    <span>Total</span>
                    <span>₱{{ total }}</span>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div class="empty-state" v-else>
            <div class="empty-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="8" cy="21" r="1"></circle>
                    <circle cx="19" cy="21" r="1"></circle>
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                </svg>
            </div>
            <h2 class="empty-title">Your cart is empty</h2>
            <p class="empty-description">Start adding delicious items from our sellers!</p>
            <button class="browse-btn" @click="goHome">Browse Sellers</button>
        </div>

        <!-- Checkout Button -->
        <div class="checkout-section" v-if="cartItems.length > 0">
            <button class="checkout-btn" @click="checkout">
                <span>Proceed to Checkout</span>
                <span class="checkout-total">₱{{ total }}</span>
            </button>
        </div>

        <!-- Toast notification -->
        <transition name="toast">
            <div v-if="showToast" class="toast">
                {{ toastMessage }}
            </div>
        </transition>
    </div>
</template>

<script>
import CartItem from '../components/CartItem.vue'
import { useCartStore } from '../stores/cartStore'

export default {
    name: 'CartPage',
    components: {
        CartItem
    },
    setup() {
        const cartStore = useCartStore()
        return { cartStore }
    },
    data() {
        return {
            showToast: false,
            toastMessage: ''
        }
    },
    computed: {
        cartItems() {
            return this.cartStore.items
        },
        totalItems() {
            return this.cartStore.itemCount
        },
        subtotal() {
            return this.cartStore.subtotal
        },
        deliveryFee() {
            return this.cartItems.length > 0 ? this.cartStore.deliveryFee : 0
        },
        total() {
            return this.cartStore.total
        }
    },
    methods: {
        updateCart() {
            // Force reactivity update
            this.$forceUpdate()
        },
        handleItemRemoved(item) {
            this.toastMessage = `${item.name} removed from cart`
            this.showToast = true
            setTimeout(() => {
                this.showToast = false
            }, 2000)
        },
        goHome() {
            this.$router.push('/')
        },
        checkout() {
            this.toastMessage = 'Order placed successfully!'
            this.showToast = true

            // Clear cart after checkout
            setTimeout(() => {
                this.cartStore.clearCart()
                this.showToast = false
                this.$router.push('/orders')
            }, 2000)
        }
    }
}
</script>

<style scoped>
.cart-page {
    min-height: 100vh;
    background: var(--bg-main);
    padding: 16px;
    padding-top: calc(16px + env(safe-area-inset-top, 0));
    padding-bottom: 120px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.page-title {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
}

.item-count {
    font-size: 14px;
    color: var(--text-secondary);
    background: var(--bg-surface);
    padding: 6px 12px;
    border-radius: 16px;
}

.cart-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.cart-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.cart-summary {
    background: var(--bg-surface);
    border-radius: 16px;
    padding: 20px;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    font-size: 15px;
    color: var(--text-secondary);
}

.summary-row.total {
    border-top: 1px solid var(--border-color);
    margin-top: 8px;
    padding-top: 16px;
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
}

.summary-row.total span:last-child {
    color: var(--color-primary);
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;
}

.empty-icon {
    color: var(--border-color);
    margin-bottom: 20px;
}

.empty-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 8px;
}

.empty-description {
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 24px;
}

.browse-btn {
    background: var(--color-primary);
    color: #ffffff;
    border: none;
    padding: 14px 28px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;
    min-height: 48px;
}

.browse-btn:hover {
    background: var(--color-primary-dark);
}

.checkout-section {
    position: fixed;
    bottom: 80px;
    left: 0;
    right: 0;
    padding: 16px;
    padding-bottom: calc(16px + env(safe-area-inset-bottom, 0));
    background: var(--bg-surface);
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.06);
}

.checkout-btn {
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
    transition: all 0.2s ease;
    min-height: 56px;
    box-shadow: var(--shadow-button);
}

.checkout-btn:hover {
    background: var(--color-primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px -2px rgba(14, 165, 233, 0.4);
}

.checkout-btn:active {
    transform: scale(0.98);
}

.checkout-total {
    font-weight: 700;
}

.toast {
    position: fixed;
    bottom: 160px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--text-primary);
    color: var(--bg-main);
    padding: 12px 24px;
    border-radius: 24px;
    font-size: 14px;
    font-weight: 500;
    z-index: 1001;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
}
</style>
