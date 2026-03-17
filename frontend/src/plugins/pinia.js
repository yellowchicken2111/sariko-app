import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'

const pinia = createPinia();
pinia.use(piniaPersist)
export default function useStorePlugin(app) {
    app.use(pinia)
    console.log("Loaded Pinia plugin")
}