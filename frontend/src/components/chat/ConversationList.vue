<script>
import { mapState } from 'pinia';
import { User, MessageCircle } from 'lucide-vue-next';
import { useChatStore } from '@/stores/chat/chatStore';

export default {
    components: { User, MessageCircle },

    computed: {
        ...mapState(useChatStore, ['conversations', 'loadingConversations']),
    },

    methods: {
        partyName(conv) {
            return conv.seller_profiles?.store_name || conv.users?.name || 'Chat';
        },
        partyAvatar(conv) {
            return conv.seller_profiles?.avatar_url || conv.users?.avatar_url || null;
        },
        openConversation(conv) {
            this.$router.push({ name: 'conversation', params: { conversationId: conv.id } });
        },
    },
}
</script>

<template>
    <div>
        <!-- Skeleton -->
        <template v-if="loadingConversations && conversations.length === 0">
            <q-skeleton v-for="n in 5" :key="n" type="rect" height="64px" class="skeleton-row" animation="pulse" />
        </template>

        <!-- Empty -->
        <div v-else-if="conversations.length === 0" class="empty-state">
            <MessageCircle :size="40" />
            <div class="empty-title">No messages yet</div>
            <div class="empty-sub">Start a chat from a seller's page.</div>
        </div>

        <!-- List -->
        <div
            v-for="conv in conversations"
            :key="conv.id"
            class="conv-row"
            @click="openConversation(conv)"
        >
            <q-avatar size="48px" class="conv-avatar">
                <img v-if="partyAvatar(conv)" :src="partyAvatar(conv)" class="avatar-img">
                <div v-else class="avatar-fallback"><User :size="22" /></div>
            </q-avatar>

            <div class="conv-body">
                <div class="conv-name">{{ partyName(conv) }}</div>
                <div class="conv-preview">{{ conv.last_message_text || 'No messages yet' }}</div>
            </div>

            <q-badge v-if="conv.unread_count > 0" class="conv-unread" rounded>
                {{ conv.unread_count }}
            </q-badge>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.skeleton-row {
    border-radius: 16px;
    margin-bottom: 8px;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 64px 20px;
    color: rgb(122, 140, 174);
    text-align: center;
}

.empty-title {
    font-family: $sariko-font-family-primary;
    font-size: 16px;
    font-weight: 700;
    color: #fff;
}

.empty-sub {
    font-size: 12px;
}

.conv-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 16px;
    cursor: pointer;

    &:active {
        background: var(--surface, #1f2940);
    }
}

.conv-avatar {
    flex-shrink: 0;
}

.avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-fallback {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--surface, #1f2940);
    color: rgba(255, 255, 255, 0.6);
}

.conv-body {
    flex: 1;
    min-width: 0;
}

.conv-name {
    font-family: $sariko-font-family-primary;
    font-size: 15px;
    font-weight: 700;
    color: #fff;
}

.conv-preview {
    font-size: 13px;
    color: rgb(122, 140, 174);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.conv-unread {
    flex-shrink: 0;
    background: #facc15;
    color: #121b2f;
    font-weight: 700;
}
</style>
