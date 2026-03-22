<script>
import { mapState } from 'pinia';
import { useSellerStore } from '@/stores/seller/seller-store.js';
import { useHomeStore } from '@/stores/homeStore';
import SellerCard from '@/components/seller/seller-list/SellerCard.vue';

export default {

    components: {
        SellerCard
    },

    computed: {
        ...mapState(useSellerStore, [
            "sellers",
            "filteredSellers"
        ]),


        ...mapState(useHomeStore, [
            "searchQuery",
            "selectedCategory"
        ]),

        newSellers() {
            // Mock logic: Simple reversal to simulate "new additions"
            return [...this.filteredSellers].reverse().slice(0, 3)
        }
    }
}
</script>

<template>
    <div class="sellers-section" v-if="newSellers.length > 0">
        <div class="section-header">
            <h2 class="section-title">New Sellers</h2>
            <button class="see-all-btn">See All</button>
        </div>
        <div class="seller-list">
            <SellerCard v-for="seller in newSellers" :key="`new-${seller.id}`" :seller="seller" />
        </div>
    </div>
</template>

<style scoped>

.sellers-section {
    margin-bottom: 32px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.section-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
}

.see-all-btn {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-accent);
    background: none;
    border: none;
    cursor: pointer;
    transition: opacity 0.2s ease;
}

.see-all-btn:hover {
    opacity: 0.8;
}

.seller-list {
    display: flex;
    flex-direction: column;
}

</style>