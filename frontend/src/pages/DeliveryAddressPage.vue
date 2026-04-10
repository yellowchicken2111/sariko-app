<script>
import LayoutBaseSettings from '@/layouts/account/LayoutBaseSettings.vue';
import AddressForm from '@/components/account/AddressForm.vue';

export default {
    name: 'DeliveryAddressPage',
    components: {
        LayoutBaseSettings,
        AddressForm,
    }
}
</script>

<template>
    <LayoutBaseSettings :title="$t('breadcrumbs.delivery_address_page')" back-to="/account">
        <template #Content>
            <AddressForm />
        </template>
    </LayoutBaseSettings>
</template>
