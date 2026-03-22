<script>
import { mapState, mapWritableState } from 'pinia';
import { useHomeStore } from '@/stores/homeStore';
import { categories } from '@/stores/data'; 
import CategoryChips from '@/components/home-page/CategoryChips.vue';
export default {

    components: {
        CategoryChips
    },

    computed: {

        ...mapState(useHomeStore, [
            "categories"
        ]),

        ...mapWritableState(useHomeStore, [
            "selectedCategory"
        ]),

        selectedCategoryName() {
            if (!this.selectedCategory) return null
            const category = this.categories.find(c => c.id === this.selectedCategory)
            return category ? category.name : null
        },
    },

    methods: {
        handleCategorySelect(categoryId) {
            this.selectedCategory = categoryId
        }
    }
}
</script>

<template>

    <CategoryChips 
        :categories="categories" 
        :selectedCategory="selectedCategory"
        @select="handleCategorySelect" 
    />

</template>

<style scoped>
</style>