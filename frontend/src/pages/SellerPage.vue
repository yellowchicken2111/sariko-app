<template>
  <div class="seller-page" v-if="seller">
    <!-- Banner -->
    <div class="banner-section">
      <img :src="seller.banner" :alt="seller.name" class="banner-image" />
      <button class="back-btn" @click="goBack">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>
    </div>

    <!-- Seller Info -->
    <div class="seller-info">
      <img :src="seller.image" :alt="seller.name" class="seller-avatar" />
      <h1 class="seller-name">{{ seller.name }}</h1>
      <div class="seller-meta">
        <span class="rating">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FFB800" stroke="#FFB800" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          {{ seller.rating }} ({{ seller.reviewCount }} reviews)
        </span>
        <span class="divider">•</span>
        <span class="delivery-time">{{ seller.deliveryTime }}</span>
      </div>
      <p class="seller-description">{{ seller.description }}</p>
    </div>

    <!-- Menu Section -->
    <div class="menu-section">
      <h2 class="section-title">Menu</h2>
      <div class="menu-list">
        <MenuItem 
          v-for="item in seller.menu" 
          :key="item.id" 
          :item="item"
          :sellerId="seller.id"
          :sellerName="seller.name"
          @added="handleItemAdded"
        />
      </div>
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
import MenuItem from '../components/MenuItem.vue'
import { sellers } from '../stores/data'

export default {
  name: 'SellerPage',
  components: {
    MenuItem
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      seller: null,
      showToast: false
    }
  },
  created() {
    this.loadSeller()
  },
  watch: {
    id() {
      this.loadSeller()
    }
  },
  methods: {
    loadSeller() {
      const sellerId = parseInt(this.id)
      this.seller = sellers.find(s => s.id === sellerId)
    },
    goBack() {
      this.$router.back()
    },
    handleItemAdded() {
      this.showToast = true
      setTimeout(() => {
        this.showToast = false
      }, 2000)
    }
  }
}
</script>

<style scoped>
.seller-page {
  min-height: 100vh;
  background: #F3F4F6;
}

.banner-section {
  position: relative;
  height: 200px;
}

.banner-image {
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
  color: #111827;
}

.seller-info {
  background: white;
  margin-top: -40px;
  border-radius: 24px 24px 0 0;
  padding: 20px;
  padding-top: 60px;
  position: relative;
  text-align: center;
}

.seller-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
}

.seller-name {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

.seller-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  color: #6B7280;
  margin-bottom: 12px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
  color: #111827;
}

.divider {
  color: #D1D5DB;
}

.seller-description {
  font-size: 14px;
  color: #6B7280;
  line-height: 1.5;
  max-width: 400px;
  margin: 0 auto;
}

.menu-section {
  padding: 20px 16px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 16px;
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  color: #6B7280;
}

.toast {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: #111827;
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
