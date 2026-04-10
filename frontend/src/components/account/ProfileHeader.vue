<script>
import { Pencil } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth/authStore';

export default {
    components: { Pencil },

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
        },
        initials() {
            if (!this.user?.fullName) return '?'
            return this.user.fullName.trim().charAt(0).toUpperCase()
        },
        secondaryLine() {
            // Prefer phone (VN mental model), fall back to email
            return this.user?.phone || this.user?.email
        },
        modeBadgeLabel() {
            return this.isSellerMode
                ? this.$t('account_page.badge_seller_mode')
                : this.$t('account_page.badge_buyer_mode')
        }
    },

    methods: {
        goToEditProfile() {
            this.$router.push('/account/profile')
        }
    }
}
</script>

<template>
    <div class="profile-header" @click="goToEditProfile">
        <div class="avatar-wrap">
            <q-avatar v-if="user?.avatarUrl" size="56px">
                <img :src="user.avatarUrl" :alt="user.fullName">
            </q-avatar>
            <div v-else class="avatar-initials">
                {{ initials }}
            </div>
        </div>

        <div class="profile-info">
            <h2 class="profile-name">{{ user?.fullName || 'Guest' }}</h2>
            <p class="profile-secondary">{{ secondaryLine }}</p>
            <span v-if="isSeller" class="seller-badge">
                {{ modeBadgeLabel }}
            </span>
        </div>

        <button class="edit-btn" aria-label="Edit profile">
            <Pencil :size="16" />
        </button>
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
    cursor: pointer;
    transition: background 0.15s ease;
}

.profile-header:hover {
    background: var(--bg-card-hover);
}

.avatar-wrap {
    flex-shrink: 0;
}

.avatar-initials {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: rgba(245, 166, 35, 0.15);
    color: var(--color-accent);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 700;
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

.profile-secondary {
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

.edit-btn {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.06);
    border: none;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.15s ease;
}

.edit-btn:hover {
    background: rgba(255, 255, 255, 0.12);
    color: var(--text-primary);
}
</style>
