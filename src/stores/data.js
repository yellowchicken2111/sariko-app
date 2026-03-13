// Mock data for the application
export const categories = [
  { id: 1, name: 'Filipino Meals', icon: '🍛' },
  { id: 2, name: 'Desserts', icon: '🍰' },
  { id: 3, name: 'Snacks', icon: '🥟' },
  { id: 4, name: 'Drinks', icon: '🥤' },
  { id: 5, name: 'Homemade Goods', icon: '🫙' }
]

export const sellers = [
  {
    id: 1,
    name: "Nanay Luz's Kitchen",
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
    banner: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop',
    rating: 4.8,
    reviewCount: 156,
    distance: '1.2 km',
    deliveryTime: '25-35 min',
    description: 'Authentic Filipino home cooking made with love. Specializing in traditional recipes passed down through generations.',
    category: 'Filipino Meals',
    previewImages: [
      'https://images.unsplash.com/photo-1569058242567-93de6f36f8eb?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=200&h=200&fit=crop'
    ],
    menu: [
      {
        id: 101,
        name: 'Chicken Adobo',
        description: 'Classic Filipino braised chicken in soy sauce and vinegar with garlic',
        price: 150,
        image: 'https://images.unsplash.com/photo-1569058242567-93de6f36f8eb?w=400&h=400&fit=crop'
      },
      {
        id: 102,
        name: 'Sinigang na Baboy',
        description: 'Sour pork soup with vegetables and tamarind broth',
        price: 180,
        image: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=400&h=400&fit=crop'
      },
      {
        id: 103,
        name: 'Kare-Kare',
        description: 'Oxtail stew in rich peanut sauce with vegetables',
        price: 250,
        image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=400&fit=crop'
      },
      {
        id: 104,
        name: 'Lechon Kawali',
        description: 'Crispy deep-fried pork belly served with liver sauce',
        price: 200,
        image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=400&fit=crop'
      }
    ]
  },
  {
    id: 2,
    name: "Ate Mila's Sweets",
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    banner: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=400&fit=crop',
    rating: 4.9,
    reviewCount: 89,
    distance: '0.8 km',
    deliveryTime: '20-30 min',
    description: 'Handcrafted Filipino desserts and kakanin. All made fresh daily with premium local ingredients.',
    category: 'Desserts',
    previewImages: [
      'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=200&h=200&fit=crop'
    ],
    menu: [
      {
        id: 201,
        name: 'Leche Flan',
        description: 'Creamy caramel custard made with fresh eggs and condensed milk',
        price: 120,
        image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=400&fit=crop'
      },
      {
        id: 202,
        name: 'Ube Halaya',
        description: 'Sweet purple yam jam, perfect as dessert or spread',
        price: 150,
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop'
      },
      {
        id: 203,
        name: 'Bibingka',
        description: 'Soft rice cake topped with salted egg and cheese',
        price: 80,
        image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&h=400&fit=crop'
      },
      {
        id: 204,
        name: 'Halo-Halo',
        description: 'Shaved ice with mixed fruits, beans, and leche flan',
        price: 100,
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop'
      }
    ]
  },
  {
    id: 3,
    name: "Kuya Boy's Meryenda",
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    banner: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=400&fit=crop',
    rating: 4.7,
    reviewCount: 203,
    distance: '2.1 km',
    deliveryTime: '30-40 min',
    description: 'Your go-to spot for Filipino street food and afternoon snacks. Authentic flavors from the streets!',
    category: 'Snacks',
    previewImages: [
      'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200&h=200&fit=crop'
    ],
    menu: [
      {
        id: 301,
        name: 'Lumpiang Shanghai',
        description: 'Crispy fried spring rolls with pork filling (12 pcs)',
        price: 120,
        image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=400&fit=crop'
      },
      {
        id: 302,
        name: 'Turon',
        description: 'Fried banana rolls with jackfruit and caramelized sugar (6 pcs)',
        price: 60,
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop'
      },
      {
        id: 303,
        name: 'Fishball with Sauce',
        description: 'Classic street-style fishballs with sweet and spicy sauce',
        price: 40,
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop'
      },
      {
        id: 304,
        name: 'Kwek-Kwek',
        description: 'Deep-fried orange battered quail eggs (10 pcs)',
        price: 50,
        image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&h=400&fit=crop'
      }
    ]
  },
  {
    id: 4,
    name: "Tita Rose Refreshments",
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    banner: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&h=400&fit=crop',
    rating: 4.6,
    reviewCount: 78,
    distance: '1.5 km',
    deliveryTime: '15-25 min',
    description: 'Fresh homemade Filipino beverages and refreshments. Beat the heat with our traditional drinks!',
    category: 'Drinks',
    previewImages: [
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=200&h=200&fit=crop'
    ],
    menu: [
      {
        id: 401,
        name: 'Sago\'t Gulaman',
        description: 'Sweet tapioca pearls and gelatin in brown sugar syrup',
        price: 45,
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=400&fit=crop'
      },
      {
        id: 402,
        name: 'Buko Juice',
        description: 'Fresh coconut water with tender coconut meat',
        price: 50,
        image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&h=400&fit=crop'
      },
      {
        id: 403,
        name: 'Calamansi Juice',
        description: 'Refreshing Philippine lime juice with honey',
        price: 40,
        image: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=400&h=400&fit=crop'
      },
      {
        id: 404,
        name: 'Taho',
        description: 'Soft silken tofu with arnibal and sago pearls',
        price: 35,
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop'
      }
    ]
  },
  {
    id: 5,
    name: "Lola Ising's Preserves",
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    banner: 'https://images.unsplash.com/photo-1464454709131-ffd692591ee5?w=800&h=400&fit=crop',
    rating: 4.9,
    reviewCount: 45,
    distance: '3.0 km',
    deliveryTime: '35-45 min',
    description: 'Traditional Filipino preserves, pickles, and homemade goods. Made with recipes from three generations!',
    category: 'Homemade Goods',
    previewImages: [
      'https://images.unsplash.com/photo-1597227029238-775589e8c66c?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1589135233689-1c3ae43e3e14?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=200&h=200&fit=crop'
    ],
    menu: [
      {
        id: 501,
        name: 'Bagoong (Shrimp Paste)',
        description: 'Homemade fermented shrimp paste, perfect with green mangoes',
        price: 180,
        image: 'https://images.unsplash.com/photo-1597227029238-775589e8c66c?w=400&h=400&fit=crop'
      },
      {
        id: 502,
        name: 'Atchara',
        description: 'Sweet pickled papaya relish in traditional recipe',
        price: 120,
        image: 'https://images.unsplash.com/photo-1589135233689-1c3ae43e3e14?w=400&h=400&fit=crop'
      },
      {
        id: 503,
        name: 'Homemade Longganisa',
        description: 'Sweet Filipino sausage, vacuum packed (500g)',
        price: 250,
        image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400&h=400&fit=crop'
      },
      {
        id: 504,
        name: 'Peanut Butter',
        description: 'Fresh ground peanut butter, no preservatives',
        price: 150,
        image: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400&h=400&fit=crop'
      }
    ]
  }
]

export const orders = [
  {
    id: 1001,
    sellerId: 1,
    sellerName: "Nanay Luz's Kitchen",
    items: [
      { name: 'Chicken Adobo', quantity: 2, price: 150 },
      { name: 'Sinigang na Baboy', quantity: 1, price: 180 }
    ],
    total: 529,
    status: 'Delivered',
    time: '2 days ago'
  },
  {
    id: 1002,
    sellerId: 2,
    sellerName: "Ate Mila's Sweets",
    items: [
      { name: 'Leche Flan', quantity: 2, price: 120 },
      { name: 'Ube Halaya', quantity: 1, price: 150 }
    ],
    total: 439,
    status: 'Delivered',
    time: '5 days ago'
  },
  {
    id: 1003,
    sellerId: 3,
    sellerName: "Kuya Boy's Meryenda",
    items: [
      { name: 'Lumpiang Shanghai', quantity: 3, price: 120 }
    ],
    total: 409,
    status: 'Preparing',
    time: '10 mins ago'
  }
]

export const dashboardData = {
  totalOrders: 156,
  revenue: 28450,
  pendingOrders: 8,
  recentOrders: [
    {
      id: 2001,
      customerName: 'Juan Dela Cruz',
      items: ['Chicken Adobo x2', 'Rice x2'],
      status: 'Pending',
      time: '5 mins ago'
    },
    {
      id: 2002,
      customerName: 'Maria Santos',
      items: ['Sinigang na Baboy', 'Kare-Kare'],
      status: 'Preparing',
      time: '15 mins ago'
    },
    {
      id: 2003,
      customerName: 'Pedro Reyes',
      items: ['Lechon Kawali x3'],
      status: 'Ready',
      time: '25 mins ago'
    },
    {
      id: 2004,
      customerName: 'Ana Garcia',
      items: ['Chicken Adobo', 'Sinigang na Baboy'],
      status: 'Delivered',
      time: '1 hour ago'
    }
  ]
}
