<script>
import { mapState, mapActions } from 'pinia'
import { useSearchStore } from '@/stores/search/searchStore'

const PREORDER_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'available', label: 'Available now' },
    { value: 'preorder', label: 'Pre-order' }
]

export default {
    name: 'SearchFilters',
    data() {
        return { preorderOptions: PREORDER_OPTIONS }
    },
    computed: {
        ...mapState(useSearchStore, ['preorderFilter'])
    },
    methods: {
        ...mapActions(useSearchStore, ['setPreorderFilter'])
    }
}
</script>

<template>
    <div class="filters-row">
        <button
            v-for="opt in preorderOptions"
            :key="opt.value"
            class="chip"
            :class="{ active: preorderFilter === opt.value }"
            @click="setPreorderFilter(opt.value)"
        >
            {{ opt.label }}
        </button>
    </div>
</template>

<style lang="scss" scoped>
.filters-row {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
}
.filters-row::-webkit-scrollbar {
    display: none;
}

.chip {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.7);
    border-radius: 16px;
    padding: 6px 14px;
    font-size: 12px;
    font-family: $sariko-font-family-secondary;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
}

.chip.active {
    background: #facc15;
    color: #121b2f;
    border-color: #facc15;
    font-weight: 600;
}
</style>
