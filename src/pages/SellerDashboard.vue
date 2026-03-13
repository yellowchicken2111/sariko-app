<template>
  <div class="dashboard-page">
    <!-- Header -->
    <header class="header">
      <h1 class="page-title">Seller Dashboard</h1>
      <p class="welcome-text">Welcome back!</p>
    </header>

    <!-- Stats Cards -->
    <div class="stats-section">
      <div class="stat-card">
        <div class="stat-icon orders">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ dashboardData.totalOrders }}</span>
          <span class="stat-label">Total Orders</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon revenue">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">₱{{ formattedRevenue }}</span>
          <span class="stat-label">Revenue</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon pending">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ dashboardData.pendingOrders }}</span>
          <span class="stat-label">Pending Orders</span>
        </div>
      </div>
    </div>

    <!-- Recent Orders -->
    <section class="recent-orders-section">
      <h2 class="section-title">Recent Orders</h2>
      <div class="orders-list">
        <div 
          v-for="order in dashboardData.recentOrders" 
          :key="order.id"
          class="order-item"
        >
          <div class="order-info">
            <h4 class="customer-name">{{ order.customerName }}</h4>
            <p class="order-items-text">{{ order.items.join(', ') }}</p>
            <span class="order-time">{{ order.time }}</span>
          </div>
          <div class="order-actions">
            <span class="order-status" :class="getStatusClass(order.status)">
              {{ order.status }}
            </span>
            <button class="action-btn" @click="updateStatus(order)">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 11 12 14 22 4"></polyline>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Toast notification -->
    <transition name="toast">
      <div v-if="showToast" class="toast">
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script>
import { dashboardData } from '../stores/data'

export default {
  name: 'SellerDashboard',
  data() {
    return {
      dashboardData: dashboardData,
      showToast: false,
      toastMessage: ''
    }
  },
  computed: {
    formattedRevenue() {
      return this.dashboardData.revenue.toLocaleString()
    }
  },
  methods: {
    getStatusClass(status) {
      const statusMap = {
        'Pending': 'status-pending',
        'Preparing': 'status-preparing',
        'Ready': 'status-ready',
        'Delivered': 'status-delivered',
        'Cancelled': 'status-cancelled'
      }
      return statusMap[status] || 'status-pending'
    },
    updateStatus(order) {
      const statusFlow = ['Pending', 'Preparing', 'Ready', 'Delivered']
      const currentIndex = statusFlow.indexOf(order.status)
      
      if (currentIndex < statusFlow.length - 1) {
        order.status = statusFlow[currentIndex + 1]
        this.toastMessage = `Order updated to ${order.status}`
        this.showToast = true
        setTimeout(() => {
          this.showToast = false
        }, 2000)
      }
    }
  }
}
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background: #F8F9FA;
  padding: 16px;
  padding-top: calc(16px + env(safe-area-inset-top, 0));
}

.header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #2D3436;
}

.welcome-text {
  font-size: 14px;
  color: #636E72;
  margin-top: 4px;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 28px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.orders {
  background: #E3F2FD;
  color: #1976D2;
}

.stat-icon.revenue {
  background: #E8F5E9;
  color: #388E3C;
}

.stat-icon.pending {
  background: #FFF3E0;
  color: #F57C00;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: #2D3436;
}

.stat-label {
  font-size: 12px;
  color: #636E72;
  margin-top: 2px;
}

.recent-orders-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #2D3436;
  margin-bottom: 16px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-item {
  background: white;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.order-info {
  flex: 1;
  min-width: 0;
}

.customer-name {
  font-size: 15px;
  font-weight: 600;
  color: #2D3436;
  margin-bottom: 4px;
}

.order-items-text {
  font-size: 13px;
  color: #636E72;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.order-time {
  font-size: 12px;
  color: #B2BEC3;
}

.order-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.order-status {
  font-size: 11px;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 12px;
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

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #F5F5F5;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #2D3436;
  transition: background 0.2s ease;
}

.action-btn:hover {
  background: #E5E5E5;
}

.toast {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: #2D3436;
  color: white;
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  z-index: 1001;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
</style>
