<script>
</script>

<template>
    <div class="button-container">
        
        <q-btn
        class="button-start-ordering"
        flat
        no-caps
        to="/home"
        >
            {{ $t('onboarding_page.buyer.button_group.button_label_text_start_ordering') }}
        </q-btn>

        <q-btn
        class="button-skip"
        no-caps
        flat
        to="/home"
        >
            {{ $t('onboarding_page.buyer.button_group.button_label_text_skip_for_now') }}
        </q-btn>

    </div>
</template>

<style lang="scss" scoped>
.button-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.button-start-ordering {
    width: 100%;
    margin-bottom: 5px;
    background-color: $accent;
    color: var(--bg-main);
    font-weight: 600;
    font-size: 18px;
    border-radius: .75rem;
}

.button-skip {
    width: 100%;
    color: var(--text-muted);
    font-weight: 600;
    font-size: 14px;
}

</style>
