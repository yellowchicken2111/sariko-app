// Mock data for the application
export const categories = [
    { id: 1, name: 'Meat', icon: '🍖' },
    { id: 2, name: 'Fast Food', icon: '🍔' },
    { id: 3, name: 'Sushi', icon: '🍣' },
    { id: 4, name: 'Drinks', icon: '🥤' },
    { id: 5, name: 'Desserts', icon: '🍰' }
]

export const promotions = [
    {
        id: 1,
        title: 'New Year Offer',
        discount: '30% OFF',
        period: '16 - 31 Dec',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop'
    }
]

export const sellers = [
    {
        id: 1,
        name: "Pizza Italiano",
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
        banner: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop',
        rating: 4.8,
        reviewCount: 2300,
        distance: '1.2 km',
        deliveryTime: '20 min',
        description: 'Authentic Italian pizzas made with love. Fresh ingredients and traditional recipes.',
        category: 'Fast Food',
        previewImages: [
            'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop',
            'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&h=200&fit=crop',
            'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop'
        ],
        menu: [
            {
                id: 101,
                name: 'Melting Cheese Pizza',
                description: 'Classic pizza with melted mozzarella cheese, fresh tomato sauce and basil',
                price: 599,
                image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop',
                calories: 44,
                sizes: [
                    { name: 'S - Small', price: 449 },
                    { name: 'M - Medium', price: 599 },
                    { name: 'L - Large', price: 799 }
                ],
                addons: [
                    { id: 'chicken', name: 'Chicken', weight: '250 gm', price: 240 },
                    { id: 'mushroom', name: 'Mushroom', price: 80 }
                ]
            },
            {
                id: 102,
                name: 'Pepperoni Pizza',
                description: 'Loaded with spicy pepperoni and extra cheese',
                price: 649,
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
                calories: 52,
                sizes: [
                    { name: 'S - Small', price: 499 },
                    { name: 'M - Medium', price: 649 },
                    { name: 'L - Large', price: 849 }
                ],
                addons: [
                    { id: 'extra_cheese', name: 'Extra Cheese', price: 100 },
                    { id: 'jalapeno', name: 'Jalapeno', price: 50 }
                ]
            },
            {
                id: 103,
                name: 'Margherita Pizza',
                description: 'Simple and classic with tomato, mozzarella, and fresh basil',
                price: 499,
                image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
                calories: 38,
                sizes: [
                    { name: 'S - Small', price: 399 },
                    { name: 'M - Medium', price: 499 },
                    { name: 'L - Large', price: 699 }
                ],
                addons: [
                    { id: 'olives', name: 'Olives', price: 60 },
                    { id: 'basil', name: 'Extra Basil', price: 30 }
                ]
            }
        ]
    },
    {
        id: 2,
        name: "Matt House",
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
        banner: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=400&fit=crop',
        rating: 4.6,
        reviewCount: 1850,
        distance: '0.8 km',
        deliveryTime: '15 min',
        description: 'Healthy salads and fresh bowls. Perfect for a nutritious meal.',
        category: 'Fast Food',
        previewImages: [
            'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop',
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop',
            'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=200&h=200&fit=crop'
        ],
        menu: [
            {
                id: 201,
                name: 'Chicken Salad',
                description: 'Fresh greens with grilled chicken, cherry tomatoes, and house dressing',
                price: 456,
                image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
                calories: 28,
                sizes: [
                    { name: 'S - Small', price: 356 },
                    { name: 'M - Medium', price: 456 },
                    { name: 'L - Large', price: 556 }
                ],
                addons: [
                    { id: 'avocado', name: 'Avocado', price: 80 },
                    { id: 'egg', name: 'Boiled Egg', price: 40 }
                ]
            },
            {
                id: 202,
                name: 'Greek Salad',
                description: 'Classic Mediterranean salad with feta cheese and olives',
                price: 399,
                image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
                calories: 22,
                sizes: [
                    { name: 'S - Small', price: 299 },
                    { name: 'M - Medium', price: 399 },
                    { name: 'L - Large', price: 499 }
                ],
                addons: [
                    { id: 'feta', name: 'Extra Feta', price: 70 },
                    { id: 'olives', name: 'Extra Olives', price: 50 }
                ]
            }
        ]
    },
    {
        id: 3,
        name: "Burger Kork",
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        banner: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=400&fit=crop',
        rating: 4.7,
        reviewCount: 2100,
        distance: '2.1 km',
        deliveryTime: '30 min',
        description: 'Juicy burgers with premium beef patties and fresh toppings.',
        category: 'Fast Food',
        previewImages: [
            'https://images.unsplash.com/photo-1550547660-d9450f859349?w=200&h=200&fit=crop',
            'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop',
            'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&h=200&fit=crop'
        ],
        menu: [
            {
                id: 301,
                name: 'Cheese Burger',
                description: 'Classic beef burger with melted cheddar cheese and special sauce',
                price: 499,
                image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
                calories: 44,
                sizes: [
                    { name: 'Regular', price: 499 },
                    { name: 'Double', price: 699 }
                ],
                addons: [
                    { id: 'bacon', name: 'Bacon', price: 80 },
                    { id: 'extra_patty', name: 'Extra Patty', price: 150 }
                ]
            },
            {
                id: 302,
                name: 'BBQ Burger',
                description: 'Smoky BBQ sauce, caramelized onions, and crispy bacon',
                price: 549,
                image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=400&fit=crop',
                calories: 52,
                sizes: [
                    { name: 'Regular', price: 549 },
                    { name: 'Double', price: 749 }
                ],
                addons: [
                    { id: 'jalapeno', name: 'Jalapeno', price: 40 },
                    { id: 'onion_rings', name: 'Onion Rings', price: 60 }
                ]
            }
        ]
    },
    {
        id: 4,
        name: "Sushi Master",
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
        banner: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&h=400&fit=crop',
        rating: 4.9,
        reviewCount: 980,
        distance: '1.5 km',
        deliveryTime: '25 min',
        description: 'Authentic Japanese sushi prepared by expert chefs.',
        category: 'Sushi',
        previewImages: [
            'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&h=200&fit=crop',
            'https://images.unsplash.com/photo-1553621042-f6e147245754?w=200&h=200&fit=crop',
            'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=200&h=200&fit=crop'
        ],
        menu: [
            {
                id: 401,
                name: 'Salmon Roll',
                description: 'Fresh salmon with avocado and cucumber',
                price: 399,
                image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=400&fit=crop',
                calories: 32,
                sizes: [
                    { name: '6 pcs', price: 399 },
                    { name: '12 pcs', price: 749 }
                ],
                addons: [
                    { id: 'wasabi', name: 'Extra Wasabi', price: 20 },
                    { id: 'ginger', name: 'Extra Ginger', price: 20 }
                ]
            }
        ]
    },
    {
        id: 5,
        name: "Grill House",
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
        banner: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=400&fit=crop',
        rating: 4.8,
        reviewCount: 1650,
        distance: '3.0 km',
        deliveryTime: '35 min',
        description: 'Premium grilled meats and steaks cooked to perfection.',
        category: 'Meat',
        previewImages: [
            'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&h=200&fit=crop',
            'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=200&h=200&fit=crop',
            'https://images.unsplash.com/photo-1558030006-450675393462?w=200&h=200&fit=crop'
        ],
        menu: [
            {
                id: 501,
                name: 'Grilled Steak',
                description: 'Premium beef steak grilled to your preference',
                price: 899,
                image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop',
                calories: 68,
                sizes: [
                    { name: '200g', price: 899 },
                    { name: '300g', price: 1199 },
                    { name: '400g', price: 1499 }
                ],
                addons: [
                    { id: 'mushroom_sauce', name: 'Mushroom Sauce', price: 80 },
                    { id: 'pepper_sauce', name: 'Pepper Sauce', price: 80 }
                ]
            }
        ]
    }
]

export const orders = [
    {
        id: 1001,
        sellerId: 1,
        sellerName: "Pizza Italiano",
        items: [
            { name: 'Melting Cheese Pizza', quantity: 1, price: 599 },
            { name: 'Pepperoni Pizza', quantity: 1, price: 649 }
        ],
        total: 1298,
        status: 'Delivered',
        time: '2 days ago'
    },
    {
        id: 1002,
        sellerId: 2,
        sellerName: "Matt House",
        items: [
            { name: 'Chicken Salad', quantity: 2, price: 456 }
        ],
        total: 962,
        status: 'Delivered',
        time: '5 days ago'
    },
    {
        id: 1003,
        sellerId: 3,
        sellerName: "Burger Kork",
        items: [
            { name: 'Cheese Burger', quantity: 2, price: 499 }
        ],
        total: 1048,
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
            items: ['Melting Cheese Pizza x2', 'Coke x2'],
            status: 'Pending',
            time: '5 mins ago'
        },
        {
            id: 2002,
            customerName: 'Maria Santos',
            items: ['Chicken Salad', 'Greek Salad'],
            status: 'Preparing',
            time: '15 mins ago'
        },
        {
            id: 2003,
            customerName: 'Pedro Reyes',
            items: ['Cheese Burger x3'],
            status: 'Ready',
            time: '25 mins ago'
        },
        {
            id: 2004,
            customerName: 'Ana Garcia',
            items: ['Pepperoni Pizza', 'Margherita Pizza'],
            status: 'Delivered',
            time: '1 hour ago'
        }
    ]
}
