<template>
  <div class="cart-item">
    <img :src="item.image" :alt="item.name" class="item-image" />
    <div class="item-content">
      <h4 class="item-name">{{ item.name }}</h4>
      <span class="item-price">₱{{ item.price }}</span>
      <div class="quantity-controls">
        <button class="qty-btn" @click="decreaseQuantity">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <span class="quantity">{{ item.quantity }}</span>
        <button class="qty-btn" @click="increaseQuantity">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
    </div>
    <div class="item-actions">
      <span class="item-total">₱{{ item.price * item.quantity }}</span>
      <button class="remove-btn" @click="removeItem">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '../stores/cartStore'

export default {
  name: 'CartItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  emits: ['updated', 'removed'],
  setup() {
    const cartStore = useCartStore()
    return { cartStore }
  },
  methods: {
    increaseQuantity() {
      this.cartStore.updateQuantity(this.item.id, this.item.sellerId, this.item.quantity + 1)
      this.$emit('updated')
    },
    decreaseQuantity() {
      if (this.item.quantity > 1) {
        this.cartStore.updateQuantity(this.item.id, this.item.sellerId, this.item.quantity - 1)
        this.$emit('updated')
      } else {
        this.removeItem()
      }
    },
    removeItem() {
      this.cartStore.removeItem(this.item.id, this.item.sellerId)
      this.$emit('removed', this.item)
    }
  }
}
</script>

<style scoped>
.cart-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 16px;
  align-items: flex-start;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 12px;
  flex-shrink: 0;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.item-price {
  font-size: 13px;
  color: #6B7280;
  display: block;
  margin-bottom: 10px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.qty-btn {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: #F3F4F6;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #111827;
  transition: background 0.2s ease;
}

.qty-btn:hover {
  background: #D1D5DB;
}

.qty-btn:active {
  background: #D1D5DB;
}

.quantity {
  font-size: 16px;
  font-weight: 600;
  min-width: 24px;
  text-align: center;
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.item-total {
  font-size: 16px;
  font-weight: 700;
  color: #16A34A;
}

.remove-btn {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: #FEE2E2;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #EF4444;
  transition: background 0.2s ease;
}

.remove-btn:hover {
  background: #FECACA;
}
</style>
