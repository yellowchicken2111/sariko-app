<script>
import { User, Globe, FileText, Shield, ChevronRight } from 'lucide-vue-next';

export default {
    name: 'SellerMeSettings',

    components: { User, Globe, FileText, Shield, ChevronRight },
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

            <router-link to="/account/language" class="menu-item">
                <div class="menu-icon"><Globe size="18" /></div>
                <span class="menu-label">{{ $t('seller_me.menu_label_language') }}</span>
                <ChevronRight size="16" class="menu-arrow" />
            </router-link>

            <a href="https://buyerdox.sariko.store/" target="_blank" class="menu-item">
                <div class="menu-icon"><FileText size="18" /></div>
                <span class="menu-label">{{ $t('seller_me.menu_label_terms') }}</span>
                <ChevronRight size="16" class="menu-arrow" />
            </a>

            <a href="/docs/privacy-policy.html" target="_blank" class="menu-item">
                <div class="menu-icon"><Shield size="18" /></div>
                <span class="menu-label">{{ $t('seller_me.menu_label_privacy') }}</span>
                <ChevronRight size="16" class="menu-arrow" />
            </a>

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
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
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
</style>
