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
    video: '/video/restaurants/CHOLE BHATURE.mp4',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=320&fit=crop&auto=format&q=60',
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
        description: 'Tender tandoori chicken simmered in a rich buttery tomato gravy finished with fresh cream and aromatic Indian spices.',
        price: 350,
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-002',
        name: 'Paneer Tikka Masala',
        category: 'Main Course',
        description: 'Smoky grilled paneer cubes cooked in a creamy onion tomato gravy with bold North Indian spices and herbs.',
        price: 280,
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-003',
        name: 'Dal Makhani',
        category: 'Main Course',
        description: 'Slow-cooked black lentils and kidney beans blended with butter, cream, and traditional Punjabi flavors.',
        price: 220,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-004',
        name: 'Tandoori Chicken',
        category: 'Starters',
        description: 'Juicy chicken marinated overnight in yogurt and spices, then flame-grilled in a traditional clay tandoor.',
        price: 320,
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-005',
        name: 'Garlic Naan',
        category: 'Breads',
        description: 'Soft freshly baked naan brushed with melted garlic butter and topped with coriander for extra flavor.',
        price: 60,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-006',
        name: 'Biryani',
        category: 'Rice',
        description: 'Fragrant basmati rice layered with spiced meat, caramelized onions, saffron, and slow-cooked dum flavors.',
        price: 380,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: false,
        isBestseller: true
      }
    ]
  },
  {
    id: 'rest-002',
    name: 'Green Leaf Pure Veg',
    slug: 'green-leaf-pure-veg',
    logoImage: 'https://i.pinimg.com/736x/e6/08/07/e608075fca5c9c167058881b1d275229.jpg',
    coverImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=320&fit=crop&auto=format&q=60',
    video: '/video/restaurants/SALAD.mp4',
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
        description: 'Golden crispy dosa filled with flavorful potato masala and served with coconut chutney and hot sambar.',
        price: 120,
        image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-102',
        name: 'Idli Sambar',
        category: 'South Indian',
        description: 'Soft fluffy idlis served with authentic South Indian sambar and freshly prepared coconut chutney.',
        price: 80,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-103',
        name: 'Veg Fried Rice',
        category: 'Chinese',
        description: 'Wok-tossed fried rice loaded with fresh vegetables, sauces, spring onions, and Indo-Chinese flavors.',
        price: 150,
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-104',
        name: 'Paneer Manchurian',
        category: 'Chinese',
        description: 'Crispy paneer cubes tossed in spicy garlic soy sauce with onions, capsicum, and spring onions.',
        price: 200,
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: true,
        isBestseller: false
      }
    ]
  },
  {
    id: 'rest-003',
    name: 'Biryani House',
    slug: 'biryani-house',
    logoImage: 'https://i.pinimg.com/1200x/81/72/65/817265f683729ee6ffc17e750ba51f25.jpg',
    coverImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=320&fit=crop&auto=format&q=60',
    video: '/video/restaurants/BIRIYANI.mp4',
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
        description: 'Authentic Hyderabadi dum biryani layered with fragrant basmati rice, tender chicken, saffron, and slow-cooked spices.',
        price: 380,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-202',
        name: 'Mutton Biryani',
        category: 'Biryani',
        description: 'Rich and flavorful biryani prepared with juicy slow-cooked mutton, aromatic spices, and long-grain basmati rice.',
        price: 450,
        image: 'https://images.unsplash.com/photo-1633945274309-7ae8a0f4c9b7?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-203',
        name: 'Veg Biryani',
        category: 'Biryani',
        description: 'Fragrant basmati rice cooked with fresh vegetables, herbs, saffron, and traditional biryani masala spices.',
        price: 280,
        image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-204',
        name: 'Chicken 65',
        category: 'Starters',
        description: 'Crispy spicy fried chicken tossed with curry leaves, garlic, green chilies, and South Indian seasonings.',
        price: 250,
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-205',
        name: 'Raita',
        category: 'Sides',
        description: 'Refreshing chilled yogurt mixed with cucumber, onions, herbs, and mild spices to complement your biryani.',
        price: 60,
        image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: true,
        isBestseller: false
      }
    ]
  },
  {
    id: 4,
    name: 'Dosa Point',
    slug: 'dosa-point',
    logoImage: 'https://i.pinimg.com/736x/41/59/7f/41597f78477d3a5178ec56ef939929e5.jpg',
    coverImage: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&h=320&fit=crop&auto=format&q=60',
    video: '/video/restaurants/DOSA.mp4',
    cuisines: ['South Indian', 'Breakfast', 'Pure Veg'],
    rating: 4.4,
    ratingCount: 850,
    deliveryTime: '20-25 mins',
    priceForTwo: 250,
    location: {
      area: 'Whitefield',
      city: 'Bangalore'
    },
    features: {
      pureVeg: true,
      outdoorSeating: false,
      openNow: true
    },
    offers: [
      {
        title: '40% OFF',
        description: 'Up to ₹100'
      }
    ],
    menu: [
      {
        id: 'dish-301',
        name: 'Masala Dosa',
        category: 'South Indian',
        description: 'Crispy golden dosa stuffed with flavorful potato masala and served with coconut chutney and hot sambar.',
        price: 140,
        image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-302',
        name: 'Ghee Roast Dosa',
        category: 'South Indian',
        description: 'Thin crispy dosa roasted generously in pure ghee for a rich aroma and authentic South Indian flavor.',
        price: 170,
        image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-303',
        name: 'Filter Coffee',
        category: 'Beverages',
        description: 'Traditional South Indian filter coffee brewed strong with freshly ground beans and frothy hot milk.',
        price: 60,
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: true,
        isBestseller: false
      }
    ]
  },
  {
    id: 5,
    name: 'Pizza Corner',
    slug: 'pizza-corner',
    logoImage: 'https://i.pinimg.com/736x/d5/50/47/d5504746a4defd9808768303d7f4aad4.jpg',
    coverImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=320&fit=crop&auto=format&q=60',
    video: '/video/restaurants/PIZZA.mp4',
    cuisines: ['Pizza', 'Fast Food', 'Italian'],
    rating: 4.2,
    ratingCount: 620,
    deliveryTime: '30-35 mins',
    priceForTwo: 450,
    location: {
      area: 'Indiranagar',
      city: 'Bangalore'
    },
    features: {
      pureVeg: false,
      outdoorSeating: true,
      openNow: true
    },
    offers: [
      {
        title: '50% OFF',
        description: 'Up to ₹150'
      }
    ],
    menu: [
      {
        id: 'dish-401',
        name: 'Margherita Pizza',
        category: 'Pizza',
        description: 'Classic Italian-style pizza topped with mozzarella cheese, fresh basil leaves, and rich tomato sauce.',
        price: 280,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-402',
        name: 'Pepperoni Pizza',
        category: 'Pizza',
        description: 'Loaded with spicy pepperoni slices, mozzarella cheese, and signature pizza sauce on a crispy crust.',
        price: 420,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-403',
        name: 'Farmhouse Pizza',
        category: 'Pizza',
        description: 'Cheesy pizza generously topped with onions, capsicum, tomatoes, mushrooms, and fresh vegetables.',
        price: 360,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-404',
        name: 'Garlic Bread',
        category: 'Sides',
        description: 'Freshly baked garlic bread brushed with butter and herbs, served with creamy cheesy dip.',
        price: 160,
        image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-405',
        name: 'Choco Lava Cake',
        category: 'Desserts',
        description: 'Warm chocolate cake with a rich molten chocolate center served fresh for the perfect dessert experience.',
        price: 140,
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: true,
        isBestseller: true
      }
    ]
  },
  {
    id: 6,
    name: 'Sweet Treats',
    slug: 'sweet-treats',
    logoImage: 'https://i.pinimg.com/736x/cd/d6/49/cdd649decf33a59adb6503e80e0f60e4.jpg',
    coverImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=320&fit=crop&auto=format&q=60',
    video: '/video/restaurants/DESSERT.mp4',
    cuisines: ['Desserts', 'Bakery', 'Ice Cream'],
    rating: 4.5,
    ratingCount: 740,
    deliveryTime: '25-30 mins',
    priceForTwo: 300,
    location: {
      area: 'Koramangala',
      city: 'Bangalore'
    },
    features: {
      pureVeg: true,
      outdoorSeating: false,
      openNow: true
    },
    offers: [
      {
        title: '30% OFF',
        description: 'On desserts'
      }
    ],
    menu: [
      {
        id: 'dish-501',
        name: 'Chocolate Truffle Cake',
        category: 'Desserts',
        description: 'Decadent layered chocolate truffle cake made with rich cocoa, smooth ganache, and creamy chocolate frosting.',
        price: 220,
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-502',
        name: 'Belgian Waffle',
        category: 'Desserts',
        description: 'Freshly baked Belgian waffle served warm with chocolate sauce, whipped cream, and sweet toppings.',
        price: 190,
        image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-503',
        name: 'Cold Coffee',
        category: 'Beverages',
        description: 'Creamy chilled coffee blended with milk, ice cream, and rich coffee flavors for a refreshing drink.',
        price: 140,
        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: true,
        isBestseller: false
      }
    ]
  }
  ,
  {
    id: 7,
    name: 'Burger Junction',
    slug: 'burger-junction',
    logoImage: 'https://i.pinimg.com/736x/40/12/73/4012730d581a919d4a423ac37cbffbf0.jpg',
    coverImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=320&fit=crop&auto=format&q=60',
    video: '/video/restaurants/burger.mp4',
    cuisines: ['Burgers', 'Fast Food', 'American'],
    rating: 4.3,
    ratingCount: 980,
    deliveryTime: '25-30 mins',
    priceForTwo: 350,
    location: {
      area: 'BTM Layout',
      city: 'Bangalore'
    },
    features: {
      pureVeg: false,
      outdoorSeating: true,
      openNow: true
    },
    offers: [
      {
        title: '45% OFF',
        description: 'Up to ₹120'
      }
    ],
    menu: [
      {
        id: 'dish-601',
        name: 'Classic Chicken Burger',
        category: 'Burgers',
        description: 'Juicy grilled chicken burger layered with fresh lettuce, cheese, signature sauce, and crispy fries on the side.',
        price: 260,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-602',
        name: 'Veg Cheese Burger',
        category: 'Burgers',
        description: 'Loaded vegetable patty burger with melted cheese, crunchy lettuce, fresh veggies, and creamy burger sauce.',
        price: 220,
        image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-603',
        name: 'Peri Peri Fries',
        category: 'Sides',
        description: 'Crispy golden fries tossed with spicy peri peri seasoning and served hot with creamy dipping sauce.',
        price: 140,
        image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: true,
        isBestseller: false
      }
    ]
  },
  {
    id: 8,
    name: 'Royal Tandoor',
    slug: 'royal-tandoor',
    logoImage: 'https://i.pinimg.com/736x/13/b2/a0/13b2a025a1f8d88ffb7814de395c958f.jpg',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=320&fit=crop&auto=format&q=60',
    video: '/video/restaurants/KEBAB.mp4',
    cuisines: ['North Indian', 'Tandoor', 'Mughlai'],
    rating: 4.6,
    ratingCount: 1500,
    deliveryTime: '35-40 mins',
    priceForTwo: 600,
    location: {
      area: 'Jayanagar',
      city: 'Bangalore'
    },
    features: {
      pureVeg: false,
      outdoorSeating: true,
      openNow: true
    },
    offers: [
      {
        title: '55% OFF',
        description: 'Flat ₹150 off'
      }
    ],
    menu: [
      {
        id: 'dish-701',
        name: 'Butter Naan',
        category: 'Breads',
        description: 'Soft freshly baked naan brushed generously with melted butter and served warm from the tandoor.',
        price: 70,
        image: 'https://placehold.co/400x300/F4D7A1/5A2E0C/png?text=Butter+Naan',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-702',
        name: 'Chicken Tikka',
        category: 'Starters',
        description: 'Juicy chicken tikka marinated in yogurt and spices, then flame-grilled in a traditional tandoor oven.',
        price: 340,
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-703',
        name: 'Paneer Butter Masala',
        category: 'Main Course',
        description: 'Soft paneer cubes cooked in a creamy buttery tomato gravy with rich North Indian spices and herbs.',
        price: 290,
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: true,
        isBestseller: true
      }
    ]
  },
  {
    id: 9,
    name: 'China Wok Express',
    slug: 'china-wok-express',
    logoImage: 'https://i.pinimg.com/736x/37/cf/6d/37cf6db6870543439def79427aa2a312.jpg',
    coverImage: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&h=320&fit=crop&auto=format&q=60',
    video: '/video/restaurants/WOK.mp4',
    cuisines: ['Chinese', 'Asian', 'Noodles'],
    rating: 4.1,
    ratingCount: 720,
    deliveryTime: '30-35 mins',
    priceForTwo: 400,
    location: {
      area: 'Marathahalli',
      city: 'Bangalore'
    },
    features: {
      pureVeg: false,
      outdoorSeating: false,
      openNow: true
    },
    offers: [
      {
        title: '30% OFF',
        description: 'On Chinese combos'
      }
    ],
    menu: [
      {
        id: 'dish-801',
        name: 'Hakka Noodles',
        category: 'Chinese',
        description: 'Wok-tossed hakka noodles stir-fried with fresh vegetables, sauces, and bold Indo-Chinese flavors.',
        price: 210,
        image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-802',
        name: 'Chicken Manchurian',
        category: 'Chinese',
        description: 'Crispy chicken pieces tossed in spicy garlic soy sauce with onions, capsicum, and spring onions.',
        price: 280,
        image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-803',
        name: 'Spring Rolls',
        category: 'Starters',
        description: 'Crunchy golden spring rolls stuffed with seasoned vegetables and served with spicy dipping sauce.',
        price: 180,
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: true,
        isBestseller: false
      }
    ]
  },
  {
    id: 10,
    name: 'Cafe Mocha',
    slug: 'cafe-mocha',
    logoImage: 'https://i.pinimg.com/736x/20/fb/29/20fb294c1890f05e10430fdb34f1b1e1.jpg',
    coverImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=320&fit=crop&auto=format&q=60',
    video: '/video/restaurants/COFFEE.mp4',
    cuisines: ['Cafe', 'Beverages', 'Desserts'],
    rating: 4.7,
    ratingCount: 1800,
    deliveryTime: '20-25 mins',
    priceForTwo: 550,
    location: {
      area: 'Indiranagar',
      city: 'Bangalore'
    },
    features: {
      pureVeg: true,
      outdoorSeating: true,
      openNow: true
    },
    offers: [
      {
        title: 'Buy 1 Get 1',
        description: 'On beverages'
      }
    ],
    menu: [
      {
        id: 'dish-901',
        name: 'Cappuccino',
        category: 'Beverages',
        description: 'Freshly brewed cappuccino topped with rich milk foam and crafted using premium roasted coffee beans.',
        price: 180,
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-902',
        name: 'Red Velvet Pastry',
        category: 'Desserts',
        description: 'Soft and moist red velvet pastry layered with smooth cream cheese frosting and chocolate garnish.',
        price: 160,
        image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-903',
        name: 'Pasta Alfredo',
        category: 'Italian',
        description: 'Creamy Alfredo pasta tossed with white sauce, herbs, garlic, parmesan cheese, and fresh vegetables.',
        price: 320,
        image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023882c?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: true,
        isBestseller: false
      }
    ]
  },
  {
    id: 11,
    name: 'Andhra Spice',
    slug: 'andhra-spice',
    logoImage: 'https://i.pinimg.com/736x/ee/ed/d6/eeedd61044b2130c2f729127aeab6ff4.jpg',
    coverImage: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&h=320&fit=crop&auto=format&q=60',
    video: '/video/restaurants/ANDHRAFISH.mp4',
    cuisines: ['Andhra', 'South Indian', 'Spicy'],
    rating: 4.5,
    ratingCount: 1120,
    deliveryTime: '30-40 mins',
    priceForTwo: 450,
    location: {
      area: 'Electronic City',
      city: 'Bangalore'
    },
    features: {
      pureVeg: false,
      outdoorSeating: false,
      openNow: true
    },
    offers: [
      {
        title: '50% OFF',
        description: 'Up to ₹100'
      }
    ],
    menu: [
      {
        id: 'dish-1001',
        name: 'Andhra Chicken Curry',
        category: 'Main Course',
        description: 'Fiery Andhra-style chicken curry slow-cooked with roasted spices, curry leaves, and traditional regional flavors.',
        price: 340,
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-1002',
        name: 'Gongura Mutton',
        category: 'Main Course',
        description: 'Tender mutton cooked with tangy gongura leaves, aromatic spices, and authentic Andhra-style seasoning.',
        price: 420,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop&auto=format&q=60',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-1003',
        name: 'Andhra Meals',
        category: 'Meals',
        description: 'Traditional Andhra-style thali served with rice, curries, dal, chutneys, papad, and regional specialties.',
        price: 260,
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=400&fit=crop&auto=format&q=60',
      }
    ]
  },
  // ── New Restaurants (rest-012 to rest-022) ──
  {
    id: 'rest-012',
    name: 'Mumbai Street Bites',
    slug: 'mumbai-street-bites',
    logoImage: 'https://i.pinimg.com/736x/8e/55/12/8e5512cf5a1e8d43f29a0e5f1a56d2e3.jpg',
    coverImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-DJaKKrPhPnKnfZqcsgyNrEOi8Xnto_1J-O6rLQ6GBg&s',
    video: '/video/restaurants/CHOLE BHATURE.mp4',
    cuisines: ['Street Food', 'North Indian', 'Chaat'],
    rating: 4.4,
    ratingCount: 960,
    deliveryTime: '20-25 mins',
    priceForTwo: 200,
    location: { area: 'Koramangala', city: 'Bangalore' },
    features: { pureVeg: true, outdoorSeating: false, openNow: true },
    offers: [{ title: '40% OFF', description: 'Up to ₹80 on orders above ₹149' }],
    timings: { open: '10:00 AM', close: '11:00 PM', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    menu: [
      { id: 'dish-1101', name: 'Pav Bhaji', category: 'Street Food', description: 'Spiced mashed vegetable curry served with buttered toasted pav buns — the iconic Mumbai classic.', price: 120, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: true },
      { id: 'dish-1102', name: 'Vada Pav', category: 'Street Food', description: 'Crispy battered potato fritter nestled in a soft bun with chutneys and spiced masala.', price: 60, image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: true },
      { id: 'dish-1103', name: 'Sev Puri', category: 'Chaat', description: 'Crunchy puris topped with potatoes, chutneys, onions, and crispy sev for a tangy bite.', price: 80, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: false },
      { id: 'dish-1104', name: 'Misal Pav', category: 'Street Food', description: 'Spicy sprouted moth beans curry topped with farsan, onion and served with pav buns.', price: 100, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: false },
      { id: 'dish-1105', name: 'Bhel Puri', category: 'Chaat', description: 'Light and crunchy puffed rice tossed with veggies, tamarind chutney, and sev.', price: 70, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: false },
      { id: 'dish-1106', name: 'Masala Chai', category: 'Beverages', description: 'Strong brewed tea simmered with ginger, cardamom, and aromatic Indian spices.', price: 40, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: false }
    ]
  },
  {
    id: 'rest-013',
    name: 'Punjabi Dhaba',
    slug: 'punjabi-dhaba',
    logoImage: 'https://i.pinimg.com/736x/4a/bb/c0/4abbc06f4c1e8d45f9e94b01e74b2b7c.jpg',
    coverImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlEz9SfGhwL0XCeU_EIo6zVVE1YWhLuX2n2odOHL_L-w&s=10',
    video: '/video/restaurants/KEBAB.mp4',
    cuisines: ['Punjabi', 'North Indian', 'Tandoor'],
    rating: 4.5,
    ratingCount: 1340,
    deliveryTime: '30-35 mins',
    priceForTwo: 500,
    location: { area: 'Rajajinagar', city: 'Bangalore' },
    features: { pureVeg: false, outdoorSeating: true, openNow: true },
    offers: [{ title: '50% OFF', description: 'Up to ₹120 on orders above ₹249' }],
    timings: { open: '11:30 AM', close: '11:30 PM', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    menu: [
      { id: 'dish-1201', name: 'Sarson Da Saag', category: 'Main Course', description: 'Traditional Punjabi mustard greens slow-cooked with spices and finished with dollop of white butter.', price: 260, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: true },
      { id: 'dish-1202', name: 'Makki di Roti', category: 'Breads', description: 'Rustic cornmeal flatbread cooked on a traditional tawa — perfect with sarson da saag.', price: 40, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: false },
      { id: 'dish-1203', name: 'Amritsari Fish', category: 'Starters', description: 'Juicy fish fillet marinated in bold Amritsari spices and deep-fried to golden perfection.', price: 380, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=400&fit=crop&auto=format&q=60', isVeg: false, isBestseller: true },
      { id: 'dish-1204', name: 'Shahi Paneer', category: 'Main Course', description: 'Royal paneer cooked in a fragrant cashew and cream gravy with saffron and aromatic whole spices.', price: 310, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: true },
      { id: 'dish-1205', name: 'Lassi', category: 'Beverages', description: 'Chilled sweet yogurt drink blended smooth with sugar and a hint of cardamom and rose water.', price: 80, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: false },
      { id: 'dish-1206', name: 'Dal Tadka', category: 'Main Course', description: 'Yellow lentils tempered with cumin, garlic, ghee, and mild spices in rustic dhaba style.', price: 200, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: false }
    ]
  },
  {
    id: 'rest-014',
    name: 'Kerala Spice Garden',
    slug: 'kerala-spice-garden',
    logoImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY6JOWTUQvi9vXCXQArfST4pJOgNhXgveocRG-VpJK5A&s=10',
    coverImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDNFBE8EIvF5Rv87MvQ13Utz2gJhvmZGvXhR6pVgMNjw&s=10',
    video: '/video/restaurants/ANDHRAFISH.mp4',
    cuisines: ['Kerala', 'South Indian', 'Seafood'],
    rating: 4.6,
    ratingCount: 880,
    deliveryTime: '35-40 mins',
    priceForTwo: 600,
    location: { area: 'JP Nagar', city: 'Bangalore' },
    features: { pureVeg: false, outdoorSeating: true, openNow: true },
    offers: [{ title: '35% OFF', description: 'On Kerala specials' }],
    timings: { open: '12:00 PM', close: '10:30 PM', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    menu: [
      { id: 'dish-1301', name: 'Kerala Fish Curry', category: 'Main Course', description: 'Tangy coconut milk fish curry slow-cooked with raw mango and authentic Kerala spices.', price: 380, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&h=400&fit=crop&auto=format&q=60', isVeg: false, isBestseller: true },
      { id: 'dish-1302', name: 'Appam with Stew', category: 'South Indian', description: 'Lacy hoppers served with creamy coconut milk vegetable stew flavored with whole spices.', price: 180, image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: true },
      { id: 'dish-1303', name: 'Karimeen Pollichathu', category: 'Main Course', description: 'Pearl spot fish marinated in spicy masala and baked in banana leaf for smoky authentic flavor.', price: 450, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=400&fit=crop&auto=format&q=60', isVeg: false, isBestseller: true },
      { id: 'dish-1304', name: 'Puttu Kadala', category: 'Breakfast', description: 'Steamed rice cylinders layered with coconut served with spicy black chickpea curry.', price: 140, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: false },
      { id: 'dish-1305', name: 'Prawn Moilee', category: 'Main Course', description: 'Delicate coconut milk prawn curry gently spiced with turmeric, green chili, and ginger.', price: 420, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop&auto=format&q=60', isVeg: false, isBestseller: false }
    ]
  },
  {
    id: 'rest-015',
    name: 'Rolls & Wraps Co.',
    slug: 'rolls-and-wraps-co',
    logoImage: 'https://i.pinimg.com/736x/0d/23/2d/0d232d46c3c0e1f4f9e20d14b7c6e9d8.jpg',
    coverImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiYlTZziwKmt2KJO_vqlsh-xmukU9cGR6u74gxtctAsQ&s=10',
    video: '/video/restaurants/KEBAB.mp4',
    cuisines: ['Rolls', 'Fast Food', 'Wraps'],
    rating: 4.2,
    ratingCount: 740,
    deliveryTime: '20-25 mins',
    priceForTwo: 280,
    location: { area: 'Bannerghatta Road', city: 'Bangalore' },
    features: { pureVeg: false, outdoorSeating: false, openNow: true },
    offers: [{ title: '30% OFF', description: 'On combo meals' }],
    timings: { open: '11:00 AM', close: '11:00 PM', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    menu: [
      { id: 'dish-1401', name: 'Chicken Kathi Roll', category: 'Rolls', description: 'Juicy spiced chicken tikka wrapped in soft paratha with crunchy onions and mint chutney.', price: 180, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&h=400&fit=crop&auto=format&q=60', isVeg: false, isBestseller: true },
      { id: 'dish-1402', name: 'Paneer Tikka Roll', category: 'Rolls', description: 'Smoky grilled paneer cubes rolled in flaky paratha with pickled veggies and green chutney.', price: 160, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: true },
      { id: 'dish-1403', name: 'Egg Double Roll', category: 'Rolls', description: 'Two-egg omelet roll with spiced potato filling, onions, and signature house sauce.', price: 130, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop&auto=format&q=60', isVeg: false, isBestseller: false },
      { id: 'dish-1404', name: 'Veg Cheese Roll', category: 'Rolls', description: 'Loaded veggie and cheese mix wrapped in crispy paratha with creamy mayo and jalapeños.', price: 150, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: false },
      { id: 'dish-1405', name: 'Mutton Seekh Roll', category: 'Rolls', description: 'Tender minced mutton seekh kebab wrapped in soft paratha with pickled onions and chutney.', price: 220, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop&auto=format&q=60', isVeg: false, isBestseller: false }
    ]
  },
  {
    id: 'rest-016',
    name: 'Chettinad Palace',
    slug: 'chettinad-palace',
    logoImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWSJ8FbuSzlemubERTnSf8L_0ZCttN3lwgfblGTQkAVw&s=10',
    coverImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzHDylY-C0LpD0_2dZnx2WUHzhk8gcX-jaHrNjaO4NGA&s=10',
    video: '/video/restaurants/ANDHRAFISH.mp4',
    cuisines: ['Chettinad', 'South Indian', 'Spicy'],
    rating: 4.7,
    ratingCount: 1200,
    deliveryTime: '35-40 mins',
    priceForTwo: 550,
    location: { area: 'Yelahanka', city: 'Bangalore' },
    features: { pureVeg: false, outdoorSeating: false, openNow: true },
    offers: [{ title: '45% OFF', description: 'Up to ₹110 on orders above ₹299' }],
    timings: { open: '12:00 PM', close: '11:00 PM', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    menu: [
      { id: 'dish-1501', name: 'Chettinad Chicken Curry', category: 'Main Course', description: 'Fiery and aromatic chicken curry made with freshly ground Chettinad spice blend and coconut.', price: 360, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&h=400&fit=crop&auto=format&q=60', isVeg: false, isBestseller: true },
      { id: 'dish-1502', name: 'Kavuni Arisi Payasam', category: 'Desserts', description: 'Traditional black glutinous rice kheer sweetened with jaggery and coconut milk.', price: 140, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: true },
      { id: 'dish-1503', name: 'Mutton Chukka', category: 'Starters', description: 'Dry-roasted mutton tossed with freshly ground spices, curry leaves, and pearl onions.', price: 420, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop&auto=format&q=60', isVeg: false, isBestseller: true },
      { id: 'dish-1504', name: 'Parotta', category: 'Breads', description: 'Flaky layered South Indian flatbread made with maida — perfect with curries and gravies.', price: 50, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: false },
      { id: 'dish-1505', name: 'Kara Kuzhambu', category: 'Main Course', description: 'Bold and tangy tamarind gravy with brinjal, small onions, and aromatic Chettinad spices.', price: 220, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: false }
    ]
  },
  {
    id: 'rest-017',
    name: 'Thali Express',
    slug: 'thali-express',
    logoImage: 'https://i.pinimg.com/736x/b2/78/3d/b2783d2e16f5d4c7f9b01e22a3c9d0a1.jpg',
    coverImage: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=320&fit=crop&auto=format&q=60',
    video: '/video/restaurants/SALAD.mp4',
    cuisines: ['Thali', 'North Indian', 'Rajasthani'],
    rating: 4.3,
    ratingCount: 680,
    deliveryTime: '30-35 mins',
    priceForTwo: 350,
    location: { area: 'Bellandur', city: 'Bangalore' },
    features: { pureVeg: true, outdoorSeating: false, openNow: true },
    offers: [{ title: '25% OFF', description: 'On thali combos' }],
    timings: { open: '11:00 AM', close: '10:30 PM', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    menu: [
      { id: 'dish-1601', name: 'Rajasthani Thali', category: 'Thali', description: 'Wholesome thali with dal baati churma, gatte ki sabzi, ker sangri, and bajra roti.', price: 280, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: true },
      { id: 'dish-1602', name: 'Gujarati Thali', category: 'Thali', description: 'Sweet, sour and spicy Gujarati thali with dal, shaak, rotli, rice, kadhi, and farsan.', price: 260, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: true },
      { id: 'dish-1603', name: 'Dal Baati Churma', category: 'Main Course', description: 'Baked wheat dumplings dunked in aromatic five-lentil dal and served with sweet churma.', price: 240, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: false },
      { id: 'dish-1604', name: 'Gatte Ki Sabzi', category: 'Main Course', description: 'Chickpea flour dumplings simmered in tangy yogurt-based gravy with Rajasthani spices.', price: 180, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: false },
      { id: 'dish-1605', name: 'Malpua', category: 'Desserts', description: 'Sweet fried pancakes soaked in sugar syrup with cardamom and garnished with rabri.', price: 120, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: false },
      { id: 'dish-1606', name: 'Bajra Roti', category: 'Breads', description: 'Rustic pearl millet flatbread served hot with ghee — a wholesome Rajasthani staple.', price: 40, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: false }
    ]
  },
  {
    id: 'rest-018',
    name: 'Oven Fresh Bakehouse',
    slug: 'oven-fresh-bakehouse',
    logoImage: 'https://i.pinimg.com/736x/7a/4e/31/7a4e31b5c1de84f7a9b01e24b5d2f0c3.jpg',
    coverImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=320&fit=crop&auto=format&q=60',
    video: '/video/restaurants/DESSERT.mp4',
    cuisines: ['Bakery', 'Cafe', 'Healthy'],
    rating: 4.6,
    ratingCount: 1050,
    deliveryTime: '25-30 mins',
    priceForTwo: 400,
    location: { area: 'Sadashivanagar', city: 'Bangalore' },
    features: { pureVeg: true, outdoorSeating: true, openNow: true },
    offers: [{ title: 'Buy 2 Get 1', description: 'On all pastries' }],
    timings: { open: '08:00 AM', close: '10:00 PM', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    menu: [
      { id: 'dish-1701', name: 'Artisan Sourdough', category: 'Bakery', description: 'Slow-fermented sourdough with a crispy crust and chewy open crumb using heirloom wheat.', price: 180, image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: true },
      { id: 'dish-1702', name: 'Croissant', category: 'Bakery', description: 'Flaky buttery croissant with honeyed layers, baked golden every morning for peak freshness.', price: 120, image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: true },
      { id: 'dish-1703', name: 'Tiramisu', category: 'Desserts', description: 'Classic Italian tiramisu with mascarpone cream, espresso-soaked ladyfingers, and cocoa dust.', price: 220, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: true },
      { id: 'dish-1704', name: 'Banana Walnut Muffin', category: 'Bakery', description: 'Moist banana muffin studded with crunchy walnuts — freshly baked and naturally sweetened.', price: 90, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: false },
      { id: 'dish-1705', name: 'Matcha Latte', category: 'Beverages', description: 'Ceremonial grade matcha whisked with oat milk for a creamy and antioxidant-rich drink.', price: 180, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: false },
      { id: 'dish-1706', name: 'Cheesecake Slice', category: 'Desserts', description: 'Dense and velvety New York-style cheesecake on a buttery graham cracker crust.', price: 200, image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: false }
    ]
  },
  {
    id: 'rest-019',
    name: 'Kebab & Grill House',
    slug: 'kebab-and-grill-house',
    logoImage: 'https://i.pinimg.com/736x/c2/47/5e/c2475ea5b1de94f8a9b01e36b7d2f1c4.jpg',
    coverImage: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=320&fit=crop&auto=format&q=60',
    video: '/video/restaurants/KEBAB.mp4',
    cuisines: ['Mughlai', 'Kebab', 'Grills'],
    rating: 4.4,
    ratingCount: 1680,
    deliveryTime: '35-40 mins',
    priceForTwo: 700,
    location: { area: 'Shivajinagar', city: 'Bangalore' },
    features: { pureVeg: false, outdoorSeating: true, openNow: true },
    offers: [{ title: '60% OFF', description: 'Up to ₹200 on first order' }],
    timings: { open: '12:00 PM', close: '12:00 AM', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    menu: [
      { id: 'dish-1801', name: 'Seekh Kebab', category: 'Starters', description: 'Minced mutton blended with herbs and spices, skewered and grilled in a flaming charcoal tandoor.', price: 360, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=400&fit=crop&auto=format&q=60', isVeg: false, isBestseller: true },
      { id: 'dish-1802', name: 'Kakori Kebab', category: 'Starters', description: 'Ultra-smooth mutton kebabs with raw papaya and subtle aromatic spices — melt-in-mouth texture.', price: 420, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&h=400&fit=crop&auto=format&q=60', isVeg: false, isBestseller: true },
      { id: 'dish-1803', name: 'Reshmi Kebab', category: 'Starters', description: 'Silky chicken kebab marinated in cream, cashew, and fresh herbs for a delicate flavor.', price: 340, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop&auto=format&q=60', isVeg: false, isBestseller: false },
      { id: 'dish-1804', name: 'Bihari Murgh', category: 'Main Course', description: 'Succulent chicken cooked with mustard and poppy seeds in a richly spiced Bihari-style gravy.', price: 380, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&h=400&fit=crop&auto=format&q=60', isVeg: false, isBestseller: false },
      { id: 'dish-1805', name: 'Laccha Paratha', category: 'Breads', description: 'Multi-layered whole wheat paratha cooked with ghee — crispy outside, fluffy layers inside.', price: 80, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: false }
    ]
  },
  {
    id: 'rest-020',
    name: 'Noodle Bar Asia',
    slug: 'noodle-bar-asia',
    logoImage: 'https://i.pinimg.com/736x/a3/56/7b/a3567be1c0de75f8a9b01e47b5e3f2d5.jpg',
    coverImage: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=600&h=320&fit=crop&auto=format&q=60',
    video: '/video/restaurants/WOK.mp4',
    cuisines: ['Pan Asian', 'Japanese', 'Thai'],
    rating: 4.3,
    ratingCount: 890,
    deliveryTime: '30-35 mins',
    priceForTwo: 650,
    location: { area: 'MG Road', city: 'Bangalore' },
    features: { pureVeg: false, outdoorSeating: true, openNow: true },
    offers: [{ title: '30% OFF', description: 'On Asian bowls' }],
    timings: { open: '12:00 PM', close: '11:00 PM', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    menu: [
      { id: 'dish-1901', name: 'Ramen Bowl', category: 'Japanese', description: 'Rich tonkotsu broth with ramen noodles, soft-boiled egg, chashu pork, nori, and bamboo shoots.', price: 480, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=600&h=400&fit=crop&auto=format&q=60', isVeg: false, isBestseller: true },
      { id: 'dish-1902', name: 'Pad Thai', category: 'Thai', description: 'Stir-fried rice noodles with tamarind sauce, tofu, bean sprouts, spring onion, and crushed peanuts.', price: 380, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: true },
      { id: 'dish-1903', name: 'Dim Sum Platter', category: 'Chinese', description: 'Assorted steamed and fried dim sum including har gow, siu mai, and vegetable gyoza.', price: 320, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&h=400&fit=crop&auto=format&q=60', isVeg: false, isBestseller: false },
      { id: 'dish-1904', name: 'Green Thai Curry', category: 'Thai', description: 'Fragrant coconut milk green curry with vegetables or chicken, basil, and kaffir lime leaves.', price: 360, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: false },
      { id: 'dish-1905', name: 'Bao Buns', category: 'Starters', description: 'Steamed fluffy bao buns filled with crispy pork belly or spiced tofu and pickled daikon.', price: 280, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop&auto=format&q=60', isVeg: false, isBestseller: false }
    ]
  },
  {
    id: 'rest-021',
    name: 'Malabar Mess',
    slug: 'malabar-mess',
    logoImage: 'https://i.pinimg.com/736x/d1/89/4a/d1894a5c2ef8b1f9a0b01e58b4d3e3e6.jpg',
    coverImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdNKEJ_Lxz2qgjUyiS9HIOy6tc-L9ZKPuEWmxFtDV9PQ&s=10',
    video: '/video/restaurants/BIRIYANI.mp4',
    cuisines: ['Malabar', 'South Indian', 'Seafood'],
    rating: 4.5,
    ratingCount: 770,
    deliveryTime: '30-40 mins',
    priceForTwo: 480,
    location: { area: 'Hennur', city: 'Bangalore' },
    features: { pureVeg: false, outdoorSeating: false, openNow: true },
    offers: [{ title: '40% OFF', description: 'Up to ₹120 on seafood combos' }],
    timings: { open: '11:00 AM', close: '10:30 PM', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    menu: [
      { id: 'dish-2001', name: 'Malabar Chicken Biryani', category: 'Biryani', description: 'Fragrant Malabar-style biryani with small-grain kaima rice, whole spices, and caramelized onions.', price: 360, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=400&fit=crop&auto=format&q=60', isVeg: false, isBestseller: true },
      { id: 'dish-2002', name: 'Chemeen Mappas', category: 'Main Course', description: 'Coastal prawn curry in coconut milk with whole spices, tomato, and Malabar pepper.', price: 400, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&h=400&fit=crop&auto=format&q=60', isVeg: false, isBestseller: true },
      { id: 'dish-2003', name: 'Pathiri', category: 'Breads', description: 'Thin lacy rice flour flatbreads — a Malabar specialty best paired with coastal curries.', price: 60, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: false },
      { id: 'dish-2004', name: 'Thalassery Mutton Curry', category: 'Main Course', description: 'Bold mutton curry marinated with Thalassery spice blend and slow-simmered in coconut gravy.', price: 440, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop&auto=format&q=60', isVeg: false, isBestseller: false },
      { id: 'dish-2005', name: 'Ari Payasam', category: 'Desserts', description: 'Creamy rice kheer cooked in coconut milk with jaggery, cardamom, and cashews.', price: 110, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: false }
    ]
  },
  {
    id: 'rest-022',
    name: 'Pasta & More',
    slug: 'pasta-and-more',
    logoImage: 'https://i.pinimg.com/736x/e2/10/5c/e2105c6d3ef9c2f0a0b01e69b5d4f4f7.jpg',
    coverImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEPUr6uYJsWYlfuHdjBycHhWCTLVKmXeofzQqCVzww6w&s=10',
    video: '/video/restaurants/PIZZA.mp4',
    cuisines: ['Italian', 'Pasta', 'Mediterranean'],
    rating: 4.4,
    ratingCount: 640,
    deliveryTime: '30-35 mins',
    priceForTwo: 600,
    location: { area: 'HSR Layout', city: 'Bangalore' },
    features: { pureVeg: false, outdoorSeating: true, openNow: true },
    offers: [{ title: '35% OFF', description: 'On pasta combos' }],
    timings: { open: '11:30 AM', close: '11:00 PM', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    menu: [
      { id: 'dish-2101', name: 'Cacio e Pepe', category: 'Italian', description: 'Roman classic — spaghetti tossed with Pecorino, Parmigiano, and freshly cracked black pepper.', price: 420, image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023882c?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: true },
      { id: 'dish-2102', name: 'Penne Arrabbiata', category: 'Italian', description: 'Fiery tomato-garlic sauce with penne pasta, olives, capers, and fresh basil leaves.', price: 360, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: true },
      { id: 'dish-2103', name: 'Chicken Carbonara', category: 'Italian', description: 'Creamy egg-based sauce with grilled chicken, pancetta, Pecorino, and silky pasta.', price: 480, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop&auto=format&q=60', isVeg: false, isBestseller: false },
      { id: 'dish-2104', name: 'Focaccia', category: 'Breads', description: 'Soft herb-loaded Italian flatbread brushed with olive oil, sea salt, and rosemary.', price: 200, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: false },
      { id: 'dish-2105', name: 'Panna Cotta', category: 'Desserts', description: 'Velvety Italian cream dessert with berry coulis — silky smooth and perfectly chilled.', price: 240, image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: false },
      { id: 'dish-2106', name: 'Bruschetta', category: 'Starters', description: 'Grilled bread rubbed with garlic, topped with ripe tomatoes, basil, and drizzled olive oil.', price: 220, image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=600&h=400&fit=crop&auto=format&q=60', isVeg: true, isBestseller: false }
    ]
  }
];

const NUTRITION_BY_DISH_ID = {
  // Swadishtt Kitchen
  'dish-001': { calories: 620, protein: 38, carbs: 14, fats: 45 },
  'dish-002': { calories: 540, protein: 24, carbs: 22, fats: 38 },
  'dish-003': { calories: 420, protein: 18, carbs: 36, fats: 22 },
  'dish-004': { calories: 390, protein: 42, carbs: 6, fats: 20 },
  'dish-005': { calories: 290, protein: 8, carbs: 42, fats: 10 },
  'dish-006': { calories: 720, protein: 32, carbs: 74, fats: 30 },

  // Green Leaf Pure Veg
  'dish-101': { calories: 430, protein: 9, carbs: 58, fats: 18 },
  'dish-102': { calories: 260, protein: 9, carbs: 44, fats: 4 },
  'dish-103': { calories: 520, protein: 12, carbs: 74, fats: 18 },
  'dish-104': { calories: 470, protein: 22, carbs: 30, fats: 28 },

  // Biryani House
  'dish-201': { calories: 780, protein: 35, carbs: 82, fats: 34 },
  'dish-202': { calories: 860, protein: 39, carbs: 78, fats: 42 },
  'dish-203': { calories: 590, protein: 12, carbs: 84, fats: 20 },
  'dish-204': { calories: 470, protein: 32, carbs: 18, fats: 28 },
  'dish-205': { calories: 90, protein: 4, carbs: 8, fats: 4 },

  // Dosa Point
  'dish-301': { calories: 430, protein: 9, carbs: 58, fats: 18 },
  'dish-302': { calories: 520, protein: 8, carbs: 56, fats: 28 },
  'dish-303': { calories: 110, protein: 4, carbs: 12, fats: 5 },

  // Pizza Corner
  'dish-401': { calories: 690, protein: 24, carbs: 72, fats: 32 },
  'dish-402': { calories: 820, protein: 34, carbs: 70, fats: 44 },
  'dish-403': { calories: 760, protein: 28, carbs: 74, fats: 38 },
  'dish-404': { calories: 340, protein: 7, carbs: 38, fats: 16 },
  'dish-405': { calories: 380, protein: 5, carbs: 48, fats: 18 },

  // Sweet Treats
  'dish-501': { calories: 520, protein: 7, carbs: 58, fats: 28 },
  'dish-502': { calories: 430, protein: 8, carbs: 54, fats: 20 },
  'dish-503': { calories: 280, protein: 6, carbs: 32, fats: 14 },

  // Burger Junction
  'dish-601': { calories: 640, protein: 32, carbs: 48, fats: 34 },
  'dish-602': { calories: 520, protein: 18, carbs: 50, fats: 28 },
  'dish-603': { calories: 365, protein: 4, carbs: 48, fats: 17 },

  // Royal Tandoor
  'dish-701': { calories: 310, protein: 8, carbs: 44, fats: 12 },
  'dish-702': { calories: 430, protein: 42, carbs: 8, fats: 24 },
  'dish-703': { calories: 540, protein: 22, carbs: 20, fats: 40 },

  // China Wok Express
  'dish-801': { calories: 520, protein: 12, carbs: 74, fats: 18 },
  'dish-802': { calories: 520, protein: 34, carbs: 24, fats: 30 },
  'dish-803': { calories: 320, protein: 7, carbs: 42, fats: 14 },

  // Cafe Mocha
  'dish-901': { calories: 140, protein: 6, carbs: 12, fats: 7 },
  'dish-902': { calories: 420, protein: 6, carbs: 48, fats: 22 },
  'dish-903': { calories: 760, protein: 20, carbs: 68, fats: 42 },

  // Andhra Spice
  'dish-1001': { calories: 590, protein: 36, carbs: 14, fats: 42 },
  'dish-1002': { calories: 680, protein: 38, carbs: 12, fats: 52 },
  'dish-1003': { calories: 720, protein: 22, carbs: 92, fats: 28 },
};

RESTAURANTS.forEach((restaurant) => {
  restaurant.menu = restaurant.menu.map((dish) => ({
    ...dish,
    ...(NUTRITION_BY_DISH_ID[dish.id] || {}),
  }));
});

export const MENU_ITEMS = [
  {
    id: 'dish-001',
    restaurantId: 'rest-001',
    name: 'Butter Chicken',
    description: 'Tender tandoori chicken simmered in a rich buttery tomato gravy finished with cream and aromatic Indian spices.',
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
    description: 'Smoky grilled paneer cubes cooked in creamy tomato gravy with bold North Indian spices and herbs.',
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
    description: 'Authentic dum biryani layered with fragrant basmati rice, tender chicken, saffron, and slow-cooked spices.',
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
    description: 'Golden crispy dosa stuffed with flavorful potato masala and served with coconut chutney and hot sambar.',
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

