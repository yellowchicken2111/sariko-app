<template>
  <div class="seller-card" @click="goToSeller">
    <div class="card-header">
      <img :src="seller.image" :alt="seller.name" class="seller-image" />
      <div class="seller-info">
        <h3 class="seller-name">{{ seller.name }}</h3>
        <div class="seller-meta">
          <span class="rating">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#FFB800" stroke="#FFB800" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            {{ seller.rating }}
          </span>
          <span class="divider">•</span>
          <span class="distance">{{ seller.distance }}</span>
        </div>
      </div>
    </div>
    <div class="preview-images">
      <img 
        v-for="(img, index) in seller.previewImages" 
        :key="index" 
        :src="img" 
        :alt="`${seller.name} food ${index + 1}`"
        class="preview-image"
      />
    </div>
    <div class="card-footer">
      <span class="category-tag">{{ seller.category }}</span>
      <span class="delivery-time">{{ seller.deliveryTime }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SellerCard',
  props: {
    seller: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  methods: {
    goToSeller() {
      this.$router.push(`/seller/${this.seller.id}`)
    }
  }
}
</script>

<style scoped>
.seller-card {
  background: var(--bg-surface);
  border-radius: 16px;
  padding: 16px;
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.seller-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hover);
}

.seller-card:active {
  transform: scale(0.98);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.seller-image {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  object-fit: cover;
}

.seller-info {
  flex: 1;
}

.seller-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.seller-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-secondary);
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
  color: var(--text-primary);
}

.divider {
  color: var(--border-color);
}

.preview-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.preview-image {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 12px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-tag {
  background: var(--bg-card-hover);
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-primary);
}

.delivery-time {
  font-size: 12px;
  color: var(--text-secondary);
}
</style>
