<script>
import { User, MapPin, Globe, ChevronRight } from 'lucide-vue-next';

export default {
    components: { User, MapPin, Globe, ChevronRight }
}
</script>

<template>
    <div>
        <h3 class="section-title">{{ $t('account_page.section_title_settings') }}</h3>
        <div class="menu-group">
            <router-link to="/account/profile" class="menu-item">
                <div class="menu-icon"><User size="18" /></div>
                <span class="menu-label">{{ $t('account_page.menu_label_edit_profile') }}</span>
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
    padding: 14px 16px;
    cursor: pointer;
    text-decoration: none;
    color: var(--text-primary);
    transition: background 0.15s ease;
}

.menu-item:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
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

.menu-label {
    flex: 1;
    font-size: 15px;
    font-weight: 500;
}

.menu-arrow {
    color: var(--text-muted);
}
</style>
