<script>
import { ArrowLeftRight, ChevronRight } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth/authStore';

export default {
    components: { ArrowLeftRight, ChevronRight },

    computed: {
        authStore() {
            return useAuthStore()
        },
        isSeller() {
            return this.authStore.user?.isSeller || false
        },
        isSellerMode() {
            return this.isSeller && this.authStore.viewMode === 'seller'
        },
        label() {
            return this.isSellerMode
                ? this.$t('account_page.menu_label_switch_to_buyer')
                : this.$t('account_page.menu_label_switch_to_seller')
        }
    },

    methods: {
        switchMode() {
            this.authStore.switchViewMode()
            // Route to the appropriate landing for the new mode
            const target = this.isSellerMode ? '/dashboard' : '/home'
            this.$router.push(target)
        }
    }
}
</script>

<template>
    <div v-if="isSeller" class="menu-item" @click="switchMode">
        <div class="menu-icon switch">
            <ArrowLeftRight size="18" />
        </div>
        <span class="menu-label">{{ label }}</span>
        <ChevronRight size="16" class="menu-arrow" />
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
</style>
