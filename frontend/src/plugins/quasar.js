import { Quasar, Loading, Notify, Dialog } from 'quasar'
import iconSet from 'quasar/icon-set/fontawesome-v6'

export default function useQuasarPlugin(app) {
    console.log("Loaded Quasar plugin")
    app.use(Quasar, {
        plugins: { Loading, Notify, Dialog }, // Quasar plugins
        iconSet: iconSet,
        config: {
            brand: {
                // primary: '#027BE3',
                // secondary: '#26A69A',
                // accent: '#9C27B0',
            }
        }
    })
}