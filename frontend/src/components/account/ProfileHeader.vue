<script>
import { User, Pencil, X, Check } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth/authStore';
import apiUsers from '@/apis/users/apiUsers';

export default {
    components: { User, Pencil, X, Check },

    data() {
        return {
            editingAvatar: false,
            avatarInput: '',
            saving: false,
        }
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
        initials() {
            if (!this.user?.fullName) return '?'
            return this.user.fullName.trim().charAt(0).toUpperCase()
        }
    },

    methods: {
        startEditAvatar() {
            this.avatarInput = this.user?.avatarUrl || ''
            this.editingAvatar = true
        },
        cancelEditAvatar() {
            this.editingAvatar = false
            this.avatarInput = ''
        },
        async saveAvatar() {
            this.saving = true
            try {
                await apiUsers.updateProfile({ avatar_url: this.avatarInput || null })
                if (this.user) {
                    this.user.avatarUrl = this.avatarInput || null
                }
                this.editingAvatar = false
            } catch (e) {
                this.$q.notify({ type: 'negative', message: 'Failed to update avatar', position: 'top' })
            } finally {
                this.saving = false
            }
        }
    }
}
</script>

<template>
    <div class="profile-header">
        <div class="avatar-wrap">
            <q-avatar v-if="user?.avatarUrl" size="56px">
                <img :src="user.avatarUrl" :alt="user.fullName">
            </q-avatar>
            <div v-else class="avatar-initials">
                {{ initials }}
            </div>
            <button class="edit-avatar-btn" @click="startEditAvatar">
                <Pencil :size="12" />
            </button>
        </div>

        <div class="profile-info">
            <h2 class="profile-name">{{ user?.fullName || 'Guest' }}</h2>
            <p class="profile-email">{{ user?.email }}</p>
            <span v-if="isSeller" class="seller-badge">
                {{ isSellerMode ? 'Seller Mode' : 'Buyer Mode' }}
            </span>
        </div>

        <!-- Edit avatar URL dialog -->
        <q-dialog v-model="editingAvatar">
            <q-card class="avatar-dialog">
                <q-card-section>
                    <div class="dialog-title">Update Avatar</div>
                    <q-input
                        v-model="avatarInput"
                        dense
                        outlined
                        placeholder="Paste image URL..."
                        class="avatar-input"
                        dark
                        autofocus
                    />
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn flat no-caps label="Cancel" @click="cancelEditAvatar" />
                    <q-btn flat no-caps label="Save" color="positive" :loading="saving" @click="saveAvatar" />
                </q-card-actions>
            </q-card>
        </q-dialog>
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

.avatar-wrap {
    position: relative;
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

.edit-avatar-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #1f2940;
    border: 1px solid rgba(255,255,255,0.2);
    color: rgba(255,255,255,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
}

.avatar-dialog {
    background-color: #1f2940;
    border-radius: 16px;
    min-width: 300px;
}

.dialog-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
}

.avatar-input {
    margin-top: 4px;
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
