import { defineStore } from 'pinia'
import { sellers, menus } from '@/stores/data.js'
import apiSellers from '@/apis/sellers/apiSellers'

export const useSellerStore = defineStore('sellerStore', {
    
    state: () => {
        return {
            sellers: sellers,
            seller: null,
            foundingSellers: [],

            // categories
            homeMenuCategories: [
                {id: 1, label: 'Lutong Bahay', icon: '🍲'},
                {id: 2, label: 'Silogs', icon: '🍳'},
                {id: 3, label: 'Noodles', icon: '🍜'},
                {id: 4, label: 'Desserts', icon: '🍮'},
                {id: 5, label: 'Frozen', icon: '❄️'},
                {id: 6, label: 'Others', icon: ''},
            ],
            selectedHomeMenuCategory: 'Lutong Bahay',

            // categories
            menuCategories: [
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
        menu(state) {
            if (!state.selectedCategoryMenu || !state.menus.length) return []
            const category = state.menus.find(m => m.id === state.selectedCategoryMenu)
            return category?.food_items || []
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
    },

    actions: {
        
        async getFoundingSellers() {
            try {
                const res = await apiSellers.getFoundingSellers()
                if (res?.data) {
                    this.foundingSellers = res.data.founding_sellers
                }
            } catch (e) {
                console.error(`sellerStore - getFoundingSellers - ${e}`);
            }
        },

        async getSellerbySlugName(slugName) {
            try {
                const res = await apiSellers.getSellerbySlugName(slugName)
                console.log('getSellerbySlugName response:', res?.data)
                if (res?.data) {
                    this.seller = res.data.seller
                }
            } catch (e) {
                console.error(`sellerStore - getSellerbySlugName - ${e}`);
            }
            
        },

        async getSellerFullMenu(slugName) {
            try {
                const res = await apiSellers.getSellerFullMenu(slugName)
                if (res?.data) {
                    this.menus = res.data.menus
                    this.menuCategories = this.menus.map(c => ({ id: c.id, name: c.name }))
                    this.selectedCategoryMenu = this.menus.find(menu => {return menu.food_items.length > 0}).id
                }
            } catch (e) {
                console.error(`sellerStore - getSellerFullMenu - ${e}`);
            }
        }
    }
})