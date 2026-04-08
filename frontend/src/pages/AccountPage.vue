<script>
import { useAuthStore } from '@/stores/auth/authStore'
import { ChevronRight, User, MapPin, Globe, FileText, LogOut, ArrowLeftRight } from 'lucide-vue-next'

export default {
    name: 'AccountPage',

    components: {
        ChevronRight, User, MapPin, Globe, FileText, LogOut, ArrowLeftRight
    },

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
        switchModeLabel() {
            return this.isSellerMode ? 'Switch to Buyer' : 'Switch to Seller'
        },
    },

    methods: {
        switchMode() {
            this.authStore.switchViewMode()
            this.$router.push('/home')
        },
        async signOut() {
            await this.authStore.onClickedSignout()
        },
    },
}
</script>

<template>
    <div class="account-page">
        <!-- Profile Header -->
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

        <!-- Switch Mode (seller only) -->
        <div v-if="isSeller" class="menu-section">
            <div class="menu-item" @click="switchMode">
                <div class="menu-icon switch">
                    <ArrowLeftRight size="18" />
                </div>
                <span class="menu-label">{{ switchModeLabel }}</span>
                <ChevronRight size="16" class="menu-arrow" />
            </div>
        </div>

        <!-- Settings -->
        <div class="menu-section">
            <h3 class="section-title">Settings</h3>

            <router-link to="/onboarding" class="menu-item">
                <div class="menu-icon">
                    <User size="18" />
                </div>
                <span class="menu-label">Edit Profile</span>
                <ChevronRight size="16" class="menu-arrow" />
            </router-link>

            <router-link to="/onboarding" class="menu-item">
                <div class="menu-icon">
                    <MapPin size="18" />
                </div>
                <span class="menu-label">Delivery Address</span>
                <ChevronRight size="16" class="menu-arrow" />
            </router-link>

            <router-link to="/onboarding" class="menu-item">
                <div class="menu-icon">
                    <Globe size="18" />
                </div>
                <span class="menu-label">Language</span>
                <ChevronRight size="16" class="menu-arrow" />
            </router-link>
        </div>

        <!-- Support -->
        <div class="menu-section">
            <h3 class="section-title">Support</h3>

            <div class="menu-item">
                <div class="menu-icon">
                    <FileText size="18" />
                </div>
                <span class="menu-label">Terms & Privacy Policy</span>
                <ChevronRight size="16" class="menu-arrow" />
            </div>
        </div>

        <!-- Sign Out -->
        <div class="menu-section">
            <div class="menu-item signout" @click="signOut">
                <div class="menu-icon signout-icon">
                    <LogOut size="18" />
                </div>
                <span class="menu-label">Sign Out</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.account-page {
    min-height: 100vh;
    background: var(--bg-main);
    padding: 16px;
    padding-top: calc(24px + env(safe-area-inset-top, 0));
    padding-bottom: calc(80px + env(safe-area-inset-bottom, 0));
}

.profile-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 28px;
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

.menu-section {
    margin-bottom: 20px;
}

.section-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
    padding-left: 4px;
}

.menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: var(--bg-surface);
    border-radius: 12px;
    margin-bottom: 4px;
    cursor: pointer;
    text-decoration: none;
    color: var(--text-primary);
    transition: background 0.15s ease;
}

.menu-item:hover {
    background: var(--bg-card-hover);
}

.menu-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    flex-shrink: 0;
}

.menu-icon.switch {
    background: rgba(245, 166, 35, 0.15);
    color: var(--color-accent);
}

.menu-label {
    flex: 1;
    font-size: 15px;
    font-weight: 500;
}

.menu-arrow {
    color: var(--text-muted);
}

.menu-item.signout {
    margin-top: 8px;
}

.signout-icon {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
}

.menu-item.signout .menu-label {
    color: #ef4444;
}
</style>
