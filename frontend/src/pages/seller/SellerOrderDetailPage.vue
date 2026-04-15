<script>
import { ArrowLeft } from 'lucide-vue-next';
import apiSellerDashboard from '@/apis/sellers/apiSellerDashboard';
import LayoutSellerOrderDetail from '@/layouts/seller/LayoutSellerOrderDetail.vue';
import SellerOrderDetailContent from '@/components/seller-order-detail/SellerOrderDetailContent.vue';
import SellerOrderActionBar from '@/components/seller-order-detail/SellerOrderActionBar.vue';

export default {
    name: 'SellerOrderDetailPage',

    components: { ArrowLeft, LayoutSellerOrderDetail, SellerOrderDetailContent, SellerOrderActionBar },

    props: ['orderId'],

    data() {
        return {
            order: null,
            loading: true,
        }
    },

    methods: {
        async loadOrder() {
            this.loading = true
            try {
                const res = await apiSellerDashboard.getOrderDetail(this.orderId)
                this.order = res.order || null
            } catch (e) {
                console.error('SellerOrderDetailPage - loadOrder -', e)
            } finally {
                this.loading = false
            }
        },

        onStatusUpdated(newStatus, reason = null) {
            this.order.status = newStatus
            if (reason) this.order.cancellation_reason = reason
        },
    },

    mounted() {
        this.loadOrder()
    },
}
</script>

<template>
    <LayoutSellerOrderDetail>

        <template #Header>
            <div class="page-header">
                <button class="back-btn" @click="$router.back()">
                    <ArrowLeft :size="20" />
                </button>
                <span class="page-title">{{ $t('seller_order_detail.page_title') }}</span>
            </div>
        </template>

        <template #Content>
            <div v-if="loading" class="skeleton-list">
                <q-skeleton v-for="n in 4" :key="n" type="rect" :height="`${70 + n * 15}px`" style="border-radius:16px;" animation="pulse" />
            </div>
            <SellerOrderDetailContent v-else-if="order" :order="order" />
        </template>

        <template #Actions>
            <SellerOrderActionBar
                v-if="order && !loading"
                :order="order"
                @status-updated="onStatusUpdated"
            />
        </template>

    </LayoutSellerOrderDetail>
</template>

<style lang="scss" scoped>
.page-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
}

.back-btn {
    background: transparent;
    border: none;
    color: var(--text-primary);
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
}

.page-title {
    font-size: 17px;
    font-weight: 700;
    color: var(--text-primary);
    font-family: $sariko-font-family-secondary;
}

.skeleton-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
</style>
