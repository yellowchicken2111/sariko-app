import { defineStore } from "pinia";
import apiCarts from "@/apis/cart/apiCart";
import { error } from "highcharts";

export const useCartStore = defineStore("cartStore", {
    state() {
        return {
            cart: null,
            cartItems: []
        }
    },

    actions: {
        async getCurrentCart() {
            try {
                const res = await apiCarts.getCart()
                if (res?.data?.success) {
                    this.cart = res.data.cart
            
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

        async updateQuantity(itemId, newQuantity) {
            try {
                const res = await apiCarts.updateQuantity(this.cart.id, itemId, newQuantity)
            } catch (e) {
                console.error(`cartStore - updateQuantity - ${e}`);
            }
            
        }
    }
})