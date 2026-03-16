<template>
  <div class="order-card">
    <div class="order-header">
      <h4 class="seller-name">{{ order.sellerName }}</h4>
      <span class="order-status" :class="statusClass">{{ order.status }}</span>
    </div>
    <div class="order-items">
      <div v-for="(item, index) in order.items" :key="index" class="order-item">
        <span class="item-quantity">{{ item.quantity }}x</span>
        <span class="item-name">{{ item.name }}</span>
      </div>
    </div>
    <div class="order-footer">
      <span class="order-total">Total: ₱{{ order.total }}</span>
      <span class="order-time">{{ order.time }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderCard',
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {
    statusClass() {
      const statusMap = {
        'Pending': 'status-pending',
        'Preparing': 'status-preparing',
        'Ready': 'status-ready',
        'Delivered': 'status-delivered',
        'Cancelled': 'status-cancelled'
      }
      return statusMap[this.order.status] || 'status-pending'
    }
  },
  methods: {}
}
</script>

<style scoped>
.order-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.seller-name {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.order-status {
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 16px;
}

.status-pending {
  background: #FEF3C7;
  color: #D97706;
}

.status-preparing {
  background: #DBEAFE;
  color: #2563EB;
}

.status-ready {
  background: #D1FAE5;
  color: #059669;
}

.status-delivered {
  background: #F3F4F6;
  color: #6B7280;
}

.status-cancelled {
  background: #FEE2E2;
  color: #DC2626;
}

.order-items {
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #D1D5DB;
}

.order-item {
  display: flex;
  gap: 8px;
  font-size: 14px;
  color: #6B7280;
  margin-bottom: 4px;
}

.order-item:last-child {
  margin-bottom: 0;
}

.item-quantity {
  font-weight: 500;
  color: #111827;
  min-width: 24px;
}

.item-name {
  flex: 1;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-total {
  font-size: 15px;
  font-weight: 700;
  color: #16A34A;
}

.order-time {
  font-size: 13px;
  color: #6B7280;
}
</style>
