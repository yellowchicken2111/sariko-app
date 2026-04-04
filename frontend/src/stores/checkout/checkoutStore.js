import { defineStore } from "pinia";
import { useCartStore } from "@/stores/cart/cartStore.js";
import { useOrderStore } from "@/stores/order/orderStore.js";
import { router } from "@/plugins/router.js";

export const useCheckoutStore = defineStore("checkoutStore", {
    state() {
        return {
            deliveryMethod: 'delivery',
            deliveryAddress: '',
            note: '',
            submitting: false,
        }
    },

    getters: {
        isFormValid(state) {
            const cartStore = useCartStore()
            if (cartStore.cartItems.length === 0) return false
            if (state.deliveryMethod === 'delivery' && !state.deliveryAddress.trim()) return false
            return true
        },

        sellerName() {
            const cartStore = useCartStore()
            return cartStore.cartItems[0]?.sellerStore || ''
        }
    },

    actions: {
        async placeOrder() {
            if (!this.isFormValid || this.submitting) return

            this.submitting = true
            try {
                const orderStore = useOrderStore()
                const order = await orderStore.placeOrder(
                    this.deliveryMethod,
                    this.deliveryMethod === 'delivery' ? this.deliveryAddress : null,
                    this.note || null
                )

                if (order) {
                    const cartStore = useCartStore()
                    cartStore.$reset()
                    this.$reset()
                    router.push({ name: 'order-confirmation', params: { orderId: order.id } })
                }
            } catch (e) {
                console.error(`checkoutStore - placeOrder - ${e}`)
            } finally {
                this.submitting = false
            }
        }
    }
})
