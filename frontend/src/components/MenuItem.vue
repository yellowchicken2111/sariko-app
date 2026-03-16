<template>
  <div class="menu-item" @click="goToDetail">
    <img :src="item.image" :alt="item.name" class="item-image" />
    <div class="item-content">
      <h4 class="item-name">{{ item.name }}</h4>
      <p class="item-description">{{ item.description }}</p>
      <div class="item-footer">
        <span class="item-price">₱{{ item.price }}</span>
        <button class="add-btn" @click.stop="addToCart">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '../stores/cartStore'

export default {
  name: 'MenuItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    sellerId: {
      type: Number,
      required: true
    },
    sellerName: {
      type: String,
      required: true
    }
  },
  emits: ['added'],
  setup() {
    const cartStore = useCartStore()
    return { cartStore }
  },
  methods: {
    goToDetail() {
      this.$router.push(`/food/${this.sellerId}/${this.item.id}`)
    },
    addToCart() {
      this.cartStore.addItem({
        id: this.item.id,
        name: this.item.name,
        price: this.item.price,
        image: this.item.image,
        sellerId: this.sellerId,
        sellerName: this.sellerName,
        quantity: 1
      })
      this.$emit('added', this.item)
    }
  }
}
</script>

<style scoped>
.menu-item {
  display: flex;
  gap: 14px;
  padding: 16px;
  background: white;
  border-radius: 16px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.menu-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.menu-item:active {
  transform: scale(0.98);
}

.item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
  flex-shrink: 0;
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.item-name {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.item-description {
  font-size: 13px;
  color: #6B7280;
  line-height: 1.4;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.item-price {
  font-size: 16px;
  font-weight: 700;
  color: #16A34A;
}

.add-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #16A34A;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;
}

.add-btn:hover {
  background: #15803D;
}

.add-btn:active {
  transform: scale(0.9);
}
</style>
