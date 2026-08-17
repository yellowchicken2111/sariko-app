<script>
import { Camera, ChevronRight, Mail, Phone, Globe } from 'lucide-vue-next';
import { mapState } from 'pinia';
import { useAuthStore } from '@/stores/auth/authStore';
import apiUsers from '@/apis/users/apiUsers';

export default {
    components: { Camera, ChevronRight, Mail, Phone, Globe },

    data() {
        return {
            profile: null,
        }
    },

    computed: {
        ...mapState(useAuthStore, ['user']),
        initials() {
            if (!this.user?.fullName) return '?'
            return this.user.fullName.trim().charAt(0).toUpperCase()
        },
        isSeller() {
            return this.user?.isSeller || false
        },
        phone() {
            return this.profile?.phone || null
        },
        language() {
            return this.profile?.preferred_language || null
        },
    },

    async mounted() {
        try {
            const res = await apiUsers.getProfile()
            this.profile = res?.user || null
        } catch (e) {
            // non-critical
        }
    },

    methods: {
        goEditProfile() {
            this.$router.push('/account/profile')
        },
    }
}
</script>

<template>
    <div class="profile-header">

        <!-- Avatar -->
        <div class="avatar-wrap" @click="goEditProfile">
            <q-avatar v-if="user?.avatarUrl" size="88px" class="avatar-img">
                <img :src="user.avatarUrl" :alt="user.fullName">
            </q-avatar>
            <div v-else class="avatar-initials">
                {{ initials }}
            </div>
            <div class="avatar-edit-badge">
                <Camera :size="12" />
            </div>
        </div>

        <!-- Name + badge -->
        <div class="profile-name">{{ user?.fullName || 'Guest' }}</div>
        <div class="profile-email-line">{{ user?.email }}</div>

        <span v-if="isSeller" class="seller-badge">
            {{ $t('account_page.seller_badge') }}
        </span>

        <!-- Edit profile button -->
        <button class="edit-profile-btn" @click="goEditProfile">
            {{ $t('account_page.edit_profile') }}
        </button>

        <!-- Info section -->
        <div class="info-section">
            <div class="info-row">
                <Mail :size="16" class="info-icon" />
                <span class="info-label">{{ $t('account_page.info_email') }}</span>
                <span class="info-value">{{ user?.email }}</span>
            </div>
            <div v-if="phone" class="info-row">
                <Phone :size="16" class="info-icon" />
                <span class="info-label">{{ $t('account_page.info_phone') }}</span>
                <span class="info-value">{{ phone }}</span>
            </div>
            <div v-if="language" class="info-row">
                <Globe :size="16" class="info-icon" />
                <span class="info-label">{{ $t('account_page.info_language') }}</span>
                <span class="info-value">{{ language }}</span>
            </div>
        </div>

    </div>
</template>

<style scoped>
.profile-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 0 4px;
}

/* Avatar */
.avatar-img :deep(img) {
    object-fit: cover;
    width: 100%;
    height: 100%;
}

.avatar-wrap {
    position: relative;
    cursor: pointer;
    margin-bottom: 14px;
}

.avatar-initials {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    background: rgba(29, 107, 74, 0.15);
    color: var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: 700;
    border: 1px solid rgba(29, 107, 74, 0.3);
}

.avatar-edit-badge {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--color-primary);
    color: var(--text-on-shell);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--bg-main);
}

/* Text */
.profile-name {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 4px;
}

.profile-email-line {
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 10px;
}

.seller-badge {
    font-size: 11px;
    font-weight: 600;
    padding: 3px 12px;
    border-radius: 12px;
    background: rgba(29, 107, 74, 0.15);
    color: var(--color-primary);
    margin-bottom: 14px;
}

/* Edit button */
.edit-profile-btn {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-primary);
    background: rgba(29, 107, 74, 0.1);
    border: 1px solid rgba(29, 107, 74, 0.3);
    border-radius: 20px;
    padding: 6px 20px;
    cursor: pointer;
    margin-bottom: 24px;
}

/* Info section */
.info-section {
    width: 100%;
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    overflow: hidden;
}

.info-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 13px 16px;
    border-bottom: 1px solid var(--border-color);
}

.info-row:last-child {
    border-bottom: none;
}

.info-icon {
    color: var(--text-secondary);
    flex-shrink: 0;
}

.info-label {
    font-size: 14px;
    color: var(--text-secondary);
    flex: 1;
}

.info-value {
    font-size: 13px;
    color: var(--text-primary);
    text-align: right;
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
