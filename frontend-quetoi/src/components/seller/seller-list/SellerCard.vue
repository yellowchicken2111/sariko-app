<script>
import { User } from 'lucide-vue-next';

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
        },
        sellerFeaturedCategory: {
            type: String,
            required: true
        },
        sellerStatus: {
            type: String,
            default: 'active'
        }
    },

    components: {
        User
    },

    computed: {
        isComingSoon() {
            return this.sellerStatus === 'coming_soon'
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
            <q-avatar v-if="sellerAvatarImageURL" size="48px">
                <img :src="sellerAvatarImageURL" class="avatar-img">
            </q-avatar>
            <div v-else class="guest-icon">
                <User :size="28" />
            </div>
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
                v-if="isComingSoon"
                rounded
                class="badge badge-coming-soon"
                :label="$t('seller_card.coming_soon')"/>
                <q-badge
                v-else
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
    border: 1px solid var(--color-gold);
    border-radius: .75rem;
    background-color: var(--bg-surface);
    padding: 10px 14px;
    cursor: pointer;
}

.container {
    display: flex;
    align-items: center;
    border: 1.5px solid var(--border-color);
    border-radius: .75rem;
    background-color: var(--bg-surface);
    padding: 10px 14px;
    cursor: pointer;
}

.seller-avatar {
    margin-right: 10px;
}

.avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.guest-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
}

.seller-name {
    font-weight: 700;
    font-size: 10px;
}

.seller-feature-category {
    font-size: 8px;
    color: var(--text-secondary)
}

.badge {
    padding: 5px 10px;
    font-size: 9px;
    color: var(--color-primary);
    background-color: rgba(29, 107, 74, 0.12);
}

.badge-coming-soon {
    color: var(--text-secondary);
    background-color: var(--bg-surface-2);
}


</style>