import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import { useDashboardStore } from '@/stores/seller/dashboardStore'
import apiSellerMenu from '@/apis/sellers/apiSellerMenu'

export const useMenuStore = defineStore('menuStore', {
    state() {
        return {
            categories: [],   // [{ id, name, sort_order, is_active, food_items: [...] }]
            isLoading: false,
            sellerId: null,
        }
    },

    getters: {
        allItems(state) {
            return state.categories.flatMap(c => c.food_items || [])
        },
    },

    actions: {
        async fetchMenu() {
            this.isLoading = true
            try {
                const dashStore = useDashboardStore()
                if (!dashStore.sellerId) await dashStore.fetchSellerInfo()
                this.sellerId = dashStore.sellerId

                const res = await apiSellerMenu.getMenu()
                this.categories = res.menu || []
            } catch (e) {
                console.error('menuStore - fetchMenu -', e)
            } finally {
                this.isLoading = false
            }
        },

        // ── Categories ──────────────────────────────────────────────────────

        async createCategory(name) {
            const maxOrder = this.categories.reduce((m, c) => Math.max(m, c.sort_order || 0), 0)
            const res = await apiSellerMenu.createCategory(name, maxOrder + 1)
            this.categories.push({ ...res.category, food_items: [] })
            return res.category
        },

        async updateCategory(catId, fields) {
            const res = await apiSellerMenu.updateCategory(catId, fields)
            const idx = this.categories.findIndex(c => c.id === catId)
            if (idx !== -1) Object.assign(this.categories[idx], res.category)
        },

        async deleteCategory(catId) {
            await apiSellerMenu.deleteCategory(catId)
            this.categories = this.categories.filter(c => c.id !== catId)
        },

        // ── Food Items ───────────────────────────────────────────────────────

        async createItem(fields) {
            const res = await apiSellerMenu.createItem(fields)
            const item = res.item
            const cat = this.categories.find(c => c.id === item.category_id)
            if (cat) {
                if (!cat.food_items) cat.food_items = []
                cat.food_items.push(item)
            }
            return item
        },

        async updateItem(itemId, fields) {
            const res = await apiSellerMenu.updateItem(itemId, fields)
            const updated = res.item
            for (const cat of this.categories) {
                const idx = (cat.food_items || []).findIndex(i => i.id === itemId)
                if (idx !== -1) {
                    // Handle category change
                    if (updated.category_id !== cat.id) {
                        cat.food_items.splice(idx, 1)
                        const newCat = this.categories.find(c => c.id === updated.category_id)
                        if (newCat) {
                            if (!newCat.food_items) newCat.food_items = []
                            newCat.food_items.push(updated)
                        }
                    } else {
                        Object.assign(cat.food_items[idx], updated)
                    }
                    break
                }
            }
            return updated
        },

        async deleteItem(itemId) {
            await apiSellerMenu.deleteItem(itemId)
            for (const cat of this.categories) {
                const idx = (cat.food_items || []).findIndex(i => i.id === itemId)
                if (idx !== -1) { cat.food_items.splice(idx, 1); break }
            }
        },

        async toggleAvailable(itemId, isAvailable) {
            return this.updateItem(itemId, { is_available: isAvailable })
        },

        // ── Image upload (Supabase Storage) ─────────────────────────────────

        async uploadImage(itemId, file) {
            const sellerId = this.sellerId
            if (!sellerId) throw new Error('No seller ID')
            const path = `${sellerId}/${itemId}`
            const { error } = await supabase.storage
                .from('food-items')
                .upload(path, file, { upsert: true, contentType: file.type })
            if (error) throw error
            const { data } = supabase.storage.from('food-items').getPublicUrl(path)
            return data.publicUrl
        },
    },
})
