<script>
export default {
    name: 'SellerPageSkeleton'
}
</script>

<template>
    <div class="skeleton-page">
        <!-- Seller info + stats -->
        <q-skeleton type="rect" animation="pulse" class="block block--top" />
        <!-- Featured banner -->
        <q-skeleton type="rect" animation="pulse" class="block block--banner" />
        <!-- Category tabs -->
        <q-skeleton type="rect" animation="pulse" class="block block--tabs" />
        <!-- Menu rows -->
        <div class="block--menu">
            <q-skeleton type="rect" animation="pulse" class="menu-row" />
            <q-skeleton type="rect" animation="pulse" class="menu-row" />
            <q-skeleton type="rect" animation="pulse" class="menu-row" />
            <q-skeleton type="rect" animation="pulse" class="menu-row" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

.skeleton-page {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.block {
    width: 100%;
    border-radius: $radius-base;
    background-color: #253352 !important;
}

.block--top    { height: 140px; }
.block--banner { height: 60px; }
.block--tabs   { height: 36px; border-radius: 10px; }

.block--menu {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.menu-row {
    width: 100%;
    height: 96px;
    border-radius: $radius-base;
    background-color: #253352 !important;
}
</style>
