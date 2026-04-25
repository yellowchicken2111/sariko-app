<script>
import { useMenuStore } from '@/stores/seller/menuStore'
import ModalEditItem from './ModalEditItem.vue'

export default {
    name: 'SellerMenuFoodItem',

    components: { ModalEditItem },

    props: {
        item: { type: Object, required: true },
    },

    data() {
        return {
            showEditModal: false,
            toggling: false,
        }
    },

    methods: {
        async onToggleAvailable(val) {
            this.toggling = true
            try {
                await useMenuStore().toggleAvailable(this.item.id, val)
            } catch (e) {
                console.error('SellerMenuFoodItem - onToggleAvailable -', e)
                this.$q.notify({ type: 'negative', message: this.$t('seller_menu.toast_save_failed'), position: 'bottom' })
            } finally {
                this.toggling = false
            }
        },
    },
}
</script>

<template>
    <div class="food-item-row">
        <img
            :src="item.image_url || '/images/default-food-image.webp'"
            class="food-thumb"
            @error="$event.target.src = '/images/default-food-image.webp'"
        />
        <div class="food-info">
            <div class="food-name">{{ item.name }}</div>
            <div class="food-price">{{ item.price_text }}</div>
            <div v-if="item.unit_label" class="food-unit">/ {{ item.unit_label }}</div>
        </div>
        <div class="food-actions">
            <q-toggle
                :model-value="item.is_available"
                color="positive"
                dense
                :disable="toggling"
                @update:model-value="onToggleAvailable"
            />
            <button class="btn-edit" @click="showEditModal = true">
                {{ $t('seller_menu.item_edit') }}
            </button>
        </div>

        <ModalEditItem
            v-model="showEditModal"
            :item="item"
        />
    </div>
</template>

<style lang="scss" scoped>
.food-item-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    &:last-child { border-bottom: none; }
}

.food-thumb {
    width: 52px;
    height: 52px;
    border-radius: 10px;
    object-fit: cover;
    flex-shrink: 0;
    background: rgba(255,255,255,0.05);
}

.food-info {
    flex: 1;
    min-width: 0;
}

.food-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.food-price {
    font-size: 13px;
    color: var(--color-accent);
    margin-top: 2px;
}

.food-unit {
    font-size: 11px;
    color: var(--text-muted);
}

.food-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
}

.btn-edit {
    font-size: 11px;
    color: var(--text-secondary);
    background: rgba(255,255,255,0.07);
    border: none;
    border-radius: 6px;
    padding: 3px 10px;
    cursor: pointer;
    font-family: inherit;
    &:active { background: rgba(255,255,255,0.12); }
}
</style>
