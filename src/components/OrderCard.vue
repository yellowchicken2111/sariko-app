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
  color: #2D3436;
}

.order-status {
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 16px;
}

.status-pending {
  background: #FFF3E0;
  color: #E65100;
}

.status-preparing {
  background: #E3F2FD;
  color: #1565C0;
}

.status-ready {
  background: #E8F5E9;
  color: #2E7D32;
}

.status-delivered {
  background: #F5F5F5;
  color: #636E72;
}

.status-cancelled {
  background: #FFEBEE;
  color: #C62828;
}

.order-items {
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #F0F0F0;
}

.order-item {
  display: flex;
  gap: 8px;
  font-size: 14px;
  color: #636E72;
  margin-bottom: 4px;
}

.order-item:last-child {
  margin-bottom: 0;
}

.item-quantity {
  font-weight: 500;
  color: #2D3436;
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
  color: #FF6B35;
}

.order-time {
  font-size: 13px;
  color: #636E72;
}
</style>
