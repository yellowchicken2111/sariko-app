<script>
export default {}
</script>

<template>
    <div class="not-found">
        <div class="code">404</div>
        <div class="title">Page not found</div>
        <div class="subtitle">The page you're looking for doesn't exist.</div>
        <button class="btn-home" @click="$router.push('/home')">Back to Home</button>
    </div>
</template>

<style lang="scss" scoped>
.not-found {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    background: var(--bg-main);
    font-family: $sariko-font-family-secondary;
    padding: 24px;
    text-align: center;
}

.code {
    font-size: 72px;
    font-weight: 800;
    color: $accent;
    line-height: 1;
    font-family: $sariko-font-family-primary;
}

.title {
    font-size: 22px;
    font-weight: 700;
    color: var(--text-primary);
}

.subtitle {
    font-size: 14px;
    color: var(--text-muted);
    margin-bottom: 8px;
}

.btn-home {
    margin-top: 8px;
    padding: 12px 28px;
    background: $accent;
    color: var(--bg-main);
    border: none;
    border-radius: 100px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
}
</style>
