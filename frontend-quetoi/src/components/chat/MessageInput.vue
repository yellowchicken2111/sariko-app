<script>
import { mapState } from 'pinia';
import { Send } from 'lucide-vue-next';
import { useChatStore } from '@/stores/chat/chatStore';

export default {
    components: { Send },

    data() {
        return {
            draft: '',
        };
    },

    computed: {
        ...mapState(useChatStore, ['sending']),
        canSend() {
            return this.draft.trim().length > 0 && !this.sending;
        },
    },

    methods: {
        async send() {
            if (!this.canSend) return;
            const text = this.draft;
            this.draft = '';
            try {
                await useChatStore().sendMessage(text);
            } catch (e) {
                this.draft = text; // restore on failure so the user doesn't lose it
            }
        },
    },
}
</script>

<template>
    <div class="input-row">
        <q-input
            v-model="draft"
            class="input-field"
            dense
            borderless
            placeholder="Type a message…"
            @keyup.enter="send"
        />
        <button class="send-btn" :disabled="!canSend" @click="send">
            <Send :size="18" />
        </button>
    </div>
</template>

<style lang="scss" scoped>
.input-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.input-field {
    flex: 1;
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 2px 14px;
    color: var(--text-primary);
}

.input-field :deep(.q-field__native),
.input-field :deep(input) {
    color: var(--text-primary);
}

.input-field :deep(.q-field__native)::placeholder,
.input-field :deep(input)::placeholder {
    color: var(--text-muted);
}

.send-btn {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: var(--color-primary);
    color: var(--text-on-shell);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:disabled {
        opacity: 0.4;
        cursor: default;
    }
}
</style>
