<script>
import { mapActions, mapWritableState, mapState } from 'pinia';
import { useSellerStore } from '@/stores/seller/seller-store';

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
    font-family: $sariko-font-family-secondary;
}

.category {
    border: 1.5px solid rgb(255, 255, 255, 0.3);
    border-radius: 1rem;
    margin-right: 10px;
    background-color: rgb(255, 255, 255, 0.15);
    padding: 0px 12px;
}
.category-active {
    color: $primary;
    font-weight: 700;
    background-color: $accent;
    border: 2px solid rgb(255, 255, 255, 0.3);
    border-radius: 2rem;
}

:deep(.q-tab__content) {
    font-size: 11px;
    font-weight: 600;
}
</style>
