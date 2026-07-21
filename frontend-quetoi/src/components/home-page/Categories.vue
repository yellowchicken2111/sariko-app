<script>
import { mapActions, mapWritableState, mapState } from 'pinia';
import { useSellerStore } from '@/stores/seller/sellerStore';

export default {
    computed: {
        ...mapState(useSellerStore, [
            "homeMenuCategories"
        ]),

        ...mapWritableState(useSellerStore, [
            "selectedHomeMenuCategory"
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
    indicator-color="transparent"
    outside-arrows
    align="justify"
    v-model="selectedHomeMenuCategory"
    >
        <q-tab class="category" v-for="category in homeMenuCategories" :name="category.label">
            <div>
                {{category.icon}} {{ category.label }}
            </div>
        </q-tab>
    </q-tabs>

</template>

<style lang="scss" scoped>

.categories {
    font-family: $quetoi-font-family-secondary;
}

.category {
    border: 1.5px solid var(--border-color);
    border-radius: 10px;
    margin-right: 10px;
    background-color: rgba(26, 42, 32, 0.05);
    padding: 0px 12px;
}
.category-active {
    color: var(--text-on-shell);
    font-weight: 700;
    background-color: $primary;
    border: 2px solid rgb(255, 255, 255, 0.3);
    border-radius: 2rem;
}

:deep(.q-tab__content) {
    font-size: 11px;
    font-weight: 600;
}
</style>
