/**
 * Swadishtt Data Module
 * @module lib/swadishttData
 * @description Central repository for restaurant and menu data
 */

export const RESTAURANTS = [
  {
    id: 'rest-001',
    name: 'Swadishtt Kitchen',
    slug: 'swadishtt-kitchen',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop'
    ],
    rating: 4.5,
    ratingCount: 1250,
    cuisines: ['North Indian', 'Mughlai', 'Tandoor'],
    priceForTwo: 400,
    deliveryTime: '30-35 mins',
    location: {
      area: 'Koramangala',
      city: 'Bangalore',
      coordinates: { lat: 12.9352, lng: 77.6245 }
    },
    offers: [
      {
        title: '50% OFF',
        description: 'Up to ₹100 on orders above ₹199',
        code: 'SWAD50',
        discount: 50
      },
      {
        title: 'Free Delivery',
        description: 'On orders above ₹299',
        code: 'FREEDEL',
        discount: 0
      }
    ],
    features: {
      pureVeg: false,
      acceptsVouchers: true,
      hasParking: true,
      servesAlcohol: false
    },
    timings: {
      open: '11:00 AM',
      close: '11:00 PM',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    menu: [
      {
        id: 'dish-001',
        name: 'Butter Chicken',
        category: 'Main Course',
        description: 'Tender chicken in rich tomato gravy',
        price: 350,
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-002',
        name: 'Paneer Tikka Masala',
        category: 'Main Course',
        description: 'Grilled cottage cheese in spicy gravy',
        price: 280,
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-003',
        name: 'Dal Makhani',
        category: 'Main Course',
        description: 'Creamy black lentils slow-cooked overnight',
        price: 220,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-004',
        name: 'Tandoori Chicken',
        category: 'Starters',
        description: 'Smoky grilled chicken from tandoor',
        price: 320,
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-005',
        name: 'Garlic Naan',
        category: 'Breads',
        description: 'Soft naan with garlic butter',
        price: 60,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-006',
        name: 'Biryani',
        category: 'Rice',
        description: 'Aromatic basmati rice with spices',
        price: 380,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop',
        isVeg: false,
        isBestseller: true
      }
    ]
  },
  {
    id: 'rest-002',
    name: 'Green Leaf Pure Veg',
    slug: 'green-leaf-pure-veg',
    coverImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop',
      '/images/swadisht/restaurants/green-leaf-2.jpg'
    ],
    rating: 4.3,
    ratingCount: 890,
    cuisines: ['South Indian', 'North Indian', 'Chinese'],
    priceForTwo: 300,
    deliveryTime: '25-30 mins',
    location: {
      area: 'Indiranagar',
      city: 'Bangalore',
      coordinates: { lat: 12.9716, lng: 77.6412 }
    },
    offers: [
      {
        title: '40% OFF',
        description: 'Up to ₹80 on orders above ₹159',
        code: 'GREEN40',
        discount: 40
      }
    ],
    features: {
      pureVeg: true,
      acceptsVouchers: true,
      hasParking: false,
      servesAlcohol: false
    },
    timings: {
      open: '10:00 AM',
      close: '10:30 PM',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    menu: [
      {
        id: 'dish-101',
        name: 'Masala Dosa',
        category: 'South Indian',
        description: 'Crispy rice crepe with potato filling',
        price: 120,
        image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-102',
        name: 'Idli Sambar',
        category: 'South Indian',
        description: 'Steamed rice cakes with lentil stew',
        price: 80,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-103',
        name: 'Veg Fried Rice',
        category: 'Chinese',
        description: 'Stir-fried rice with vegetables',
        price: 150,
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-104',
        name: 'Paneer Manchurian',
        category: 'Chinese',
        description: 'Cottage cheese in spicy sauce',
        price: 200,
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop',
        isVeg: true,
        isBestseller: false
      }
    ]
  },
  {
    id: 'rest-003',
    name: 'Biryani House',
    slug: 'biryani-house',
    coverImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=600&fit=crop',
      '/images/swadisht/restaurants/biryani-house-2.jpg',
      '/images/swadisht/restaurants/biryani-house-3.jpg'
    ],
    rating: 4.6,
    ratingCount: 2100,
    cuisines: ['Biryani', 'Hyderabadi', 'Mughlai'],
    priceForTwo: 500,
    deliveryTime: '35-40 mins',
    location: {
      area: 'HSR Layout',
      city: 'Bangalore',
      coordinates: { lat: 12.9121, lng: 77.6446 }
    },
    offers: [
      {
        title: '60% OFF',
        description: 'Up to ₹120 on orders above ₹249',
        code: 'BIRYANI60',
        discount: 60
      }
    ],
    features: {
      pureVeg: false,
      acceptsVouchers: true,
      hasParking: true,
      servesAlcohol: false
    },
    timings: {
      open: '12:00 PM',
      close: '11:30 PM',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    menu: [
      {
        id: 'dish-201',
        name: 'Hyderabadi Chicken Biryani',
        category: 'Biryani',
        description: 'Aromatic basmati rice with tender chicken',
        price: 380,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-202',
        name: 'Mutton Biryani',
        category: 'Biryani',
        description: 'Slow-cooked mutton with fragrant rice',
        price: 450,
        image: 'https://images.unsplash.com/photo-1633945274309-7ae8a0f4c9b7?w=400&h=300&fit=crop',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-203',
        name: 'Veg Biryani',
        category: 'Biryani',
        description: 'Mixed vegetables with aromatic rice',
        price: 280,
        image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=400&h=300&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-204',
        name: 'Chicken 65',
        category: 'Starters',
        description: 'Spicy fried chicken appetizer',
        price: 250,
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-205',
        name: 'Raita',
        category: 'Sides',
        description: 'Cooling yogurt with cucumber',
        price: 60,
        image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=400&h=300&fit=crop',
        isVeg: true,
        isBestseller: false
      }
    ]
  }
];

export const MENU_ITEMS = [
  {
    id: 'dish-001',
    restaurantId: 'rest-001',
    name: 'Butter Chicken',
    description: 'Tender chicken in rich tomato-butter gravy',
    price: 350,
    image: '/images/swadisht/menu/butter-chicken.jpg',
    category: 'Main Course',
    isVeg: false,
    isBestseller: true,
    rating: 4.7,
    deliveryTime: '30-35 mins'
  },
  {
    id: 'dish-002',
    restaurantId: 'rest-001',
    name: 'Paneer Tikka Masala',
    description: 'Grilled cottage cheese in spiced tomato gravy',
    price: 280,
    image: '/images/swadisht/menu/paneer-tikka.jpg',
    category: 'Main Course',
    isVeg: true,
    isBestseller: true,
    rating: 4.5,
    deliveryTime: '25-30 mins'
  },
  {
    id: 'dish-003',
    restaurantId: 'rest-003',
    name: 'Hyderabadi Chicken Biryani',
    description: 'Aromatic basmati rice with tender chicken',
    price: 320,
    image: '/images/swadisht/menu/chicken-biryani.jpg',
    category: 'Biryani',
    isVeg: false,
    isBestseller: true,
    rating: 4.8,
    deliveryTime: '35-40 mins'
  },
  {
    id: 'dish-004',
    restaurantId: 'rest-002',
    name: 'Masala Dosa',
    description: 'Crispy rice crepe with spiced potato filling',
    price: 120,
    image: '/images/swadisht/menu/masala-dosa.jpg',
    category: 'South Indian',
    isVeg: true,
    isBestseller: true,
    rating: 4.6,
    deliveryTime: '20-25 mins'
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'All', icon: '🍽️' },
  { id: 'biryani', name: 'Biryani', icon: '🍚' },
  { id: 'north-indian', name: 'North Indian', icon: '🍛' },
  { id: 'south-indian', name: 'South Indian', icon: '🥘' },
  { id: 'chinese', name: 'Chinese', icon: '🥢' },
  { id: 'pizza', name: 'Pizza', icon: '🍕' },
  { id: 'burgers', name: 'Burgers', icon: '🍔' },
  { id: 'desserts', name: 'Desserts', icon: '🍰' }
];

export function getRestaurantById(id) {
  return RESTAURANTS.find(r => r.id === id);
}

export function getRestaurantBySlug(slug) {
  return RESTAURANTS.find(r => r.slug === slug);
}

export function getMenuByRestaurant(restaurantId) {
  return MENU_ITEMS.filter(item => item.restaurantId === restaurantId);
}

export function getDishById(id) {
  return MENU_ITEMS.find(item => item.id === id);
}

export function searchRestaurants(query) {
  const lowerQuery = query.toLowerCase();
  return RESTAURANTS.filter(r => 
    r.name.toLowerCase().includes(lowerQuery) ||
    r.cuisines.some(c => c.toLowerCase().includes(lowerQuery))
  );
}

export function filterRestaurants(filters) {
  let filtered = [...RESTAURANTS];
  
  if (filters.pureVeg) {
    filtered = filtered.filter(r => r.features.pureVeg);
  }
  
  if (filters.rating) {
    filtered = filtered.filter(r => r.rating >= filters.rating);
  }
  
  if (filters.cuisines && filters.cuisines.length > 0) {
    filtered = filtered.filter(r => 
      r.cuisines.some(c => filters.cuisines.includes(c))
    );
  }
  
  if (filters.priceRange) {
    filtered = filtered.filter(r => 
      r.priceForTwo >= filters.priceRange.min && 
      r.priceForTwo <= filters.priceRange.max
    );
  }
  
  return filtered;
}
