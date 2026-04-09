<script>
import { MapPin, Phone, Pen } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth/authStore';
import { mapState } from 'pinia';

export default {
    components: {
        MapPin, Phone, Pen
    },
    computed: {
        ...mapState(useAuthStore, [
            "user"
        ])
    },
    mounted() {        
        const height= this.$refs.deliverySectionRef.offsetHeight || 0
        document.documentElement.style.setProperty('--delivery-adress-height', `${height}px`)
    }
}
</script>

<template>

    <div ref="deliverySectionRef" class="container-delivery-address">
        <div class="header"> 
            <div class="title">
                <div class="title-text">
                    {{ $t('cart_page.section_delivery_address.title') }} 
                </div>
                <div class="name">
                    {{ user?.fullName || 'jack'}}
                </div>
            </div>
            <q-btn  class="button" no-caps flat dense>
                <Pen size="14px" />
                <!-- {{ $t('cart_page.section_delivery_address.button_label_text_edit') }} -->
            </q-btn>
        </div>
        <div class="user-details">
            <div class="icon">
                <MapPin size="16px"/>
            </div>
            <div class="text">
                {{  user?.address || '7b/99/11, Thành Thái, Phường 14, Quận 10, TP. Hồ Chí Minh' }}
            </div>
        </div>
        <div class="user-details">
            <div class="icon">
                <Phone size="16px"/>
            </div>
            <div class="text">
                {{  user?.phone || '(+84) 903 059 990' }}
            </div>
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

.name {
    margin-left: 5px;
    padding: 0px 10px;
    border-radius: .75rem;
    background-color: var(--bg-surface);
    border: 1px solid var(--text-active);
    color: var(--text-active);
    font-size: 12px;
    font-weight: 600px;
}

.user-details {
    display: flex;
    margin-bottom: 5px;
}

.icon {
    margin-right: 8px;
    // color: var(--text-muted);
}

.text {
    font-size: 14px;
    // color: var(--text-muted);
}
</style>