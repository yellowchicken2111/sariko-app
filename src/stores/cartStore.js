// Simple reactive cart store
import { reactive } from 'vue'

const state = reactive({
  items: [],
  deliveryFee: 49
})

export const cartStore = {
  state,
  
  addItem(item) {
    const existingItem = state.items.find(
      i => i.id === item.id && i.sellerId === item.sellerId
    )
    
    if (existingItem) {
      existingItem.quantity += item.quantity || 1
    } else {
      state.items.push({
        ...item,
        quantity: item.quantity || 1
      })
    }
  },
  
  removeItem(itemId, sellerId) {
    const index = state.items.findIndex(
      i => i.id === itemId && i.sellerId === sellerId
    )
    if (index > -1) {
      state.items.splice(index, 1)
    }
  },
  
  updateQuantity(itemId, sellerId, quantity) {
    const item = state.items.find(
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
    state.items = []
  },
  
  getSubtotal() {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  },
  
  getTotal() {
    const subtotal = this.getSubtotal()
    return subtotal > 0 ? subtotal + state.deliveryFee : 0
  },
  
  getItemCount() {
    return state.items.reduce((count, item) => count + item.quantity, 0)
  }
}
