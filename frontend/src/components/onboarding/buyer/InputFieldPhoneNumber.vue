<script>
import { Phone } from 'lucide-vue-next';

export default {
    components: {
        Phone
    },

    data() {
        const options = ["VN (+84)", "KR (+82)"]
        return {
            options,
            region: options[0],
            phone: null
        }
    }
}
</script>

<template>

    <div class="container-phone-number">

        <div class="title">
            <Phone class="icon-phone"/> {{ $t('onboarding_page.buyer.section_phone_number.title') }}
        </div>

        <div class="row q-gutter-md input-group">
            <div class="col-4">
                <div class="input-container">
                    <q-select
                    class="input-select"
                    dense
                    outlined
                    popup-content-class="my-select-popup"
                    color="white"
                    bg-color="bgInputField"
                    v-model="region" :options="options"
                    />
                </div>
            </div>
            <div class="col">
                <div class="input-container">
                    <q-input
                    class="input"
                    dense
                    outlined
                    type="text"
                    color="white"
                    bg-color="bgInputField"
                    v-model="phone"
                    />
                </div>
            </div>
        </div>

        <div class="tooltip">
            {{ $t('onboarding_page.buyer.section_phone_number.tooltip') }}
        </div>
    </div>

</template>

<style lang="scss" scoped>

.title {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.icon-phone {
    margin-right: 10px;
}

.input-container {
    overflow: hidden;
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 10px;
}

.input-select {
    width: 100%;
}

.input {
    width: 100%;
}


:deep(.q-field__native) {
    color: #ffffff;
}

</style>

<style lang="scss">

.input-select .q-field__control {
    border-radius: .75rem;
}

.input .q-field__control {
    border-radius: .75rem;
}

.my-select-popup {
    background-color: #1a1a1a !important;
    color: white !important;
}

.my-select-popup .q-item {
    background-color: #1a1a1a !important;
    color: white !important;
}

.my-select-popup .q-item--active {
    color: #ff9f43 !important;
}
</style>