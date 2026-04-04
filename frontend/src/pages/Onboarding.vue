<script>
import LayoutBaseBuyerOnboarding from '@/layouts/onboarding/buyer/LayoutBaseBuyerOnboarding.vue';
import InputFieldPhoneNumber from '@/components/onboarding/buyer/InputFieldPhoneNumber.vue';

export default {
    components: {
        LayoutBaseBuyerOnboarding,
        InputFieldPhoneNumber
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
            <InputFieldPhoneNumber />
        </template>

        <template #DeliveryAddressSection>
            JKL
        </template>

        <template #PreferedLanguageSection>
            MNO
        </template>

        <template #ButtonGroupSection>
            MNO
        </template>

    </LayoutBaseBuyerOnboarding>

</template>