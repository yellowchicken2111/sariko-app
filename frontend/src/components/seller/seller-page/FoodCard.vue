<script>
import { mapState } from 'pinia';
import { useSellerStore } from '@/stores/seller/sellerStore';
import { useCartStore } from '@/stores/cart/cartStore';

export default {
    props: {
        itemId: {
            required: true,
            type: String
        },
        name: {
            required: true,
            type: String
        },
        price: {
            required: true,
            type: String
        },
        imgSrc: {
            required: true,
            type: String
        }
    },

    data() {
        return {
            loading: false
        }
    },

    computed: {
        ...mapState(useSellerStore, ['seller'])
    },

    methods: {
        goToDetail() {
            if (this.seller?.slug) {
                this.$router.push(`/food/${this.seller.slug}/${this.itemId}`)
            }
        },

        async handleAddToCart(e) {
            e.stopPropagation()
            if (this.loading) return
            this.loading = true
            const cartStore = useCartStore()
            await cartStore.addItem(this.seller.id, this.itemId, this.seller.store_name)
            this.loading = false
            if (!cartStore.isShowModalCartConflict) {
                this.$q.notify({
                    classes: 'quasar-notify-positive',
                    message: `✔️ ${this.name} added to cart`,
                    progress: true,
                    position: 'bottom',
                    timeout: 1500,
                })
            }
        }
    }
}
</script>

<template>
    <div class="card" @click="goToDetail">

        <div class="food-image">
            <q-img
            :src="imgSrc"
            :ratio="16/9"
            />
        </div>

        <div class="food-info">

            <div class="">
                <div class="food-name">
                    {{ name }}
                </div>

                <div class="food-price">
                    ₫{{ price }}
                </div>
            </div>

            <div class="button-add-cart">
                <q-btn
                flat
                dense
                no-caps
                :loading="loading"
                @click="handleAddToCart"
                >
                    <q-icon name="fa-solid fa-circle-plus" style="color: #f5A623" />
                    <template #loading>
                        <q-spinner-dots color="orange" size="16px" />
                    </template>
                </q-btn>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.card {
    background-color:#121827;
    height: 100%;
    padding: 0;
    font-family: $sariko-font-family-secondary;
    overflow-x: hidden;
    border-radius: 0.75rem;
}


.food-info {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.food-name {
    font-size: 12px;
    font-weight: 700;
}

.food-price {
    font-weight: 600;
    color: var(--text-active);
}

</style>