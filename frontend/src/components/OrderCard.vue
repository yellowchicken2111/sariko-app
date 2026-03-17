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
  background: var(--bg-surface);
  border-radius: var(--border-radius-lg);
  padding: 16px;
  box-shadow: var(--shadow-card);
  transition: all 0.2s ease;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hover);
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
  color: var(--text-primary);
}

.order-status {
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 16px;
}

.status-pending {
  background: rgba(245, 158, 11, 0.1);
  color: var(--color-warning);
}

.status-preparing {
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-info);
}

.status-ready {
  background: rgba(34, 197, 94, 0.1);
  color: var(--color-success);
}

.status-delivered {
  background: var(--bg-card-hover);
  color: var(--text-secondary);
}

.status-cancelled {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-error);
}

.order-items {
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.order-item {
  display: flex;
  gap: 8px;
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.order-item:last-child {
  margin-bottom: 0;
}

.item-quantity {
  font-weight: 500;
  color: var(--text-primary);
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
  color: var(--color-accent);
}

.order-time {
  font-size: 13px;
  color: var(--text-secondary);
}
</style>
