<template>
  <div class="food-detail-page" v-if="food && seller">
    <!-- Hero Image -->
    <div class="hero-section">
      <img :src="food.image" :alt="food.name" class="hero-image" />
      <button class="back-btn" @click="goBack">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>
    </div>

    <!-- Food Info -->
    <div class="food-info">
      <h1 class="food-name">{{ food.name }}</h1>
      <span class="food-price">₱{{ food.price }}</span>
      <p class="seller-name" @click="goToSeller">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        {{ seller.name }}
      </p>
      <p class="food-description">{{ food.description }}</p>
    </div>

    <!-- Quantity Selector -->
    <div class="quantity-section">
      <span class="section-label">Quantity</span>
      <div class="quantity-controls">
        <button class="qty-btn" @click="decreaseQuantity" :disabled="quantity <= 1">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <span class="quantity">{{ quantity }}</span>
        <button class="qty-btn" @click="increaseQuantity">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
    </div>

    <!-- Add to Cart Button -->
    <div class="add-to-cart-section">
      <button class="add-to-cart-btn" @click="addToCart">
        <span>Add to Cart</span>
        <span class="total-price">₱{{ totalPrice }}</span>
      </button>
    </div>

    <!-- Toast notification -->
    <transition name="toast">
      <div v-if="showToast" class="toast">
        Added to cart!
      </div>
    </transition>
  </div>

  <div v-else class="loading-state">
    <p>Loading...</p>
  </div>
</template>

<script>
import { sellers } from '../stores/data'
import { cartStore } from '../stores/cartStore'

export default {
  name: 'FoodDetailPage',
  props: {
    sellerId: {
      type: String,
      required: true
    },
    foodId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      seller: null,
      food: null,
      quantity: 1,
      showToast: false
    }
  },
  computed: {
    totalPrice() {
      return this.food ? this.food.price * this.quantity : 0
    }
  },
  created() {
    this.loadData()
  },
  watch: {
    sellerId() {
      this.loadData()
    },
    foodId() {
      this.loadData()
    }
  },
  methods: {
    loadData() {
      const sId = parseInt(this.sellerId)
      const fId = parseInt(this.foodId)
      
      this.seller = sellers.find(s => s.id === sId)
      if (this.seller) {
        this.food = this.seller.menu.find(m => m.id === fId)
      }
    },
    goBack() {
      this.$router.back()
    },
    goToSeller() {
      this.$router.push(`/seller/${this.sellerId}`)
    },
    increaseQuantity() {
      this.quantity++
    },
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--
      }
    },
    addToCart() {
      cartStore.addItem({
        id: this.food.id,
        name: this.food.name,
        price: this.food.price,
        image: this.food.image,
        sellerId: this.seller.id,
        sellerName: this.seller.name,
        quantity: this.quantity
      })
      
      this.showToast = true
      setTimeout(() => {
        this.showToast = false
        this.$router.back()
      }, 1500)
    }
  }
}
</script>

<style scoped>
.food-detail-page {
  min-height: 100vh;
  background: #F8F9FA;
  padding-bottom: 120px;
}

.hero-section {
  position: relative;
  height: 300px;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.back-btn {
  position: absolute;
  top: calc(16px + env(safe-area-inset-top, 0));
  left: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

.back-btn svg {
  color: #2D3436;
}

.food-info {
  background: white;
  margin-top: -24px;
  border-radius: 24px 24px 0 0;
  padding: 24px 20px;
  position: relative;
}

.food-name {
  font-size: 24px;
  font-weight: 700;
  color: #2D3436;
  margin-bottom: 8px;
}

.food-price {
  font-size: 22px;
  font-weight: 700;
  color: #FF6B35;
  display: block;
  margin-bottom: 12px;
}

.seller-name {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #636E72;
  margin-bottom: 16px;
  cursor: pointer;
}

.seller-name:hover {
  color: #FF6B35;
}

.seller-name svg {
  color: #FF6B35;
}

.food-description {
  font-size: 15px;
  color: #636E72;
  line-height: 1.6;
}

.quantity-section {
  background: white;
  padding: 20px;
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-label {
  font-size: 16px;
  font-weight: 600;
  color: #2D3436;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.qty-btn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #F5F5F5;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #2D3436;
  transition: background 0.2s ease;
}

.qty-btn:hover:not(:disabled) {
  background: #E5E5E5;
}

.qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.quantity {
  font-size: 20px;
  font-weight: 700;
  min-width: 32px;
  text-align: center;
}

.add-to-cart-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom, 0));
  background: white;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
}

.add-to-cart-btn {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #FF6B35;
  color: white;
  border: none;
  padding: 18px 24px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.add-to-cart-btn:hover {
  background: #E55A2B;
}

.add-to-cart-btn:active {
  transform: scale(0.98);
}

.total-price {
  font-weight: 700;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  color: #636E72;
}

.toast {
  position: fixed;
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
  background: #2D3436;
  color: white;
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  z-index: 1001;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
