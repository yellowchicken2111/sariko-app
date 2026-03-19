<template>
    <div class="seller-page" v-if="seller">
        <!-- Banner & Header -->
        <div class="banner-section">
            <div class="overlay"></div>
            <img :src="seller.banner || seller.image" :alt="seller.name" class="banner-image" />
            <button class="back-btn" @click="goBack">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
            </button>
        </div>

        <!-- Seller Info Meta -->
        <div class="seller-info">
            <img :src="seller.image" :alt="seller.name" class="seller-avatar" />
            
            <div class="title-row">
                <h1 class="seller-name">{{ seller.name }}</h1>
            </div>
            
            <div class="meta-tags">
                <span class="meta-tag rating">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"
                        stroke="currentColor" stroke-width="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    {{ seller.rating }} ({{ seller.reviewCount }})
                </span>
                <span class="meta-tag min-order">
                    Min ₱{{ seller.minOrder || 0 }}
                </span>
            </div>
            
            <div class="delivery-meta">
               <div class="meta-item">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                   <span>{{ seller.deliveryTime }}</span>
               </div>
               <span class="divider">•</span>
               <div class="meta-item">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                   <span>₱{{ seller.deliveryFee || 0 }}</span>
               </div>
               <span class="divider">•</span>
               <div class="meta-item status" :class="{ 'closed': seller.isOpen === false }">
                   <span class="status-dot"></span>
                   <span>{{ seller.isOpen !== false ? 'Open' : 'Closed' }} until {{ seller.closingTime }}</span>
               </div>
            </div>

            <p class="seller-description">{{ seller.description }}</p>
        </div>

        <!-- Sticky Category Navigation Tab -->
        <div class="category-tabs-container">
            <div class="category-tabs">
                <button 
                  v-for="(items, categoryName) in categorizedMenu" 
                  :key="categoryName"
                  class="category-tab"
                  :class="{ 'active': activeCategory === categoryName }"
                  @click="scrollToCategory(categoryName)"
                >
                  {{ categoryName }}
                </button>
            </div>
        </div>

        <!-- Menu Grouped Sections -->
        <div class="menu-container">
            <div 
                v-for="(items, categoryName) in categorizedMenu" 
                :key="categoryName" 
                :id="`category-${categoryName.replace(/\\s+/g, '-')}`"
                class="menu-category-section"
            >
                <h2 class="category-title">{{ categoryName }}</h2>
                <div class="menu-list">
                    <MenuItem 
                        v-for="item in items" 
                        :key="item.id" 
                        :item="item" 
                        :sellerId="seller.id"
                        :sellerName="seller.name" 
                    />
                </div>
            </div>
        </div>
        
        <!-- Bottom padding to prevent cart overlap -->
        <div class="bottom-spacer" v-if="sellerCartItemCount > 0"></div>

        <!-- Sticky Cart Bar -->
        <transition name="slide-up">
            <div class="sticky-cart-bar" v-if="sellerCartItemCount > 0">
                <div class="cart-summary">
                    <div class="cart-badge">{{ sellerCartItemCount }}</div>
                    <div class="cart-total-info">
                        <span class="total-label">Subtotal</span>
                        <span class="total-amount">₱{{ sellerCartTotal }}</span>
                    </div>
                </div>
                <button class="view-cart-btn" @click="goToCart">
                    View Cart
                </button>
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
import { useCartStore } from '../stores/cartStore'

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
    setup() {
        const cartStore = useCartStore()
        return { cartStore }
    },
    data() {
        return {
            seller: null,
            activeCategory: null
        }
    },
    computed: {
        categorizedMenu() {
            if (!this.seller || !this.seller.menu) return {}
            
            const grouped = {};
            this.seller.menu.forEach(item => {
                const mapKey = item.categoryName || 'Others';
                if (!grouped[mapKey]) {
                    grouped[mapKey] = [];
                }
                grouped[mapKey].push(item);
            });
            return grouped;
        },
        // Filter cart items specifically belonging to THIS seller for the sticky bar
        sellerCartItems() {
            if (!this.seller) return [];
            return this.cartStore.items.filter(i => i.sellerId === this.seller.id);
        },
        sellerCartItemCount() {
            return this.sellerCartItems.reduce((acc, item) => acc + item.quantity, 0);
        },
        sellerCartTotal() {
            return this.sellerCartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
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
            
            if (this.seller && this.seller.menu.length > 0) {
                // Set first category as active initially
                const categories = Object.keys(this.categorizedMenu);
                if (categories.length > 0) {
                    this.activeCategory = categories[0];
                }
            }
        },
        goBack() {
            this.$router.back()
        },
        goToCart() {
            this.$router.push('/cart')
        },
        scrollToCategory(categoryName) {
            this.activeCategory = categoryName;
            const elementId = `category-${categoryName.replace(/\\s+/g, '-')}`;
            const element = document.getElementById(elementId);
            if (element) {
                // Account for heights: header offset + sticky tabs roughly ~80px
                const y = element.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }
    }
}
</script>

<style scoped>
.seller-page {
    min-height: 100vh;
    background: var(--bg-main);
    position: relative;
}

.banner-section {
    position: relative;
    height: 220px;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(15, 42, 68, 0.7) 0%, rgba(15, 42, 68, 0) 40%);
    z-index: 1;
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
    background: rgba(15, 42, 68, 0.4);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    transition: all 0.2s ease;
    color: white;
}

.back-btn:active {
    transform: scale(0.95);
    background: rgba(15, 42, 68, 0.6);
}

.seller-info {
    background: var(--bg-surface);
    margin-top: -30px;
    border-radius: 24px 24px 0 0;
    padding: 24px 20px 20px;
    position: relative;
    z-index: 5;
    box-shadow: 0 -4px 12px rgba(0,0,0,0.1);
}

.seller-avatar {
    width: 76px;
    height: 76px;
    border-radius: 20px;
    object-fit: cover;
    border: 4px solid var(--bg-surface);
    background-color: var(--bg-surface);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    position: absolute;
    top: -38px;
    left: 20px;
}

.title-row {
    margin-top: 24px;
    margin-bottom: 12px;
}

.seller-name {
    font-size: 24px;
    font-weight: 800;
    color: var(--text-primary);
    margin: 0;
    line-height: 1.2;
}

.meta-tags {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
}

.meta-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: var(--bg-main);
    border-radius: 12px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
}

.meta-tag.rating {
    color: var(--color-accent);
}

.delivery-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border-color);
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--text-secondary);
    font-weight: 500;
}

.meta-item svg {
    color: var(--text-secondary);
    opacity: 0.8;
}

.divider {
    color: var(--border-color);
    font-size: 10px;
}

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #10B981; /* Default to open green */
}

.status.closed .status-dot {
    background-color: #EF4444; /* Red for closed */
}

.seller-description {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.5;
    margin: 0;
}

.category-tabs-container {
    position: sticky;
    top: env(safe-area-inset-top, 0);
    background: var(--bg-surface);
    z-index: 20;
    border-bottom: 1px solid var(--border-color);
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}

.category-tabs {
    display: flex;
    overflow-x: auto;
    scrollbar-width: none;
    padding: 0 16px;
}

.category-tabs::-webkit-scrollbar {
    display: none;
}

.category-tab {
    padding: 16px 12px;
    white-space: nowrap;
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 14px;
    font-weight: 600;
    position: relative;
    cursor: pointer;
    transition: color 0.2s ease;
}

.category-tab.active {
    color: var(--color-accent);
}

.category-tab.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--color-accent);
    border-radius: 3px 3px 0 0;
}

.menu-container {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 32px;
}

.category-title {
    font-size: 20px;
    font-weight: 800;
    color: var(--text-primary);
    margin-bottom: 16px;
    padding-top: 8px;
}

.menu-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.bottom-spacer {
    height: 100px;
}

.sticky-cart-bar {
    position: fixed;
    bottom: 16px;
    left: 16px;
    right: 16px;
    background: var(--color-accent);
    border-radius: 16px;
    padding: 12px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 10px 25px -5px rgba(201, 166, 70, 0.4);
    z-index: 100;
}

.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
    opacity: 0;
    transform: translateY(100px);
}

.cart-summary {
    display: flex;
    align-items: center;
    gap: 12px;
}

.cart-badge {
    background: var(--bg-main);
    color: var(--color-accent);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
}

.cart-total-info {
    display: flex;
    flex-direction: column;
    color: var(--bg-main);
}

.total-label {
    font-size: 12px;
    font-weight: 600;
    opacity: 0.9;
}

.total-amount {
    font-size: 16px;
    font-weight: 800;
}

.view-cart-btn {
    background: var(--bg-main);
    color: var(--color-accent);
    border: none;
    padding: 10px 20px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: transform 0.1s ease;
}

.view-cart-btn:active {
    transform: scale(0.96);
}

.loading-state {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    color: var(--text-secondary);
    font-size: 15px;
}
</style>
