import { defineStore } from 'pinia'

export const useCartStore = defineStore('cartStore', {
    
    state: () => {
        return {
            items: [],
            deliveryFee: 49
        }
    },

    getters: {
        itemCount: (state) => {
            return state.items.reduce((count, item) => count + item.quantity, 0)
        },
        subtotal: (state) => {
            return state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
        },
        total: (state) => {
            const subtotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
            return subtotal > 0 ? subtotal + state.deliveryFee : 0
        }
    },

    actions: {
        addItem(item) {
            const existingItem = this.items.find(
                i => i.id === item.id && i.sellerId === item.sellerId
            )

            if (existingItem) {
                existingItem.quantity += item.quantity || 1
            } else {
                this.items.push({
                    ...item,
                    quantity: item.quantity || 1
                })
            }
        },

        removeItem(itemId, sellerId) {
            const index = this.items.findIndex(
                i => i.id === itemId && i.sellerId === sellerId
            )
            if (index > -1) {
                this.items.splice(index, 1)
            }
        },

        updateQuantity(itemId, sellerId, quantity) {
            const item = this.items.find(
                i => i.id === itemId && i.sellerId === sellerId
            )
            if (item) {
                if (quantity <= 0) {
                    this.removeItem(itemId, sellerId)
                } else {
                    item.quantity = quantity
                }
            }
        },

        clearCart() {
            this.items = []
        }
    }
})
