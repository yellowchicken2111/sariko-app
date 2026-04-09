<script>
import { User } from 'lucide-vue-next';
import { mapState } from 'pinia';
import { useAuthStore } from '@/stores/auth/authStore';

export default {

    components: { User },

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
        
    </header>
</template>

<style lang="scss" scoped>

.header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 20px;
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

.initials-avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: rgba(245, 166, 35, 0.2);
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