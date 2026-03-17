import { createApp } from 'vue'
import VueAxios from 'vue-axios'
import axios from 'axios'
import App from './App.vue'
import '@/assets/quasar/main.scss'
import './assets/main.css'

const app = createApp(App)
app.use(VueAxios, axios);

window.$http = window.axios = axios;

const plugins = import.meta.glob('./plugins/*.js', { eager: true });
for (const path in plugins) {
    const plugin = plugins[path];
    plugin.default(app);
}

app.mount('#app')

// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js', { scope: '/' })
            .then((registration) => {
                console.log('SW registered:', registration)
            })
            .catch((error) => {
                console.log('SW registration failed:', error)
            })
    })
}
