<script>
import { User } from 'lucide-vue-next';
import { mapState } from 'pinia';
import { useAuthStore } from '@/stores/auth/authStore';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher.vue';

export default {

    components: { User, LanguageSwitcher },

    computed: {
        ...mapState(useAuthStore, ["user"]),
        initials() {
            if (!this.user?.fullName) return ''
            return this.user.fullName.trim().charAt(0).toUpperCase()
        }
    },

    methods: {
        onClickAvatar() {
            this.$router.push(this.user ? '/account' : '/signin')
        }
    },
}

</script>

<template>
    <header class="header">

        <div class="greeting-section">
            <div class="greeting-text-line-1">
                {{ $t("home_page.section_header.greeting_text_line_1") }}
            </div>
            <div class="greeting-text-line-2">
                {{ $t("home_page.section_header.greeting_text_line_2") }} <span style="color: rgb(245, 166, 35)">{{ $t("home_page.section_header.greeting_location") }}</span>
                <br>
                {{ $t("home_page.section_header.greeting_text_line_3") }}
            </div>
        </div>

        <div class="user-column">
            <div class="user-profile" @click="onClickAvatar">
                <q-avatar v-if="user?.avatarUrl" size="64px">
                    <img :src="user.avatarUrl" :alt="user.fullName">
                </q-avatar>
                <div v-else-if="user" class="initials-avatar">
                    {{ initials }}
                </div>
                <div v-else class="guest-icon">
                    <User :size="28" />
                </div>
            </div>
            <LanguageSwitcher />
        </div>

    </header>
</template>

<style lang="scss" scoped>

.header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    gap: 12px;
}

.user-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
}

.greeting-text-line-1 {
    font-family: $sariko-font-family-secondary;
    font-size: 10px;
    color: rgb(122, 140, 174);
}

.greeting-text-line-2 {
    font-family: $sariko-font-family-primary;
    font-size: 21px;
    font-weight: 700;
    line-height: 1.3;
}

.user-profile {
    cursor: pointer;
}

.user-profile :deep(img) {
    object-fit: cover;
    width: 100%;
    height: 100%;
}

.initials-avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: rgba(245, 166, 35, 0.2);
    border: 1px solid rgba(245, 166, 35, 0.3);
    color: #f5a623;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 700;
    font-family: $sariko-font-family-primary;
}

.guest-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.6);
}

</style>