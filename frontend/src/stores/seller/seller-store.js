import { defineStore } from 'pinia'
import { sellers, menus } from '@/stores/data.js'
export const useSellerStore = defineStore('sellerStore', {
    
    state: () => {
        return {
            sellers: sellers,
            seller: null,

            // categories
            categoriesMenu: [
                {id: 1, label: 'Lutong Bahay', icon: '🍲'},
                {id: 2, label: 'Silogs', icon: '🍳'},
                {id: 3, label: 'Noodles', icon: '🍜'},
                {id: 4, label: 'Desserts', icon: '🍮'},
                {id: 5, label: 'Frozen', icon: '❄️'},
                {id: 6, label: 'Others', icon: ''},
            ],
            selectedCategoryMenu: 'Lutong Bahay',

            // menu
            menus: menus
        }
    },

    getters: {
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
    }
})