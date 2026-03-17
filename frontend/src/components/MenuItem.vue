<template>
  <div class="menu-item" :class="{ 'is-disabled': !item.available }" @click="goToDetail">
    <img :src="item.image" :alt="item.name" class="item-image" />
    <div class="item-content">
      <div class="item-header">
        <h4 class="item-name">{{ item.name }}</h4>
        <span v-if="item.preorder" class="preorder-badge">{{ item.preorder }}</span>
      </div>
      <p class="item-description">{{ item.description }}</p>
      
      <div class="item-footer">
        <div class="price-container">
          <span class="item-price">₱{{ item.price }}</span>
          <span v-if="item.unit" class="item-unit">{{ item.unit }}</span>
        </div>
        
        <div v-if="!item.available" class="sold-out-badge">
          Sold Out
        </div>
        <div v-else class="action-container" @click.stop>
          <button v-if="quantity === 0" class="add-btn" @click="handleQuantityChange(1)">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          
          <div v-else class="quantity-selector">
            <button class="qty-btn" @click="handleQuantityChange(-1)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <span class="qty-display">{{ quantity }}</span>
            <button class="qty-btn" @click="handleQuantityChange(1)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '../stores/cartStore'
import { computed } from 'vue'

export default {
  name: 'MenuItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    sellerId: {
      type: Number,
      required: true
    },
    sellerName: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const cartStore = useCartStore()
    
    // Find if the item exists in the cart to sync local quantity representation
    const cartItem = computed(() => {
        return cartStore.items.find(i => i.id === props.item.id && i.sellerId === props.sellerId)
    })
    
    const quantity = computed(() => {
        return cartItem.value ? cartItem.value.quantity : 0
    })

    return { cartStore, quantity }
  },
  methods: {
    goToDetail() {
      if (!this.item.available) return;
      this.$router.push(`/food/${this.sellerId}/${this.item.id}`)
    },
    handleQuantityChange(change) {
      const newQty = this.quantity + change;
      
      if (newQty > 0) {
          // If 0 going to 1, or 1 going to 2, update using the store's addToCart/update functionality
          // Note: our current store has addItem and updateQuantity.
          if (this.quantity === 0) {
              this.cartStore.addItem({
                id: this.item.id,
                name: this.item.name,
                price: this.item.price,
                image: this.item.image,
                sellerId: this.sellerId,
                sellerName: this.sellerName,
                quantity: 1
              });
          } else {
              this.cartStore.updateQuantity(this.item.id, newQty)
          }
      } else if (newQty === 0) {
          // Removes item if quantity drops to 0
          this.cartStore.removeItem(this.item.id)
      }
    }
  }
}
</script>

<style scoped>
.menu-item {
  display: flex;
  gap: 14px;
  padding: 16px;
  background: var(--bg-surface);
  border-radius: 16px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.menu-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.menu-item:active {
  transform: scale(0.98);
}

.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 12px;
  flex-shrink: 0;
  background-color: var(--bg-main);
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
  gap: 8px;
}

.item-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.preorder-badge {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  background: rgba(201, 166, 70, 0.15);
  color: var(--color-accent);
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
}

.sold-out-badge {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-secondary);
  background: var(--bg-main);
  padding: 4px 8px;
  border-radius: 6px;
}

.item-description {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.price-container {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.item-price {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-accent);
}

.item-unit {
  font-size: 12px;
  color: var(--text-secondary);
}

.action-container {
  display: flex;
  align-items: center;
}

.add-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-accent);
  color: var(--bg-main);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: filter 0.2s ease, transform 0.1s ease;
}

.add-btn:hover {
  filter: brightness(1.1);
}

.add-btn:active {
  transform: scale(0.9);
}

.quantity-selector {
  display: flex;
  align-items: center;
  background: var(--bg-main);
  border-radius: 20px;
  padding: 2px;
  box-shadow: inset 0 0 0 1px var(--border-color);
}

.qty-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  transition: background 0.2s ease;
}

.qty-btn:hover {
  background: var(--bg-surface);
}

.qty-display {
  min-width: 24px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}
</style>
