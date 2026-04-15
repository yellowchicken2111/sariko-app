<script>
import { LogOut } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth/authStore';

export default {
    name: 'SellerMeSignOut',

    components: { LogOut },

    data() {
        return {
            showConfirm: false,
            signingOut: false,
        }
    },

    methods: {
        openConfirm() {
            this.showConfirm = true
        },

        async confirmSignOut() {
            this.signingOut = true
            try {
                await useAuthStore().onClickedSignout()
            } finally {
                this.signingOut = false
                this.showConfirm = false
            }
        }
    }
}
</script>

<template>
    <div>
        <div class="menu-item signout" @click="openConfirm">
            <div class="menu-icon signout-icon">
                <LogOut size="18" />
            </div>
            <span class="menu-label">{{ $t('seller_me.button_label_sign_out') }}</span>
        </div>

        <q-dialog v-model="showConfirm">
            <q-card class="signout-dialog">
                <q-card-section class="dialog-content">
                    <div class="dialog-title">{{ $t('seller_me.signout_dialog_title') }}</div>
                    <div class="dialog-message">{{ $t('seller_me.signout_dialog_message') }}</div>
                </q-card-section>
                <q-card-actions align="right" class="dialog-actions">
                    <q-btn flat no-caps :label="$t('common.button_label_cancel')" class="btn-cancel" :disable="signingOut" v-close-popup />
                    <q-btn flat no-caps :label="$t('seller_me.signout_dialog_confirm')" class="btn-confirm" :loading="signingOut" @click="confirmSignOut" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<style scoped>
.menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background-color: rgb(255, 255, 255, 0.05);
    border-radius: 12px;
    cursor: pointer;
    color: var(--text-primary);
    transition: background 0.15s ease;
}

.menu-item:hover {
    background: var(--bg-card-hover);
}

.menu-icon {
    width: 24px;
    height: 24px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.signout-icon {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
}

.signout .menu-label {
    color: #ef4444;
    font-size: 14px;
    font-weight: 500;
    flex: 1;
}

.signout-dialog {
    background-color: #1f2940;
    border-radius: 16px;
    min-width: 300px;
    color: var(--text-primary);
}

.dialog-content {
    padding: 24px 20px 12px;
}

.dialog-title {
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 8px;
    color: var(--text-primary);
}

.dialog-message {
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.4;
}

.dialog-actions {
    padding: 8px 16px 16px;
}

.btn-cancel {
    color: var(--text-secondary);
}

.btn-confirm {
    color: #ef4444;
    font-weight: 600;
}
</style>
