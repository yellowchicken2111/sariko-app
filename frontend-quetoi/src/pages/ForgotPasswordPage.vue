<script>
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm.vue';

export default {
    name: 'ForgotPasswordPage',
    components: { ForgotPasswordForm }
}
</script>

<template>
    <div class="background">
        <div class="container">
            <ForgotPasswordForm />
        </div>
    </div>
</template>

<style scoped>
.background {
    min-height: 100vh;
    min-height: 100dvh;
    background-color: var(--bg-main);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50px 0 100px;
}

.container {
    width: 100%;
    padding: 0 20px;
}
</style>
