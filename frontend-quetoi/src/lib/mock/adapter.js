// Axios adapter that serves the mock `db` instead of hitting a backend.
// Installed onto apiClient only when mock mode is on (see index.js).
import { db, findSeller, findFood, buildCartPayload } from './data.js'

const ok = (config, data, status = 200) => ({
    data, status, statusText: 'OK', headers: {}, config, request: {},
})

const parseBody = (config) => {
    if (!config.data) return {}
    try { return typeof config.data === 'string' ? JSON.parse(config.data) : config.data }
    catch { return {} }
}

// Route table: [method, RegExp, handler(match, config)]
const routes = [
    // ── Users ──
    ['get', /\/v1\/users\/info\/me$/, () => ({ user: db.user })],
    ['get', /\/v1\/users\/me\/address$/, () => ({ address: db.address })],
    ['patch', /\/v1\/users\/me\/profile$/, (m, c) => { Object.assign(db.user, parseBody(c)); return { success: true, user: db.user } }],

    // ── Sellers (buyer-facing) ──
    ['get', /\/v1\/sellers\/founding$/, () => ({ founding_sellers: db.sellers.filter(s => s.is_founding).map(db.sellerCard) })],
    ['get', /\/v1\/sellers\/featured-dishes$/, () => ({ success: true, featured_dishes: db.featured })],
    ['get', /\/v1\/sellers\/([^/]+)\/menu$/, (m) => {
        const s = findSeller(m[1])
        return { menus: s ? s.menus : [] }
    }],
    ['get', /\/v1\/sellers\/([^/]+)$/, (m) => {
        const s = findSeller(m[1])
        return { seller: s ? db.sellerCard(s) : null }
    }],

    // ── Cart ──
    ['get', /\/v1\/cart$/, () => ({ success: true, cart: buildCartPayload() })],
    ['post', /\/v1\/cart\/add$/, (m, c) => {
        const b = parseBody(c)
        if (db.cart && db.cart.sellerId && db.cart.sellerId !== b.seller_id) {
            const cur = db.sellers.find(s => s.id === db.cart.sellerId)
            const err = new Error('conflict')
            err._status = 409
            err._data = { detail: { message: 'Cart contains items from another seller', current_seller_name: cur?.store_name } }
            throw err
        }
        if (!db.cart) db.cart = { sellerId: b.seller_id, items: [] }
        const existing = db.cart.items.find(i => i.foodId === b.food_item_id)
        if (existing) existing.quantity += (b.quantity || 1)
        else db.cart.items.push({ foodId: b.food_item_id, quantity: b.quantity || 1 })
        return { success: true }
    }],
    ['patch', /\/v1\/cart\/update$/, (m, c) => {
        const b = parseBody(c)
        const it = db.cart?.items.find(i => i.foodId === b.food_item_id)
        if (it) it.quantity = b.quantity
        return { success: true }
    }],
    ['delete', /\/v1\/cart\/remove\/([^/]+)$/, (m) => {
        if (db.cart) db.cart.items = db.cart.items.filter(i => i.foodId !== m[1])
        if (db.cart && !db.cart.items.length) db.cart = null
        return { success: true }
    }],
    ['delete', /\/v1\/cart\/clear$/, () => { db.cart = null; return { success: true } }],

    // ── Orders ──
    ['get', /\/v1\/orders$/, () => ({ success: true, orders: db.orders })],
    ['post', /\/v1\/orders$/, (m, c) => {
        const b = parseBody(c)
        const cart = buildCartPayload()
        const seller = db.sellers.find(s => s.id === db.cart?.sellerId)
        const items = (cart?.cart_items || []).map(ci => ({
            name_snapshot: ci.food_items.name,
            price_snapshot: ci.food_items.price,
            quantity: ci.quantity,
            image_url: ci.food_items.image_url,
        }))
        const subtotal = items.reduce((s, i) => s + i.price_snapshot * i.quantity, 0)
        const fee = b.delivery_fee ?? 3000
        const order = {
            id: `order-${db.orders.length + 1}`,
            status: 'pending',
            payment_status: 'pending',
            payment_method: 'kakaopay',
            delivery_method: b.delivery_method || 'delivery',
            delivery_address: b.delivery_address || db.address.address,
            delivery_fee: fee,
            total_amount: subtotal + fee,
            note: b.note || '',
            created_at: new Date().toISOString(),
            order_items: items,
            seller_profiles: { store_name: seller?.store_name, slug: seller?.slug },
            users: { name: db.user.name, phone: db.user.phone },
        }
        db.orders.unshift(order)
        db.cart = null   // order snapshot clears cart (mirrors real flow)
        return { success: true, order }
    }],
    ['get', /\/v1\/orders\/([^/]+)$/, (m) => ({ success: true, order: db.orders.find(o => o.id === m[1]) || null })],
    ['patch', /\/v1\/orders\/([^/]+)\/cancel$/, (m) => {
        const o = db.orders.find(x => x.id === m[1])
        if (o) o.status = 'cancelled'
        return { success: true }
    }],

    // ── Search ──
    ['get', /\/v1\/search$/, (m, c) => {
        const q = (c.params?.q || '').toLowerCase().trim()
        const foods = db.sellers.flatMap(db.allFoods)
            .filter(f => f.name.toLowerCase().includes(q))
            .map(f => ({ id: f.id, name: f.name, price_text: f.price_text, image_url: f.image_url, preorder_day: f.preorder_day, seller_slug_name: f._sellerSlug, store_name: f._storeName }))
        return { foods, categories: [] }
    }],

    // ── Chat (list only; realtime messages degrade to empty in mock) ──
    ['get', /\/v1\/chat\/conversations$/, () => ({ conversations: [] })],
    ['post', /\/v1\/chat\/conversations$/, () => ({ conversation: { id: 'conv-1' } })],
    ['patch', /\/v1\/chat\/conversations\/[^/]+\/(read|pin)$/, () => ({ success: true })],
    ['delete', /\/v1\/chat\/conversations\/[^/]+$/, () => ({ success: true })],

    // ── Deliveries ──
    ['post', /\/v1\/deliveries\/quotation$/, () => ({ success: true, quotation_id: 'quote-1', delivery_fee: 3000, fee_text: db.KRW(3000), eta_text: '30–40 phút' })],
    ['get', /\/v1\/deliveries\/[^/]+\/status$/, () => ({ success: true, status: 'ASSIGNING', driver: null })],
    ['get', /\/v1\/deliveries\/[^/]+\/seller-status$/, () => ({ success: true, status: 'ASSIGNING' })],
    ['post', /\/v1\/deliveries\/[^/]+\/rebook$/, () => ({ success: true })],
    ['delete', /\/v1\/deliveries\/[^/]+\/cancel$/, () => ({ success: true })],

    // ── Payments (demand-test: no real gateway) ──
    ['post', /\/v1\/payments\/[^/]+\/create\/([^/]+)$/, () => ({ success: true, payment_url: null, mock: true })],
    ['get', /\/v1\/payments\/payment-status\/([^/]+)$/, () => ({ success: true, payment_status: 'pending' })],

    // ── Seller dashboard (secondary; return empty-but-valid shapes) ──
    ['get', /\/v1\/sellers\/me$/, () => ({ seller: db.sellerCard(db.sellers[0]) })],
    ['get', /\/v1\/sellers\/me\/orders$/, () => ({ success: true, orders: [] })],
    ['get', /\/v1\/sellers\/me\/menu$/, () => ({ menus: db.sellers[0].menus })],
]

export function mockAdapter(config) {
    const method = (config.method || 'get').toLowerCase()
    const url = config.url || ''
    const route = routes.find(([mth, re]) => mth === method && re.test(url))

    return new Promise((resolve, reject) => {
        // small latency so skeletons/spinners actually show
        setTimeout(() => {
            if (!route) {
                if (import.meta.env.DEV) console.warn(`[MOCK] unhandled ${method.toUpperCase()} ${url}`)
                return resolve(ok(config, { success: true }, 200))
            }
            try {
                const match = url.match(route[1])
                const data = route[2](match, config)
                resolve(ok(config, data))
            } catch (e) {
                const status = e._status || 500
                const err = new Error(e.message || 'mock error')
                err.response = { status, data: e._data || { detail: e.message }, config, headers: {} }
                err.config = config
                reject(err)
            }
        }, 180)
    })
}
