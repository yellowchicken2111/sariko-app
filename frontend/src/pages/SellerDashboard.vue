<script>
import LayoutBaseSellerDashboard from '@/layouts/seller-dashboard/LayoutBaseSellerDashboard.vue';
import DashboardHeader from '@/components/seller-dashboard/DashboardHeader.vue';
import DashboardStats from '@/components/seller-dashboard/DashboardStats.vue';
import RecentOrders from '@/components/seller-dashboard/RecentOrders.vue';

export default {
    name: 'SellerDashboard',
    components: {
        LayoutBaseSellerDashboard,
        DashboardHeader,
        DashboardStats,
        RecentOrders,
    }
}
</script>

<template>
    <LayoutBaseSellerDashboard>

        <template #Header>
            <DashboardHeader />
        </template>

        <template #Stats>
            <DashboardStats />
        </template>

        <template #RecentOrders>
            <RecentOrders />
        </template>

    </LayoutBaseSellerDashboard>
</template>
