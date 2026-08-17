<script>
import { Shield, Info, Truck, CreditCard, MessageCircle, ExternalLink } from 'lucide-vue-next';

export default {
    components: { Shield, Info, Truck, CreditCard, MessageCircle, ExternalLink },

    computed: {
        supportMailto() {
            return 'mailto:support@quetoi.store?subject=Que%20Toi%20Support'
        }
    }
}
</script>

<template>
    <div>
        <div class="section-title">{{ $t('account_page.section_title_support') }}</div>
        <div class="menu-group">
            <a :href="supportMailto" class="menu-item">
                <div class="menu-icon"><MessageCircle size="18" /></div>
                <span class="menu-label">{{ $t('account_page.menu_label_contact_support') }}</span>
                <ExternalLink size="14" class="menu-arrow" />
            </a>

            <!-- Legal docs: QuêTôi (Korea/PIPA) versions not written yet. The old
                 SariKo docs are Vietnam-jurisdiction and must NOT be shown here. -->
            <div class="menu-item is-pending">
                <div class="menu-icon"><Shield size="18" /></div>
                <span class="menu-label">{{ $t('account_page.menu_label_privacy') }}</span>
                <span class="pending-tag">{{ $t('account_page.label_coming_soon') }}</span>
            </div>

            <div class="menu-item is-pending">
                <div class="menu-icon"><Truck size="18" /></div>
                <span class="menu-label">{{ $t('account_page.menu_label_shipping') }}</span>
                <span class="pending-tag">{{ $t('account_page.label_coming_soon') }}</span>
            </div>

            <div class="menu-item is-pending">
                <div class="menu-icon"><CreditCard size="18" /></div>
                <span class="menu-label">{{ $t('account_page.menu_label_payment_methods') }}</span>
                <span class="pending-tag">{{ $t('account_page.label_coming_soon') }}</span>
            </div>

            <div class="menu-item is-pending">
                <div class="menu-icon"><Info size="18" /></div>
                <span class="menu-label">{{ $t('account_page.menu_label_about') }}</span>
                <span class="pending-tag">{{ $t('account_page.label_coming_soon') }}</span>
            </div>
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
    background: rgba(26, 42, 32, 0.05);
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

.is-pending:hover {
    background: transparent;
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

.app-version {
    margin-top: 12px;
    text-align: center;
    font-size: 11px;
    color: var(--text-muted);
    letter-spacing: 0.3px;
}
</style>
