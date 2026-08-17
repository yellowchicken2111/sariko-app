<script>
import { User } from 'lucide-vue-next';
import { mapState } from 'pinia';
import { useAuthStore } from '@/stores/auth/authStore';

export default {
    name: 'SellerGreeting',

    components: { User },

    data() {
        return {
            now: new Date(),
            ticker: null,
        }
    },

    computed: {
        ...mapState(useAuthStore, ['user']),

        greetingPrefix() {
            const hour = this.now.getHours()
            if (hour < 12) return this.$t('seller_home.greeting_morning_prefix')
            if (hour < 18) return this.$t('seller_home.greeting_afternoon_prefix')
            return this.$t('seller_home.greeting_evening_prefix')
        },

        storeName() {
            return (this.user?.fullName || '...') + ' 👋'
        },

        initials() {
            if (!this.user?.fullName) return ''
            return this.user.fullName.trim().charAt(0).toUpperCase()
        },

        dateLocale() {
            return this.$i18n.locale === 'vi' ? 'vi-VN' : 'en-PH'
        },

        dateText() {
            return this.now.toLocaleDateString(this.dateLocale, {
                weekday: 'long',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            })
        },

        timeText() {
            return this.now.toLocaleTimeString(this.dateLocale, {
                hour: '2-digit',
                minute: '2-digit',
            })
        },
    },

    mounted() {
        this.ticker = setInterval(() => { this.now = new Date() }, 60000)
    },

    beforeUnmount() {
        clearInterval(this.ticker)
    },
}
</script>

<template>
    <div class="greeting-header">
        <div class="greeting-wrap">
            <div class="greeting-prefix">{{ greetingPrefix }}</div>
            <div class="greeting">{{ storeName }}</div>
            <div class="datetime">
                <span class="date-text">{{ dateText }}</span>
                <span class="time-text">{{ timeText }}</span>
            </div>
        </div>

        <div class="avatar-wrap" @click="$router.push('/seller/me')">
            <q-avatar v-if="user?.avatarUrl" size="64px">
                <img :src="user.avatarUrl" :alt="user.fullName">
            </q-avatar>
            <div v-else-if="user" class="initials-avatar">
                {{ initials }}
            </div>
            <div v-else class="guest-icon">
                <User :size="24" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.greeting-header {
    display: flex;
    justify-content: space-between;
    align-items:center;
    gap: 12px;
}

.greeting-wrap {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    min-width: 0;
}

.greeting-prefix {
    font-size: 13px;
    color: var(--text-secondary);
    font-family: $quetoi-font-family-secondary;
}

.greeting {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
    word-break: break-word;
}

.datetime {
    display: flex;
    align-items: center;
    gap: 8px;
}

.date-text {
    font-size: 13px;
    color: var(--text-secondary);
    text-transform: capitalize;
}

.time-text {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-accent);
}

.avatar-wrap {
    cursor: pointer;
    flex-shrink: 0;
}

.avatar-wrap :deep(img) {
    object-fit: cover;
    width: 100%;
    height: 100%;
}

.initials-avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: rgba(29, 107, 74, 0.15);
    border: 1px solid rgba(29, 107, 74, 0.3);
    color: var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 700;
    font-family: $quetoi-font-family-primary;
}

.guest-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
}
</style>
