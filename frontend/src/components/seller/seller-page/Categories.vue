<script>
import { mapActions, mapWritableState, mapState } from 'pinia';
import { useSellerStore } from '@/stores/seller/seller-store';

export default {
    data() {
        return {

        }
    },

    computed: {
        ...mapState(useSellerStore, [
            "categoriesMenu"
        ]),

        ...mapWritableState(useSellerStore, [
            "selectedCategoryMenu"
        ])
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
        <q-tab v-for="category in categoriesMenu" :name="category.label">
            <div>
                {{category.icon}} {{ category.label }}
            </div>
        </q-tab>
    </q-tabs>

</template>

<style lang="scss" scoped>

.categories {
    font-family: $sariko-font-family-secondary;
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
