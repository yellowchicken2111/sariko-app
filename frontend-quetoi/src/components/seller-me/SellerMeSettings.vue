<script>
import { User, MapPin, Globe, Shield, Lock, ChevronRight } from 'lucide-vue-next';

export default {
    name: 'SellerMeSettings',

    components: { User, MapPin, Globe, Shield, Lock, ChevronRight },
}
</script>

<template>
    <div>
        <div class="section-title">{{ $t('seller_me.section_title_settings') }}</div>
        <div class="menu-group">

            <router-link to="/account/profile" class="menu-item">
                <div class="menu-icon"><User size="18" /></div>
                <span class="menu-label">{{ $t('seller_me.menu_label_profile') }}</span>
                <ChevronRight size="16" class="menu-arrow" />
            </router-link>

            <router-link to="/account/address" class="menu-item">
                <div class="menu-icon"><MapPin size="18" /></div>
                <span class="menu-label">{{ $t('seller_me.menu_label_store_address') }}</span>
                <ChevronRight size="16" class="menu-arrow" />
            </router-link>

            <router-link to="/account/language" class="menu-item">
                <div class="menu-icon"><Globe size="18" /></div>
                <span class="menu-label">{{ $t('seller_me.menu_label_language') }}</span>
                <ChevronRight size="16" class="menu-arrow" />
            </router-link>

            <router-link to="/account/change-password" class="menu-item">
                <div class="menu-icon"><Lock size="18" /></div>
                <span class="menu-label">{{ $t('account_page.menu_label_change_password') }}</span>
                <ChevronRight size="16" class="menu-arrow" />
            </router-link>

            <!-- QuêTôi (Korea/PIPA) legal docs not written yet; the SariKo ones
                 are Vietnam-jurisdiction and must NOT be surfaced here. -->
            <div class="menu-item is-pending">
                <div class="menu-icon"><Shield size="18" /></div>
                <span class="menu-label">{{ $t('seller_me.menu_label_privacy') }}</span>
                <span class="pending-tag">{{ $t('account_page.label_coming_soon') }}</span>
            </div>

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
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: 12px;
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
    border-bottom: 1px solid var(--border-color);
}

.menu-item:last-child {
    border-bottom: none;
}

.menu-item:hover {
    background: var(--bg-card-hover);
}

.menu-icon {
    width: 24px;
    height: 24px;
    border-radius: 10px;
    background: var(--bg-surface-2);
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

.is-pending {
    cursor: default;
    opacity: 0.65;
}

.pending-tag {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-secondary);
    background: var(--bg-surface-2);
    border-radius: var(--border-radius-full);
    padding: 2px 8px;
    white-space: nowrap;
}
</style>