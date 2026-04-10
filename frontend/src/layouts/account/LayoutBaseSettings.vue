<script>
import PageBreadcrumbs from '@/components/shared/PageBreadcrumbs.vue';

export default {
    components: {
        PageBreadcrumbs,
    },
    props: {
        title: {
            type: String,
            required: true,
        },
        backTo: {
            type: String,
            default: '/account',
        },
    },
}
</script>

<template>
    <div class="settings-page">
        <div class="header-section">
            <PageBreadcrumbs :title="title" :back-to="backTo" />
        </div>

        <div class="content-section">
            <slot name="Content" />
        </div>

        <div class="footer-section">
            <slot name="Footer" />
        </div>
    </div>
</template>

<style scoped>
.settings-page {
    min-height: 100vh;
    background: var(--bg-main);
    padding: 16px;
    padding-top: calc(16px + env(safe-area-inset-top, 0));
    padding-bottom: calc(24px + env(safe-area-inset-bottom, 0));
    display: flex;
    flex-direction: column;
}

.header-section {
    margin-bottom: 20px;
}

.content-section {
    flex: 1;
}

.footer-section:not(:empty) {
    margin-top: 24px;
    padding-top: 16px;
}
</style>
