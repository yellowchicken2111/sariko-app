import { defineStore } from "pinia";
import apiCarts from "@/apis/cart/apiCart";

export const useCartStore = defineStore("cartStore", {
    state() {
        return {
            cart: null,
            cartItems: [],

            // modal conflict store
            firstSeller: null,
            secondSeller: null,
            isShowModalCartConflict: false,
            pendingSellerId: null,
            pendingFoodItemId: null,
            pendingSellerName: null,

            // note
            note: ''
        }
    },

    getters: {
        subtotal(state) {
            return state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        },
        subtotalText() {
            return new Intl.NumberFormat('vi-VN').format(this.subtotal) + ' ₫'
        },
        itemCount(state) {
            return state.cartItems.reduce((sum, item) => sum + item.quantity, 0)
        },
        currentSellerSlug(state) {
            return state.cartItems[0]?.sellerSlugName || null
        }
    },

    actions: {
        async getCurrentCart() {
            try {
                const res = await apiCarts.getCart()
                if ((res.data?.success) && (res.data?.cart)) {
                    this.cart = res.data.cart
                    this.cartItems = []

                    const _cartItems = this.cart.cart_items
                    for (let i=0; i<_cartItems.length; i++) {
                        this.cartItems.push({
                            "id": _cartItems[i]?.food_items?.id,
                            "name": _cartItems[i]?.food_items?.name,
                            "price": _cartItems[i]?.food_items?.price,
                            "priceText": _cartItems[i]?.food_items?.price_text,
                            "imgSrc": _cartItems[i]?.food_items?.image_url,
                            "category":  _cartItems[i]?.food_items?.menu_categories?.name,
                            "quantity": _cartItems[i]?.quantity,
                            "sellerStore": this.cart?.seller_profiles?.store_name,
                            "sellerSlugName": this.cart?.seller_profiles?.slug,
                        })
                    }
                }
            } catch (e) {
                console.error(`cartStore - getCurrentCart - ${e}`);
            }
        },

        async addItem(sellerId, foodItemId, newSellerName) {
            try {
                await apiCarts.addItem(sellerId, foodItemId)
                await this.refreshCart()
            } catch (e) {
                if (e.message === 'another seller') {
                    this.pendingSellerId = sellerId
                    this.pendingFoodItemId = foodItemId
                    this.pendingSellerName = newSellerName
                    this.showConflictModal(e.currentSellerName || '', newSellerName || '')
                } else {
                    console.error(`cartStore - addItem - ${e}`)
                }
            }
        },

        async clearCartAndAddItem() {
            try {
                await apiCarts.clearCart()
                this.cart = null
                this.cartItems = []
                this.isShowModalCartConflict = false

                if (this.pendingSellerId && this.pendingFoodItemId) {
                    await apiCarts.addItem(this.pendingSellerId, this.pendingFoodItemId)
                    await this.refreshCart()
                }

                this.pendingSellerId = null
                this.pendingFoodItemId = null
                this.pendingSellerName = null
            } catch (e) {
                console.error(`cartStore - clearCartAndAddItem - ${e}`)
            }
        },

        async refreshCart() {
            this.cart = null
            this.cartItems = []
            await this.getCurrentCart()
        },

        async updateQuantity(foodItemId, newQuantity) {
            try {
                await apiCarts.updateQuantity(foodItemId, newQuantity)
                const item = this.cartItems.find(i => i.id === foodItemId)
                if (item) item.quantity = newQuantity
            } catch (e) {
                console.error(`cartStore - updateQuantity - ${e}`);
            }
        },

        async removeItem(foodItemId) {
            try {
                await apiCarts.removeItem(foodItemId)
                this.cartItems = this.cartItems.filter(i => i.id !== foodItemId)
            } catch (e) {
                console.error(`cartStore - removeItem - ${e}`);
            }
        },

        showConflictModal(firstSeller, secondSeller) {
            this.firstSeller = firstSeller
            this.secondSeller = secondSeller
            this.isShowModalCartConflict = true
        }
    }
})