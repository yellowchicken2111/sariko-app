<script>
import { CircleCheckBig, CircleX, Loader } from 'lucide-vue-next';
import apiPayments from '@/apis/payments/apiPayments';

export default {
    components: {
        CircleCheckBig, CircleX, Loader
    },

    data() {
        return {
            loading: true,
            success: false,
            responseCode: '',
            txnRef: '',
        }
    },

    async mounted() {
        try {
            const params = new URLSearchParams(window.location.search)
            const vnpParams = new URLSearchParams()
            for (const [key, value] of params) {
                if (key.startsWith('vnp_')) vnpParams.append(key, value)
            }
            const queryString = vnpParams.toString()
            const res = await apiPayments.checkVnpayReturn(queryString)
            if (res?.data) {
                this.success = res.data.success
                this.responseCode = res.data.response_code
                this.txnRef = res.data.txn_ref
            }
        } catch (e) {
            console.error('Payment return error:', e)
            this.success = false
        } finally {
            this.loading = false
        }
    }
}
</script>

<template>
    <div class="payment-result">
        <div v-if="loading" class="state-container">
            <Loader :size="48" class="spinner" />
            <div class="title">Verifying payment...</div>
        </div>

        <div v-else-if="success" class="state-container">
            <CircleCheckBig :size="64" color="#10b981" />
            <div class="title">Payment Successful!</div>
            <div class="subtext">Your payment has been confirmed. Thank you!</div>
            <q-btn class="btn-primary" dense no-caps @click="$router.push('/orders')">
                View My Orders
            </q-btn>
            <q-btn class="btn-secondary" flat dense no-caps @click="$router.push('/home')">
                Back to Home
            </q-btn>
        </div>

        <div v-else class="state-container">
            <CircleX :size="64" color="#ef4444" />
            <div class="title">Payment Failed</div>
            <div class="subtext">
                Something went wrong with your payment. Please try again or use a different payment method.
            </div>
            <div class="error-code">Error code: {{ responseCode }}</div>
            <q-btn class="btn-primary" dense no-caps @click="$router.push('/orders')">
                View My Orders
            </q-btn>
            <q-btn class="btn-secondary" flat dense no-caps @click="$router.push('/home')">
                Back to Home
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
