<script>
import { CircleCheckBig, CircleX, Loader } from 'lucide-vue-next';
import apiPayments from '@/apis/payments/apiPayments';
import { supabase } from '@/lib/supabase';

const POLL_INTERVAL = 3000;
const POLL_TIMEOUT = 60000;

export default {
    components: {
        CircleCheckBig, CircleX, Loader
    },

    data() {
        return {
            // 'verifying' | 'polling' | 'success' | 'failed'
            state: 'verifying',
            responseCode: '',
            orderId: '',
            pollTimer: null,
            pollStartTime: null,
        }
    },

    methods: {
        startPolling() {
            this.pollTimer = setInterval(async () => {
                try {
                    // Timeout after 60s
                    if (Date.now() - this.pollStartTime > POLL_TIMEOUT) {
                        this.stopPolling()
                        this.state = 'failed'
                        return
                    }

                    const res = await apiPayments.pollPaymentStatus(this.orderId)
                    const status = res?.data?.payment_status

                    if (status === 'paid') {
                        this.stopPolling()
                        this.state = 'success'
                    } else if (status === 'failed') {
                        this.stopPolling()
                        this.state = 'failed'
                    }
                    // status === 'pending' → keep polling
                } catch (e) {
                    console.error('Payment poll error:', e)
                    // Don't stop polling on network error, keep trying
                }
            }, POLL_INTERVAL)
        },

        stopPolling() {
            if (this.pollTimer) {
                clearInterval(this.pollTimer)
                this.pollTimer = null
            }
        },

        listenPaymentStatus() {
            this.channel = supabase
            .channel(`payment-${this.orderId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders',
                    filter: `id=eq.${this.orderId}`
                },
                (payload) => {
                    console.log({payload})
                    if (payload.new.payment_status === 'paid') {
                        this.state = 'success'
                        this.cleanup()
                    } else if (payload.new.payment_status === 'failed') {
                        this.state = 'failed'
                        this.cleanup()
                    }
                }
            )
            .subscribe((status) => {
                console.log('Subscribe status:', status)
            })
        },

        cleanup() {
            if (this.channel) supabase.removeChannel(this.channel)
            if (this.timeoutId) clearTimeout(this.timeoutId)
        },
    },

    async created() {
        try {
            const params = new URLSearchParams(window.location.search)
            const vnpParams = new URLSearchParams()

            const responseCode = params.get('vnp_ResponseCode')
            const txnRef = params.get('vnp_TxnRef')

            const orderIdNoDash = txnRef ? txnRef.split('_')[0] : ''
            this.orderId = orderIdNoDash.length === 32
                ? `${orderIdNoDash.slice(0,8)}-${orderIdNoDash.slice(8,12)}-${orderIdNoDash.slice(12,16)}-${orderIdNoDash.slice(16,20)}-${orderIdNoDash.slice(20)}`
                : ''

            this.listenPaymentStatus()
            this.state = 'polling'

            for (const [key, value] of params) {
                    if (key.startsWith('vnp_')) vnpParams.append(key, value)
            }
            const queryString = vnpParams.toString()
            const res = await apiPayments.checkVnpayReturn(queryString)

            if (!res?.data) {
                this.state = 'failed'
                return
            }

            this.responseCode = res.data.response_code
            if (!res.data.success) {
                this.state = 'failed'
                return
            }

            this.timeoutId = setTimeout(() => {
                this.state = 'failed'
                this.cleanup()
            }, 30000)

        } catch (e) {
            console.error('Payment return error:', e)
            this.state = 'failed'
        }
    },

    async mounted() {
    },

    beforeUnmount() {
        // this.stopPolling()
        this.cleanup()
    },
}
</script>

<template>
    <div class="payment-result">
        <!-- Verifying hash -->
        <div v-if="state === 'verifying'" class="state-container">
            <Loader :size="48" class="spinner" />
            <div class="title">{{ $t('payment.verifying') }}</div>
        </div>

        <!-- Polling DB for IPN confirmation -->
        <div v-else-if="state === 'polling'" class="state-container">
            <Loader :size="48" class="spinner" />
            <div class="title">{{ $t('payment.confirming') }}</div>
            <div class="subtext">{{ $t('payment.doNotClose') }}</div>
        </div>

        <!-- Payment confirmed -->
        <div v-else-if="state === 'success'" class="state-container">
            <CircleCheckBig :size="64" color="#10b981" />
            <div class="title">{{ $t('payment.success') }}</div>
            <div class="subtext">{{ $t('payment.successMessage') }}</div>
            <q-btn class="btn-primary" dense no-caps @click="$router.push('/orders')">
                {{ $t('payment.viewOrders') }}
            </q-btn>
            <q-btn class="btn-secondary" flat dense no-caps @click="$router.push('/home')">
                {{ $t('payment.backHome') }}
            </q-btn>
        </div>

        <!-- Payment failed -->
        <div v-else class="state-container">
            <CircleX :size="64" color="#ef4444" />
            <div class="title">{{ $t('payment.failed') }}</div>
            <div class="subtext">{{ $t('payment.failedMessage') }}</div>
            <div v-if="responseCode && responseCode !== '00'" class="error-code">
                Error code: {{ responseCode }}
            </div>
            <q-btn class="btn-primary" dense no-caps @click="$router.push('/orders')">
                {{ $t('payment.viewOrders') }}
            </q-btn>
            <q-btn class="btn-secondary" flat dense no-caps @click="$router.push('/home')">
                {{ $t('payment.backHome') }}
            </q-btn>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.payment-result {
    width: 100%;
}

.state-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 12px;
}

.spinner {
    color: $accent;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.title {
    font-family: $sariko-font-family-primary;
    font-size: 22px;
    font-weight: 700;
    margin-top: 8px;
}

.subtext {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
    line-height: 1.5;
    max-width: 300px;
}

.error-code {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.3);
    margin-bottom: 8px;
}

.btn-primary {
    width: 100%;
    max-width: 280px;
    background-color: $accent;
    color: var(--bg-main);
    padding: 14px 0;
    border-radius: 2rem;
    font-weight: 600;
    font-size: 16px;
    margin-top: 12px;
}

.btn-secondary {
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
}
</style>
