<script>
import { ChefHat } from 'lucide-vue-next';

export default {
    components: { ChefHat }
}
</script>

<template>
    <div class="coming-soon">
        <ChefHat :size="40" class="coming-soon__icon" />
        <p class="coming-soon__title">{{ $t('seller_page.section_coming_soon.title') }}</p>
        <p class="coming-soon__subtitle">{{ $t('seller_page.section_coming_soon.subtitle') }}</p>
        <q-btn
            no-caps
            unelevated
            rounded
            class="coming-soon__btn"
            :label="$t('seller_page.section_coming_soon.button_explore')"
            @click="$router.push('/sellers')"
        />
    </div>
</template>

<style lang="scss" scoped>
.coming-soon {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 320px;
    text-align: center;
    padding: 0 24px;

    &__icon {
        color: var(--color-primary);
        opacity: 0.55;
        margin-bottom: 16px;
    }

    &__title {
        font-family: $quetoi-font-family-primary;
        font-size: 16px;
        font-weight: 700;
        margin: 0 0 6px;
    }

    &__subtitle {
        font-family: $quetoi-font-family-secondary;
        font-size: 12px;
        color: var(--text-secondary);
        margin: 0;
        max-width: 260px;
        line-height: 1.5;
    }

    &__btn {
        margin-top: 20px;
        background-color: var(--color-primary);
        color: var(--text-on-shell);
        font-family: $quetoi-font-family-secondary;
        font-size: 12px;
        font-weight: 700;
        padding: 6px 20px;
    }
}
</style>
