<template>
  <div class="home-page">
    <!-- Header -->
    <header class="header">
      <div class="logo-section">
        <h1 class="logo">Sariko</h1>
        <p class="tagline">Community Marketplace</p>
      </div>
    </header>

    <!-- Search & Location -->
    <div class="search-section">
      <div class="search-bar">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search for food or sellers..."
          class="search-input"
        />
      </div>
      <button class="location-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <span>Manila, PH</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    </div>

    <!-- Category Chips -->
    <section class="categories-section">
      <CategoryChips 
        :categories="categories" 
        :selectedCategory="selectedCategory"
        @select="handleCategorySelect"
      />
    </section>

    <!-- Seller Feed -->
    <section class="sellers-section">
      <h2 class="section-title">
        {{ selectedCategoryName ? selectedCategoryName : 'Discover Sellers' }}
      </h2>
      <div class="sellers-feed">
        <SellerCard 
          v-for="seller in filteredSellers" 
          :key="seller.id" 
          :seller="seller"
        />
      </div>
      <div v-if="filteredSellers.length === 0" class="empty-state">
        <p>No sellers found in this category.</p>
      </div>
    </section>
  </div>
</template>

<script>
import CategoryChips from '../components/CategoryChips.vue'
import SellerCard from '../components/SellerCard.vue'
import { categories, sellers } from '../stores/data'

export default {
  name: 'HomePage',
  components: {
    CategoryChips,
    SellerCard
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
    filteredSellers() {
      let result = this.sellers

      // Filter by category
      if (this.selectedCategory) {
        const categoryName = this.selectedCategoryName
        result = result.filter(seller => seller.category === categoryName)
      }

      // Filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        result = result.filter(seller => 
          seller.name.toLowerCase().includes(query) ||
          seller.category.toLowerCase().includes(query) ||
          seller.menu.some(item => item.name.toLowerCase().includes(query))
        )
      }

      return result
    }
  },
  methods: {
    handleCategorySelect(categoryId) {
      this.selectedCategory = categoryId
    }
  }
}
</script>

<style scoped>
.home-page {
  padding: 16px;
  padding-top: calc(16px + env(safe-area-inset-top, 0));
}

.header {
  margin-bottom: 20px;
}

.logo-section {
  display: flex;
  flex-direction: column;
}

.logo {
  font-size: 28px;
  font-weight: 700;
  color: #FF6B35;
  letter-spacing: -0.5px;
}

.tagline {
  font-size: 13px;
  color: #636E72;
  margin-top: 2px;
}

.search-section {
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 14px 16px;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 12px;
}

.search-bar svg {
  color: #636E72;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  color: #2D3436;
  background: transparent;
}

.search-input::placeholder {
  color: #B2BEC3;
}

.location-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 12px 16px;
  border-radius: 12px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: #2D3436;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.location-btn svg {
  color: #FF6B35;
}

.location-btn svg:last-child {
  color: #636E72;
}

.categories-section {
  margin-bottom: 24px;
}

.sellers-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #2D3436;
  margin-bottom: 16px;
}

.sellers-feed {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #636E72;
}
</style>
