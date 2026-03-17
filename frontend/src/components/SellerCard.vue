<template>
  <div class="seller-card" @click="goToSeller">
    <div class="seller-cover-wrapper">
      <img :src="seller.banner || seller.image" :alt="seller.name" class="seller-cover" />
      <div class="seller-distance-badge">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <span>{{ seller.distance }}</span>
      </div>
    </div>
    
    <div class="seller-info">
      <div class="seller-header">
        <h3 class="seller-name">{{ seller.name }}</h3>
        <div class="seller-rating">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="var(--color-accent)" stroke="var(--color-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span>{{ seller.rating }}</span>
          <span class="review-count">({{ seller.reviewCount }})</span>
        </div>
      </div>
      
      <p class="seller-description">{{ seller.description }}</p>
      
      <div class="seller-previews" v-if="seller.previewImages && seller.previewImages.length > 0">
        <img v-for="(img, idx) in seller.previewImages.slice(0, 3)" :key="idx" :src="img" alt="Food preview" class="preview-img" />
      </div>
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
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid var(--border-color);
  margin-bottom: 16px;
}

.seller-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hover);
}

.seller-card:active {
  transform: scale(0.98);
}

.seller-cover-wrapper {
  position: relative;
  height: 140px;
  width: 100%;
}

.seller-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.seller-distance-badge {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.seller-info {
  padding: 16px;
}

.seller-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.seller-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  flex: 1;
}

.seller-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
}

.review-count {
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 12px;
}

.seller-description {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 16px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.seller-previews {
  display: flex;
  gap: 8px;
}

.preview-img {
  flex: 1;
  aspect-ratio: 1;
  border-radius: 8px;
  object-fit: cover;
  background-color: var(--bg-main);
}
</style>
