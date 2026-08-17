<script>
import { Wallet } from 'lucide-vue-next';

export default {
    name: 'SellerMeEarnings',

    components: { Wallet },
}
</script>

<template>
    <div>
        <div class="section-title">{{ $t('seller_me.section_title_earnings') }}</div>
        <div class="coming-soon-card">
            <Wallet :size="28" class="coming-soon-icon" />
            <div class="coming-soon-text">{{ $t('seller_me.earnings_coming_soon') }}</div>
            <div class="coming-soon-sub">{{ $t('seller_me.earnings_coming_soon_sub') }}</div>
        </div>
    </div>
</template>

<style scoped>
.section-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
    padding-left: 4px;
}

.coming-soon-card {
    background: var(--bg-surface);
    border-radius: 10px;
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    border: 1px solid var(--border-color);
}

.coming-soon-icon {
    color: var(--color-primary);
    opacity: 0.6;
    margin-bottom: 4px;
}

.coming-soon-text {
    font-size: 15px;
    font-weight: 700;
    color: var(--text-primary);
}

.coming-soon-sub {
    font-size: 13px;
    color: var(--text-secondary);
    text-align: center;
}
</style>
