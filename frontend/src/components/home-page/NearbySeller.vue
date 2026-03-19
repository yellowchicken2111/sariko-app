<script>
</script>

<template>

    <section class="sellers-section">
        <div class="section-header">
            <h2 class="section-title">Nearby Sellers</h2>
            <button class="see-all-btn">See All</button>
        </div>
        <div class="seller-list">
            <SellerCard v-for="seller in nearbySellers" :key="`nearby-${seller.id}`" :seller="seller" />
        </div>
    </section>


</template>

<style scoped>
</style>