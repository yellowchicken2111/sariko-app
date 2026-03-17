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
            let filtered = this.sellers;

            // Filter by category
            if (this.selectedCategory) {
                const categoryName = this.selectedCategoryName
                filtered = filtered.filter(s => s.category === categoryName)
            }

            // Filter by search query (match seller name, description, or contained menu items)
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                filtered = filtered.filter(seller =>
                    seller.name.toLowerCase().includes(query) ||
                    seller.description.toLowerCase().includes(query) ||
                    seller.menu.some(food => food.name.toLowerCase().includes(query))
                );
            }
            return filtered;
        },
        nearbySellers() {
            // Mock logic: Sort by parsed distance pseudo-computation
            return [...this.filteredSellers].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance)).slice(0, 3)
        },
        popularSellers() {
            // Mock logic: Sort by rating (top down)
            return [...this.filteredSellers].sort((a, b) => b.rating - a.rating).slice(0, 3)
        },
        newSellers() {
            // Mock logic: Simple reversal to simulate "new additions"
            return [...this.filteredSellers].reverse().slice(0, 3)
        }
    },
    methods: {
        handleCategorySelect(categoryId) {
            this.selectedCategory = categoryId
        }
    }
}
</script>


<template>
    <div class="home-page">
        <!-- Header / Location Selector -->
        <header class="header">
            <div class="header-left">
                <span class="location-label">Current Location</span>
                <div class="location-selector">
                    <h1 class="agency-name">Manila, Philippines</h1>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
            </div>
            <div class="header-right">
                <button class="icon-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </button>
            </div>
        </header>

        <!-- Search Bar -->
        <div class="search-container">
            <div class="search-box">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="search-icon">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input type="text" v-model="searchQuery" placeholder="Search for food or sellers..."
                    class="search-input" />
            </div>
        </div>

        <!-- Category Chips -->
        <section class="categories-section">
            <CategoryChips :categories="categories" :selectedCategory="selectedCategory"
                @select="handleCategorySelect" />
        </section>

        <!-- Discovery Feed: Sellers -->
        <div class="discovery-feed" v-if="filteredSellers.length > 0">

            <!-- Nearby Sellers -->
            <section class="sellers-section">
                <div class="section-header">
                    <h2 class="section-title">Nearby Sellers</h2>
                    <button class="see-all-btn">See All</button>
                </div>
                <div class="seller-list">
                    <SellerCard v-for="seller in nearbySellers" :key="`nearby-${seller.id}`" :seller="seller" />
                </div>
            </section>

            <!-- Popular Sellers -->
            <section class="sellers-section" v-if="popularSellers.length > 0">
                <div class="section-header">
                    <h2 class="section-title">Popular Sellers</h2>
                    <button class="see-all-btn">See All</button>
                </div>
                <div class="seller-list">
                    <SellerCard v-for="seller in popularSellers" :key="`popular-${seller.id}`" :seller="seller" />
                </div>
            </section>

            <!-- New Sellers -->
            <section class="sellers-section" v-if="newSellers.length > 0">
                <div class="section-header">
                    <h2 class="section-title">New Sellers</h2>
                    <button class="see-all-btn">See All</button>
                </div>
                <div class="seller-list">
                    <SellerCard v-for="seller in newSellers" :key="`new-${seller.id}`" :seller="seller" />
                </div>
            </section>

        </div>

        <div v-else class="empty-state">
            <p>No sellers or food items match your search.</p>
        </div>
    </div>
</template>

<style scoped>
.home-page {
    min-height: 100vh;
    background: var(--bg-main);
    padding: 16px;
    padding-top: calc(16px + env(safe-area-inset-top, 0));
    padding-bottom: 100px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.header-left {
    display: flex;
    flex-direction: column;
}

.location-label {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
    margin-bottom: 2px;
}

.location-selector {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
}

.agency-name {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
}

.icon-btn {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: var(--bg-surface);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--color-accent);
    transition: background 0.2s ease;
    box-shadow: var(--shadow-card);
}

.icon-btn:hover {
    background: var(--bg-card-hover);
}

.search-container {
    margin-bottom: 24px;
}

.search-box {
    position: relative;
    width: 100%;
}

.search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
}

.search-input {
    width: 100%;
    padding: 14px 16px 14px 44px;
    border-radius: 16px;
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    font-size: 15px;
    box-shadow: var(--shadow-card);
    outline: none;
    transition: all 0.2s ease;
}

.search-input::placeholder {
    color: var(--text-secondary);
}

.search-input:focus {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 2px rgba(201, 166, 70, 0.2);
}

.categories-section {
    margin-bottom: 28px;
}

.sellers-section {
    margin-bottom: 32px;
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
    color: var(--text-primary);
    margin: 0;
}

.see-all-btn {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-accent);
    background: none;
    border: none;
    cursor: pointer;
    transition: opacity 0.2s ease;
}

.see-all-btn:hover {
    opacity: 0.8;
}

.seller-list {
    display: flex;
    flex-direction: column;
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: var(--text-secondary);
    font-size: 15px;
}
</style>
