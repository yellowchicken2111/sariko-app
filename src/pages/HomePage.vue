<template>
  <div class="home-page">
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <span class="location-label">Hello</span>
        <h1 class="agency-name">Delisas Agency</h1>
      </div>
      <div class="header-right">
        <button class="icon-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
        <button class="icon-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
      </div>
    </header>

    <!-- Category Chips -->
    <section class="categories-section">
      <CategoryChips 
        :categories="categories" 
        :selectedCategory="selectedCategory"
        @select="handleCategorySelect"
      />
    </section>

    <!-- Promotional Banner -->
    <section class="promo-section">
      <div class="promo-banner">
        <div class="promo-content">
          <span class="promo-badge">New Year Offer</span>
          <h2 class="promo-discount">30% OFF</h2>
          <p class="promo-period">16 - 31 Dec</p>
          <button class="promo-btn">Get Now</button>
        </div>
        <img 
          src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop" 
          alt="Pizza" 
          class="promo-image"
        />
      </div>
    </section>

    <!-- Best Sellers -->
    <section class="sellers-section">
      <div class="section-header">
        <h2 class="section-title">Best Sellers</h2>
        <button class="see-all-btn">See All</button>
      </div>
      
      <div class="food-grid">
        <FoodCard 
          v-for="food in bestSellerFoods" 
          :key="`${food.sellerId}-${food.id}`" 
          :food="food"
          :sellerId="food.sellerId"
          @click="goToFood(food.sellerId, food.id)"
        />
      </div>
      
      <div v-if="bestSellerFoods.length === 0" class="empty-state">
        <p>No items found.</p>
      </div>
    </section>
  </div>
</template>

<script>
import CategoryChips from '../components/CategoryChips.vue'
import FoodCard from '../components/FoodCard.vue'
import { categories, sellers } from '../stores/data'

export default {
  name: 'HomePage',
  components: {
    CategoryChips,
    FoodCard
  },
  data() {
    return {
      searchQuery: '',
      selectedCategory: null,
      categories: categories,
      sellers: sellers
    }
  },
  computed: {
    selectedCategoryName() {
      if (!this.selectedCategory) return null
      const category = this.categories.find(c => c.id === this.selectedCategory)
      return category ? category.name : null
    },
    bestSellerFoods() {
      let foods = []
      
      // Get all foods from all sellers
      this.sellers.forEach(seller => {
        seller.menu.forEach(food => {
          foods.push({
            ...food,
            sellerId: seller.id,
            sellerName: seller.name,
            deliveryTime: seller.deliveryTime
          })
        })
      })

      // Filter by category if selected
      if (this.selectedCategory) {
        const categoryName = this.selectedCategoryName
        const filteredSellers = this.sellers.filter(s => s.category === categoryName)
        foods = []
        filteredSellers.forEach(seller => {
          seller.menu.forEach(food => {
            foods.push({
              ...food,
              sellerId: seller.id,
              sellerName: seller.name,
              deliveryTime: seller.deliveryTime
            })
          })
        })
      }

      // Return first 6 items
      return foods.slice(0, 6)
    }
  },
  methods: {
    handleCategorySelect(categoryId) {
      this.selectedCategory = categoryId
    },
    goToFood(sellerId, foodId) {
      this.$router.push(`/food/${sellerId}/${foodId}`)
    }
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #FFFFFF;
  padding: 16px;
  padding-top: calc(16px + env(safe-area-inset-top, 0));
  padding-bottom: 100px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  flex-direction: column;
}

.location-label {
  font-size: 12px;
  color: #9CA3AF;
  margin-bottom: 2px;
}

.agency-name {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.header-right {
  display: flex;
  gap: 12px;
}

.icon-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #F3F4F6;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #374151;
  transition: background 0.2s ease;
}

.icon-btn:hover {
  background: #E5E7EB;
}

.categories-section {
  margin-bottom: 24px;
}

.promo-section {
  margin-bottom: 28px;
}

.promo-banner {
  background: linear-gradient(135deg, #166534 0%, #15803D 50%, #22C55E 100%);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
  min-height: 140px;
}

.promo-content {
  flex: 1;
  z-index: 1;
}

.promo-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 12px;
  margin-bottom: 8px;
}

.promo-discount {
  font-size: 32px;
  font-weight: 800;
  color: white;
  margin-bottom: 4px;
  line-height: 1.1;
}

.promo-period {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 12px;
}

.promo-btn {
  background: white;
  color: #16A34A;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.promo-btn:hover {
  background: #F0FDF4;
}

.promo-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  position: absolute;
  right: 16px;
  bottom: -10px;
  border: 4px solid rgba(255, 255, 255, 0.3);
}

.sellers-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.see-all-btn {
  font-size: 14px;
  font-weight: 600;
  color: #22C55E;
  background: none;
  border: none;
  cursor: pointer;
}

.see-all-btn:hover {
  color: #16A34A;
}

.food-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #6B7280;
}

@media (max-width: 360px) {
  .food-grid {
    grid-template-columns: 1fr;
  }
}
</style>
