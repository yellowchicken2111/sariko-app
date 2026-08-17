<script>
import { UtensilsCrossed } from 'lucide-vue-next';

export default {
    components: { UtensilsCrossed }
}
</script>

<template>
    <div class="menu-empty">
        <UtensilsCrossed :size="36" class="menu-empty__icon" />
        <p class="menu-empty__text">No dishes in this category</p>
    </div>
</template>

<style lang="scss" scoped>
.menu-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 300px;
    text-align: center;

    &__icon {
        color: var(--color-primary);
        opacity: 0.45;
        margin-bottom: 14px;
    }

    &__text {
        font-family: $quetoi-font-family-secondary;
        font-size: 14px;
        color: var(--text-secondary);
        margin: 0;
    }
}
</style>
