<script>
import LayoutBaseSearchPage from '@/layouts/search/LayoutBaseSearchPage.vue'
import SearchHeader from '@/components/search/SearchHeader.vue'
import SearchFilters from '@/components/search/SearchFilters.vue'
import FoodResults from '@/components/search/FoodResults.vue'
import CategoryResults from '@/components/search/CategoryResults.vue'
import { useSearchStore } from '@/stores/search/searchStore'

export default {
    name: 'SearchPage',
    components: {
        LayoutBaseSearchPage,
        SearchHeader,
        SearchFilters,
        FoodResults,
        CategoryResults
    },
    mounted() {
        const q = this.$route.query.q
        if (q && typeof q === 'string') {
            const store = useSearchStore()
            store.query = q
            store.search(q)
        }
    }
}
</script>

<template>
    <LayoutBaseSearchPage>

        <template #Header>
            <SearchHeader />
        </template>

        <template #Filters>
            <SearchFilters />
        </template>

        <template #FoodResults>
            <FoodResults />
        </template>

        <template #CategoryResults>
            <CategoryResults />
        </template>

    </LayoutBaseSearchPage>
</template>
