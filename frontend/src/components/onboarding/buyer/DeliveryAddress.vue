<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, LocateFixed } from 'lucide-vue-next';
import { mapWritableState } from 'pinia';
import { useAuthStore } from '@/stores/auth/authStore';

export default {
    components: {
        MapPin,
        LocateFixed
    },

    data() {
        return {
            map: null,
            marker: null,
            isLocating: false
        }
    },

    computed: {
        ...mapWritableState(useAuthStore, [
            "inputAddress",
            "inputAddressDetails",
            "inputLat",
            "inputLon"
        ])
    },

    mounted() {
        this.$nextTick(() => {
            this.initMap();
        });
    },

    beforeUnmount() {
        if (this.map) {
            this.map.remove();
            this.map = null;
        }
    },

    methods: {
        initMap() {
            const defaultLat = this.inputLat || 10.7769;
            const defaultLon = this.inputLon || 106.7009;

            this.map = L.map(this.$refs.mapContainer, {
                center: [defaultLat, defaultLon],
                zoom: 14,
                zoomControl: false,
                attributionControl: false
            });

            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                maxZoom: 19,
                subdomains: 'abcd'
            }).addTo(this.map);

            // Custom marker icon
            const markerIcon = L.divIcon({
                className: 'custom-marker',
                html: `<div class="marker-pin"></div>`,
                iconSize: [30, 42],
                iconAnchor: [15, 42]
            });

            this.marker = L.marker([defaultLat, defaultLon], {
                draggable: true,
                icon: markerIcon
            }).addTo(this.map);

            this.marker.on('dragend', () => {
                const pos = this.marker.getLatLng();
                this.inputLat = pos.lat;
                this.inputLon = pos.lng;
                this.reverseGeocode(pos.lat, pos.lng);
            });
        },

        async reverseGeocode(lat, lon) {
            try {
                const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`;
                const res = await fetch(url);
                const data = await res.json();
                if (data?.display_name) {
                    this.inputAddress = data.display_name;
                }
            } catch (e) {
                console.error('Reverse geocode failed:', e);
            }
        },

        async useCurrentLocation() {
            if (!navigator.geolocation) {
                console.error('Geolocation not supported');
                return;
            }

            this.isLocating = true;

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    this.inputLat = lat;
                    this.inputLon = lon;

                    if (this.map && this.marker) {
                        this.map.setView([lat, lon], 16);
                        this.marker.setLatLng([lat, lon]);
                    }

                    await this.reverseGeocode(lat, lon);
                    this.isLocating = false;
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    this.isLocating = false;
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        }
    }
}
</script>

<template>

    <div class="container-phone-number">
        <div class="title-group">
            <div class="title">
                <MapPin class="icon-map-pin"/> {{ $t('onboarding_page.buyer.section_delivery_address.title') }}
            </div>
            <div class="optional">
                Optional
            </div>
        </div>

        <div class="section-map">
            <div ref="mapContainer" class="map-container"></div>

            <button
                class="btn-use-location"
                :disabled="isLocating"
                @click="useCurrentLocation"
            >
                <q-spinner-dots v-if="isLocating" color="accent" size="18px" />
                <LocateFixed v-else class="icon-locate" :size="18" />
                <span>{{ isLocating ? 'Getting location...' : 'Use current location' }}</span>
            </button>
        </div>

        <div v-if="inputAddress" class="section-address-preview">
            <div class="address-text">{{ inputAddress }}</div>
        </div>

        <div class="section-address-details">
            <div class="input-container">
                <q-input
                class="input"
                dense
                outlined
                type="text"
                color="white"
                :placeholder="$t('onboarding_page.buyer.section_delivery_address.text_placeholder_address_details')"
                bg-color="bgInputField"
                v-model="inputAddressDetails"
                />
            </div>
        </div>
    </div>

</template>

<style lang="scss" scoped>

.title-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.title {
    display: flex;
}

.optional {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    font-size: 12px;
    color: var(--text-muted);
    padding: 0px 15px;
}

.icon-map-pin {
    margin-right: 5px;
}

.section-map {
    margin-bottom: 12px;
}

.map-container {
    width: 100%;
    height: 200px;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-use-location {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    margin-top: 10px;
    padding: 10px 16px;
    background-color: var(--bg-surface);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    color: #ffffff;
    font-size: 14px;
    font-family: var(--sariko-font-family-secondary, inherit);
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover:not(:disabled) {
        background-color: rgba(255, 255, 255, 0.08);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
}

.icon-locate {
    color: var(--accent, #ff9f43);
    flex-shrink: 0;
}

.section-address-preview {
    margin-bottom: 12px;
    padding: 10px 14px;
    background-color: var(--bg-surface);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
}

.address-text {
    font-size: 13px;
    color: var(--text-muted);
    line-height: 1.4;
    word-break: break-word;
}

:deep(.q-field__native::placeholder) {
    color: var(--text-muted);
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
