<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, LocateFixed, Search, X } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth/authStore';
import apiUsers from '@/apis/users/apiUsers';

// Swap this function when Goong key is ready
async function searchAddress(query) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=6&countrycodes=vn`
    const res = await fetch(url, { headers: { 'Accept-Language': 'vi,en' } })
    const data = await res.json()
    return data.map(item => ({
        label: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
    }))
}

async function reverseGeocode(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=vi,en`
    const res = await fetch(url)
    const data = await res.json()
    return data?.display_name || null
}

export default {
    components: { MapPin, LocateFixed, Search, X },

    data() {
        return {
            query: '',
            suggestions: [],
            isSearching: false,
            isLocating: false,
            saving: false,
            showDropdown: false,
            address: '',
            addressDetails: '',
            lat: null,
            lon: null,
            _debounceTimer: null,
            _map: null,
            _marker: null,
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
        this.address = this.authStore.inputAddress || ''
        this.addressDetails = this.authStore.inputAddressDetails || ''
        this.lat = this.authStore.inputLat || null
        this.lon = this.authStore.inputLon || null
        if (this.address) this.query = this.address
        if (this.lat && this.lon) {
            this.$nextTick(() => this.showMapAt(this.lat, this.lon))
        }
    },

    beforeUnmount() {
        if (this._map) { this._map.remove(); this._map = null }
    },

    methods: {
        onQueryInput() {
            clearTimeout(this._debounceTimer)
            if (!this.query.trim() || this.query.length < 3) {
                this.suggestions = []
                this.showDropdown = false
                return
            }
            this._debounceTimer = setTimeout(() => this.fetchSuggestions(), 350)
        },

        async fetchSuggestions() {
            this.isSearching = true
            try {
                this.suggestions = await searchAddress(this.query)
                this.showDropdown = this.suggestions.length > 0
            } catch (e) {
                console.error('Address search failed:', e)
            } finally {
                this.isSearching = false
            }
        },

        selectSuggestion(item) {
            this.address = item.label
            this.lat = item.lat
            this.lon = item.lon
            this.query = item.label
            this.showDropdown = false
            this.suggestions = []
            this.$nextTick(() => this.showMapAt(item.lat, item.lon))
        },

        clearSearch() {
            this.query = ''
            this.address = ''
            this.lat = null
            this.lon = null
            this.suggestions = []
            this.showDropdown = false
        },

        showMapAt(lat, lon) {
            if (!this.$refs.mapContainer) return
            if (this._map) {
                this._map.setView([lat, lon], 16)
                this._marker.setLatLng([lat, lon])
                return
            }
            this._map = L.map(this.$refs.mapContainer, {
                center: [lat, lon],
                zoom: 16,
                zoomControl: false,
                attributionControl: false,
                dragging: false,
                scrollWheelZoom: false,
                doubleClickZoom: false,
                touchZoom: false,
            })
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                maxZoom: 19,
                subdomains: 'abcd'
            }).addTo(this._map)
            const icon = L.divIcon({
                className: '',
                html: `<div class="preview-pin"></div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12],
            })
            this._marker = L.marker([lat, lon], { icon }).addTo(this._map)
        },

        async useCurrentLocation() {
            if (!navigator.geolocation) return
            this.isLocating = true
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const lat = pos.coords.latitude
                    const lon = pos.coords.longitude
                    this.lat = lat
                    this.lon = lon
                    const found = await reverseGeocode(lat, lon)
                    if (found) {
                        this.address = found
                        this.query = found
                    }
                    this.$nextTick(() => this.showMapAt(lat, lon))
                    this.isLocating = false
                },
                (err) => {
                    console.error('Geolocation error:', err)
                    this.isLocating = false
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
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

        <!-- Search input -->
        <div class="search-wrap">
            <div class="search-box">
                <Search :size="16" class="icon-search" />
                <input
                    v-model="query"
                    class="search-input"
                    :placeholder="$t('delivery_address_page.search_placeholder')"
                    autocomplete="off"
                    @input="onQueryInput"
                    @focus="showDropdown = suggestions.length > 0"
                />
                <button v-if="query" class="btn-clear" @click="clearSearch">
                    <X :size="14" />
                </button>
                <q-spinner-dots v-if="isSearching" color="accent" size="16px" class="spinner" />
            </div>

            <!-- Dropdown suggestions -->
            <div v-if="showDropdown" class="dropdown">
                <button
                    v-for="(item, i) in suggestions"
                    :key="i"
                    class="suggestion-item"
                    @click="selectSuggestion(item)"
                >
                    <MapPin :size="14" class="icon-pin-sm" />
                    <span class="suggestion-text">{{ item.label }}</span>
                </button>
            </div>
        </div>

        <!-- GPS button -->
        <button class="btn-gps" :disabled="isLocating" @click="useCurrentLocation">
            <q-spinner-dots v-if="isLocating" color="accent" size="18px" />
            <LocateFixed v-else :size="18" class="icon-locate" />
            <span>{{ isLocating
                ? $t('delivery_address_page.button_locating')
                : $t('delivery_address_page.button_use_current_location') }}</span>
        </button>

        <!-- Map preview (shown after address selected) -->
        <div v-show="address" class="map-preview">
            <div ref="mapContainer" class="map-container"></div>
        </div>

        <!-- Selected address preview -->
        <div v-if="address" class="address-preview">
            <MapPin :size="16" class="icon-pin" />
            <div class="address-text">{{ address }}</div>
        </div>

        <!-- Address details -->
        <div class="form-field">
            <label class="field-label">{{ $t('delivery_address_page.label_address_details') }}</label>
            <q-input
                v-model="addressDetails"
                dense outlined dark
                :placeholder="$t('delivery_address_page.placeholder_address_details')"
            />
        </div>

        <!-- Save -->
        <q-btn
            class="btn-save"
            no-caps unelevated
            :disable="!canSave"
            :loading="saving"
            @click="onSave"
        >
            {{ saving ? $t('common.button_label_saving') : $t('delivery_address_page.button_save') }}
        </q-btn>

    </div>
</template>

<style lang="scss" scoped>
.address-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

/* Search */
.search-wrap {
    position: relative;
}

.search-box {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 14px;
    background: var(--bg-surface);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    height: 48px;
}

.icon-search {
    color: var(--text-secondary);
    flex-shrink: 0;
}

.search-input {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    color: var(--text-primary);
    font-size: 14px;
    min-width: 0;

    &::placeholder {
        color: var(--text-secondary);
    }
}

.btn-clear {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0;
    flex-shrink: 0;
}

.spinner {
    flex-shrink: 0;
}

/* Dropdown */
.dropdown {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    background: #1f2940;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    overflow: hidden;
    z-index: 100;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}

.suggestion-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    width: 100%;
    padding: 12px 14px;
    background: none;
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    cursor: pointer;
    text-align: left;

    &:last-child { border-bottom: none; }
    &:hover { background: rgba(255,255,255,0.05); }
}

.icon-pin-sm {
    color: var(--color-accent);
    flex-shrink: 0;
    margin-top: 2px;
}

.suggestion-text {
    font-size: 13px;
    color: var(--text-primary);
    line-height: 1.4;
}

/* Map preview */
.map-preview {
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.1);
}

.map-container {
    width: 100%;
    height: 180px;
}

/* GPS button */
.btn-gps {
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

    &:hover:not(:disabled) { background: rgba(255,255,255,0.08); }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
}

.icon-locate { color: var(--color-accent); }

/* Selected preview */
.address-preview {
    display: flex;
    gap: 10px;
    padding: 12px 14px;
    background: var(--bg-surface);
    border: 1px solid rgba(245, 166, 35, 0.3);
    border-radius: 12px;
}

.icon-pin { color: var(--color-accent); flex-shrink: 0; margin-top: 2px; }

.address-text {
    font-size: 13px;
    color: var(--text-primary);
    line-height: 1.4;
}

/* Form */
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
</style>

<style>
.preview-pin {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #f5a623;
    border: 3px solid #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
}
</style>
