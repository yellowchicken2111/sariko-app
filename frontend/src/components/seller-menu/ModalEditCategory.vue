<script>
import { useMenuStore } from '@/stores/seller/menuStore'

export default {
    name: 'ModalEditCategory',

    props: {
        modelValue: { type: Boolean, default: false },
        // null = create mode, object = edit mode
        category: { type: Object, default: null },
    },

    emits: ['update:modelValue'],

    data() {
        return {
            name: '',
            saving: false,
            deleting: false,
            showDeleteConfirm: false,
        }
    },

    computed: {
        isEdit()    { return !!this.category },
        canSave()   { return this.name.trim().length > 0 && !this.saving },
        itemCount() { return (this.category?.food_items || []).length },
    },

    watch: {
        modelValue(val) {
            if (val) this.name = this.category?.name || ''
        },
    },

    methods: {
        close() { this.$emit('update:modelValue', false) },

        onDeleteClick() {
            if (this.itemCount > 0) {
                this.$q.notify({ type: 'warning', message: this.$t('seller_menu.category_delete_has_items', { count: this.itemCount }), position: 'bottom' })
                return
            }
            this.showDeleteConfirm = true
        },

        async save() {
            if (!this.canSave) return
            this.saving = true
            try {
                const store = useMenuStore()
                if (this.isEdit) {
                    await store.updateCategory(this.category.id, { name: this.name.trim() })
                } else {
                    await store.createCategory(this.name.trim())
                }
                this.close()
            } catch (e) {
                console.error('ModalEditCategory - save -', e)
                this.$q.notify({ type: 'negative', message: this.$t('seller_menu.toast_save_failed'), position: 'bottom' })
            } finally {
                this.saving = false
            }
        },

        async confirmDelete() {
            this.deleting = true
            try {
                await useMenuStore().deleteCategory(this.category.id)
                this.showDeleteConfirm = false
                this.close()
            } catch (e) {
                console.error('ModalEditCategory - confirmDelete -', e)
                this.$q.notify({ type: 'negative', message: this.$t('seller_menu.toast_delete_failed'), position: 'bottom' })
            } finally {
                this.deleting = false
            }
        },
    },
}
</script>

<template>
    <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
        <q-card class="edit-dialog">
            <q-card-section>
                <div class="dialog-title">
                    {{ isEdit ? $t('seller_menu.category_edit_title') : $t('seller_menu.category_add_title') }}
                </div>
                <q-input
                    v-model="name"
                    dense outlined dark autofocus
                    :label="$t('seller_menu.category_name_label')"
                    :placeholder="$t('seller_menu.category_name_placeholder')"
                    class="name-input"
                    @keyup.enter="save"
                />
            </q-card-section>

            <q-card-actions class="dialog-actions">
                <q-btn
                    v-if="isEdit"
                    flat no-caps
                    class="btn-delete"
                    :loading="deleting"
                    @click="onDeleteClick"
                >
                    {{ $t('seller_menu.category_delete') }}
                </q-btn>
                <div class="spacer" />
                <q-btn flat no-caps :label="$t('common.button_label_cancel')" v-close-popup />
                <q-btn flat no-caps class="btn-save" :disable="!canSave" :loading="saving" @click="save">
                    {{ $t('common.button_label_save') }}
                </q-btn>
            </q-card-actions>
        </q-card>

        <!-- Delete confirm -->
        <q-dialog v-model="showDeleteConfirm">
            <q-card class="edit-dialog">
                <q-card-section>
                    <div class="dialog-title">{{ $t('seller_menu.category_delete_confirm_title') }}</div>
                    <div class="dialog-sub">{{ $t('seller_menu.category_delete_confirm_body') }}</div>
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn flat no-caps :label="$t('common.button_label_cancel')" v-close-popup />
                    <q-btn flat no-caps color="negative" :loading="deleting" @click="confirmDelete">
                        {{ $t('seller_menu.category_delete_confirm_action') }}
                    </q-btn>
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-dialog>
</template>

<style lang="scss" scoped>
.edit-dialog {
    background: #1f2940;
    border-radius: 16px;
    min-width: 300px;
    color: var(--text-primary);
}

.dialog-title {
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 16px;
}

.dialog-sub {
    font-size: 13px;
    color: var(--text-secondary);
    margin-top: 4px;
}

.name-input { margin-top: 4px; }

.dialog-actions {
    display: flex;
    align-items: center;
    padding: 8px 16px 12px;
}

.spacer { flex: 1; }

.btn-delete { color: #ef4444; font-size: 13px; }
.btn-save   { color: var(--color-accent); font-size: 13px; font-weight: 600; }
</style>
