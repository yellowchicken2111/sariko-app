<script>
export default {
    props: {
        sellerIndex: {
            type: Number
        },
        sellerName: {
            type: String,
            required: true
        },
        sellerSlugName: {
            type: String,
            required: true
        },
        sellerAvatarImageURL: {
            type: String,
            required: true
        },
        sellerFeaturedCategory: {
            type: String,
            required: true
        }
    },

    methods: {
        onClicked() {
            this.$router.push(`/seller/${this.sellerSlugName}`)
        }
    }
}
</script>

<template>

    <div v-on:click="onClicked" :class="sellerIndex == 1 ? 'container-1st' : 'container'">

        <div class="seller-avatar">
            <q-avatar size="48px">
                <img :src="sellerIndex == 1 ? '/seller-avatar/seller_dummy_avatar_teresa.jpg' : sellerAvatarImageURL">
            </q-avatar>
        </div>

        <div class="seller-info">
            <div class="seller-name">
                {{ sellerName }}
            </div>

            <div class="seller-feature-category">
                🍲 {{ sellerFeaturedCategory }}
            </div>

            <div class="seller-index">
                <q-badge 
                rounded
                class="badge"
                :label="'# ' + sellerIndex"/>
            </div>
        </div>

    </div>

</template>

<style lang="scss" scoped>

.container-1st {
    display: flex;
    align-items: center;
    margin-right: 15px;
    border: 1px solid $accent;
    border-radius: .75rem;
    background-color: #2c261f;
    padding: 10px 20px;
}

.container {
    display: flex;
    align-items: center;
    margin-right: 15px;
    border: 1.5px solid rgb(255, 255, 255, 0.3);
    border-radius: .75rem;
    background-color: rgb(255, 255, 255, 0.15);
    padding: 10px 20px;
}

.seller-avatar {
    margin-right: 10px;
}

.seller-name {
    font-weight: 700;
    font-size: 10px;
}

.seller-feature-category {
    font-size: 8px;
    color: rgb(122, 140, 174)
}

.badge {
    padding: 5px 10px; 
    font-size: 9px;
    color: #facc15; 
    background-color: #4a391f;
}


</style>