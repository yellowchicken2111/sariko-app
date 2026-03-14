<template>
  <div class="category-chips hide-scrollbar">
    <button
      v-for="category in categories"
      :key="category.id"
      class="chip"
      :class="{ active: selectedCategory === category.id }"
      @click="selectCategory(category.id)"
    >
      <span class="chip-icon">{{ category.icon }}</span>
      <span class="chip-label">{{ category.name }}</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'CategoryChips',
  props: {
    categories: {
      type: Array,
      required: true
    },
    selectedCategory: {
      type: Number,
      default: null
    }
  },
  emits: ['select'],
  data() {
    return {}
  },
  methods: {
    selectCategory(categoryId) {
      if (this.selectedCategory === categoryId) {
        this.$emit('select', null)
      } else {
        this.$emit('select', categoryId)
      }
    }
  }
}
</script>

<style scoped>
.category-chips {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 4px 0;
  scroll-snap-type: x mandatory;
}

.chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: white;
  border: 1.5px solid #D1D5DB;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
  scroll-snap-align: start;
  min-height: 44px;
}

.chip:hover {
  border-color: #16A34A;
}

.chip.active {
  background: #16A34A;
  border-color: #16A34A;
  color: white;
}

.chip-icon {
  font-size: 16px;
}

.chip-label {
  font-size: 13px;
}
</style>
