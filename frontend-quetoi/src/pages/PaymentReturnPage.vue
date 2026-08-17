<script>
import LayoutBasePaymentReturn from '@/layouts/payment/LayoutBasePaymentReturn.vue';
import PaymentResult from '@/components/payment/PaymentResult.vue';

export default {
    components: {
        LayoutBasePaymentReturn,
        PaymentResult,
    }
}
</script>

<template>
    <LayoutBasePaymentReturn>

        <template #PaymentResult>
            <PaymentResult />
        </template>

    </LayoutBasePaymentReturn>
</template>
