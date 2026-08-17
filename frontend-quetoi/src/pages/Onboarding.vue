<script>
import LayoutBaseBuyerOnboarding from '@/layouts/onboarding/buyer/LayoutBaseBuyerOnboarding.vue';
import PhoneNumber from '@/components/onboarding/buyer/PhoneNumber.vue';
import DeliveryAddress from '@/components/onboarding/buyer/DeliveryAddress.vue';
import PreferredLanguage from '@/components/onboarding/buyer/PreferredLanguage.vue';
import ButtonGroup from '@/components/onboarding/buyer/ButtonGroup.vue';
export default {
    components: {
        LayoutBaseBuyerOnboarding,
        PhoneNumber,
        DeliveryAddress,
        PreferredLanguage,
        ButtonGroup
    }
}
</script>


<template>

    <LayoutBaseBuyerOnboarding>

        <template #HeaderGreetingText>
            {{ $t('onboarding_page.buyer.greeting_text') }}
        </template>

        <template #HeaderGreetingSubText>
            {{ $t('onboarding_page.buyer.greeting_subtext') }}
        </template>

        <template #PhoneNumberSection>
            <PhoneNumber />
        </template>

        <template #DeliveryAddressSection>
            <DeliveryAddress />
        </template>

        <template #PreferredLanguageSection>
            <PreferredLanguage />
        </template>

        <template #ButtonGroupSection>
            <ButtonGroup />
        </template>

    </LayoutBaseBuyerOnboarding>

</template>