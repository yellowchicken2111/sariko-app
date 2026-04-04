<script>
import { MessageSquare } from 'lucide-vue-next';
import { mapState } from 'pinia';
import { useCheckoutStore } from '@/stores/checkout/checkoutStore.js';

export default {
    components: {
        MessageSquare
    },

    computed: {
        ...mapState(useCheckoutStore, ['note'])
    },

    methods: {
        onInput(val) {
            const checkoutStore = useCheckoutStore()
            checkoutStore.note = val
        }
    }
}
</script>

<template>
    <div class="note-input">
        <div class="section-label">
            <MessageSquare :size="16" class="label-icon" />
            Special Instructions
        </div>
        <q-input
            :model-value="note"
            outlined
            dense
            dark
            type="textarea"
            rows="3"
            placeholder="Add any special instructions for the seller (optional)"
            class="note-field"
            @update:model-value="onInput"
        />
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
    color: rgba(255, 255, 255, 0.4);
}

.note-field {
    width: 100%;
    font-family: $sariko-font-family-secondary;

    :deep(.q-field__control) {
        border-radius: $radius-base;
        background-color: $bg-surface;
        border-color: rgba(255, 255, 255, 0.12);
    }

    :deep(.q-field__native) {
        color: white;
        font-size: 14px;
        line-height: 1.5;
        resize: none;

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
