<script>
import LayoutBaseSellerDashboard from '@/layouts/seller-dashboard/LayoutBaseSellerDashboard.vue';
import PageBreadcrumbs from '@/components/shared/PageBreadcrumbs.vue';
import DashboardStats from '@/components/seller-dashboard/DashboardStats.vue';
import RecentOrders from '@/components/seller-dashboard/RecentOrders.vue';

export default {
    name: 'SellerDashboard',
    components: {
        LayoutBaseSellerDashboard,
        PageBreadcrumbs,
        DashboardStats,
        RecentOrders,
    }
}
</script>

<template>
    <LayoutBaseSellerDashboard>

        <template #Header>
            <PageBreadcrumbs title="Dashboard" back-to="/home" />
        </template>

        <template #Stats>
            <DashboardStats />
        </template>

        <template #RecentOrders>
            <RecentOrders />
        </template>

    </LayoutBaseSellerDashboard>
</template>
