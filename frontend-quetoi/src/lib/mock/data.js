// ─────────────────────────────────────────────────────────────────────────────
// QuêTôi — MOCK dataset (Node 2: cộng đồng người Việt tại Seoul).
// Soft-launch demand test: no real backend. All flows run off this in-memory db.
// Prices in KRW (integer, zero-decimal). price_text is pre-formatted "₩12,000".
// ─────────────────────────────────────────────────────────────────────────────

const KRW = (n) => '₩' + new Intl.NumberFormat('ko-KR').format(n)

// Reused Unsplash food photos (valid URLs, generic food — fine for a mock).
const IMG = {
    pho: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
    bun: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop',
    banhmi: 'https://images.unsplash.com/photo-1600628421055-4d30de868b8f?w=400&h=400&fit=crop',
    comtam: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    goicuon: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop',
    nem: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop',
    cafe: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
    che: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
    frozen: 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=400&h=400&fit=crop',
    banner: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop',
    avatar1: 'https://i.pravatar.cc/150?img=32',
    avatar2: 'https://i.pravatar.cc/150?img=45',
    avatar3: 'https://i.pravatar.cc/150?img=12',
    avatar4: 'https://i.pravatar.cc/150?img=5',
    avatar5: 'https://i.pravatar.cc/150?img=60',
    avatar6: 'https://i.pravatar.cc/150?img=8',
}

let _fid = 0
const item = (name, description, price, image, opts = {}) => ({
    id: `food-${++_fid}`,
    name,
    description,
    price,
    price_text: KRW(price),
    image_url: image,
    preorder_day: opts.preorder_day ?? 0,
    is_available: opts.is_available ?? true,
    unit_label: opts.unit_label ?? 'phần',
    min_quantity: 1,
    quantity_step: 1,
    menu_categories: { name: opts.category || 'Món chính' },
})

// ── Sellers with full menus ─────────────────────────────────────────────────
const SELLERS = [
    {
        id: 'seller-1', slug: 'bep-ba-ngoai', store_name: 'Bếp Bà Ngoại',
        name: 'Bếp Bà Ngoại', avatar_url: IMG.avatar1, banner_url: IMG.banner,
        description: 'Phở & bún nấu kiểu nhà, đúng vị Bắc. Bếp gia đình ở Ansan.',
        rating: 4.9, review_count: 218, area: 'Ansan', status: 'active', is_founding: true,
        menus: [
            { id: 'cat-1-1', name: 'Phở & Bún', food_items: [
                item('Phở bò tái', 'Nước dùng ninh xương 12 tiếng, bánh phở tươi.', 12000, IMG.pho, { category: 'Phở & Bún' }),
                item('Phở gà', 'Gà ta xé, hành mùi, nước trong ngọt thanh.', 11000, IMG.pho, { category: 'Phở & Bún' }),
                item('Bún riêu cua', 'Riêu cua đồng, cà chua, đậu phụ.', 12000, IMG.bun, { category: 'Phở & Bún' }),
            ]},
            { id: 'cat-1-2', name: 'Khai vị', food_items: [
                item('Nem rán (6 cuốn)', 'Nem cua bể chiên giòn.', 9000, IMG.nem, { category: 'Khai vị' }),
                item('Gỏi cuốn (4 cuốn)', 'Tôm thịt, rau thơm, chấm mắm nêm.', 8000, IMG.goicuon, { category: 'Khai vị' }),
            ]},
        ],
    },
    {
        id: 'seller-2', slug: 'saigon-nho', store_name: 'Sài Gòn Nhớ',
        name: 'Sài Gòn Nhớ', avatar_url: IMG.avatar2, banner_url: IMG.banner,
        description: 'Cơm tấm, bánh mì Sài Gòn. Vị miền Nam giữa lòng Itaewon.',
        rating: 4.8, review_count: 164, area: 'Itaewon', status: 'active', is_founding: true,
        menus: [
            { id: 'cat-2-1', name: 'Cơm', food_items: [
                item('Cơm tấm sườn bì chả', 'Sườn nướng, bì, chả trứng, mỡ hành.', 13000, IMG.comtam, { category: 'Cơm' }),
                item('Cơm gà xối mỡ', 'Gà da giòn, cơm mỡ hành, dưa leo.', 12000, IMG.comtam, { category: 'Cơm' }),
            ]},
            { id: 'cat-2-2', name: 'Bánh mì', food_items: [
                item('Bánh mì thịt nguội', 'Pate, chả lụa, đồ chua, rau mùi.', 6000, IMG.banhmi, { category: 'Bánh mì' }),
                item('Bánh mì xíu mại', 'Xíu mại sốt cà, ổ bánh nóng giòn.', 6500, IMG.banhmi, { category: 'Bánh mì' }),
            ]},
        ],
    },
    {
        id: 'seller-3', slug: 'huong-viet-seoul', store_name: 'Hương Việt Seoul',
        name: 'Hương Việt Seoul', avatar_url: IMG.avatar3, banner_url: IMG.banner,
        description: 'Bún bò Huế cay nồng, đặc sản miền Trung. Nhận đặt trước.',
        rating: 4.7, review_count: 98, area: 'Dongdaemun', status: 'active', is_founding: false,
        menus: [
            { id: 'cat-3-1', name: 'Bún Huế', food_items: [
                item('Bún bò Huế', 'Giò heo, chả cua, sả ớt đậm đà.', 13000, IMG.bun, { category: 'Bún Huế' }),
                item('Bún bò đặc biệt', 'Full topping: giò, gân, chả, huyết.', 15000, IMG.bun, { category: 'Bún Huế' }),
            ]},
            { id: 'cat-3-2', name: 'Đặt trước', food_items: [
                item('Bánh bột lọc (10 cái)', 'Đặt trước 1 ngày. Gói lá chuối.', 10000, IMG.nem, { category: 'Đặt trước', preorder_day: 1 }),
            ]},
        ],
    },
    {
        id: 'seller-4', slug: 'me-nau', store_name: 'Mẹ Nấu',
        name: 'Mẹ Nấu', avatar_url: IMG.avatar4, banner_url: IMG.banner,
        description: 'Cơm nhà mỗi ngày — canh, kho, xào đổi món. Ấm bụng người xa quê.',
        rating: 4.9, review_count: 142, area: 'Guro', status: 'active', is_founding: true,
        menus: [
            { id: 'cat-4-1', name: 'Cơm phần', food_items: [
                item('Cơm sườn kho + canh', 'Sườn kho tiêu, canh rau, cơm trắng.', 11000, IMG.comtam, { category: 'Cơm phần' }),
                item('Cá kho tộ + cơm', 'Cá basa kho tộ, đậm đà đưa cơm.', 12000, IMG.comtam, { category: 'Cơm phần' }),
                item('Thịt kho trứng + cơm', 'Thịt ba chỉ kho tàu, trứng.', 11500, IMG.comtam, { category: 'Cơm phần' }),
            ]},
        ],
    },
    {
        id: 'seller-5', slug: 'ca-phe-sua', store_name: 'Cà Phê Sữa',
        name: 'Cà Phê Sữa', avatar_url: IMG.avatar5, banner_url: IMG.banner,
        description: 'Cà phê phin & chè Việt. Góc nhỏ Hongdae cho người nhớ vị nhà.',
        rating: 4.8, review_count: 205, area: 'Hongdae', status: 'active', is_founding: false,
        menus: [
            { id: 'cat-5-1', name: 'Cà phê', food_items: [
                item('Cà phê sữa đá', 'Phin truyền thống, sữa đặc.', 5000, IMG.cafe, { category: 'Cà phê' }),
                item('Bạc xỉu', 'Nhiều sữa, nhẹ cà phê.', 5500, IMG.cafe, { category: 'Cà phê' }),
            ]},
            { id: 'cat-5-2', name: 'Tráng miệng', food_items: [
                item('Chè ba màu', 'Đậu đỏ, đậu xanh, nước cốt dừa.', 7000, IMG.che, { category: 'Tráng miệng' }),
                item('Chè khúc bạch', 'Phô mai khúc bạch, hạnh nhân.', 7500, IMG.che, { category: 'Tráng miệng' }),
            ]},
        ],
    },
    {
        id: 'seller-6', slug: 'cho-que', store_name: 'Chợ Quê',
        name: 'Chợ Quê', avatar_url: IMG.avatar6, banner_url: IMG.banner,
        description: 'Đồ Việt đông lạnh & khô: bánh chưng, giò, nem chua, gia vị.',
        rating: 4.6, review_count: 76, area: 'Ansan', status: 'active', is_founding: false,
        menus: [
            { id: 'cat-6-1', name: 'Đông lạnh', food_items: [
                item('Bánh chưng (1 cái)', 'Gói tay, luộc sẵn, hút chân không.', 14000, IMG.frozen, { category: 'Đông lạnh', unit_label: 'cái' }),
                item('Giò lụa (500g)', 'Giò lụa truyền thống, gói lá.', 16000, IMG.frozen, { category: 'Đông lạnh', unit_label: 'cây' }),
                item('Nem chua (10 cái)', 'Nem chua Thanh Hóa.', 9000, IMG.frozen, { category: 'Đông lạnh' }),
            ]},
        ],
    },
]

// Flatten helpers ------------------------------------------------------------
function allFoods(seller) {
    return seller.menus.flatMap(m => m.food_items.map(f => ({ ...f, _sellerId: seller.id, _sellerSlug: seller.slug, _storeName: seller.store_name })))
}

function sellerCard(s) {
    // superset of fields used by list/card/detail components
    return {
        id: s.id, slug: s.slug, store_name: s.store_name, name: s.name,
        description: s.description, avatar_url: s.avatar_url, banner_url: s.banner_url,
        rating: s.rating, review_count: s.review_count, area: s.area,
        status: s.status, is_founding: s.is_founding,
        menu: allFoods(s),
    }
}

// Featured dishes (home) — one hero dish per seller
const FEATURED = SELLERS.slice(0, 5).map(s => {
    const f = allFoods(s)[0]
    return {
        id: f.id, name: f.name, price_text: f.price_text, image_url: f.image_url,
        seller_profiles: { id: s.id, slug: s.slug, store_name: s.store_name },
    }
})

// ── Mutable session state (cart / orders) ───────────────────────────────────
export const db = {
    KRW,
    sellers: SELLERS,
    sellerCard,
    allFoods,
    featured: FEATURED,

    user: {
        id: 'demo-user', name: 'Khách QuêTôi', email: 'demo@quetoi.store',
        phone: '010-0000-0000', avatar_url: null, is_seller: false,
        // NOTE: authStore.applyLocale maps by display LABEL (LANG_MAP), not code.
        seller_id: null, preferred_language: 'Tiếng Việt',
    },
    address: {
        address: '15 Won곡로, Ansan-si, Gyeonggi-do',
        label: 'Nhà — Ansan', lat: 37.3219, lon: 126.8309,
    },

    // in-memory cart: { sellerId, items: [{ foodId, quantity }] }
    cart: null,
    orders: [],
}

export function findSeller(slug) {
    return db.sellers.find(s => s.slug === slug) || null
}
export function findFood(foodId) {
    for (const s of db.sellers) {
        const f = allFoods(s).find(x => x.id === foodId)
        if (f) return { food: f, seller: s }
    }
    return { food: null, seller: null }
}

// Build the API-shaped cart payload from the in-memory cart
export function buildCartPayload() {
    if (!db.cart || !db.cart.items.length) return null
    const seller = db.sellers.find(s => s.id === db.cart.sellerId)
    if (!seller) return null
    const cart_items = db.cart.items.map(ci => {
        const f = allFoods(seller).find(x => x.id === ci.foodId)
        return {
            quantity: ci.quantity,
            food_items: {
                id: f.id, name: f.name, price: f.price, price_text: f.price_text,
                image_url: f.image_url, preorder_day: f.preorder_day,
                menu_categories: f.menu_categories,
            },
        }
    })
    return {
        id: 'cart-1',
        seller_profiles: { store_name: seller.store_name, slug: seller.slug },
        cart_items,
    }
}
