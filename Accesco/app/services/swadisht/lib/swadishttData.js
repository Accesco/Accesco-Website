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
    sku: 'SWD-RST-SK-01',
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
      { title: '50% OFF', description: 'Up to ₹100 on orders above ₹199', code: 'SWAD50', discount: 50 },
      { title: 'Free Delivery', description: 'On orders above ₹299', code: 'FREEDEL', discount: 0 }
    ],
    features: { pureVeg: false, acceptsVouchers: true, hasParking: true, servesAlcohol: false, outdoorSeating: true, openNow: true },
    timings: { open: '11:00 AM', close: '11:00 PM', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    menu: [
      {
        id: 'dish-001',
        sku: 'SWD-SK-BTCK-01',
        name: 'Butter Chicken',
        category: 'Main Course',
        description: 'Tender tandoori chicken simmered in a rich buttery tomato gravy finished with fresh cream and aromatic Indian spices.',
        price: 350,
        image: '/assets/images/dishes/high_res_butter_chicken.jpg',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-002',
        sku: 'SWD-SK-PTKM-02',
        name: 'Paneer Tikka Masala',
        category: 'Main Course',
        description: 'Smoky grilled paneer cubes cooked in a creamy onion tomato gravy with bold North Indian spices and herbs.',
        price: 280,
        image: '/assets/images/dishes/high_res_paneer_tikka_masala.jpg',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-003',
        sku: 'SWD-SK-DLMK-03',
        name: 'Dal Makhani',
        category: 'Main Course',
        description: 'Slow-cooked black lentils and kidney beans blended with butter, cream, and traditional Punjabi flavors.',
        price: 220,
        image: '/assets/images/dishes/high_res_dal_makhani.jpg',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-004',
        sku: 'SWD-SK-TDCK-04',
        name: 'Tandoori Chicken',
        category: 'Starters',
        description: 'Juicy chicken marinated overnight in yogurt and spices, then flame-grilled in a traditional clay tandoor.',
        price: 320,
        image: '/assets/images/dishes/high_res_tandoori_chicken.jpg',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-005',
        sku: 'SWD-SK-GLNN-05',
        name: 'Garlic Naan',
        category: 'Breads',
        description: 'Soft freshly baked naan brushed with melted garlic butter and topped with coriander for extra flavor.',
        price: 60,
        image: '/assets/images/dishes/high_res_garlic_naan.jpg',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-006',
        sku: 'SWD-SK-BRYN-06',
        name: 'Biryani',
        category: 'Rice',
        description: 'Fragrant basmati rice layered with spiced meat, caramelized onions, saffron, and slow-cooked dum flavors.',
        price: 380,
        image: '/assets/images/dishes/high_res_biryani.jpg',
        isVeg: false,
        isBestseller: true
      }
    ]
  },
  {
    id: 'rest-002',
    name: 'Green Leaf Pure Veg',
    slug: 'green-leaf-pure-veg',
    sku: 'SWD-RST-GL-02',
    coverImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=320&fit=crop&auto=format&q=60',
    video: '/video/restaurants/SALAD.mp4',
    images: [
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop'
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
      { title: '40% OFF', description: 'Up to ₹80 on orders above ₹159', code: 'GREEN40', discount: 40 }
    ],
    features: { pureVeg: true, acceptsVouchers: true, hasParking: false, servesAlcohol: false, outdoorSeating: false, openNow: true },
    timings: { open: '10:00 AM', close: '10:30 PM', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    menu: [
      {
        id: 'dish-101',
        sku: 'SWD-GL-MSDS-01',
        name: 'Masala Dosa',
        category: 'South Indian',
        description: 'Golden crispy dosa filled with flavorful potato masala and served with coconut chutney and hot sambar.',
        price: 120,
        image: '/assets/images/dishes/high_res_masala_dosa.jpg',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-102',
        sku: 'SWD-GL-IDSB-02',
        name: 'Idli Sambar',
        category: 'South Indian',
        description: 'Soft fluffy idlis served with authentic South Indian sambar and freshly prepared coconut chutney.',
        price: 80,
        image: '/assets/images/dishes/high_res_idli_sambar.jpg',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-103',
        sku: 'SWD-GL-VGFR-03',
        name: 'Veg Fried Rice',
        category: 'Chinese',
        description: 'Wok-tossed fried rice loaded with fresh vegetables, sauces, spring onions, and Indo-Chinese flavors.',
        price: 150,
        image: '/assets/images/dishes/high_res_veg_fried_rice.jpg',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-104',
        sku: 'SWD-GL-PNMC-04',
        name: 'Paneer Manchurian',
        category: 'Chinese',
        description: 'Crispy paneer cubes tossed in spicy garlic soy sauce with onions, capsicum, and spring onions.',
        price: 200,
        image: '/assets/images/dishes/high_res_paneer_manchurian.jpg',
        isVeg: true,
        isBestseller: false
      }
    ]
  },
  {
    id: 'rest-003',
    name: 'Biryani House',
    slug: 'biryani-house',
    sku: 'SWD-RST-BH-03',
    coverImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=320&fit=crop&auto=format&q=60',
    video: '/video/restaurants/BIRIYANI.mp4',
    images: [
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=600&fit=crop'
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
      { title: '60% OFF', description: 'Up to ₹120 on orders above ₹249', code: 'BIRYANI60', discount: 60 }
    ],
    features: { pureVeg: false, acceptsVouchers: true, hasParking: true, servesAlcohol: false, outdoorSeating: true, openNow: true },
    timings: { open: '12:00 PM', close: '11:30 PM', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    menu: [
      {
        id: 'dish-201',
        sku: 'SWD-BH-HDCB-01',
        name: 'Hyderabadi Chicken Biryani',
        category: 'Biryani',
        description: 'Authentic Hyderabadi dum biryani layered with fragrant basmati rice, tender chicken, saffron, and slow-cooked spices.',
        price: 380,
        image: '/assets/images/dishes/high_res_hyderabadi_chicken_biryani.jpg',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-202',
        sku: 'SWD-BH-MTBY-02',
        name: 'Mutton Biryani',
        category: 'Biryani',
        description: 'Rich and flavorful biryani prepared with juicy slow-cooked mutton, aromatic spices, and long-grain basmati rice.',
        price: 450,
        image: '/assets/images/dishes/high_res_mutton_biryani.jpg',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-203',
        sku: 'SWD-BH-VGBY-03',
        name: 'Veg Biryani',
        category: 'Biryani',
        description: 'Fragrant basmati rice cooked with fresh vegetables, herbs, saffron, and traditional biryani masala spices.',
        price: 280,
        image: '/assets/images/dishes/high_res_veg_biryani.jpg',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-204',
        sku: 'SWD-BH-CK65-04',
        name: 'Chicken 65',
        category: 'Starters',
        description: 'Crispy spicy fried chicken tossed with curry leaves, garlic, green chilies, and South Indian seasonings.',
        price: 250,
        image: '/assets/images/dishes/high_res_chicken_65.jpg',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-205',
        sku: 'SWD-BH-RITA-05',
        name: 'Raita',
        category: 'Sides',
        description: 'Refreshing chilled yogurt mixed with cucumber, onions, herbs, and mild spices to complement your biryani.',
        price: 60,
        image: '/assets/images/dishes/high_res_raita.jpg',
        isVeg: true,
        isBestseller: false
      }
    ]
  },
  {
    id: 'rest-004',
    name: 'Dosa Point',
    slug: 'dosa-point',
    sku: 'SWD-RST-DP-04',
    coverImage: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&h=320&fit=crop&auto=format&q=60',
    video: '/video/restaurants/DOSA.mp4',
    cuisines: ['South Indian', 'Breakfast', 'Pure Veg'],
    rating: 4.4,
    ratingCount: 850,
    deliveryTime: '20-25 mins',
    priceForTwo: 250,
    location: { area: 'Whitefield', city: 'Bangalore' },
    features: { pureVeg: true, outdoorSeating: false, openNow: true },
    offers: [{ title: '40% OFF', description: 'Up to ₹100' }],
    menu: [
      {
        id: 'dish-301',
        sku: 'SWD-DP-MSDS-01',
        name: 'Masala Dosa',
        category: 'South Indian',
        description: 'Crispy golden dosa stuffed with flavorful potato masala and served with coconut chutney and hot sambar.',
        price: 140,
        image: '/assets/images/dishes/high_res_masala_dosa.jpg',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-302',
        sku: 'SWD-DP-GRDS-02',
        name: 'Ghee Roast Dosa',
        category: 'South Indian',
        description: 'Thin crispy dosa roasted generously in pure ghee for a rich aroma and authentic South Indian flavor.',
        price: 170,
        image: '/assets/images/dishes/high_res_ghee_roast_dosa.jpg',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-303',
        sku: 'SWD-DP-FTCF-03',
        name: 'Filter Coffee',
        category: 'Beverages',
        description: 'Traditional South Indian filter coffee brewed strong with freshly ground beans and frothy hot milk.',
        price: 60,
        image: '/assets/images/dishes/high_res_filter_coffee.jpg',
        isVeg: true,
        isBestseller: false
      }
    ]
  },
  {
    id: 'rest-005',
    name: 'Pizza Corner',
    slug: 'pizza-corner',
    sku: 'SWD-RST-PC-05',
    coverImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=320&fit=crop&auto=format&q=60',
    video: '/video/restaurants/PIZZA.mp4',
    cuisines: ['Pizza', 'Fast Food', 'Italian'],
    rating: 4.2,
    ratingCount: 620,
    deliveryTime: '30-35 mins',
    priceForTwo: 450,
    location: { area: 'Indiranagar', city: 'Bangalore' },
    features: { pureVeg: false, outdoorSeating: true, openNow: true },
    offers: [{ title: '50% OFF', description: 'Up to ₹150' }],
    menu: [
      {
        id: 'dish-401',
        sku: 'SWD-PC-MGPZ-01',
        name: 'Margherita Pizza',
        category: 'Pizza',
        description: 'Classic Italian-style pizza topped with mozzarella cheese, fresh basil leaves, and rich tomato sauce.',
        price: 280,
        image: '/assets/images/dishes/high_res_margherita_pizza.jpg',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-402',
        sku: 'SWD-PC-PPPZ-02',
        name: 'Pepperoni Pizza',
        category: 'Pizza',
        description: 'Loaded with spicy pepperoni slices, mozzarella cheese, and signature pizza sauce on a crispy crust.',
        price: 420,
        image: '/assets/images/dishes/high_res_pepperoni_pizza.jpg',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-403',
        sku: 'SWD-PC-FHPZ-03',
        name: 'Farmhouse Pizza',
        category: 'Pizza',
        description: 'Cheesy pizza generously topped with onions, capsicum, tomatoes, mushrooms, and fresh vegetables.',
        price: 360,
        image: '/assets/images/dishes/high_res_farmhouse_pizza.jpg',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-404',
        sku: 'SWD-PC-GLBD-04',
        name: 'Garlic Bread',
        category: 'Sides',
        description: 'Freshly baked garlic bread brushed with butter and herbs, served with creamy cheesy dip.',
        price: 160,
        image: '/assets/images/dishes/high_res_garlic_bread.jpg',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-405',
        sku: 'SWD-PC-CLCK-05',
        name: 'Choco Lava Cake',
        category: 'Desserts',
        description: 'Warm chocolate cake with a rich molten chocolate center served fresh for the perfect dessert experience.',
        price: 140,
        image: '/assets/images/dishes/high_res_choco_lava_cake.jpg',
        isVeg: true,
        isBestseller: true
      }
    ]
  },
  {
    id: 'rest-006',
    name: 'Sweet Treats',
    slug: 'sweet-treats',
    sku: 'SWD-RST-ST-06',
    coverImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=320&fit=crop&auto=format&q=60',
    video: '/video/restaurants/DESSERT.mp4',
    cuisines: ['Desserts', 'Bakery', 'Ice Cream'],
    rating: 4.5,
    ratingCount: 740,
    deliveryTime: '25-30 mins',
    priceForTwo: 300,
    location: { area: 'Koramangala', city: 'Bangalore' },
    features: { pureVeg: true, outdoorSeating: false, openNow: true },
    offers: [{ title: '30% OFF', description: 'On desserts' }],
    menu: [
      {
        id: 'dish-501',
        sku: 'SWD-ST-CTCK-01',
        name: 'Chocolate Truffle Cake',
        category: 'Desserts',
        description: 'Decadent layered chocolate truffle cake made with rich cocoa, smooth ganache, and creamy chocolate frosting.',
        price: 220,
        image: '/assets/images/dishes/high_res_chocolate_truffle_cake.jpg',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-502',
        sku: 'SWD-ST-BGWF-02',
        name: 'Belgian Waffle',
        category: 'Desserts',
        description: 'Freshly baked Belgian waffle served warm with chocolate sauce, whipped cream, and sweet toppings.',
        price: 190,
        image: '/assets/images/dishes/high_res_belgian_waffle.jpg',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-503',
        sku: 'SWD-ST-CLCF-03',
        name: 'Cold Coffee',
        category: 'Beverages',
        description: 'Creamy chilled coffee blended with milk, ice cream, and rich coffee flavors for a refreshing drink.',
        price: 140,
        image: '/assets/images/dishes/high_res_cold_coffee.jpg',
        isVeg: true,
        isBestseller: false
      }
    ]
  },
  {
    id: 'rest-007',
    name: 'Burger Junction',
    slug: 'burger-junction',
    sku: 'SWD-RST-BJ-07',
    coverImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=320&fit=crop&auto=format&q=60',
    video: '/video/restaurants/burger.mp4',
    cuisines: ['Burgers', 'Fast Food', 'American'],
    rating: 4.3,
    ratingCount: 980,
    deliveryTime: '25-30 mins',
    priceForTwo: 350,
    location: { area: 'BTM Layout', city: 'Bangalore' },
    features: { pureVeg: false, outdoorSeating: true, openNow: true },
    offers: [{ title: '45% OFF', description: 'Up to ₹120' }],
    menu: [
      {
        id: 'dish-601',
        sku: 'SWD-BJ-CCBG-01',
        name: 'Classic Chicken Burger',
        category: 'Burgers',
        description: 'Juicy grilled chicken burger layered with fresh lettuce, cheese, signature sauce, and crispy fries on the side.',
        price: 260,
        image: '/assets/images/dishes/high_res_classic_chicken_burger.jpg',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-602',
        sku: 'SWD-BJ-VCBG-02',
        name: 'Veg Cheese Burger',
        category: 'Burgers',
        description: 'Loaded vegetable patty burger with melted cheese, crunchy lettuce, fresh veggies, and creamy burger sauce.',
        price: 220,
        image: '/assets/images/dishes/high_res_veg_cheese_burger.jpg',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-603',
        sku: 'SWD-BJ-PPFR-03',
        name: 'Peri Peri Fries',
        category: 'Sides',
        description: 'Crispy golden fries tossed with spicy peri peri seasoning and served hot with creamy dipping sauce.',
        price: 140,
        image: '/assets/images/dishes/high_res_peri_peri_fries.jpg',
        isVeg: true,
        isBestseller: false
      }
    ]
  },
  {
    id: 'rest-008',
    name: 'Royal Tandoor',
    slug: 'royal-tandoor',
    sku: 'SWD-RST-RT-08',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=320&fit=crop&auto=format&q=60',
    video: '/video/restaurants/KEBAB.mp4',
    cuisines: ['North Indian', 'Tandoor', 'Mughlai'],
    rating: 4.6,
    ratingCount: 1500,
    deliveryTime: '35-40 mins',
    priceForTwo: 600,
    location: { area: 'Jayanagar', city: 'Bangalore' },
    features: { pureVeg: false, outdoorSeating: true, openNow: true },
    offers: [{ title: '55% OFF', description: 'Flat ₹150 off' }],
    menu: [
      {
        id: 'dish-701',
        sku: 'SWD-RT-BTNN-01',
        name: 'Butter Naan',
        category: 'Breads',
        description: 'Soft freshly baked naan brushed generously with melted butter and served warm from the tandoor.',
        price: 70,
        image: '/assets/images/dishes/high_res_butter_naan.jpg',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-702',
        sku: 'SWD-RT-CKTK-02',
        name: 'Chicken Tikka',
        category: 'Starters',
        description: 'Juicy chicken tikka marinated in yogurt and spices, then flame-grilled in a traditional tandoor oven.',
        price: 340,
        image: '/assets/images/dishes/high_res_chicken_tikka.jpg',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-703',
        sku: 'SWD-RT-PBMS-03',
        name: 'Paneer Butter Masala',
        category: 'Main Course',
        description: 'Soft paneer cubes cooked in a creamy buttery tomato gravy with rich North Indian spices and herbs.',
        price: 290,
        image: '/assets/images/dishes/high_res_paneer_butter_masala.jpg',
        isVeg: true,
        isBestseller: true
      }
    ]
  },
  {
    id: 'rest-009',
    name: 'China Wok Express',
    slug: 'china-wok-express',
    sku: 'SWD-RST-CW-09',
    coverImage: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&h=320&fit=crop&auto=format&q=60',
    video: '/video/restaurants/WOK.mp4',
    cuisines: ['Chinese', 'Asian', 'Noodles'],
    rating: 4.1,
    ratingCount: 720,
    deliveryTime: '30-35 mins',
    priceForTwo: 400,
    location: { area: 'Marathahalli', city: 'Bangalore' },
    features: { pureVeg: false, outdoorSeating: false, openNow: true },
    offers: [{ title: '30% OFF', description: 'On Chinese combos' }],
    menu: [
      {
        id: 'dish-801',
        sku: 'SWD-CW-HKND-01',
        name: 'Hakka Noodles',
        category: 'Chinese',
        description: 'Wok-tossed hakka noodles stir-fried with fresh vegetables, sauces, and bold Indo-Chinese flavors.',
        price: 210,
        image: '/assets/images/dishes/high_res_hakka_noodles.jpg',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-802',
        sku: 'SWD-CW-CKMC-02',
        name: 'Chicken Manchurian',
        category: 'Chinese',
        description: 'Crispy chicken pieces tossed in spicy garlic soy sauce with onions, capsicum, and spring onions.',
        price: 280,
        image: '/assets/images/dishes/high_res_chicken_manchurian.jpg',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-803',
        sku: 'SWD-CW-SPRL-03',
        name: 'Spring Rolls',
        category: 'Starters',
        description: 'Crunchy golden spring rolls stuffed with seasoned vegetables and served with spicy dipping sauce.',
        price: 180,
        image: '/assets/images/dishes/high_res_spring_rolls.jpg',
        isVeg: true,
        isBestseller: false
      }
    ]
  },
  {
    id: 'rest-010',
    name: 'Cafe Mocha',
    slug: 'cafe-mocha',
    sku: 'SWD-RST-CM-10',
    coverImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=320&fit=crop&auto=format&q=60',
    video: '/video/restaurants/COFFEE.mp4',
    cuisines: ['Cafe', 'Beverages', 'Desserts'],
    rating: 4.7,
    ratingCount: 1800,
    deliveryTime: '20-25 mins',
    priceForTwo: 550,
    location: { area: 'Indiranagar', city: 'Bangalore' },
    features: { pureVeg: true, outdoorSeating: true, openNow: true },
    offers: [{ title: 'Buy 1 Get 1', description: 'On beverages' }],
    menu: [
      {
        id: 'dish-901',
        sku: 'SWD-CM-CPCN-01',
        name: 'Cappuccino',
        category: 'Beverages',
        description: 'Freshly brewed cappuccino topped with rich milk foam and crafted using premium roasted coffee beans.',
        price: 180,
        image: '/assets/images/dishes/high_res_cappuccino.jpg',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-902',
        sku: 'SWD-CM-RVPT-02',
        name: 'Red Velvet Pastry',
        category: 'Desserts',
        description: 'Soft and moist red velvet pastry layered with smooth cream cheese frosting and chocolate garnish.',
        price: 160,
        image: '/assets/images/dishes/high_res_red_velvet_pastry.jpg',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-903',
        sku: 'SWD-CM-PSAF-03',
        name: 'Pasta Alfredo',
        category: 'Italian',
        description: 'Creamy Alfredo pasta tossed with white sauce, herbs, garlic, parmesan cheese, and fresh vegetables.',
        price: 320,
        image: '/assets/images/dishes/high_res_pasta_alfredo.jpg',
        isVeg: true,
        isBestseller: false
      }
    ]
  },
  {
    id: 'rest-011',
    name: 'Andhra Spice',
    slug: 'andhra-spice',
    sku: 'SWD-RST-AS-11',
    coverImage: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&h=320&fit=crop&auto=format&q=60',
    video: '/video/restaurants/ANDHRAFISH.mp4',
    cuisines: ['Andhra', 'South Indian', 'Spicy'],
    rating: 4.5,
    ratingCount: 1120,
    deliveryTime: '30-40 mins',
    priceForTwo: 450,
    location: { area: 'Electronic City', city: 'Bangalore' },
    features: { pureVeg: false, outdoorSeating: false, openNow: true },
    offers: [{ title: '50% OFF', description: 'Up to ₹100' }],
    menu: [
      {
        id: 'dish-1001',
        sku: 'SWD-AS-ACCR-01',
        name: 'Andhra Chicken Curry',
        category: 'Main Course',
        description: 'Fiery Andhra-style chicken curry slow-cooked with roasted spices, curry leaves, and traditional regional flavors.',
        price: 340,
        image: '/assets/images/dishes/high_res_andhra_chicken_curry.jpg',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-1002',
        sku: 'SWD-AS-GGMT-02',
        name: 'Gongura Mutton',
        category: 'Main Course',
        description: 'Tender mutton cooked with tangy gongura leaves, aromatic spices, and authentic Andhra-style seasoning.',
        price: 420,
        image: '/assets/images/dishes/high_res_gongura_mutton.jpg',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-1003',
        sku: 'SWD-AS-ANML-03',
        name: 'Andhra Meals',
        category: 'Meals',
        description: 'Traditional Andhra-style thali served with rice, curries, dal, chutneys, papad, and regional specialties.',
        price: 260,
        image: '/assets/images/dishes/high_res_andhra_meals.jpg',
        isVeg: true,
        isBestseller: false
      }
    ]
  },
  {
    id: 'rest-012',
    name: 'Coastal Kitchen',
    slug: 'coastal-kitchen',
    sku: 'SWD-RST-CK-12',
    coverImage: 'https://images.unsplash.com/photo-1574484284002-952d92a03a52?w=600&h=320&fit=crop&auto=format&q=60',
    video: null,
    images: ['https://images.unsplash.com/photo-1574484284002-952d92a03a52?w=800&h=600&fit=crop'],
    rating: 4.7,
    ratingCount: 1420,
    cuisines: ['Coastal', 'Seafood', 'Goan'],
    priceForTwo: 600,
    deliveryTime: '35-45 mins',
    location: { area: 'Whitefield', city: 'Bangalore', coordinates: { lat: 12.9698, lng: 77.7499 } },
    offers: [{ title: '30% OFF', description: 'Up to ₹90 on orders above ₹349', code: 'SEA30', discount: 30 }],
    features: { pureVeg: false, acceptsVouchers: true, hasParking: true, servesAlcohol: false, outdoorSeating: true, openNow: true },
    timings: { open: '12:00 PM', close: '11:00 PM', days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
    menu: [
      { id: 'dish-1101', sku: 'SWD-CK-MBFC-01', name: 'Malabar Fish Curry', category: 'Main Course', description: 'Coastal Kerala-style fish curry slow-simmered in raw mango, coconut milk and bold spices.', price: 380, image: '/assets/images/dishes/high_res_malabar_fish_curry.jpg', isVeg: false, isBestseller: true },
      { id: 'dish-1102', sku: 'SWD-CK-PGRS-02', name: 'Prawn Ghee Roast', category: 'Starters', description: 'Mangalorean prawns roasted in ghee with fiery red chilli paste and aromatic spices.', price: 460, image: '/assets/images/dishes/high_res_prawn_ghee_roast.jpg', isVeg: false, isBestseller: true },
      { id: 'dish-1103', sku: 'SWD-CK-CBCR-03', name: 'Crab Curry', category: 'Main Course', description: 'Fresh crab cooked in spiced coconut gravy with fresh green chillies and mustard tempering.', price: 520, image: '/assets/images/dishes/high_res_crab_curry.jpg', isVeg: false, isBestseller: false },
      { id: 'dish-1104', sku: 'SWD-CK-APST-04', name: 'Appam with Stew', category: 'Main Course', description: 'Fluffy rice appams paired with mild coconut vegetable stew, a Kerala classic.', price: 180, image: '/assets/images/dishes/high_res_appam_with_stew.jpg', isVeg: true, isBestseller: false }
    ]
  },
  {
    id: 'rest-013',
    name: 'Mumbai Chaat House',
    slug: 'mumbai-chaat-house',
    sku: 'SWD-RST-MC-13',
    coverImage: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&h=320&fit=crop&auto=format&q=60',
    video: null,
    images: ['https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&h=600&fit=crop'],
    rating: 4.4,
    ratingCount: 980,
    cuisines: ['Street Food', 'Mumbai', 'Chaat'],
    priceForTwo: 200,
    deliveryTime: '15-25 mins',
    location: { area: 'Jayanagar', city: 'Bangalore', coordinates: { lat: 12.9250, lng: 77.5938 } },
    offers: [{ title: '25% OFF', description: 'On orders above ₹149', code: 'CHAAT25', discount: 25 }],
    features: { pureVeg: true, acceptsVouchers: false, hasParking: false, servesAlcohol: false, outdoorSeating: false, openNow: true },
    timings: { open: '11:00 AM', close: '10:30 PM', days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
    menu: [
      { id: 'dish-1201', sku: 'SWD-MC-PVBJ-01', name: 'Pav Bhaji', category: 'Street Food', description: 'Spiced vegetable mash served with buttered toasted pav buns and a squeeze of lime.', price: 120, image: '/assets/images/dishes/high_res_pav_bhaji.jpg', isVeg: true, isBestseller: true },
      { id: 'dish-1202', sku: 'SWD-MC-BLPR-02', name: 'Bhel Puri', category: 'Chaat', description: 'Classic Mumbai street mix of puffed rice, sev, onions, and chutneys tossed to order.', price: 80, image: '/assets/images/dishes/high_res_bhel_puri.jpg', isVeg: true, isBestseller: true },
      { id: 'dish-1203', sku: 'SWD-MC-VDPV-03', name: 'Vada Pav', category: 'Street Food', description: 'Crispy fried spiced potato vada nestled in a soft pav with chutneys and fried green chilli.', price: 60, image: '/assets/images/dishes/high_res_vada_pav.jpg', isVeg: true, isBestseller: true },
      { id: 'dish-1204', sku: 'SWD-MC-SVPR-04', name: 'Sev Puri', category: 'Chaat', description: 'Crispy puris topped with potatoes, raw mango, tamarind chutney, and fine sev.', price: 90, image: '/assets/images/dishes/high_res_sev_puri.jpg', isVeg: true, isBestseller: false }
    ]
  },
  {
    id: 'rest-014',
    name: 'Rajasthani Haveli',
    slug: 'rajasthani-haveli',
    sku: 'SWD-RST-RH-14',
    coverImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=320&fit=crop&auto=format&q=60',
    video: null,
    images: ['https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop'],
    rating: 4.5,
    ratingCount: 780,
    cuisines: ['Rajasthani', 'North Indian', 'Vegetarian'],
    priceForTwo: 450,
    deliveryTime: '30-40 mins',
    location: { area: 'RT Nagar', city: 'Bangalore', coordinates: { lat: 13.0194, lng: 77.5985 } },
    offers: [{ title: 'Thali Combo', description: 'Free dessert on unlimited thali orders', code: 'HAVELI20', discount: 20 }],
    features: { pureVeg: true, acceptsVouchers: true, hasParking: true, servesAlcohol: false, outdoorSeating: true, openNow: true },
    timings: { open: '11:30 AM', close: '10:30 PM', days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
    menu: [
      { id: 'dish-1301', sku: 'SWD-RH-DBCM-01', name: 'Dal Baati Churma', category: 'Main Course', description: 'Baked wheat baati served with five-lentil dal and sweet churma — a Rajasthani classic.', price: 320, image: '/assets/images/dishes/high_res_dal_baati_churma.jpg', isVeg: true, isBestseller: true },
      { id: 'dish-1302', sku: 'SWD-RH-LLMS-02', name: 'Laal Maas', category: 'Main Course', description: 'Bold Rajasthani mutton curry cooked with mathania red chillies and a robust spice paste.', price: 440, image: '/assets/images/dishes/high_res_laal_maas.jpg', isVeg: false, isBestseller: true },
      { id: 'dish-1303', sku: 'SWD-RH-KSSB-03', name: 'Ker Sangri Sabzi', category: 'Main Course', description: 'Desert beans and berries cooked in traditional Rajasthani style with dried spices.', price: 220, image: '/assets/images/dishes/high_res_ker_sangri_sabzi.jpg', isVeg: true, isBestseller: false },
      { id: 'dish-1304', sku: 'SWD-RH-RJTL-04', name: 'Rajasthani Thali', category: 'Thali', description: 'Complete unlimited thali with dal, curries, breads, rice, pickles, sweets, and buttermilk.', price: 380, image: '/assets/images/dishes/high_res_rajasthani_thali.jpg', isVeg: true, isBestseller: true }
    ]
  },
  {
    id: 'rest-015',
    name: 'Bengali Bhojon Ghar',
    slug: 'bengali-bhojon-ghar',
    sku: 'SWD-RST-BB-15',
    coverImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=320&fit=crop&auto=format&q=60',
    video: null,
    images: ['https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=600&fit=crop'],
    rating: 4.6,
    ratingCount: 620,
    cuisines: ['Bengali', 'Fish', 'East Indian'],
    priceForTwo: 480,
    deliveryTime: '30-40 mins',
    location: { area: 'Shivajinagar', city: 'Bangalore', coordinates: { lat: 12.9850, lng: 77.6021 } },
    offers: [{ title: '20% OFF', description: 'On fish dishes above ₹249', code: 'BENGAL20', discount: 20 }],
    features: { pureVeg: false, acceptsVouchers: false, hasParking: false, servesAlcohol: false, outdoorSeating: false, openNow: true },
    timings: { open: '12:00 PM', close: '10:00 PM', days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
    menu: [
      { id: 'dish-1401', sku: 'SWD-BB-MCJL-01', name: 'Macher Jhol', category: 'Main Course', description: 'Light Bengali mustard-oil fish curry with potatoes and nigella seeds — a home comfort classic.', price: 320, image: '/assets/images/dishes/high_res_macher_jhol.jpg', isVeg: false, isBestseller: true },
      { id: 'dish-1402', sku: 'SWD-BB-KSMG-02', name: 'Kosha Mangsho', category: 'Main Course', description: 'Slow-cooked caramelised mutton in a thick dark gravy with whole spices and caramelised onions.', price: 420, image: '/assets/images/dishes/high_res_kosha_mangsho.jpg', isVeg: false, isBestseller: true },
      { id: 'dish-1403', sku: 'SWD-BB-SSIL-03', name: 'Sorshe Ilish', category: 'Main Course', description: 'Hilsa fish cooked in tangy mustard gravy — the pride of Bengali cuisine.', price: 560, image: '/assets/images/dishes/high_res_sorshe_ilish.jpg', isVeg: false, isBestseller: true },
      { id: 'dish-1404', sku: 'SWD-BB-MTDI-04', name: 'Mishti Doi', category: 'Desserts', description: 'Sweetened fermented yogurt set in clay pots — a quintessential Bengali sweet ending.', price: 80, image: '/assets/images/dishes/high_res_mishti_doi.jpg', isVeg: true, isBestseller: false }
    ]
  },
  {
    id: 'rest-016',
    name: 'Kerala Nadan Kitchen',
    slug: 'kerala-nadan-kitchen',
    sku: 'SWD-RST-KN-16',
    coverImage: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&h=320&fit=crop&auto=format&q=60',
    video: null,
    images: ['https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&h=600&fit=crop'],
    rating: 4.7,
    ratingCount: 1060,
    cuisines: ['Kerala', 'South Indian', 'Seafood'],
    priceForTwo: 420,
    deliveryTime: '25-35 mins',
    location: { area: 'Electronic City', city: 'Bangalore', coordinates: { lat: 12.8456, lng: 77.6603 } },
    offers: [{ title: '35% OFF', description: 'Up to ₹100 on first Kerala order', code: 'NADAN35', discount: 35 }],
    features: { pureVeg: false, acceptsVouchers: true, hasParking: true, servesAlcohol: false, outdoorSeating: true, openNow: true },
    timings: { open: '7:00 AM', close: '10:00 PM', days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
    menu: [
      { id: 'dish-1501', sku: 'SWD-KN-KLCC-01', name: 'Kerala Chicken Curry', category: 'Main Course', description: 'Nadan chicken curry cooked with coconut milk, raw mango, and ground spices on a slow flame.', price: 320, image: '/assets/images/dishes/high_res_kerala_chicken_curry.jpg', isVeg: false, isBestseller: true },
      { id: 'dish-1502', sku: 'SWD-KN-PTKC-02', name: 'Puttu & Kadala Curry', category: 'Breakfast', description: 'Steamed rice cake cylinders paired with spiced black chickpea curry and coconut scraping.', price: 130, image: '/assets/images/dishes/high_res_puttu_and_kadala_curry.jpg', isVeg: true, isBestseller: true },
      { id: 'dish-1503', sku: 'SWD-KN-KPBC-03', name: 'Kerala Parotta with Beef Curry', category: 'Main Course', description: 'Layered flaky parotta served with slow-cooked Kerala-style beef curry tempered in coconut oil.', price: 280, image: '/assets/images/dishes/high_res_kerala_parotta_with_beef_curry.jpg', isVeg: false, isBestseller: true },
      { id: 'dish-1504', sku: 'SWD-KN-FSML-04', name: 'Fish Molee', category: 'Main Course', description: 'Mild and creamy Kerala fish curry in turmeric-laced coconut milk with green chillies and tomato.', price: 360, image: '/assets/images/dishes/high_res_fish_molee.jpg', isVeg: false, isBestseller: false }
    ]
  },
  {
    id: 'rest-017',
    name: 'The Pasta Lab',
    slug: 'the-pasta-lab',
    sku: 'SWD-RST-TL-17',
    coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=320&fit=crop&auto=format&q=60',
    video: null,
    images: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop'],
    rating: 4.3,
    ratingCount: 540,
    cuisines: ['Italian', 'Continental', 'Pizza'],
    priceForTwo: 700,
    deliveryTime: '30-40 mins',
    location: { area: 'Koramangala', city: 'Bangalore', coordinates: { lat: 12.9352, lng: 77.6245 } },
    offers: [{ title: 'Combo Deal', description: 'Pasta + Garlic Bread + Drink at ₹399', code: 'PASTA399', discount: 15 }],
    features: { pureVeg: false, acceptsVouchers: true, hasParking: false, servesAlcohol: false, outdoorSeating: false, openNow: true },
    timings: { open: '12:00 PM', close: '11:30 PM', days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
    menu: [
      { id: 'dish-1601', sku: 'SWD-TL-AEOO-01', name: 'Aglio e Olio', category: 'Pasta', description: 'Spaghetti tossed in olive oil, garlic, chilli flakes, and parsley — simple Italian perfection.', price: 320, image: '/assets/images/dishes/high_res_aglio_e_olio.jpg', isVeg: true, isBestseller: true },
      { id: 'dish-1602', sku: 'SWD-TL-ARPN-02', name: 'Arrabiata Penne', category: 'Pasta', description: 'Penne pasta in fiery tomato-garlic sauce with fresh basil and a generous parmesan finish.', price: 290, image: '/assets/images/dishes/high_res_arrabiata_penne.jpg', isVeg: true, isBestseller: false },
      { id: 'dish-1603', sku: 'SWD-TL-CKBL-03', name: 'Chicken Bolognese', category: 'Pasta', description: 'Rich slow-cooked chicken and tomato ragu on fresh egg tagliatelle with aged parmesan.', price: 420, image: '/assets/images/dishes/high_res_chicken_bolognese.jpg', isVeg: false, isBestseller: true },
      { id: 'dish-1604', sku: 'SWD-TL-MGPZ-04', name: 'Margherita Pizza', category: 'Pizza', description: 'Classic Neapolitan pizza with San Marzano tomato, fresh mozzarella, and fragrant basil.', price: 380, image: '/assets/images/dishes/high_res_margherita_pizza.jpg', isVeg: true, isBestseller: true }
    ]
  },
  {
    id: 'rest-018',
    name: 'Punjabi Dhaba',
    slug: 'punjabi-dhaba',
    sku: 'SWD-RST-PD-18',
    coverImage: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=320&fit=crop&auto=format&q=60',
    video: null,
    images: ['https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&h=600&fit=crop'],
    rating: 4.6,
    ratingCount: 1100,
    cuisines: ['North Indian', 'Punjabi', 'Tandoor'],
    priceForTwo: 350,
    deliveryTime: '25-30 mins',
    location: { area: 'Indiranagar', city: 'Bangalore', coordinates: { lat: 12.9716, lng: 77.6412 } },
    offers: [{ title: '25% OFF', description: 'On orders above ₹199', code: 'PUNJAB25', discount: 25 }],
    features: { pureVeg: true, acceptsVouchers: true, hasParking: false, servesAlcohol: false, outdoorSeating: true, openNow: true },
    timings: { open: '11:00 AM', close: '11:00 PM', days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
    menu: [
      { id: 'dish-1701', sku: 'SWD-PD-SKSG-01', name: 'Sarson Ka Saag', category: 'North Indian', description: 'Traditional Punjabi dish made of mustard leaves served with butter.', price: 240, image: '/assets/images/dishes/high_res_sarson_ka_saag.jpg', isVeg: true, isBestseller: true },
      { id: 'dish-1702', sku: 'SWD-PD-MKDR-02', name: 'Makki Di Roti', category: 'Breads', description: 'Cornmeal flatbread prepared traditionally on a tandoor skillet.', price: 60, image: '/assets/images/dishes/high_res_makki_di_roti.jpg', isVeg: true, isBestseller: true },
      { id: 'dish-1703', sku: 'SWD-PD-ASKC-03', name: 'Amritsari Kulcha', category: 'Breads', description: 'Crisp stuffed flatbread served with chole and tangy chutney.', price: 120, image: '/assets/images/dishes/high_res_amritsari_kulcha.jpg', isVeg: true, isBestseller: true },
      { id: 'dish-1704', sku: 'SWD-PD-PNBJ-04', name: 'Paneer Bhurji', category: 'Main Course', description: 'Spiced scrambled paneer cooked with onions, tomatoes and green chillies.', price: 260, image: '/assets/images/dishes/high_res_paneer_bhurji.jpg', isVeg: true, isBestseller: false },
      { id: 'dish-1705', sku: 'SWD-PD-LSSI-05', name: 'Punjabi Lassi', category: 'Beverages', description: 'Sweet thick yogurt drink topped with a layer of fresh malai.', price: 80, image: '/assets/images/dishes/high_res_punjabi_lassi.jpg', isVeg: true, isBestseller: false }
    ]
  },
  {
    id: 'rest-019',
    name: 'Mughlai Palace',
    slug: 'mughlai-palace',
    sku: 'SWD-RST-MP-19',
    coverImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=320&fit=crop&auto=format&q=60',
    video: null,
    images: ['https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop'],
    rating: 4.5,
    ratingCount: 880,
    cuisines: ['Mughlai', 'Biryani', 'North Indian'],
    priceForTwo: 550,
    deliveryTime: '30-40 mins',
    location: { area: 'HSR Layout', city: 'Bangalore', coordinates: { lat: 12.9121, lng: 77.6446 } },
    offers: [{ title: '30% OFF', description: 'Up to ₹120', code: 'MUGH30', discount: 30 }],
    features: { pureVeg: false, acceptsVouchers: true, hasParking: true, servesAlcohol: false, outdoorSeating: false, openNow: true },
    timings: { open: '12:00 PM', close: '11:00 PM', days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
    menu: [
      { id: 'dish-1801', sku: 'SWD-MP-SHTK-01', name: 'Shahi Tukda', category: 'Desserts', description: 'Rich royal bread pudding made with ghee, condensed milk and saffron.', price: 150, image: '/assets/images/dishes/high_res_shahi_tukda.jpg', isVeg: true, isBestseller: true },
      { id: 'dish-1802', sku: 'SWD-MP-MTKM-02', name: 'Mutton Korma', category: 'Main Course', description: 'Classic mutton stew cooked with yogurt, spices and paste of cashews.', price: 420, image: '/assets/images/dishes/high_res_mutton_korma.jpg', isVeg: false, isBestseller: true },
      { id: 'dish-1803', sku: 'SWD-MP-CKJH-03', name: 'Chicken Jahangiri', category: 'Main Course', description: 'Rich chicken curry cooked in royal Mughlai spices and thick cream gravy.', price: 380, image: '/assets/images/dishes/high_res_chicken_jahangiri.jpg', isVeg: false, isBestseller: true },
      { id: 'dish-1804', sku: 'SWD-MP-KMRT-04', name: 'Khamiri Roti', category: 'Breads', description: 'Thick puffy fermented flatbread baked inside tandoor clay oven.', price: 60, image: '/assets/images/dishes/high_res_khamiri_roti.jpg', isVeg: true, isBestseller: false },
      { id: 'dish-1805', sku: 'SWD-MP-SRKM-05', name: 'Sheer Khurma', category: 'Desserts', description: 'Festive vermicelli pudding prepared with milk, dates and assorted nuts.', price: 160, image: '/assets/images/dishes/high_res_sheer_khurma.jpg', isVeg: true, isBestseller: false }
    ]
  },
  {
    id: 'rest-020',
    name: 'South Indian Spice',
    slug: 'south-indian-spice',
    sku: 'SWD-RST-SS-20',
    coverImage: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&h=320&fit=crop&auto=format&q=60',
    video: null,
    images: ['https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&h=600&fit=crop'],
    rating: 4.4,
    ratingCount: 650,
    cuisines: ['South Indian', 'Chettinad', 'Pure Veg'],
    priceForTwo: 280,
    deliveryTime: '20-25 mins',
    location: { area: 'Whitefield', city: 'Bangalore', coordinates: { lat: 12.9698, lng: 77.7499 } },
    offers: [{ title: '20% OFF', description: 'On all Chettinad specialties', code: 'SPICE20', discount: 20 }],
    features: { pureVeg: true, acceptsVouchers: true, hasParking: false, servesAlcohol: false, outdoorSeating: false, openNow: true },
    timings: { open: '7:00 AM', close: '10:30 PM', days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
    menu: [
      { id: 'dish-1901', sku: 'SWD-SS-CNVC-01', name: 'Chettinad Veg Curry', category: 'South Indian', description: 'Spicy mixed vegetables cooked in freshly ground Chettinad spices.', price: 220, image: '/assets/images/dishes/high_res_chettinad_veg_curry.jpg', isVeg: true, isBestseller: true },
      { id: 'dish-1902', sku: 'SWD-SS-LMRC-02', name: 'Lemon Rice', category: 'Rice', description: 'Tangy rice dish tempered with curry leaves, peanuts and lemon juice.', price: 140, image: '/assets/images/dishes/high_res_lemon_rice.jpg', isVeg: true, isBestseller: false },
      { id: 'dish-1903', sku: 'SWD-SS-MDVD-03', name: 'Medu Vada', category: 'South Indian', description: 'Crispy deep-fried lentil donuts served with chutney and sambar.', price: 90, image: '/assets/images/dishes/high_res_medu_vada.jpg', isVeg: true, isBestseller: true },
      { id: 'dish-1904', sku: 'SWD-SS-RODS-04', name: 'Rava Onion Dosa', category: 'South Indian', description: 'Crisp semolina crepe topped with chopped onions and coriander.', price: 160, image: '/assets/images/dishes/high_res_rava_onion_dosa.jpg', isVeg: true, isBestseller: true },
      { id: 'dish-1905', sku: 'SWD-SS-Paypay-05', name: 'Elaneer Payasam', category: 'Desserts', description: 'Sweet dessert pudding made with tender coconut pulp and milk.', price: 100, image: '/assets/images/dishes/high_res_elaneer_payasam.jpg', isVeg: true, isBestseller: false }
    ]
  },
  {
    id: 'rest-021',
    name: 'Dessert Lab',
    slug: 'dessert-lab',
    sku: 'SWD-RST-DL-21',
    coverImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=320&fit=crop&auto=format&q=60',
    video: null,
    images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop'],
    rating: 4.7,
    ratingCount: 1540,
    cuisines: ['Desserts', 'Ice Cream', 'Bakery'],
    priceForTwo: 400,
    deliveryTime: '15-20 mins',
    location: { area: 'Koramangala', city: 'Bangalore', coordinates: { lat: 12.9352, lng: 77.6245 } },
    offers: [{ title: 'Free Brownie', description: 'On orders above ₹399', code: 'LABFREE', discount: 0 }],
    features: { pureVeg: true, acceptsVouchers: true, hasParking: true, servesAlcohol: false, outdoorSeating: true, openNow: true },
    timings: { open: '12:00 PM', close: '11:30 PM', days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
    menu: [
      { id: 'dish-2001', sku: 'SWD-DL-TRMS-01', name: 'Classic Tiramisu', category: 'Desserts', description: 'Italian coffee-flavored dessert made of ladyfingers dipped in coffee, layered with mascarpone.', price: 240, image: '/assets/images/dishes/high_res_classic_tiramisu.jpg', isVeg: true, isBestseller: true },
      { id: 'dish-2002', sku: 'SWD-DL-MGCS-02', name: 'Mango Cheesecake', category: 'Desserts', description: 'Creamy cheese filling set on biscuit crust topped with sweet Alphonso glaze.', price: 260, image: '/assets/images/dishes/high_res_mango_cheesecake.jpg', isVeg: true, isBestseller: true },
      { id: 'dish-2003', sku: 'SWD-DL-CLBN-03', name: 'Hot Fudge Brownie', category: 'Desserts', description: 'Warm chocolate fudge brownie served with a drizzle of rich chocolate syrup.', price: 150, image: '/assets/images/dishes/high_res_hot_fudge_brownie.jpg', isVeg: true, isBestseller: false },
      { id: 'dish-2004', sku: 'SWD-DL-MCRN-04', name: 'Macaron Box', category: 'Desserts', description: 'Assorted box of six French macarons in chocolate, pistachio and vanilla.', price: 320, image: '/assets/images/dishes/high_res_macaron_box.jpg', isVeg: true, isBestseller: false }
    ]
  },
  {
    id: 'rest-022',
    name: 'Indo-Chinese Corner',
    slug: 'indo-chinese-corner',
    sku: 'SWD-RST-IC-22',
    coverImage: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&h=320&fit=crop&auto=format&q=60',
    video: null,
    images: ['https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&h=600&fit=crop'],
    rating: 4.2,
    ratingCount: 710,
    cuisines: ['Chinese', 'Fast Food', 'Asian'],
    priceForTwo: 350,
    deliveryTime: '25-35 mins',
    location: { area: 'Marathahalli', city: 'Bangalore', coordinates: { lat: 12.9592, lng: 77.7001 } },
    offers: [{ title: '30% OFF', description: 'Combo meals starting at ₹189', code: 'CHINATREAT', discount: 30 }],
    features: { pureVeg: false, acceptsVouchers: false, hasParking: false, servesAlcohol: false, outdoorSeating: false, openNow: true },
    timings: { open: '11:30 AM', close: '11:00 PM', days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
    menu: [
      { id: 'dish-2101', sku: 'SWD-IC-VGMC-01', name: 'Veg Manchurian', category: 'Chinese', description: 'Fried vegetable balls tossed in sweet, sour and spicy Manchurian sauce.', price: 190, image: '/assets/images/dishes/high_res_veg_manchurian.jpg', isVeg: true, isBestseller: true },
      { id: 'dish-2102', sku: 'SWD-IC-CLCK-02', name: 'Chilli Chicken', category: 'Chinese', description: 'Crispy marinated chicken pieces stir-fried with capsicum, onion and soy sauce.', price: 280, image: '/assets/images/dishes/high_res_chilli_chicken.jpg', isVeg: false, isBestseller: true },
      { id: 'dish-2103', sku: 'SWD-IC-SZFR-03', name: 'Schezwan Fried Rice', category: 'Chinese', description: 'Spicy fried rice tossed in fiery Schezwan paste and mixed vegetables.', price: 180, image: '/assets/images/dishes/high_res_schezwan_fried_rice.jpg', isVeg: true, isBestseller: false },
      { id: 'dish-2104', sku: 'SWD-IC-HCPT-04', name: 'Honey Chilli Potato', category: 'Chinese', description: 'Crispy finger potatoes tossed in sweet honey and spicy chilli glaze.', price: 170, image: '/assets/images/dishes/high_res_honey_chilli_potato.jpg', isVeg: true, isBestseller: false }
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

// Apply nutrition and ensure features default merges properly
RESTAURANTS.forEach((restaurant) => {
  restaurant.features = {
    pureVeg: false,
    acceptsVouchers: false,
    hasParking: false,
    servesAlcohol: false,
    outdoorSeating: false,
    openNow: true,
    ...restaurant.features
  };

  restaurant.menu = restaurant.menu.map((dish) => ({
    ...dish,
    ...(NUTRITION_BY_DISH_ID[dish.id] || { calories: 320, protein: 12, carbs: 40, fats: 12 }),
  }));
});

// Compile all menu items from all restaurants
export const MENU_ITEMS = RESTAURANTS.reduce((items, restaurant) => {
  const restaurantMenu = restaurant.menu.map((dish) => ({
    ...dish,
    restaurantId: restaurant.id,
    restaurant: restaurant.name,
    rating: restaurant.rating,
    deliveryTime: restaurant.deliveryTime
  }));
  return [...items, ...restaurantMenu];
}, []);

export const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'biryani', name: 'Biryani' },
  { id: 'north-indian', name: 'North Indian' },
  { id: 'south-indian', name: 'South Indian' },
  { id: 'chinese', name: 'Chinese' },
  { id: 'coastal', name: 'Coastal' },
  { id: 'street-food', name: 'Street Food' },
  { id: 'pizza', name: 'Pizza' },
  { id: 'burgers', name: 'Burgers' },
  { id: 'desserts', name: 'Desserts' },
  { id: 'beverages', name: 'Beverages' },
  { id: 'salads', name: 'Salads & Healthy' }
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

  if (filters.offers) {
    filtered = filtered.filter(r => r.offers && r.offers.length > 0);
  }

  if (filters.outdoorSeating) {
    filtered = filtered.filter(r => r.features.outdoorSeating);
  }

  if (filters.openNow) {
    filtered = filtered.filter(r => r.features.openNow !== false);
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
