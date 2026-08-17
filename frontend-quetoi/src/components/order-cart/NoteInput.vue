<script>
import { MessageSquare } from 'lucide-vue-next';
import { mapWritableState } from 'pinia';
import { useCartStore } from '@/stores/cart/cartStore';

export default {
    components: {
        MessageSquare
    },

    computed: {
        ...mapWritableState(useCartStore, ['note'])
    }
}
</script>

<template>
    <div class="note-container">
        <div class="title">
            <MessageSquare :size="16" class="icon" />
            Note
        </div>
        <div class="note-field">
            <q-input
            v-model="note"
            dense
            type="textarea"
            rows="2"
            placeholder="Allergies, spice level, gate code..."
            class="note"
        />
        </div>
    </div>
</template>

<style lang="scss">

.note-container {
    border: 1px solid var(--border-color);
    border-radius: 10px;
    padding: 10px 15px;
    font-family: $quetoi-font-family-secondary;
    background: var(--bg-surface);
}

.title {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: 8px;
}

.icon {
    margin-right: 8px;
}

.note-fields {
    width: 100%;

    :deep(.q-field__control) {
        border-radius: .75rem;
        // background-color: var(--bg-surface);
    }

    :deep(.q-field__native) {
        color: var(--text-primary);
        font-size: 14px;
        resize: none;

        &::placeholder {
            color: var(--text-muted);
        }
    }
}
</style>
