<script>
import LayoutBaseSettings from '@/layouts/account/LayoutBaseSettings.vue';

export default {
    name: 'PrivacyPage',
    components: { LayoutBaseSettings },
}
</script>

<template>
    <LayoutBaseSettings :title="$t('breadcrumbs.privacy_page')" back-to="/account">
        <template #Content>
            <div class="static-page">
                <div class="last-updated">{{ $t('privacy_page.last_updated') }}</div>
                <p class="body-text">{{ $t('privacy_page.placeholder_body') }}</p>
            </div>
        </template>
    </LayoutBaseSettings>
</template>

<style scoped>
.static-page {
    padding: 4px 2px;
}

.last-updated {
    font-size: 12px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 16px;
}

.body-text {
    font-size: 14px;
    line-height: 1.6;
    color: var(--text-primary);
    margin: 0;
}
</style>
