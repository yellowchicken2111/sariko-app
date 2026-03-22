<script>
import { mapWritableState } from 'pinia';
import { useHomeStore } from '@/stores/homeStore';

export default {
    computed: {
        ...mapWritableState(useHomeStore, [
            "searchQuery"
        ])
    }
}
</script>

<template>
    <div class="search-box">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="search-icon">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" v-model="searchQuery" placeholder="Search for food or sellers..."
            class="search-input" />
    </div>
</template>

<style scoped>

.search-box {
    position: relative;
    width: 100%;
}

.search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
}

.search-input {
    width: 100%;
    padding: 14px 16px 14px 44px;
    border-radius: 16px;
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    font-size: 15px;
    box-shadow: var(--shadow-card);
    outline: none;
    transition: all 0.2s ease;
}

.search-input::placeholder {
    color: var(--text-secondary);
}

.search-input:focus {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 2px rgba(201, 166, 70, 0.2);
}

</style>