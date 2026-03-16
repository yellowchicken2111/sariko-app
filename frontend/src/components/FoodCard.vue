<template>
  <div class="food-card" @click="$emit('click')">
    <div class="food-image-wrapper">
      <img :src="food.image" :alt="food.name" class="food-image" />
    </div>
    <div class="food-info">
      <h3 class="food-name">{{ food.name }}</h3>
      <span class="food-price">${{ formatPrice(food.price) }}</span>
      <div class="food-meta">
        <div class="meta-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" fill="#FF6B35" stroke="none"/>
            <path d="M12 6v6l4 2" stroke="#FF6B35"/>
          </svg>
          <span>{{ food.calories }} Calories</span>
        </div>
        <div class="meta-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>{{ food.deliveryTime }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FoodCard',
  props: {
    food: {
      type: Object,
      required: true
    },
    sellerId: {
      type: Number,
      required: true
    }
  },
  emits: ['click'],
  methods: {
    formatPrice(price) {
      return (price / 100).toFixed(2)
    }
  }
}
</script>

<style scoped>
.food-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid #F3F4F6;
}

.food-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.food-card:active {
  transform: scale(0.98);
}

.food-image-wrapper {
  position: relative;
  padding: 12px;
}

.food-image {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 12px;
}

.food-info {
  padding: 0 12px 16px;
}

.food-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.food-price {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  display: block;
  margin-bottom: 8px;
}

.food-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #6B7280;
}

.meta-item svg {
  color: #F97316;
  flex-shrink: 0;
}
</style>
