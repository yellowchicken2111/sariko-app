<script>
import { Plus } from 'lucide-vue-next'
import SellerMenuFoodItem from './SellerMenuFoodItem.vue'
import ModalEditItem from './ModalEditItem.vue'
import ModalEditCategory from './ModalEditCategory.vue'

export default {
    name: 'SellerMenuCategorySection',

    components: { Plus, SellerMenuFoodItem, ModalEditItem, ModalEditCategory },

    props: {
        category: { type: Object, required: true },
    },

    data() {
        return {
            showAddItem: false,
            showEditCategory: false,
            expanded: true,
        }
    },

}
</script>

<template>
    <div class="category-section">
        <!-- Category header -->
        <div class="category-header" @click="expanded = !expanded">
            <div class="category-left">
                <div class="expand-icon" :class="{ rotated: !expanded }">›</div>
                <span class="category-name">{{ category.name }}</span>
                <span class="item-count">({{ (category.food_items || []).length }})</span>
            </div>
            <div class="category-actions" @click.stop>
                <button class="btn-cat-action" @click="showEditCategory = true">
                    {{ $t('seller_menu.category_edit') }}
                </button>
                <button class="btn-cat-add" @click="showAddItem = true">
                    <Plus :size="13" />
                    {{ $t('seller_menu.item_add') }}
                </button>
            </div>
        </div>

        <!-- Items list -->
        <div v-if="expanded" class="items-list">
            <div v-if="(category.food_items || []).length === 0" class="empty-cat">
                {{ $t('seller_menu.category_empty') }}
            </div>
            <div v-else class="items-scroll">
                <SellerMenuFoodItem
                    v-for="item in category.food_items"
                    :key="item.id"
                    :item="item"
                />
            </div>
        </div>

        <ModalEditCategory v-model="showEditCategory" :category="category" />
        <ModalEditItem v-model="showAddItem" :default-category-id="category.id" />
    </div>
</template>

<style lang="scss" scoped>
.category-section {
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 12px;
}

.category-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 14px 14px 12px;
    cursor: pointer;
    user-select: none;
    &:active { background: rgba(26,42,32,0.04); }
}

.category-left {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
    min-width: 0;
}

.expand-icon {
    font-size: 18px;
    color: var(--text-muted);
    transition: transform 0.2s;
    transform: rotate(90deg);
    line-height: 1;
    width: 16px;
    flex-shrink: 0;
    &.rotated { transform: rotate(0deg); }
}

.category-name {
    min-width: 0;
    font-size: 15px;
    font-weight: 700;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.item-count {
    font-size: 13px;
    color: var(--text-muted);
    flex-shrink: 0;
}

.category-actions {
    display: flex;
    gap: 6px;
    flex-shrink: 0;
    margin-left: 10px;
}

.btn-cat-action {
    font-size: 12px;
    color: var(--text-secondary);
    background: rgba(26,42,32,0.06);
    border: none;
    border-radius: 6px;
    padding: 4px 10px;
    cursor: pointer;
    font-family: inherit;
}

.btn-cat-add {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 12px;
    color: var(--color-primary);
    background: rgba(29,107,74,0.12);
    border: 1px solid rgba(29,107,74,0.25);
    border-radius: 6px;
    padding: 4px 10px;
    cursor: pointer;
    font-family: inherit;
    font-weight: 600;
}

.items-list {
    padding: 0 14px 12px;
}

.items-scroll {
    max-height: 308px;
    overflow-y: auto;
    overflow-x: hidden;
}

.empty-cat {
    font-size: 13px;
    color: var(--text-muted);
    text-align: center;
    padding: 16px 0;
}
</style>
