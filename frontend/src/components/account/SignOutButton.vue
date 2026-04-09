<script>
import { LogOut } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth/authStore';

export default {
    components: { LogOut },

    methods: {
        async signOut() {
            await useAuthStore().onClickedSignout()
        }
    }
}
</script>

<template>
    <div class="menu-item signout" @click="signOut">
        <div class="menu-icon signout-icon">
            <LogOut size="18" />
        </div>
        <span class="menu-label">Sign Out</span>
    </div>
</template>

<style scoped>
.menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: var(--bg-surface);
    border-radius: 12px;
    cursor: pointer;
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
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.signout-icon {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
}

.signout .menu-label {
    color: #ef4444;
    font-size: 15px;
    font-weight: 500;
}
</style>
