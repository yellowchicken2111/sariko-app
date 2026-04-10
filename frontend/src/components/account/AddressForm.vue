<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, LocateFixed } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth/authStore';
import apiUsers from '@/apis/users/apiUsers';

export default {
    components: {
        MapPin,
        LocateFixed
    },

    data() {
        return {
            map: null,
            marker: null,
            isLocating: false,
            saving: false,
            address: '',
            addressDetails: '',
            lat: null,
            lon: null,
            loaded: false,
        }
    },

    computed: {
        authStore() {
            return useAuthStore()
        },
        canSave() {
            return !!this.address && !this.saving
        }
    },

    mounted() {
        // Initialize from authStore state (set during onboarding or previous edit)
        this.address = this.authStore.inputAddress || ''
        this.addressDetails = this.authStore.inputAddressDetails || ''
        this.lat = this.authStore.inputLat || null
        this.lon = this.authStore.inputLon || null
        this.loaded = true

        this.$nextTick(() => {
            this.initMap()
        })
    },

    beforeUnmount() {
        if (this.map) {
            this.map.remove()
            this.map = null
        }
    },

    methods: {
        initMap() {
            const defaultLat = this.lat || 10.7769
            const defaultLon = this.lon || 106.7009

            this.map = L.map(this.$refs.mapContainer, {
                center: [defaultLat, defaultLon],
                zoom: 14,
                zoomControl: false,
                attributionControl: false
            })

            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                maxZoom: 19,
                subdomains: 'abcd'
            }).addTo(this.map)

            const markerIcon = L.divIcon({
                className: 'custom-marker',
                html: `<div class="marker-pin"></div>`,
                iconSize: [30, 42],
                iconAnchor: [15, 42]
            })

            this.marker = L.marker([defaultLat, defaultLon], {
                draggable: true,
                icon: markerIcon
            }).addTo(this.map)

            this.marker.on('dragend', () => {
                const pos = this.marker.getLatLng()
                this.lat = pos.lat
                this.lon = pos.lng
                this.reverseGeocode(pos.lat, pos.lng)
            })
        },

        async reverseGeocode(lat, lon) {
            try {
                const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`
                const res = await fetch(url)
                const data = await res.json()
                if (data?.display_name) {
                    this.address = data.display_name
                }
            } catch (e) {
                console.error('Reverse geocode failed:', e)
            }
        },

        async useCurrentLocation() {
            if (!navigator.geolocation) {
                console.error('Geolocation not supported')
                return
            }

            this.isLocating = true

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude
                    const lon = position.coords.longitude

                    this.lat = lat
                    this.lon = lon

                    if (this.map && this.marker) {
                        this.map.setView([lat, lon], 16)
                        this.marker.setLatLng([lat, lon])
                    }

                    await this.reverseGeocode(lat, lon)
                    this.isLocating = false
                },
                (error) => {
                    console.error('Geolocation error:', error)
                    this.isLocating = false
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            )
        },

        async onSave() {
            if (!this.canSave) return

            this.saving = true
            try {
                await apiUsers.updateProfile({
                    address: this.address,
                    address_details: this.addressDetails || null,
                    lat: this.lat,
                    lon: this.lon,
                })

                // Sync authStore so other components (cart, etc.) see the change
                this.authStore.inputAddress = this.address
                this.authStore.inputAddressDetails = this.addressDetails
                this.authStore.inputLat = this.lat
                this.authStore.inputLon = this.lon

                this.$q.notify({
                    classes: 'quasar-notify-positive',
                    message: `✔️ ${this.$t('common.toast_update_success')}`,
                    position: 'bottom',
                    timeout: 1500,
                })
                this.$router.push('/account')
            } catch (e) {
                console.error('AddressForm - onSave - ', e)
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
    <div class="address-form">
        <div class="subtitle">{{ $t('delivery_address_page.subtitle') }}</div>

        <!-- Map -->
        <div class="map-section">
            <div ref="mapContainer" class="map-container"></div>

            <button
                class="btn-use-location"
                :disabled="isLocating"
                @click="useCurrentLocation"
            >
                <q-spinner-dots v-if="isLocating" color="accent" size="18px" />
                <LocateFixed v-else :size="18" class="icon-locate" />
                <span>
                    {{ isLocating
                        ? $t('delivery_address_page.button_locating')
                        : $t('delivery_address_page.button_use_current_location') }}
                </span>
            </button>
        </div>

        <!-- Address preview -->
        <div class="address-preview">
            <MapPin :size="16" class="icon-pin" />
            <div class="address-text">
                {{ address || $t('delivery_address_page.empty_address') }}
            </div>
        </div>

        <!-- Address details input -->
        <div class="form-field">
            <label class="field-label">
                {{ $t('delivery_address_page.label_address_details') }}
            </label>
            <q-input
                v-model="addressDetails"
                dense
                outlined
                dark
                :placeholder="$t('delivery_address_page.placeholder_address_details')"
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
            {{ saving
                ? $t('common.button_label_saving')
                : $t('delivery_address_page.button_save') }}
        </q-btn>
    </div>
</template>

<style lang="scss" scoped>
.address-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.subtitle {
    font-size: 13px;
    color: var(--text-secondary);
    padding-left: 4px;
}

.map-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.map-container {
    width: 100%;
    height: 240px;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-use-location {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 12px 16px;
    background: var(--bg-surface);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    color: #fff;
    font-size: 14px;
    cursor: pointer;

    &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.08);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
}

.icon-locate {
    color: var(--color-accent, #f5A623);
}

.address-preview {
    display: flex;
    gap: 10px;
    padding: 12px 14px;
    background: var(--bg-surface);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
}

.icon-pin {
    color: var(--color-accent, #f5A623);
    flex-shrink: 0;
    margin-top: 2px;
}

.address-text {
    font-size: 13px;
    color: var(--text-primary);
    line-height: 1.4;
    word-break: break-word;
}

.form-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.field-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.3px;
    padding-left: 4px;
}

.btn-save {
    margin-top: 8px;
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

<style lang="scss">
.custom-marker {
    background: none;
    border: none;
}

.marker-pin {
    width: 30px;
    height: 30px;
    border-radius: 50% 50% 50% 0;
    background: #ff9f43;
    position: relative;
    transform: rotate(-45deg);
    margin: 0;

    &::after {
        content: '';
        width: 14px;
        height: 14px;
        background: #1a1a1a;
        position: absolute;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}
</style>
