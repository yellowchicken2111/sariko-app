<script>
import LayoutBaseAuth from '@/layouts/auth/LayoutBaseAuth.vue';
import AuthHeader from '@/components/auth/AuthHeader.vue';
import AuthButtonGroup from '@/components/auth/AuthButtonGroup.vue';
import AuthInputFields from '@/components/auth/AuthInputFields.vue';

export default {
    components: {
        LayoutBaseAuth,
        AuthHeader,
        AuthButtonGroup,
        AuthInputFields
    }
}
</script>

<template>
    <LayoutBaseAuth>

        <template #AuthHeader>
            <AuthHeader />
        </template>

        <template #AuthButtonGroup>
            <AuthButtonGroup />
        </template>

        <template #AuthInputFields>
            <AuthInputFields />
        </template>

    </LayoutBaseAuth>
</template>

<style lang="scss" scoped>
</style>