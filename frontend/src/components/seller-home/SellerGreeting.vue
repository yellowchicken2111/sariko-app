<script>
import { mapState } from 'pinia';
import { useAuthStore } from '@/stores/auth/authStore';

export default {
    name: 'SellerGreeting',

    data() {
        return {
            now: new Date(),
            ticker: null,
        }
    },

    computed: {
        ...mapState(useAuthStore, ['user']),

        greeting() {
            const hour = this.now.getHours()
            const name = this.user?.fullName?.split(' ').pop() || '...'
            if (hour < 12) return this.$t('seller_home.greeting_morning', { name })
            if (hour < 18) return this.$t('seller_home.greeting_afternoon', { name })
            return this.$t('seller_home.greeting_evening', { name })
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
    <div class="greeting-wrap">
        <div class="greeting">{{ greeting }}</div>
        <div class="datetime">
            <span class="date-text">{{ dateText }}</span>
            <span class="time-text">{{ timeText }}</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.greeting-wrap {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.greeting {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
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
</style>
