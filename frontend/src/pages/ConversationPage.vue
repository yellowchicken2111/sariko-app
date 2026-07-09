<script>
import { mapState } from 'pinia';
import { ArrowLeft, User } from 'lucide-vue-next';
import LayoutBaseConversation from '@/layouts/chat/LayoutBaseConversation.vue';
import MessageBubbleList from '@/components/chat/MessageBubbleList.vue';
import MessageInput from '@/components/chat/MessageInput.vue';
import { useChatStore } from '@/stores/chat/chatStore';
import { useAuthStore } from '@/stores/auth/authStore';

export default {
    name: 'ConversationPage',
    components: { LayoutBaseConversation, MessageBubbleList, MessageInput, ArrowLeft, User },

    props: {
        conversationId: { type: String, required: true },
    },

    computed: {
        ...mapState(useChatStore, ['conversations']),
        conversation() {
            return this.conversations.find(c => c.id === this.conversationId) || null;
        },
        partyName() {
            const c = this.conversation;
            return c?.seller_profiles?.store_name || c?.users?.name || 'Chat';
        },
        partyAvatar() {
            const c = this.conversation;
            return c?.seller_profiles?.avatar_url || c?.users?.avatar_url || null;
        },
    },

    async mounted() {
        const chat = useChatStore();
        // Deep-link: make sure the conversation list is loaded so the header resolves.
        if (chat.conversations.length === 0) {
            const asSeller = !!useAuthStore().user?.isSeller;
            await chat.loadConversations(asSeller);
        }
        chat.openConversation(this.conversationId);
    },

    beforeUnmount() {
        useChatStore().closeConversation();
    },

    methods: {
        goBack() {
            this.$router.push({ name: 'chat' });
        },
    },
}
</script>

<template>
    <LayoutBaseConversation>
        <template #Header>
            <div class="header">
                <button class="back-btn" @click="goBack"><ArrowLeft :size="22" /></button>
                <q-avatar size="36px">
                    <img v-if="partyAvatar" :src="partyAvatar" class="avatar-img">
                    <div v-else class="avatar-fallback"><User :size="18" /></div>
                </q-avatar>
                <div class="party-name">{{ partyName }}</div>
            </div>
        </template>

        <template #Messages>
            <MessageBubbleList />
        </template>

        <template #Input>
            <MessageInput />
        </template>
    </LayoutBaseConversation>
</template>

<style lang="scss" scoped>
.header {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #fff;
}

.back-btn {
    background: none;
    border: none;
    color: #fff;
    display: flex;
    cursor: pointer;
}

.avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-fallback {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--surface, #1f2940);
    color: rgba(255, 255, 255, 0.6);
}

.party-name {
    font-family: $sariko-font-family-primary;
    font-size: 16px;
    font-weight: 700;
}
</style>
