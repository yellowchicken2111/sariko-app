<script>
import { Search } from 'lucide-vue-next';

const DEBOUNCE_MS = 300

export default {

    components: {
        Search
    },

    data() {
        return {
            localQuery: '',
            debounceTimer: null
        }
    },

    watch: {
        localQuery(newVal) {
            clearTimeout(this.debounceTimer)
            const value = (newVal || '').trim()
            if (!value) return
            this.debounceTimer = setTimeout(() => {
                this.$router.push({ name: 'search', query: { q: value } })
            }, DEBOUNCE_MS)
        }
    },

    methods: {
        goToSearchEmpty() {
            this.$router.push({ name: 'search' })
        }
    },

    beforeUnmount() {
        clearTimeout(this.debounceTimer)
    }
}
</script>

<template>

    <div class="search-box">
        <Search size="14px" class="search-icon" @click="goToSearchEmpty" />
        <q-input
        v-model="localQuery"
        class="input-search"
        dense
        :placeholder="$t('home_page.section_search_bar.placeholder')"
        />
    </div>

</template>

<style lang="scss" scoped>
.search-box {
    display: flex;
    align-items: center;
    background-color: var(--bg-surface);
    padding-left: 15px;
    border-radius: .75rem;
    border: solid 1px var(--border-color);
}

.search-icon {
    color: var(--text-secondary);
    cursor: pointer;
}

.input-search {
    margin-left: 10px;
    width: 100%;
}

:deep(.q-field__native::placeholder) {
    font-family: $quetoi-font-family-secondary;
    font-size: 12px;
    color: var(--text-muted);
}

:deep(.q-field__native) {
    color: var(--text-primary);
}
</style>
