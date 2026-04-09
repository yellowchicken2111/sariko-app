<script>
import { User } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth/authStore';

export default {
    components: { User },

    computed: {
        authStore() {
            return useAuthStore()
        },
        user() {
            return this.authStore.user
        },
        isSeller() {
            return this.user?.isSeller || false
        },
        isSellerMode() {
            return this.isSeller && this.authStore.viewMode === 'seller'
        }
    }
}
</script>

<template>
    <div class="profile-header">
        <div class="avatar">
            <User size="32" />
        </div>
        <div class="profile-info">
            <h2 class="profile-name">{{ user?.fullName || 'Guest' }}</h2>
            <p class="profile-email">{{ user?.email }}</p>
            <span v-if="isSeller" class="seller-badge">
                {{ isSellerMode ? 'Seller Mode' : 'Buyer Mode' }}
            </span>
        </div>
    </div>
</template>

<style scoped>
.profile-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    background: var(--bg-surface);
    border-radius: 16px;
}

.avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: rgba(245, 166, 35, 0.15);
    color: var(--color-accent);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.profile-info {
    flex: 1;
    min-width: 0;
}

.profile-name {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
}

.profile-email {
    font-size: 13px;
    color: var(--text-secondary);
    margin: 2px 0 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.seller-badge {
    display: inline-block;
    margin-top: 6px;
    font-size: 11px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 12px;
    background: rgba(245, 166, 35, 0.15);
    color: var(--color-accent);
}
</style>
