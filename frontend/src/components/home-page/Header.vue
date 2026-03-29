<script>
import { mapState } from 'pinia';
import { useAuthStore } from '@/stores/auth/authStore';

export default {

    computed: {
        ...mapState(useAuthStore, [
            "user"
        ])
    },

    methods: {
        onClickedSignin() {
            this.$router.push("/signin")
        }
    }
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

        <div v-on:click="onClickedSignin" class="user-profile">
            <q-avatar size="64px">
                <img src="https://i.pravatar.cc/150?img=25">
            </q-avatar>
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

</style>