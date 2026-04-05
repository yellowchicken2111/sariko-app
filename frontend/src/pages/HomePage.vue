<script>
import LayoutBaseHomePage from '@/layouts/home-page/LayoutBaseHomePage.vue'
import Header from '@/components/home-page/Header.vue'
import SearchBar from '@/components/home-page/SearchBar.vue'
import Categories from '@/components/home-page/Categories.vue'
import FoundingSellers from '@/components/home-page/FoundingSellers.vue';
import FeaturedDishes from '@/components/home-page/FeaturedDishes.vue';
import Banner from '@/components/home-page/Banner.vue'
import { categories, sellers } from '../stores/data'

export default {
    name: 'HomePage',
    components: {
        LayoutBaseHomePage,
        Header,
        Categories,
        SearchBar,
        FoundingSellers,
        FeaturedDishes,
        Banner
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

    <LayoutBaseHomePage>

        <template #Header>
            <Header />
        </template>

        <template #SearchBar>
            <SearchBar />
        </template>

        <template #Categories>
            <Categories />
        </template>

        <template #FoundingSellers>
            <FoundingSellers />
        </template>

        <template #FeturedDishes>
            <FeaturedDishes />
        </template>

        <template #Banner>
            <Banner />
        </template>

    </LayoutBaseHomePage>

</template>

<style scoped>
</style>