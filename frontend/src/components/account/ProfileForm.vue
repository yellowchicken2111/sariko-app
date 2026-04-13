<script>
import { User, Phone, Image } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth/authStore';
import apiUsers from '@/apis/users/apiUsers';

export default {
    components: { User, Phone, Image },

    data() {
        return {
            name: '',
            phone: '',
            avatarUrl: '',
            saving: false,
            nameError: null,
            phoneError: null,
        }
    },

    computed: {
        authStore() {
            return useAuthStore()
        },
        user() {
            return this.authStore.user
        },
        isDirty() {
            return (
                this.name !== (this.user?.fullName || '') ||
                this.phone !== (this.user?.phone || '') ||
                this.avatarUrl !== (this.user?.avatarUrl || '')
            )
        },
        canSave() {
            return this.isDirty && !this.saving && !this.nameError && !this.phoneError
        }
    },

    mounted() {
        this.name = this.user?.fullName || ''
        this.phone = this.user?.phone || ''
        this.avatarUrl = this.user?.avatarUrl || ''
    },

    methods: {
        validateName() {
            if (!this.name || !this.name.trim()) {
                this.nameError = this.$t('edit_profile_page.validation_name_required')
                return false
            }
            this.nameError = null
            return true
        },

        validatePhone() {
            if (!this.phone) {
                this.phoneError = null
                return true
            }
            // Accept VN phone formats: 0xxxxxxxxx or +84xxxxxxxxx
            const normalized = this.phone.replace(/\s|-/g, '')
            const valid = /^(0|\+84)\d{9,10}$/.test(normalized)
            if (!valid) {
                this.phoneError = this.$t('edit_profile_page.validation_phone_invalid')
                return false
            }
            this.phoneError = null
            return true
        },

        async onSave() {
            if (!this.validateName()) return
            if (!this.validatePhone()) return

            this.saving = true
            try {
                await apiUsers.updateProfile({
                    name: this.name.trim(),
                    phone: this.phone ? this.phone.trim() : null,
                    avatar_url: this.avatarUrl ? this.avatarUrl.trim() : null,
                })

                // Update local store state
                if (this.user) {
                    this.user.fullName = this.name.trim()
                    this.user.phone = this.phone ? this.phone.trim() : null
                    this.user.avatarUrl = this.avatarUrl ? this.avatarUrl.trim() : null
                }

                this.$q.notify({
                    classes: 'quasar-notify-positive',
                    message: `✔️ ${this.$t('common.toast_update_success')}`,
                    position: 'bottom',
                    timeout: 1500,
                })
                this.$router.push('/account')
            } catch (e) {
                console.error('ProfileForm - onSave - ', e)
                this.$q.notify({
                    classes: 'quasar-notify-negative',
                    message: this.$t('common.toast_update_failed'),
                    position: 'bottom',
                    timeout: 2000,
                })
            } finally {
                this.saving = false
            }
        }
    }
}
</script>

<template>
    <div class="profile-form">
        <!-- Name field -->
        <div class="form-field">
            <label class="field-label">
                <User :size="16" /> {{ $t('edit_profile_page.label_name') }}
            </label>
            <q-input
                v-model="name"
                dense
                outlined
                dark
                :placeholder="$t('edit_profile_page.placeholder_name')"
                :error="!!nameError"
                :error-message="nameError"
                @blur="validateName"
            />
        </div>

        <!-- Phone field -->
        <div class="form-field">
            <label class="field-label">
                <Phone :size="16" /> {{ $t('edit_profile_page.label_phone') }}
            </label>
            <q-input
                v-model="phone"
                dense
                outlined
                dark
                type="tel"
                :placeholder="$t('edit_profile_page.placeholder_phone')"
                :error="!!phoneError"
                :error-message="phoneError"
                @blur="validatePhone"
            />
        </div>

        <!-- Avatar URL field -->
        <div class="form-field">
            <label class="field-label">
                <Image :size="16" /> {{ $t('edit_profile_page.label_avatar') }}
            </label>
            <q-input
                v-model="avatarUrl"
                dense
                outlined
                dark
                :placeholder="$t('edit_profile_page.placeholder_avatar')"
                :hint="$t('edit_profile_page.helper_avatar')"
            />
        </div>

        <!-- Save button -->
        <q-btn
            class="btn-save"
            no-caps
            unelevated
            :disable="!canSave"
            :loading="saving"
            @click="onSave"
        >
            {{ saving ? $t('common.button_label_saving') : $t('common.button_label_save') }}
        </q-btn>
    </div>
</template>

<style scoped>
.profile-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.field-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.3px;
}

.btn-save {
    margin-top: 12px;
    padding: 14px;
    background: var(--color-accent, #f5A623);
    color: #121b2f;
    font-weight: 700;
    font-size: 15px;
    border-radius: 12px;
}

.btn-save:disabled {
    background: rgba(245, 166, 35, 0.3);
    color: rgba(18, 27, 47, 0.5);
}
</style>
