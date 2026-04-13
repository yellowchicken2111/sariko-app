<script>
import LayoutBaseSettings from '@/layouts/account/LayoutBaseSettings.vue';
import LanguageOptions from '@/components/account/LanguageOptions.vue';

export default {
    name: 'LanguagePage',
    components: {
        LayoutBaseSettings,
        LanguageOptions,
    }
}
</script>

<template>
    <LayoutBaseSettings :title="$t('breadcrumbs.language_page')" back-to="/account">
        <template #Content>
            <LanguageOptions />
        </template>
    </LayoutBaseSettings>
</template>
