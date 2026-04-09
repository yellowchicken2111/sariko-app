<script>
import { Minus, Plus } from 'lucide-vue-next';
import { useSellerStore } from '@/stores/seller/sellerStore';

export default {
    components: { Minus, Plus },

    computed: {
        sellerStore() {
            return useSellerStore()
        },
        quantity() {
            return this.sellerStore.foodQuantity || 1
        }
    },

    methods: {
        decrease() {
            if (this.quantity > 1) {
                this.sellerStore.foodQuantity = this.quantity - 1
            }
        },
        increase() {
            this.sellerStore.foodQuantity = this.quantity + 1
        }
    }
}
</script>

<template>
    <div class="quantity-row">
        <span class="label">Quantity</span>
        <div class="controls">
            <q-btn class="qty-btn" round dense no-caps :disable="quantity <= 1" @click="decrease">
                <Minus :size="20" />
            </q-btn>
            <span class="quantity">{{ quantity }}</span>
            <q-btn class="qty-btn" round dense no-caps @click="increase">
                <Plus :size="20" />
            </q-btn>
        </div>
    </div>
</template>

<style scoped>
.quantity-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.label {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
}

.controls {
    display: flex;
    align-items: center;
    gap: 16px;
}

.qty-btn {
    width: 44px;
    height: 44px;
    background: var(--bg-card-hover);
    color: var(--text-primary);
}

.quantity {
    font-size: 20px;
    font-weight: 700;
    min-width: 32px;
    text-align: center;
}
</style>
