<script>
import { User, MapPin, Globe, Lock, ChevronRight, Inbox } from 'lucide-vue-next';
import { useChatStore } from '@/stores/chat/chatStore';

export default {
    components: { User, MapPin, Globe, Lock, ChevronRight, Inbox },

    computed: {
        inboxBadge() {
            return useChatStore().totalUnread
        }
    }
}
</script>

<template>
    <div>
        <div class="section-title">{{ $t('account_page.section_title_settings') }}</div>
        <div class="menu-group">

            <router-link to="/chat" class="menu-item">
                <div class="menu-icon"><Inbox size="18" /></div>
                <span class="menu-label">{{ $t('account_page.menu_label_inbox') }}</span>
                <span v-if="inboxBadge > 0" class="menu-badge">{{ inboxBadge }}</span>
                <ChevronRight size="16" class="menu-arrow" />
            </router-link>

            <router-link to="/account/address" class="menu-item">
                <div class="menu-icon"><MapPin size="18" /></div>
                <span class="menu-label">{{ $t('account_page.menu_label_delivery_address') }}</span>
                <ChevronRight size="16" class="menu-arrow" />
            </router-link>

            <router-link to="/account/language" class="menu-item">
                <div class="menu-icon"><Globe size="18" /></div>
                <span class="menu-label">{{ $t('account_page.menu_label_language') }}</span>
                <ChevronRight size="16" class="menu-arrow" />
            </router-link>

            <router-link to="/account/change-password" class="menu-item">
                <div class="menu-icon"><Lock size="18" /></div>
                <span class="menu-label">{{ $t('account_page.menu_label_change_password') }}</span>
                <ChevronRight size="16" class="menu-arrow" />
            </router-link>
        </div>
    </div>
</template>

<style scoped>
.section-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
    padding-left: 4px;
}

.menu-group {
    background: rgb(255, 255, 255, 0.08);
    border-radius: 12px;
    margin-bottom: 4px;
    overflow: hidden;
}

.menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    cursor: pointer;
    text-decoration: none;
    color: var(--text-primary);
    transition: background 0.15s ease;
}

.menu-item:not(:last-child) {
    /* border-bottom: 1px solid rgba(255, 255, 255, 0.05); */
}

.menu-item:hover {
    background: var(--bg-card-hover);
}

.menu-icon {
    width: 24px;
    height: 24px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    flex-shrink: 0;
}

.menu-label {
    flex: 1;
    font-size: 14px;
    font-weight: 500;
}

.menu-arrow {
    color: var(--text-muted);
}

.menu-badge {
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    border-radius: 10px;
    background: #facc15;
    color: #121b2f;
    font-size: 11px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
