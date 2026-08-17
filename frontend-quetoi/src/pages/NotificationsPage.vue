<script>
import LayoutBaseNotifications from '@/layouts/notifications/LayoutBaseNotifications.vue';
import EmptyState from '@/components/notifications/EmptyState.vue';

export default {
    name: 'NotificationsPage',
    components: {
        LayoutBaseNotifications,
        EmptyState,
    }
}
</script>

<template>
    <LayoutBaseNotifications>

        <template #Header>
            <h1 class="page-title">Notifications</h1>
        </template>

        <template #Content>
            <EmptyState />
        </template>

    </LayoutBaseNotifications>
</template>

<style scoped>
.page-title {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
}
</style>
