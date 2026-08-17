<script>
import { Star } from 'lucide-vue-next';

const FILLED = '#facc15';
const EMPTY = 'rgba(255, 255, 255, 0.25)';

export default {
    name: 'StarRating',

    components: { Star },

    props: {
        modelValue: { type: Number, default: 0 },
        size: { type: Number, default: 24 },
        gap: { type: Number, default: 6 },
        readonly: { type: Boolean, default: false },
    },

    emits: ['update:modelValue'],

    computed: {
        stars() {
            return [1, 2, 3, 4, 5]
        }
    },

    methods: {
        fillOf(value) {
            return value <= this.modelValue ? FILLED : 'none'
        },
        colorOf(value) {
            return value <= this.modelValue ? FILLED : EMPTY
        },
        select(value) {
            if (this.readonly) return
            // Tapping the current rating again clears it, so a buyer who rated a dish
            // by accident can back out without a separate "remove" control.
            this.$emit('update:modelValue', value === this.modelValue ? 0 : value)
        }
    }
}
</script>

<template>
    <div class="star-rating" :style="{ gap: `${gap}px` }">
        <button
            v-for="value in stars"
            :key="value"
            type="button"
            class="star-btn"
            :class="{ readonly }"
            :disabled="readonly"
            :aria-label="`${value}/5`"
            @click="select(value)"
        >
            <Star :size="size" :fill="fillOf(value)" :color="colorOf(value)" />
        </button>
    </div>
</template>

<style scoped>
.star-rating {
    display: flex;
    align-items: center;
}

.star-btn {
    background: none;
    border: none;
    padding: 0;
    line-height: 0;
    cursor: pointer;
    transition: transform 0.12s ease;
}

.star-btn:active {
    transform: scale(1.2);
}

.star-btn.readonly {
    cursor: default;
    transform: none;
}
</style>
