<script>
import { Landmark } from 'lucide-vue-next';

export default {
    components: {
        Landmark
    },

    props: {
        method: {
            type: String,
            default: 'Bank Transfer'
        }
    }
}
</script>

<template>
    <div class="payment-method-card">
        <div class="section-label">Payment Method</div>
        <div class="method-card">
            <div class="method-icon-wrapper">
                <Landmark :size="20" class="method-icon" />
            </div>
            <div class="method-details">
                <div class="method-name">{{ method }}</div>
                <div class="method-note">Pay after order confirmation</div>
            </div>
            <q-badge
                color="amber"
                text-color="black"
                label="Default"
                class="default-badge"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.payment-method-card {
    margin-bottom: 24px;
}

.section-label {
    font-family: $sariko-font-family-primary;
    font-size: 15px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.55);
    margin-bottom: 10px;
    letter-spacing: -0.01em;
}

.method-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border-radius: $radius-base;
    border: 1.5px solid rgba(255, 255, 255, 0.12);
    background-color: $bg-surface;
    font-family: $sariko-font-family-secondary;
}

.method-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background-color: rgba($accent, 0.1);
    flex-shrink: 0;
}

.method-icon {
    color: $accent;
}

.method-details {
    flex: 1;
    min-width: 0;
}

.method-name {
    font-size: 15px;
    font-weight: 600;
    color: white;
}

.method-note {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
    margin-top: 2px;
}

.default-badge {
    font-size: 11px;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 8px;
    flex-shrink: 0;
}
</style>
