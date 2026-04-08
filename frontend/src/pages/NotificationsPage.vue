<script>
import { Bell } from 'lucide-vue-next'

export default {
    name: 'NotificationsPage',
    components: { Bell },
}
</script>

<template>
    <div class="notifications-page">
        <header class="header">
            <h1 class="page-title">Notifications</h1>
        </header>
        <div class="empty-state">
            <div class="empty-icon">
                <Bell size="48" />
            </div>
            <p class="empty-text">No notifications yet</p>
            <p class="empty-subtext">You'll see order updates and promotions here</p>
        </div>
    </div>
</template>

<style scoped>
.notifications-page {
    min-height: 100vh;
    background: var(--bg-main);
    padding: 16px;
    padding-top: calc(24px + env(safe-area-inset-top, 0));
    padding-bottom: calc(80px + env(safe-area-inset-bottom, 0));
}

.header {
    margin-bottom: 32px;
}

.page-title {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 80px;
    text-align: center;
}

.empty-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--bg-surface);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    margin-bottom: 16px;
}

.empty-text {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 4px;
}

.empty-subtext {
    font-size: 13px;
    color: var(--text-secondary);
}
</style>
