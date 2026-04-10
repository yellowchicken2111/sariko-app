<script>
import { FileText, Shield, MessageCircle, ChevronRight, ExternalLink } from 'lucide-vue-next';

export default {
    components: { FileText, Shield, MessageCircle, ChevronRight, ExternalLink },

    computed: {
        supportMailto() {
            return 'mailto:support@sariko.store?subject=Sariko%20Support'
        }
    }
}
</script>

<template>
    <div>
        <h3 class="section-title">{{ $t('account_page.section_title_support') }}</h3>
        <div class="menu-group">
            <a :href="supportMailto" class="menu-item">
                <div class="menu-icon"><MessageCircle size="18" /></div>
                <span class="menu-label">{{ $t('account_page.menu_label_contact_support') }}</span>
                <ExternalLink size="14" class="menu-arrow" />
            </a>

            <router-link to="/account/terms" class="menu-item">
                <div class="menu-icon"><FileText size="18" /></div>
                <span class="menu-label">{{ $t('account_page.menu_label_terms') }}</span>
                <ChevronRight size="16" class="menu-arrow" />
            </router-link>

            <router-link to="/account/privacy" class="menu-item">
                <div class="menu-icon"><Shield size="18" /></div>
                <span class="menu-label">{{ $t('account_page.menu_label_privacy') }}</span>
                <ChevronRight size="16" class="menu-arrow" />
            </router-link>
        </div>
        <div class="app-version">{{ $t('account_page.app_version') }}</div>
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

.app-version {
    margin-top: 12px;
    text-align: center;
    font-size: 11px;
    color: var(--text-muted);
    letter-spacing: 0.3px;
}
</style>
