import { defineStore } from "pinia";
import { supabase } from "@/lib/supabase";
import apiDeliveries from "@/apis/deliveries/apiDeliveries";

export const useDeliveryStore = defineStore("deliveryStore", {
    state() {
        return {
            quotation: null,         // { quotation_id, total_fee, currency, distance_km }
            currentDelivery: null,   // { status, driver_name, driver_phone, driver_plate, tracking_url, share_link }
            quotationLoading: false,
            _channel: null,
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
        async getQuotation(sellerId, deliveryLat, deliveryLon, deliveryAddress) {
            this.quotationLoading = true
            this.quotation = null
            try {
                const res = await apiDeliveries.getQuotation(sellerId, deliveryLat, deliveryLon, deliveryAddress)
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

        // Load initial delivery state from backend, then subscribe to realtime
        async startWatching(orderId) {
            this.stopWatching()

            // Initial fetch from DB
            try {
                const res = await apiDeliveries.getDeliveryStatus(orderId)
                if (res?.success && res.delivery) {
                    this.currentDelivery = res.delivery
                }
            } catch (e) {
                console.error('deliveryStore - startWatching initial fetch -', e)
            }
            // Supabase realtime: listen for changes on deliveries table for this order
            const channelName = `delivery-${orderId}-${Math.random().toString(36).slice(2, 8)}`
            this._channel = supabase
                .channel(channelName)
                .on('postgres_changes', {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'deliveries',
                    filter: `order_id=eq.${orderId}`,
                }, (payload) => {
                    const d = payload.new
                    this.currentDelivery = {
                        status:       d.status,
                        driver_name:  d.driver_name,
                        driver_phone: d.driver_phone,
                        driver_plate: d.driver_plate,
                        tracking_url: d.tracking_url,
                        share_link:   d.share_link,
                    }
                })
                .subscribe((status, err) => {
                    console.log('Delivery realtime subscribe status:', status)
                    if (err) console.error('Delivery realtime error:', err)
                })
        },

        stopWatching() {
            if (this._channel) {
                supabase.removeChannel(this._channel)
                this._channel = null
            }
        },

        reset() {
            this.stopWatching()
            this.quotation = null
            this.currentDelivery = null
            this.quotationLoading = false
        },
    }
})
