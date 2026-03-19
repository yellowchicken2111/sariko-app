<script>
export default {
    name: 'CategoryChips',
    props: {
        categories: {
            type: Array,
            required: true
        },
        selectedCategory: {
            type: Number,
            default: null
        }
    },
    emits: ['select'],
    methods: {
        selectCategory(categoryId) {
            if (this.selectedCategory === categoryId) {
                this.$emit('select', null)
            } else {
                this.$emit('select', categoryId)
            }
        }
    }
}
</script>

<template>
    <div class="category-chips hide-scrollbar">
        <button v-for="category in categories" :key="category.id" class="chip"
            :class="{ active: selectedCategory === category.id }" @click="selectCategory(category.id)">
            <div class="chip-icon-wrapper" :class="{ active: selectedCategory === category.id }">
                <span class="chip-icon">{{ category.icon }}</span>
            </div>
            <span class="chip-label">{{ category.name }}</span>
        </button>
    </div>
</template>

<style scoped>
.category-chips {
    display: flex;
    gap: 16px;
    overflow-x: auto;
    padding: 4px 0;
    scroll-snap-type: x mandatory;
}

.chip {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: transparent;
    border: none;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    scroll-snap-align: start;
    min-width: 72px;
}

.chip:hover .chip-icon-wrapper {
    background: var(--color-primary-transparent);
}

.chip.active .chip-label {
    color: var(--color-primary);
    font-weight: 600;
}

.chip-icon-wrapper {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: var(--bg-card-hover);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.chip-icon-wrapper.active {
    background: var(--color-primary);
}

.chip-icon {
    font-size: 24px;
}

.chip-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-primary);
    white-space: nowrap;
}
</style>
