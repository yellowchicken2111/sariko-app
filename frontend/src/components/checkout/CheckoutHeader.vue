<script>
import { ChevronLeft } from 'lucide-vue-next';

export default {
    components: {
        ChevronLeft
    },

    props: {
        title: {
            type: String,
            default: 'Checkout'
        }
    },

    emits: ['back'],

    methods: {
        onBack() {
            this.$emit('back')
        }
    }
}
</script>

<template>
    <div class="checkout-header">
        <q-btn flat round dense class="back-btn" @click="onBack">
            <ChevronLeft :size="22" />
        </q-btn>
        <div class="header-title">{{ title }}</div>
        <div class="spacer" />
    </div>
</template>

<style lang="scss" scoped>
.checkout-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    background-color: $bg-main;
    position: sticky;
    top: 0;
    z-index: 10;
}

.back-btn {
    color: white;
    width: 40px;
    height: 40px;
}

.header-title {
    font-family: $sariko-font-family-primary;
    font-size: 20px;
    font-weight: 600;
    color: white;
    letter-spacing: -0.02em;
}

.spacer {
    width: 40px;
}
</style>
