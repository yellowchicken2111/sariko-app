<script>
import { MapPin, Phone, Pen } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth/authStore';
import { mapState } from 'pinia';

export default {
    components: {
        MapPin, Phone, Pen
    },

    computed: {
        ...mapState(useAuthStore, ['user']),

        authStore() {
            return useAuthStore()
        },
        displayName() {
            return this.user?.fullName || 'Guest'
        },
        displayAddress() {
            return this.authStore.inputAddress || null
        },
        displayPhone() {
            return this.user?.phone || null
        },
        hasAddress() {
            return !!this.displayAddress
        },
    },

    methods: {
        goEditAddress() {
            this.$router.push('/account/address')
        }
    },

    mounted() {
        const height = this.$refs.deliverySectionRef?.offsetHeight || 0
        document.documentElement.style.setProperty('--delivery-adress-height', `${height}px`)
    }
}
</script>

<template>
    <div ref="deliverySectionRef" class="container-delivery-address">
        <div class="header">
            <div class="title">
                <div class="title-text">
                    {{ $t('cart_page.section_delivery_address.title', { name: displayName }) }}
                </div>
            </div>
            <q-btn class="button" no-caps flat dense @click="goEditAddress">
                <Pen size="14px" />
            </q-btn>
        </div>

        <template v-if="hasAddress">
            <div class="user-details">
                <div class="icon"><MapPin size="16px"/></div>
                <div class="text">{{ displayAddress }}</div>
            </div>
            <div v-if="displayPhone" class="user-details">
                <div class="icon"><Phone size="16px"/></div>
                <div class="text">{{ displayPhone }}</div>
            </div>
        </template>

        <div v-else class="no-address" @click="goEditAddress">
            <MapPin size="16px" class="icon-empty" />
            <span>{{ $t('cart_page.section_delivery_address.no_address') }}</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.container-delivery-address {
    padding: 10px 15px 0px 15px;
    font-family: $sariko-font-family-secondary;
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.05);
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
}

.title {
    display: flex;
    align-items: center;
    color: var(--text-muted);
}

.title-text {
    font-size: 14px;
}

.button {
    border: solid 1px var(--border-color);
    padding: 5px;
    border-radius: 50%;
}

.user-details {
    display: flex;
    margin-bottom: 10px;
}

.icon {
    margin-right: 8px;
    flex-shrink: 0;
    margin-top: 1px;
}

.text {
    font-size: 14px;
    line-height: 1.4;
}

.no-address {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 0;
    color: var(--color-accent);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
}

.icon-empty {
    color: var(--color-accent);
}
</style>
