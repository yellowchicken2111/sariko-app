<script>
import { mapState } from 'pinia';
import { useAuthStore } from '@/stores/auth/authStore';
export default {
    computed: {
        ...mapState(useAuthStore, [
            "isSignin"
        ])
    },

    methods: {
        isSignin() {
            console.log(this.$route.path)
            return this.$route.path == '/signin'
        }
    }
}
</script>

<template>

    <div class="container">
        <div v-if="isSignin" class>
            Signin
        </div>

        <div v-else class>
            Signup
        </div>
    </div>

</template>

<style lang="scss" scoped>
</style>