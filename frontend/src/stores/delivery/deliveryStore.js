import { defineStore } from "pinia";
import apiDeliveries from "@/apis/deliveries/apiDeliveries";

export const useDeliveryStore = defineStore("deliveryStore", {
    state() {
        return {
            quotation: null,         // { quotation_id, total_fee, currency, distance_km }
            currentDelivery: null,   // { status, driver_name, driver_phone, driver_plate, tracking_url, share_link }
            quotationLoading: false,
            _pollingTimer: null,
        }
    },

    getters: {
        deliveryFee(state) {
            return state.quotation?.total_fee || 0
        },
        deliveryFeeText(state) {
            if (!state.quotation) return '--'
            return new Intl.NumberFormat('vi-VN').format(state.quotation.total_fee) + ' ₫'
        },
        isDeliveryActive(state) {
            const s = state.currentDelivery?.status
            return s && s !== 'COMPLETED' && s !== 'CANCELLED'
        },
    },

    actions: {
        async getQuotation(sellerId, deliveryLat, deliveryLon) {
            this.quotationLoading = true
            this.quotation = null
            try {
                const res = await apiDeliveries.getQuotation(sellerId, deliveryLat, deliveryLon)
                if (res?.success) {
                    this.quotation = {
                        quotation_id: res.quotation_id,
                        total_fee: res.total_fee,
                        currency: res.currency,
                        distance_km: res.distance_km,
                    }
                }
            } catch (e) {
                console.error('deliveryStore - getQuotation -', e)
            } finally {
                this.quotationLoading = false
            }
        },

        async pollOnce(orderId) {
            try {
                const res = await apiDeliveries.getDeliveryStatus(orderId)
                if (res?.success && res.delivery) {
                    this.currentDelivery = res.delivery

                    // Stop polling when terminal status
                    if (res.delivery.status === 'COMPLETED' || res.delivery.status === 'CANCELLED') {
                        this.stopPolling()
                    }
                }
            } catch (e) {
                console.error('deliveryStore - pollOnce -', e)
            }
        },

        startPolling(orderId) {
            this.stopPolling()
            // Initial poll immediately
            this.pollOnce(orderId)
            // Then every 15 seconds
            this._pollingTimer = setInterval(() => {
                this.pollOnce(orderId)
            }, 15000)
        },

        stopPolling() {
            if (this._pollingTimer) {
                clearInterval(this._pollingTimer)
                this._pollingTimer = null
            }
        },

        reset() {
            this.stopPolling()
            this.quotation = null
            this.currentDelivery = null
            this.quotationLoading = false
        },
    }
})
