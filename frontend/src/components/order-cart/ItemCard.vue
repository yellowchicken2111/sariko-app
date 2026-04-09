<script>
import { Plus, Minus, Star } from 'lucide-vue-next';
import { useCartStore } from '@/stores/cart/cartStore.js';

export default {
    props: {
        itemId: {
            required: true,
            type: String,
        },
        itemName: {
            required: true,
            type: String,
        },
        itemPriceText: {
            required: true,
            type: String,
        },
        itemCategory: {
            required: true,
            type: String,
        },
        itemImgSrc: {
            required: true,
            type: String,
        },
        itemQuantity: {
            required: true,
            type: Number
        },
        sellerStore: {
            require: true,
            type: String
        },
        sellerSlugName: {
            require: true,
            type: String
        }
    },

    components: {
        Plus, Minus, Star
    },

    setup() {
        const cartStore = useCartStore()
        return { cartStore }
    },

    methods: {
        async onClickPlus() {
            await this.cartStore.updateQuantity(this.itemId, this.itemQuantity + 1)
        },
        async onClickMinus() {
            if (this.itemQuantity <= 1) {
                await this.cartStore.removeItem(this.itemId)
            } else {
                await this.cartStore.updateQuantity(this.itemId, this.itemQuantity - 1)
            }
        }
    }
}
</script>

<template>

    <div class="background">
        <div class="container">

            <div class="row q-gutter-md">

                <div class="col-2">
                    <q-img
                    class="item-image"
                    sizes="12px"
                    :src="itemImgSrc"
                    />
                </div>

                <div class="col">

                    <div class="item-metadata">
                        <div class="group-1">
                            <div class="item-name">
                                {{ itemName }}
                            </div>
                            <div class="item-category">
                                <div>{{ itemCategory }}</div> &nbsp; | &nbsp; <Star color="#f5A623" size="12px"/> &nbsp; 4.5
                            </div>
                        </div>
                        <div class="group-2">
                            <div class="item-price">
                                {{ itemPriceText }}
                            </div>
                            <div class="item-quantity">
                                <div class="button-sub-quantity">
                                    <q-btn flat round dense size="10px" @click="onClickMinus">
                                        <Minus style="color: white; background-color: black; border-radius: 50%;"/>
                                    </q-btn>
                                </div>

                                <div class="item-price-text">
                                    {{ itemQuantity }}
                                </div>
                                <div class="button-add-quantity">
                                    <q-btn flat round dense size="10px" @click="onClickPlus">
                                        <Plus style="color: black; background-color: #f5A623; border-radius: 50%;"/>
                                    </q-btn>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>

            </div>

        </div>
    </div>

</template>

<style lang="scss" scoped>

.background {
    padding: 5px 0px 0px 20px;
}

.container {
    font-family: $sariko-font-family-secondary;
    padding: 10px;
}

.item-image {
    border-radius: 1rem;
}

.item-metadata {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.group-1 {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
}

.item-name {
    font-size: 12px;
    font-weight: 600;
    color: $accent;
}

.item-category {
    display: flex;
    align-items: center;
    font-size: 10px;
    font-weight: 600;
    color: rgb(255, 255, 255, 0.5);
}

.store-name {
    font-size: 10px;
    font-weight:600;
    color: var(--color-info)
}

.group-2 {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.item-price {
    font-size: 14px;
    font-weight: 600;
}

.item-quantity {
    display: flex;
    width: 35%;
    justify-content: space-between;
    align-items: center;
    background-color: rgb(255, 255, 255, 0.2);
    padding: 0px 4px 1px 2px;
    border-radius: 1rem;
}

.button-add-quantity {
    // background-color: white;
    border-radius: 50%;
}

.button-sub-quantity {
    // background-color: white;
    border-radius: 50%;
}

</style>