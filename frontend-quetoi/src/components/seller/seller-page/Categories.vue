<script>
import { mapActions, mapWritableState, mapState } from 'pinia';
import { useSellerStore } from '@/stores/seller/sellerStore';

export default {
    data() {
        return {

        }
    },

    computed: {
        ...mapState(useSellerStore, [
            "menuCategories",
            "menus"
        ]),

        ...mapWritableState(useSellerStore, [
            "selectedCategoryMenu"
        ])
    },

    methods: {
        ...mapActions(useSellerStore, [
            "getSellerFullMenu"
        ])
    },

    created() {
        const sellerSlugName = this.$route.params.slugName
        console.log({sellerSlugName})
        this.getSellerFullMenu(sellerSlugName)
    }
}
</script>

<template>
    <q-tabs
    no-caps=""
    dense 
    class="categories"
    content-class="categories-content"
    active-class="category-active" 
    outside-arrows
    align="justify"
    narrow-indicator 
    v-model="selectedCategoryMenu"
    >
        <q-tab v-for="category in menuCategories" :name="category.id">
            <div>
                {{category.icon}} {{ category.name }}
            </div>
        </q-tab>
    </q-tabs>

</template>

<style lang="scss" scoped>

.categories {
    font-family: $quetoi-font-family-secondary;
}

.category-active {
    color: var(--text-active);
    font-weight: 700;
}

:deep(.q-tab__content) {
    font-size: 12px;
    font-weight: 600;
}
</style>
