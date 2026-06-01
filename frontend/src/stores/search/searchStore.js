import { defineStore } from 'pinia'
import { apiSearch } from '@/apis/search/apiSearch'

const DEBOUNCE_MS = 300
const FALLBACK_FOOD_IMAGE = '/images/default-food-image.webp'

export const useSearchStore = defineStore('searchStore', {
    state: () => ({
        query: '',
        foods: [],
        categories: [],
        loading: false,
        _debounceTimer: null,
        preorderFilter: 'all'  // 'all' | 'available' | 'preorder'
    }),

    getters: {
        foodResults: (state) => {
            let list = state.foods
            if (state.preorderFilter === 'available') {
                list = list.filter(f => !f.preorder_day)
            } else if (state.preorderFilter === 'preorder') {
                list = list.filter(f => f.preorder_day > 0)
            }
            return list.map(f => ({
                ...f,
                image_url: f.image_url || FALLBACK_FOOD_IMAGE
            }))
        },
        categoryResults: (state) => state.categories
    },

    actions: {
        setPreorderFilter(value) {
            this.preorderFilter = value
        },

        setQuery(value) {
            this.query = value
            clearTimeout(this._debounceTimer)
            this._debounceTimer = setTimeout(() => {
                this.search(this.query)
            }, DEBOUNCE_MS)
        },

        async search(q) {
            const trimmed = (q || '').trim()
            if (!trimmed) {
                this.foods = []
                this.categories = []
                return
            }
            this.loading = true
            try {
                const res = await apiSearch.search(trimmed)
                this.foods = res.data?.foods || []
                this.categories = res.data?.categories || []
            } catch (e) {
                console.error('searchStore.search', e)
                this.foods = []
                this.categories = []
            } finally {
                this.loading = false
            }
        }
    }
})
