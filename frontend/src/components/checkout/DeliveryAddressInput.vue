<script>
import { MapPin } from 'lucide-vue-next';
import { mapState } from 'pinia';
import { useCheckoutStore } from '@/stores/checkout/checkoutStore.js';

export default {
    components: {
        MapPin
    },

    computed: {
        ...mapState(useCheckoutStore, ['deliveryAddress'])
    },

    methods: {
        onInput(val) {
            const checkoutStore = useCheckoutStore()
            checkoutStore.deliveryAddress = val
        }
    }
}
</script>

<template>
    <div class="delivery-address-input">
        <div class="section-label">
            <MapPin :size="16" class="label-icon" />
            Delivery Address
        </div>
        <div class="input-wrapper">
            <MapPin :size="18" class="input-icon" />
            <q-input
                :model-value="deliveryAddress"
                outlined
                dense
                dark
                placeholder="Enter your delivery address"
                class="address-field"
                @update:model-value="onInput"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.section-label {
    font-family: $sariko-font-family-primary;
    font-size: 15px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.55);
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
    letter-spacing: -0.01em;
}

.label-icon {
    color: $accent;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.input-icon {
    position: absolute;
    left: 14px;
    z-index: 1;
    color: rgba(255, 255, 255, 0.35);
    pointer-events: none;
}

.address-field {
    width: 100%;
    font-family: $sariko-font-family-secondary;

    :deep(.q-field__control) {
        border-radius: $radius-base;
        background-color: $bg-surface;
        padding-left: 42px;
        border-color: rgba(255, 255, 255, 0.12);
    }

    :deep(.q-field__native) {
        color: white;
        font-size: 14px;

        &::placeholder {
            color: rgba(255, 255, 255, 0.3);
        }
    }

    :deep(.q-field--outlined .q-field__control:focus-within) {
        border-color: $accent;
        box-shadow: 0 0 0 2px rgba($accent, 0.15);
    }
}
</style>
