<script>
import { useSearchStore } from '@/stores/search/searchStore'
import { ArrowLeft } from 'lucide-vue-next'

export default {
    name: 'SearchHeader',
    components: { ArrowLeft },
    computed: {
        query: {
            get() { return useSearchStore().query },
            set(value) { useSearchStore().setQuery(value) }
        }
    }
}
</script>

<template>
    <div class="search-header">
        <button class="back-btn" @click="$router.back()">
            <ArrowLeft :size="20" />
        </button>
        <input v-model="query" class="search-input" placeholder="Search..." />
    </div>
</template>

<style lang="scss" scoped>
.search-header {
    display: flex;
    align-items: center;
    gap: 12px;
}

.back-btn {
    background: transparent;
    border: none;
    color: var(--text-primary);
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
}

.search-input {
    flex: 1;
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 8px 12px;
    color: var(--text-primary);
    font-size: 14px;
    font-family: $quetoi-font-family-secondary;
    outline: none;
}
</style>
