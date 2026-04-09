<script>
import { ChevronLeft, EllipsisVertical } from 'lucide-vue-next';

export default {
    components: {
        ChevronLeft, EllipsisVertical
    },

    props: {
        title: {
            type: String,
            required: true
        },
        backTo: {
            type: String,
            default: ''
        },
        cssHeightVar: {
            type: String,
            default: ''
        }
    },

    methods: {
        goBack() {
            if (this.backTo) {
                this.$router.push(this.backTo)
            } else {
                this.$router.back()
            }
        }
    },

    mounted() {
        if (this.cssHeightVar) {
            const height = this.$refs.breadcrumbsRef?.offsetHeight || 0
            document.documentElement.style.setProperty(this.cssHeightVar, `${height}px`)
        }
    }
}
</script>

<template>
    <div ref="breadcrumbsRef" class="breadcrumbs">
        <q-btn class="breadcrumb-btn" round dense no-caps size="12px" @click="goBack">
            <ChevronLeft :size="18" />
        </q-btn>
        <div class="breadcrumb-title">{{ title }}</div>
        <q-btn class="breadcrumb-btn" round dense no-caps size="12px">
            <EllipsisVertical :size="18" />
        </q-btn>
    </div>
</template>

<style lang="scss" scoped>
.breadcrumbs {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.breadcrumb-btn {
    background-color: rgb(255, 255, 255, 0.2);
}

.breadcrumb-title {
    font-family: $sariko-font-family-secondary;
    font-size: 20px;
    font-weight: 700;
}
</style>
