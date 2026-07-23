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
    coverImage: '/images/swadisht/restaurants/swadishtt_kitchen.png',
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
        id: 'dish-x-001',
        name: 'Palak Paneer',
        category: 'Main Course',
        description: 'Silky spinach gravy with fresh cottage cheese cubes, tempered with cumin.',
        price: 260,
        image: 'https://images.pexels.com/photos/3996419/pexels-photo-3996419.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-x-002',
        name: 'Aloo Gobi',
        category: 'Main Course',
        description: 'Dry-spiced cauliflower and potato stir-fry with ginger and turmeric.',
        price: 190,
        image: 'https://images.pexels.com/photos/8695497/pexels-photo-8695497.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-x-003',
        name: 'Seekh Kebab',
        category: 'Starters',
        description: 'Minced mutton kebabs grilled on skewers with aromatic spices.',
        price: 320,
        image: 'https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-x-004',
        name: 'Chole Bhature',
        category: 'Main Course',
        description: 'Spiced chickpea curry served with fluffy deep-fried leavened bread.',
        price: 240,
        image: 'https://images.pexels.com/photos/3996419/pexels-photo-3996419.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-x-005',
        name: 'Mango Lassi',
        category: 'Beverages',
        description: 'Thick chilled yogurt drink blended with Alphonso mango pulp.',
        price: 110,
        image: 'https://images.pexels.com/photos/4197444/pexels-photo-4197444.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-x-006',
        name: 'Kulcha - Amritsari',
        category: 'Breads',
        description: 'Stuffed leavened bread baked in tandoor, filled with spiced potatoes.',
        price: 90,
        image: 'https://images.pexels.com/photos/8695497/pexels-photo-8695497.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-x-007',
        name: 'Fish Amritsari',
        category: 'Starters',
        description: 'Crispy batter-fried fish fillets with carom seeds and chat masala.',
        price: 350,
        image: 'https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-x-008',
        name: 'Peshwari Naan',
        category: 'Breads',
        description: 'Fluffy naan stuffed with almonds, raisins and coconut flakes.',
        price: 110,
        image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-x-009',
        name: 'Rabri Faluda',
        category: 'Desserts',
        description: 'Chilled thickened milk with rose syrup, vermicelli and basil seeds.',
        price: 160,
        image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-x-010',
        name: 'Lassi - Salted',
        category: 'Beverages',
        description: 'Cooling salted buttermilk lassi with cumin and coriander.',
        price: 80,
        image: 'https://images.pexels.com/photos/4197444/pexels-photo-4197444.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-x-011',
        name: 'Chicken Handi',
        category: 'Main Course',
        description: 'Slow-cooked chicken in a clay pot with creamy cashew gravy.',
        price: 380,
        image: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-new-001',
        name: 'Hara Bhara Kebab',
        category: 'Starters',
        description: 'Delicate patties of spinach, green peas, paneer and spices, shallow fried.',
        price: 155,
        image: 'https://images.pexels.com/photos/3407777/pexels-photo-3407777.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-new-002',
        name: 'Gulab Jamun with Rabri',
        category: 'Desserts',
        description: 'Spiced grilled paneer cubes wrapped in a soft roomali roti.',
        price: 160,
        image: 'https://images.pexels.com/photos/3735149/pexels-photo-3735149.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-new-003',
        name: 'Paneer Lababdar',
        category: 'Main Course',
        description: 'Soya chunks marinated in rich cashew cream and grilled in tandoor.',
        price: 165,
        image: 'https://images.pexels.com/photos/1640769/pexels-photo-1640769.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-new-004',
        name: 'Paneer Tikka Kathi Roll',
        category: 'Starters',
        description: 'Crispy potato fingers tossed in a sweet and spicy sesame sauce.',
        price: 170,
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-new-005',
        name: 'Rasmalai Saffron',
        category: 'Desserts',
        description: 'Golden fried sweet corn kernels tossed with garlic and spring onions.',
        price: 175,
        image: 'https://images.pexels.com/photos/4197444/pexels-photo-4197444.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-new-006',
        name: 'Methi Matar Malai',
        category: 'Main Course',
        description: 'Button mushrooms sauteed with crushed black pepper, curry leaves and onions.',
        price: 180,
        image: 'https://images.pexels.com/photos/4911986/pexels-photo-4911986.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-new-007',
        name: 'Tandoori Malai Soya Chaap',
        category: 'Starters',
        description: 'Crispy pastry rolls stuffed with seasoned stir-fried vegetables.',
        price: 185,
        image: 'https://images.pexels.com/photos/4518672/pexels-photo-4518672.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-new-008',
        name: 'Moong Dal Halwa',
        category: 'Desserts',
        description: 'Cottage cheese chunks marinated in pickling spices and cooked in clay oven.',
        price: 190,
        image: 'https://images.pexels.com/photos/5718095/pexels-photo-5718095.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-new-009',
        name: 'Kadhai Paneer Punjabi',
        category: 'Main Course',
        description: 'Fiery chicken pieces cooked in pure ghee with Kundapur spices.',
        price: 195,
        image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-new-010',
        name: 'Crispy Honey Chilli Potato',
        category: 'Starters',
        description: 'Juicy chicken wings coated in tandoori spices and charred.',
        price: 200,
        image: 'https://images.pexels.com/photos/60616/fried-chicken-restaurant-60616.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-new-011',
        name: 'Kesar Pista Kulfi',
        category: 'Desserts',
        description: 'Stir-fried fish chunks with bell peppers, green chillies and soy.',
        price: 205,
        image: 'https://images.pexels.com/photos/5718092/pexels-photo-5718092.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-001',
        name: 'Butter Chicken',
        category: 'Main Course',
        description: 'Tender tandoori chicken simmered in a rich buttery tomato gravy finished with fresh cream and aromatic Indian spices.',
        price: 350,
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-002',
        name: 'Paneer Tikka Masala',
        category: 'Main Course',
        description: 'Smoky grilled paneer cubes cooked in a creamy onion tomato gravy with bold North Indian spices and herbs.',
        price: 280,
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-003',
        name: 'Dal Makhani',
        category: 'Main Course',
        description: 'Slow-cooked black lentils and kidney beans blended with butter, cream, and traditional Punjabi flavors.',
        price: 220,
        image: 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-004',
        name: 'Tandoori Chicken',
        category: 'Starters',
        description: 'Juicy chicken marinated overnight in yogurt and spices, then flame-grilled in a traditional clay tandoor.',
        price: 320,
        image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-005',
        name: 'Garlic Naan',
        category: 'Breads',
        description: 'Soft freshly baked naan brushed with melted garlic butter and topped with coriander for extra flavor.',
        price: 60,
        image: 'https://images.pexels.com/photos/1640780/pexels-photo-1640780.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-006',
        name: 'Biryani',
        category: 'Rice',
        description: 'Fragrant basmati rice layered with spiced meat, caramelized onions, saffron, and slow-cooked dum flavors.',
        price: 380,
        image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: true
      }
    ]
  },
  {
    id: 'rest-002',
    name: 'Green Leaf Pure Veg',
    slug: 'green-leaf-pure-veg',
    logoImage: 'https://images.pexels.com/photos/29148133/pexels-photo-29148133.jpeg',
    coverImage: '/images/swadisht/restaurants/green_leaf.png',
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
        id: 'dish-x-012',
        name: 'Masala Dosa',
        category: 'Main Course',
        description: 'Crispy golden crepe filled with spiced potato and served with chutneys.',
        price: 180,
        image: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-x-013',
        name: 'Uttapam - Onion Tomato',
        category: 'Main Course',
        description: 'Thick rice pancake loaded with onions, tomatoes and green chillies.',
        price: 160,
        image: 'https://images.pexels.com/photos/1640776/pexels-photo-1640776.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-x-014',
        name: 'Idli Sambar',
        category: 'Main Course',
        description: 'Steamed fermented rice cakes with lentil vegetable stew and coconut chutney.',
        price: 140,
        image: 'https://images.pexels.com/photos/1640778/pexels-photo-1640778.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-x-015',
        name: 'Bisi Bele Bath',
        category: 'Main Course',
        description: 'Karnataka one-pot dish of rice, lentils and vegetables in aromatic spice paste.',
        price: 200,
        image: 'https://images.pexels.com/photos/1640779/pexels-photo-1640779.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-x-016',
        name: 'Pesarattu',
        category: 'Starters',
        description: 'Crispy green moong dal crepe served with ginger chutney.',
        price: 150,
        image: 'https://images.pexels.com/photos/1640781/pexels-photo-1640781.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-x-017',
        name: 'Vada - Medu',
        category: 'Starters',
        description: 'Crunchy urad dal fritters with curry leaves and coconut chutney.',
        price: 120,
        image: 'https://images.pexels.com/photos/1640782/pexels-photo-1640782.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-x-018',
        name: 'Neer Dosa',
        category: 'Main Course',
        description: 'Delicate thin water-rice crepe from coastal Karnataka, served with chicken curry.',
        price: 160,
        image: 'https://images.pexels.com/photos/1640783/pexels-photo-1640783.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-x-019',
        name: 'Filter Coffee',
        category: 'Beverages',
        description: 'Authentic South Indian decoction coffee with frothy milk in a dabara set.',
        price: 70,
        image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-x-020',
        name: 'Kesari Bath',
        category: 'Desserts',
        description: 'Saffron-scented semolina pudding with cashews, raisins and ghee.',
        price: 120,
        image: 'https://images.pexels.com/photos/1640784/pexels-photo-1640784.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-x-021',
        name: 'Puliyogare',
        category: 'Rice',
        description: 'Tamarind-spiced rice with roasted peanuts and jaggery — a temple prasad favourite.',
        price: 150,
        image: 'https://images.pexels.com/photos/1640785/pexels-photo-1640785.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-x-022',
        name: 'Akki Rotti',
        category: 'Breads',
        description: 'Rice flour flatbread with onions, green chillies and dill leaves.',
        price: 120,
        image: 'https://images.pexels.com/photos/1640786/pexels-photo-1640786.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-new-012',
        name: 'Crispy Corn Pepper Salt',
        category: 'Main Course',
        description: 'Crispy butter-fried prawns served with a spicy dip.',
        price: 210,
        image: 'https://images.pexels.com/photos/1640787/pexels-photo-1640787.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-new-013',
        name: 'Warm Gajar Ka Halwa',
        category: 'Starters',
        description: 'Spiced minced lamb skewers grilled over charcoal embers.',
        price: 215,
        image: 'https://images.pexels.com/photos/5718095/pexels-photo-5718095.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-new-014',
        name: 'Nizami Shahi Veg Korma',
        category: 'Desserts',
        description: 'Melt-in-the-mouth minced mutton patties cooked on a tawa.',
        price: 220,
        image: 'https://images.pexels.com/photos/1640788/pexels-photo-1640788.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-new-015',
        name: 'Mushroom Pepper Fry',
        category: 'Main Course',
        description: 'Crispy fried rolls packed with savory minced chicken and spring onions.',
        price: 225,
        image: 'https://images.pexels.com/photos/1640789/pexels-photo-1640789.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-new-016',
        name: 'Royal Shahi Tukda',
        category: 'Starters',
        description: 'Cottage cheese cubes in a rich, creamy, tomato-onion gravy.',
        price: 230,
        image: 'https://images.pexels.com/photos/1640790/pexels-photo-1640790.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-new-017',
        name: 'Veg Spring Rolls',
        category: 'Desserts',
        description: 'Sweet green peas in a rich gravy flavored with fresh fenugreek leaves.',
        price: 235,
        image: 'https://images.pexels.com/photos/4518672/pexels-photo-4518672.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-new-018',
        name: 'Dhaba Style Dal Fry',
        category: 'Main Course',
        description: 'Cottage cheese stir-fried with bell peppers in a freshly pounded spice mix.',
        price: 240,
        image: 'https://images.pexels.com/photos/7474259/pexels-photo-7474259.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-new-019',
        name: 'Chhena Poda',
        category: 'Starters',
        description: 'Assorted vegetables simmered in a rich, yogurt-based almond gravy.',
        price: 245,
        image: 'https://images.pexels.com/photos/6413424/pexels-photo-6413424.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-new-020',
        name: 'Paneer Achari Tikka',
        category: 'Desserts',
        description: 'Yellow lentils tempered with cumin, garlic, tomatoes and red chillies.',
        price: 250,
        image: 'https://images.pexels.com/photos/4004471/pexels-photo-4004471.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-new-021',
        name: 'Murg Tikka Masala',
        category: 'Main Course',
        description: 'Grilled chicken tikka chunks simmered in a spiced tomato gravy.',
        price: 255,
        image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-new-022',
        name: 'Double Ka Meetha',
        category: 'Starters',
        description: 'Traditional fish curry made with coconut milk and red Goan chillies.',
        price: 260,
        image: 'https://images.pexels.com/photos/4004464/pexels-photo-4004464.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-101',
        name: 'Masala Dosa',
        category: 'South Indian',
        description: 'Golden crispy dosa filled with flavorful potato masala and served with coconut chutney and hot sambar.',
        price: 120,
        image: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-102',
        name: 'Idli Sambar',
        category: 'South Indian',
        description: 'Soft fluffy idlis served with authentic South Indian sambar and freshly prepared coconut chutney.',
        price: 80,
        image: 'https://images.pexels.com/photos/4197455/pexels-photo-4197455.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-103',
        name: 'Veg Fried Rice',
        category: 'Chinese',
        description: 'Wok-tossed fried rice loaded with fresh vegetables, sauces, spring onions, and Indo-Chinese flavors.',
        price: 150,
        image: 'https://images.pexels.com/photos/4197492/pexels-photo-4197492.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-104',
        name: 'Paneer Manchurian',
        category: 'Chinese',
        description: 'Crispy paneer cubes tossed in spicy garlic soy sauce with onions, capsicum, and spring onions.',
        price: 200,
        image: 'https://images.pexels.com/photos/4197495/pexels-photo-4197495.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      }
    ]
  },
  {
    id: 'rest-003',
    name: 'Biryani House',
    slug: 'biryani-house',
    logoImage: 'https://images.pexels.com/photos/9738983/pexels-photo-9738983.jpeg',
    coverImage: 'https://i.pinimg.com/736x/15/d6/c3/15d6c3d105e3f360379012af67397338.jpg',
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
        id: 'dish-x-023',
        name: 'Pork Vindaloo',
        category: 'Main Course',
        description: 'Fiery Goan pork curry marinated in vinegar and Kashmiri chillies.',
        price: 480,
        image: 'https://images.pexels.com/photos/3996419/pexels-photo-3996419.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-x-024',
        name: 'Fish Recheado',
        category: 'Starters',
        description: 'Goan stuffed fish fried in a tangy red recheado masala.',
        price: 420,
        image: 'https://images.pexels.com/photos/8695497/pexels-photo-8695497.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-x-025',
        name: 'Bebinca',
        category: 'Desserts',
        description: 'Goan layered coconut egg pudding, baked slowly for a caramel finish.',
        price: 180,
        image: 'https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-x-026',
        name: 'Prawn Balchao',
        category: 'Starters',
        description: 'Pickled prawn dish in a spicy, sweet and tangy masala paste.',
        price: 360,
        image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-x-027',
        name: 'Chicken Cafreal',
        category: 'Main Course',
        description: 'Green herb-marinated chicken pan-fried Goan style.',
        price: 380,
        image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-x-028',
        name: 'Mushroom Xacuti',
        category: 'Main Course',
        description: 'Mushroom curry in a complex roasted coconut and spice gravy.',
        price: 290,
        image: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-x-029',
        name: 'Poi Bread',
        category: 'Breads',
        description: 'Goan leavened bread rolls with a crusty exterior and soft inside.',
        price: 60,
        image: 'https://images.pexels.com/photos/3407777/pexels-photo-3407777.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-x-030',
        name: 'Kokum Sharbat',
        category: 'Beverages',
        description: 'Chilled kokum juice drink with cumin and mint — a cooling Goan summer drink.',
        price: 80,
        image: 'https://images.pexels.com/photos/3735149/pexels-photo-3735149.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-x-031',
        name: 'Clam Caldine',
        category: 'Main Course',
        description: 'Mild Goan clam curry in coconut milk with turmeric and ginger.',
        price: 350,
        image: 'https://images.pexels.com/photos/1640769/pexels-photo-1640769.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-x-032',
        name: 'Goan Prawn Curry',
        category: 'Main Course',
        description: 'Classic coconut and tamarind-based Goan prawn curry.',
        price: 440,
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-x-033',
        name: 'Sannas',
        category: 'Breads',
        description: 'Steamed Goan rice-flour cakes — light, fluffy and slightly sweet.',
        price: 90,
        image: 'https://images.pexels.com/photos/4197444/pexels-photo-4197444.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-new-023',
        name: 'Chicken Ghee Roast Fry',
        category: 'Desserts',
        description: 'Okra cooked with double the onions, tomatoes and spice powder.',
        price: 265,
        image: 'https://images.pexels.com/photos/4911986/pexels-photo-4911986.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-new-024',
        name: 'Goan Fish Curry',
        category: 'Main Course',
        description: 'Boiled eggs cooked in a light, spicy onion-tomato broth.',
        price: 270,
        image: 'https://images.pexels.com/photos/4518672/pexels-photo-4518672.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-new-025',
        name: 'Tandoori Chicken Wings',
        category: 'Starters',
        description: 'Fried paneer sandwiches filled with sweet nuts, in a rich creamy gravy.',
        price: 275,
        image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-new-026',
        name: 'Elaneer Payasam',
        category: 'Desserts',
        description: 'Tender lamb pieces slow cooked in a rich coconut-cashew paste.',
        price: 280,
        image: 'https://images.pexels.com/photos/5718095/pexels-photo-5718095.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-new-027',
        name: 'Bhindi Do Pyaza',
        category: 'Main Course',
        description: 'Dry, dark-colored chickpeas cooked in authentic Punjabi spice powder.',
        price: 285,
        image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-new-028',
        name: 'Crispy Chilli Fish',
        category: 'Starters',
        description: 'Sauteed button mushrooms in a thick onion, tomato and spice masala.',
        price: 290,
        image: 'https://images.pexels.com/photos/60616/fried-chicken-restaurant-60616.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-new-029',
        name: 'Paan Ice Cream',
        category: 'Desserts',
        description: 'Boneless chicken pieces simmered in a healthy spiced spinach puree.',
        price: 295,
        image: 'https://images.pexels.com/photos/5718092/pexels-photo-5718092.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-new-030',
        name: 'Homestyle Egg Curry',
        category: 'Main Course',
        description: 'Deep-fried potato and paneer balls in a rich, creamy cashew gravy.',
        price: 300,
        image: 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-new-031',
        name: 'Golden Fried Prawns',
        category: 'Starters',
        description: 'Warm fried milk dumplings served on a bed of chilled thickened milk.',
        price: 305,
        image: 'https://images.pexels.com/photos/1640780/pexels-photo-1640780.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-new-032',
        name: 'Mango Mint Lassi',
        category: 'Desserts',
        description: 'Spongy cottage cheese discs soaked in sweetened saffron-infused milk.',
        price: 310,
        image: 'https://images.pexels.com/photos/4197444/pexels-photo-4197444.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-new-033',
        name: 'Paneer Pasanda',
        category: 'Main Course',
        description: 'Rich and warm lentil pudding loaded with pure ghee and dry fruits.',
        price: 315,
        image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-201',
        name: 'Hyderabadi Chicken Biryani',
        category: 'Biryani',
        description: 'Authentic Hyderabadi dum biryani layered with fragrant basmati rice, tender chicken, saffron, and slow-cooked spices.',
        price: 380,
        image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-202',
        name: 'Mutton Biryani',
        category: 'Biryani',
        description: 'Rich and flavorful biryani prepared with juicy slow-cooked mutton, aromatic spices, and long-grain basmati rice.',
        price: 450,
        image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-203',
        name: 'Veg Biryani',
        category: 'Biryani',
        description: 'Fragrant basmati rice cooked with fresh vegetables, herbs, saffron, and traditional biryani masala spices.',
        price: 280,
        image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-204',
        name: 'Chicken 65',
        category: 'Starters',
        description: 'Crispy spicy fried chicken tossed with curry leaves, garlic, green chilies, and South Indian seasonings.',
        price: 250,
        image: 'https://images.pexels.com/photos/1640776/pexels-photo-1640776.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-205',
        name: 'Raita',
        category: 'Sides',
        description: 'Refreshing chilled yogurt mixed with cucumber, onions, herbs, and mild spices to complement your biryani.',
        price: 60,
        image: 'https://images.pexels.com/photos/1640778/pexels-photo-1640778.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      }
    ]
  },
  {
    id: 4,
    name: 'Dosa Point',
    slug: 'dosa-point',
    logoImage: 'https://images.pexels.com/photos/20422123/pexels-photo-20422123.jpeg',
    coverImage: '/images/swadisht/restaurants/dosa_point.png',
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
        id: 'dish-new-034',
        name: 'Mutton Seekh Kebab',
        category: 'Starters',
        description: 'Traditional Indian ice cream made from slow-boiled condensed milk.',
        price: 320,
        image: 'https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-new-035',
        name: 'Masala Butter Milk',
        category: 'Desserts',
        description: 'Grated winter carrots slow-cooked with milk, sugar and cardamom.',
        price: 325,
        image: 'https://images.pexels.com/photos/1640779/pexels-photo-1640779.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-new-036',
        name: 'Hyderabadi Mutton Korma',
        category: 'Main Course',
        description: 'Crispy ghee-fried bread pudding topped with rich rabri and pistachios.',
        price: 330,
        image: 'https://images.pexels.com/photos/1640781/pexels-photo-1640781.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-new-037',
        name: 'Galouti Kebab',
        category: 'Starters',
        description: 'Baked cottage cheese dessert from Odisha with caramelized sugar.',
        price: 335,
        image: 'https://images.pexels.com/photos/1640782/pexels-photo-1640782.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-new-038',
        name: 'Chilled Badam Milk',
        category: 'Desserts',
        description: 'Fried bread slices soaked in hot milk, sugar syrup and saffron.',
        price: 340,
        image: 'https://images.pexels.com/photos/1640783/pexels-photo-1640783.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-new-039',
        name: 'Pindi Chole',
        category: 'Main Course',
        description: 'Chilled dessert made with tender coconut meat, milk and cardamom.',
        price: 345,
        image: 'https://images.pexels.com/photos/1640784/pexels-photo-1640784.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-new-040',
        name: 'Chicken Spring Rolls',
        category: 'Starters',
        description: 'Creamy homemade ice cream flavored with sweet betel leaf and gulkand.',
        price: 350,
        image: 'https://images.pexels.com/photos/4518672/pexels-photo-4518672.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-new-041',
        name: 'Rose Cardamom Milkshake',
        category: 'Desserts',
        description: 'Chilled yogurt shake flavored with fresh mango pulp and mint.',
        price: 355,
        image: 'https://images.pexels.com/photos/1640785/pexels-photo-1640785.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-new-042',
        name: 'Mushroom Masala',
        category: 'Main Course',
        description: 'Refreshing salted buttermilk spiced with green chillies, ginger and cilantro.',
        price: 360,
        image: 'https://images.pexels.com/photos/1640786/pexels-photo-1640786.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-new-043',
        name: 'Fresh Lime Soda',
        category: 'Starters',
        description: 'Sweetened almond milk flavored with saffron, cardamom and nuts.',
        price: 365,
        image: 'https://images.pexels.com/photos/1640787/pexels-photo-1640787.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-new-044',
        name: 'Jal Jeera Cooler',
        category: 'Desserts',
        description: 'Creamy milk blend infused with aromatic rose syrup and cardamom.',
        price: 370,
        image: 'https://images.pexels.com/photos/1640788/pexels-photo-1640788.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-301',
        name: 'Masala Dosa',
        category: 'South Indian',
        description: 'Crispy golden dosa stuffed with flavorful potato masala and served with coconut chutney and hot sambar.',
        price: 140,
        image: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-302',
        name: 'Ghee Roast Dosa',
        category: 'South Indian',
        description: 'Thin crispy dosa roasted generously in pure ghee for a rich aroma and authentic South Indian flavor.',
        price: 170,
        image: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-303',
        name: 'Filter Coffee',
        category: 'Beverages',
        description: 'Traditional South Indian filter coffee brewed strong with freshly ground beans and frothy hot milk.',
        price: 60,
        image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      }
    ]
  },
  {
    id: 5,
    name: 'Pizza Corner',
    slug: 'pizza-corner',
    logoImage: 'https://images.pexels.com/photos/31596394/pexels-photo-31596394.jpeg',
    coverImage: '/images/swadisht/restaurants/pizza_corner.png',
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
        id: 'dish-new-045',
        name: 'Chicken Saagwala',
        category: 'Main Course',
        description: 'Refreshing aerated water drink, served sweet and salted.',
        price: 375,
        image: 'https://images.pexels.com/photos/1640789/pexels-photo-1640789.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-new-046',
        name: 'Kokum Sherbet',
        category: 'Starters',
        description: 'Tangy water drink flavored with cumin, mint, black salt and lemon juice.',
        price: 380,
        image: 'https://images.pexels.com/photos/1640790/pexels-photo-1640790.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-new-047',
        name: 'Filter Coffee - Tumbler',
        category: 'Desserts',
        description: 'Chilled sweet and sour red drink made from kokum fruit pulp.',
        price: 385,
        image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-new-048',
        name: 'Malai Kofta',
        category: 'Main Course',
        description: 'Traditional hot South Indian decoction coffee frothed with milk.',
        price: 390,
        image: 'https://images.pexels.com/photos/7474259/pexels-photo-7474259.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-new-049',
        name: 'Spiced Masala Tea',
        category: 'Starters',
        description: 'Freshly brewed milk tea infused with ginger, cardamom and cloves.',
        price: 395,
        image: 'https://images.pexels.com/photos/6413424/pexels-photo-6413424.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-new-050',
        name: 'Iced Peach Tea',
        category: 'Desserts',
        description: 'Refreshing sweetened black tea blend with fresh peach flavoring.',
        price: 400,
        image: 'https://images.pexels.com/photos/4004471/pexels-photo-4004471.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-new-051',
        name: 'Butter Tandoori Roti',
        category: 'Main Course',
        description: 'Whole wheat flatbread baked in tandoor and brushed with butter.',
        price: 405,
        image: 'https://images.pexels.com/photos/4004464/pexels-photo-4004464.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-new-052',
        name: 'Whole Wheat Laccha Paratha',
        category: 'Starters',
        description: 'Layered, crispy whole wheat bread cooked in tandoor.',
        price: 410,
        image: 'https://images.pexels.com/photos/4197455/pexels-photo-4197455.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-new-053',
        name: 'Butter Garlic Naan',
        category: 'Desserts',
        description: 'Leavened flatbread topped with minced garlic and butter.',
        price: 415,
        image: 'https://images.pexels.com/photos/4197492/pexels-photo-4197492.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-new-054',
        name: 'Hyderabadi Veg Dum Biryani',
        category: 'Main Course',
        description: 'Fragrant basmati rice slow-cooked with vegetables and fresh spices.',
        price: 420,
        image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-new-055',
        name: 'Traditional Ghee Rice',
        category: 'Starters',
        description: 'Basmati rice tossed in pure ghee, fried onions, raisins and cashews.',
        price: 425,
        image: 'https://images.pexels.com/photos/4197495/pexels-photo-4197495.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: false
      },
      {
        id: 'dish-401',
        name: 'Margherita Pizza',
        category: 'Pizza',
        description: 'Classic Italian-style pizza topped with mozzarella cheese, fresh basil leaves, and rich tomato sauce.',
        price: 280,
        image: 'https://images.pexels.com/photos/3735149/pexels-photo-3735149.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-402',
        name: 'Pepperoni Pizza',
        category: 'Pizza',
        description: 'Loaded with spicy pepperoni slices, mozzarella cheese, and signature pizza sauce on a crispy crust.',
        price: 420,
        image: 'https://images.pexels.com/photos/3735149/pexels-photo-3735149.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-403',
        name: 'Farmhouse Pizza',
        category: 'Pizza',
        description: 'Cheesy pizza generously topped with onions, capsicum, tomatoes, mushrooms, and fresh vegetables.',
        price: 360,
        image: 'https://images.pexels.com/photos/3735149/pexels-photo-3735149.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-404',
        name: 'Garlic Bread',
        category: 'Sides',
        description: 'Freshly baked garlic bread brushed with butter and herbs, served with creamy cheesy dip.',
        price: 160,
        image: 'https://images.pexels.com/photos/3996419/pexels-photo-3996419.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-405',
        name: 'Choco Lava Cake',
        category: 'Desserts',
        description: 'Warm chocolate cake with a rich molten chocolate center served fresh for the perfect dessert experience.',
        price: 140,
        image: 'https://images.pexels.com/photos/5718095/pexels-photo-5718095.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: true
      }
    ]
  },
  {
    id: 6,
    name: 'Sweet Treats',
    slug: 'sweet-treats',
    logoImage: 'https://images.pexels.com/photos/8887052/pexels-photo-8887052.jpeg',
    coverImage: 'https://i.pinimg.com/vwebp/736x/2b/0d/59/2b0d597114f8886681b3e3ab4d3a4ee1.webp',
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
        image: 'https://images.pexels.com/photos/5718095/pexels-photo-5718095.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-502',
        name: 'Belgian Waffle',
        category: 'Desserts',
        description: 'Freshly baked Belgian waffle served warm with chocolate sauce, whipped cream, and sweet toppings.',
        price: 190,
        image: 'https://images.pexels.com/photos/8695497/pexels-photo-8695497.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-503',
        name: 'Cold Coffee',
        category: 'Beverages',
        description: 'Creamy chilled coffee blended with milk, ice cream, and rich coffee flavors for a refreshing drink.',
        price: 140,
        image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?w=600&h=400&fit=crop',
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
    logoImage: 'https://images.pexels.com/photos/36007382/pexels-photo-36007382.jpeg',
    coverImage: '/images/swadisht/restaurants/burger_junc.png',
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
        image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-602',
        name: 'Veg Cheese Burger',
        category: 'Burgers',
        description: 'Loaded vegetable patty burger with melted cheese, crunchy lettuce, fresh veggies, and creamy burger sauce.',
        price: 220,
        image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-603',
        name: 'Peri Peri Fries',
        category: 'Sides',
        description: 'Crispy golden fries tossed with spicy peri peri seasoning and served hot with creamy dipping sauce.',
        price: 140,
        image: 'https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      }
    ]
  },
  {
    id: 8,
    name: 'Royal Tandoor',
    slug: 'royal-tandoor',
    logoImage: 'https://images.pexels.com/photos/36895285/pexels-photo-36895285.jpeg',
    coverImage: 'https://i.pinimg.com/1200x/b1/a8/1d/b1a81d09b0765a1587508f813c9781f6.jpg',
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
        image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      },
      {
        id: 'dish-702',
        name: 'Chicken Tikka',
        category: 'Starters',
        description: 'Juicy chicken tikka marinated in yogurt and spices, then flame-grilled in a traditional tandoor oven.',
        price: 340,
        image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-703',
        name: 'Paneer Butter Masala',
        category: 'Main Course',
        description: 'Soft paneer cubes cooked in a creamy buttery tomato gravy with rich North Indian spices and herbs.',
        price: 290,
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: true
      }
    ]
  },
  {
    id: 9,
    name: 'China Wok Express',
    slug: 'china-wok-express',
    logoImage: 'https://images.pexels.com/photos/3054690/pexels-photo-3054690.jpeg',
    coverImage: '/images/swadisht/restaurants/china_wok.png',
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
        image: 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-802',
        name: 'Chicken Manchurian',
        category: 'Chinese',
        description: 'Crispy chicken pieces tossed in spicy garlic soy sauce with onions, capsicum, and spring onions.',
        price: 280,
        image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-803',
        name: 'Spring Rolls',
        category: 'Starters',
        description: 'Crunchy golden spring rolls stuffed with seasoned vegetables and served with spicy dipping sauce.',
        price: 180,
        image: 'https://images.pexels.com/photos/4518672/pexels-photo-4518672.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      }
    ]
  },
  {
    id: 10,
    name: 'Cafe Mocha',
    slug: 'cafe-mocha',
    logoImage: 'https://images.pexels.com/photos/20066366/pexels-photo-20066366.jpeg',
    coverImage: '/images/swadisht/restaurants/cafe_mocha.png',
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
        image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-902',
        name: 'Red Velvet Pastry',
        category: 'Desserts',
        description: 'Soft and moist red velvet pastry layered with smooth cream cheese frosting and chocolate garnish.',
        price: 160,
        image: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: true
      },
      {
        id: 'dish-903',
        name: 'Pasta Alfredo',
        category: 'Italian',
        description: 'Creamy Alfredo pasta tossed with white sauce, herbs, garlic, parmesan cheese, and fresh vegetables.',
        price: 320,
        image: 'https://images.pexels.com/photos/3407777/pexels-photo-3407777.jpeg?w=600&h=400&fit=crop',
        isVeg: true,
        isBestseller: false
      }
    ]
  },
  {
    id: 11,
    name: 'Andhra Spice',
    slug: 'andhra-spice',
    logoImage: 'https://images.pexels.com/photos/35267290/pexels-photo-35267290.jpeg',
    coverImage: '/images/swadisht/restaurants/andhra_spice.png',
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
        image: 'https://images.pexels.com/photos/3735149/pexels-photo-3735149.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-1002',
        name: 'Gongura Mutton',
        category: 'Main Course',
        description: 'Tender mutton cooked with tangy gongura leaves, aromatic spices, and authentic Andhra-style seasoning.',
        price: 420,
        image: 'https://images.pexels.com/photos/1640769/pexels-photo-1640769.jpeg?w=600&h=400&fit=crop',
        isVeg: false,
        isBestseller: true
      },
      {
        id: 'dish-1003',
        name: 'Andhra Meals',
        category: 'Meals',
        description: 'Traditional Andhra-style thali served with rice, curries, dal, chutneys, papad, and regional specialties.',
        price: 260,
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=600&h=400&fit=crop',
      }
    ]
  },
  // ── New Restaurants (rest-012 to rest-022) ──
  {
    id: 'rest-012',
    name: 'Mumbai Street Bites',
    slug: 'mumbai-street-bites',
    logoImage: 'https://images.pexels.com/photos/7625089/pexels-photo-7625089.jpeg',
    coverImage: '/images/swadisht/restaurants/mumbai_street_bites.png',
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
      { id: 'dish-1101', name: 'Pav Bhaji', category: 'Street Food', description: 'Spiced mashed vegetable curry served with buttered toasted pav buns — the iconic Mumbai classic.', price: 120, image: 'https://images.pexels.com/photos/4197444/pexels-photo-4197444.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: true },
      { id: 'dish-1102', name: 'Vada Pav', category: 'Street Food', description: 'Crispy battered potato fritter nestled in a soft bun with chutneys and spiced masala.', price: 60, image: 'https://images.pexels.com/photos/4911986/pexels-photo-4911986.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: true },
      { id: 'dish-1103', name: 'Sev Puri', category: 'Chaat', description: 'Crunchy puris topped with potatoes, chutneys, onions, and crispy sev for a tangy bite.', price: 80, image: 'https://images.pexels.com/photos/4911986/pexels-photo-4911986.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false },
      { id: 'dish-1104', name: 'Misal Pav', category: 'Street Food', description: 'Spicy sprouted moth beans curry topped with farsan, onion and served with pav buns.', price: 100, image: 'https://images.pexels.com/photos/4911986/pexels-photo-4911986.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false },
      { id: 'dish-1105', name: 'Bhel Puri', category: 'Chaat', description: 'Light and crunchy puffed rice tossed with veggies, tamarind chutney, and sev.', price: 70, image: 'https://images.pexels.com/photos/4911986/pexels-photo-4911986.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false },
      { id: 'dish-1106', name: 'Masala Chai', category: 'Beverages', description: 'Strong brewed tea simmered with ginger, cardamom, and aromatic Indian spices.', price: 40, image: 'https://images.pexels.com/photos/4518672/pexels-photo-4518672.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false }
    ]
  },
  {
    id: 'rest-013',
    name: 'Punjabi Dhaba',
    slug: 'punjabi-dhaba',
    logoImage: 'https://images.pexels.com/photos/9609844/pexels-photo-9609844.jpeg',
    coverImage: '/images/swadisht/restaurants/punjabi_dhaba.jpg',
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
      { id: 'dish-1201', name: 'Sarson Da Saag', category: 'Main Course', description: 'Traditional Punjabi mustard greens slow-cooked with spices and finished with dollop of white butter.', price: 260, image: 'https://images.pexels.com/photos/5718095/pexels-photo-5718095.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: true },
      { id: 'dish-1202', name: 'Makki di Roti', category: 'Breads', description: 'Rustic cornmeal flatbread cooked on a traditional tawa — perfect with sarson da saag.', price: 40, image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false },
      { id: 'dish-1203', name: 'Amritsari Fish', category: 'Starters', description: 'Juicy fish fillet marinated in bold Amritsari spices and deep-fried to golden perfection.', price: 380, image: 'https://images.pexels.com/photos/5718092/pexels-photo-5718092.jpeg?w=600&h=400&fit=crop', isVeg: false, isBestseller: true },
      { id: 'dish-1204', name: 'Shahi Paneer', category: 'Main Course', description: 'Royal paneer cooked in a fragrant cashew and cream gravy with saffron and aromatic whole spices.', price: 310, image: 'https://images.pexels.com/photos/60616/fried-chicken-restaurant-60616.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: true },
      { id: 'dish-1205', name: 'Lassi', category: 'Beverages', description: 'Chilled sweet yogurt drink blended smooth with sugar and a hint of cardamom and rose water.', price: 80, image: 'https://images.pexels.com/photos/4197444/pexels-photo-4197444.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false },
      { id: 'dish-1206', name: 'Dal Tadka', category: 'Main Course', description: 'Yellow lentils tempered with cumin, garlic, ghee, and mild spices in rustic dhaba style.', price: 200, image: 'https://images.pexels.com/photos/5718092/pexels-photo-5718092.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false }
    ]
  },
  {
    id: 'rest-014',
    name: 'Kerala Spice Garden',
    slug: 'kerala-spice-garden',
    logoImage: 'https://images.pexels.com/photos/38324319/pexels-photo-38324319.jpeg',
    coverImage: '/images/swadisht/restaurants/kerala_spice.png',
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
      { id: 'dish-1301', name: 'Kerala Fish Curry', category: 'Main Course', description: 'Tangy coconut milk fish curry slow-cooked with raw mango and authentic Kerala spices.', price: 380, image: 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?w=600&h=400&fit=crop', isVeg: false, isBestseller: true },
      { id: 'dish-1302', name: 'Appam with Stew', category: 'South Indian', description: 'Lacy hoppers served with creamy coconut milk vegetable stew flavored with whole spices.', price: 180, image: 'https://images.pexels.com/photos/1640780/pexels-photo-1640780.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: true },
      { id: 'dish-1303', name: 'Karimeen Pollichathu', category: 'Main Course', description: 'Pearl spot fish marinated in spicy masala and baked in banana leaf for smoky authentic flavor.', price: 450, image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?w=600&h=400&fit=crop', isVeg: false, isBestseller: true },
      { id: 'dish-1304', name: 'Puttu Kadala', category: 'Breakfast', description: 'Steamed rice cylinders layered with coconut served with spicy black chickpea curry.', price: 140, image: 'https://images.pexels.com/photos/1640776/pexels-photo-1640776.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false },
      { id: 'dish-1305', name: 'Prawn Moilee', category: 'Main Course', description: 'Delicate coconut milk prawn curry gently spiced with turmeric, green chili, and ginger.', price: 420, image: 'https://images.pexels.com/photos/1640778/pexels-photo-1640778.jpeg?w=600&h=400&fit=crop', isVeg: false, isBestseller: false }
    ]
  },
  {
    id: 'rest-015',
    name: 'Rolls & Wraps Co.',
    slug: 'rolls-and-wraps-co',
    logoImage: 'https://images.pexels.com/photos/29173104/pexels-photo-29173104.jpeg',
    coverImage: '/images/swadisht/restaurants/roll_wraps.png',
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
      { id: 'dish-1401', name: 'Chicken Kathi Roll', category: 'Rolls', description: 'Juicy spiced chicken tikka wrapped in soft paratha with crunchy onions and mint chutney.', price: 180, image: 'https://images.pexels.com/photos/1640779/pexels-photo-1640779.jpeg?w=600&h=400&fit=crop', isVeg: false, isBestseller: true },
      { id: 'dish-1402', name: 'Paneer Tikka Roll', category: 'Rolls', description: 'Smoky grilled paneer cubes rolled in flaky paratha with pickled veggies and green chutney.', price: 160, image: 'https://images.pexels.com/photos/1640781/pexels-photo-1640781.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: true },
      { id: 'dish-1403', name: 'Egg Double Roll', category: 'Rolls', description: 'Two-egg omelet roll with spiced potato filling, onions, and signature house sauce.', price: 130, image: 'https://images.pexels.com/photos/1640782/pexels-photo-1640782.jpeg?w=600&h=400&fit=crop', isVeg: false, isBestseller: false },
      { id: 'dish-1404', name: 'Veg Cheese Roll', category: 'Rolls', description: 'Loaded veggie and cheese mix wrapped in crispy paratha with creamy mayo and jalapeños.', price: 150, image: 'https://images.pexels.com/photos/1640783/pexels-photo-1640783.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false },
      { id: 'dish-1405', name: 'Mutton Seekh Roll', category: 'Rolls', description: 'Tender minced mutton seekh kebab wrapped in soft paratha with pickled onions and chutney.', price: 220, image: 'https://images.pexels.com/photos/1640784/pexels-photo-1640784.jpeg?w=600&h=400&fit=crop', isVeg: false, isBestseller: false }
    ]
  },
  {
    id: 'rest-016',
    name: 'Chettinad Palace',
    slug: 'chettinad-palace',
    logoImage: 'https://images.pexels.com/photos/29684985/pexels-photo-29684985.jpeg',
    coverImage: 'https://i.pinimg.com/736x/3e/db/02/3edb02bdda9774539ea4fd995b5a2049.jpg',
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
      { id: 'dish-1501', name: 'Chettinad Chicken Curry', category: 'Main Course', description: 'Fiery and aromatic chicken curry made with freshly ground Chettinad spice blend and coconut.', price: 360, image: 'https://images.pexels.com/photos/1640785/pexels-photo-1640785.jpeg?w=600&h=400&fit=crop', isVeg: false, isBestseller: true },
      { id: 'dish-1502', name: 'Kavuni Arisi Payasam', category: 'Desserts', description: 'Traditional black glutinous rice kheer sweetened with jaggery and coconut milk.', price: 140, image: 'https://images.pexels.com/photos/1640786/pexels-photo-1640786.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: true },
      { id: 'dish-1503', name: 'Mutton Chukka', category: 'Starters', description: 'Dry-roasted mutton tossed with freshly ground spices, curry leaves, and pearl onions.', price: 420, image: 'https://images.pexels.com/photos/1640787/pexels-photo-1640787.jpeg?w=600&h=400&fit=crop', isVeg: false, isBestseller: true },
      { id: 'dish-1504', name: 'Parotta', category: 'Breads', description: 'Flaky layered South Indian flatbread made with maida — perfect with curries and gravies.', price: 50, image: 'https://images.pexels.com/photos/1640788/pexels-photo-1640788.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false },
      { id: 'dish-1505', name: 'Kara Kuzhambu', category: 'Main Course', description: 'Bold and tangy tamarind gravy with brinjal, small onions, and aromatic Chettinad spices.', price: 220, image: 'https://images.pexels.com/photos/1640789/pexels-photo-1640789.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false }
    ]
  },
  {
    id: 'rest-017',
    name: 'Thali Express',
    slug: 'thali-express',
    logoImage: 'https://images.pexels.com/photos/29148133/pexels-photo-29148133.jpeg',
    coverImage: '/images/swadisht/restaurants/thali_express.png',
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
      { id: 'dish-1601', name: 'Rajasthani Thali', category: 'Thali', description: 'Wholesome thali with dal baati churma, gatte ki sabzi, ker sangri, and bajra roti.', price: 280, image: 'https://images.pexels.com/photos/1640790/pexels-photo-1640790.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: true },
      { id: 'dish-1602', name: 'Gujarati Thali', category: 'Thali', description: 'Sweet, sour and spicy Gujarati thali with dal, shaak, rotli, rice, kadhi, and farsan.', price: 260, image: 'https://images.pexels.com/photos/7474259/pexels-photo-7474259.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: true },
      { id: 'dish-1603', name: 'Dal Baati Churma', category: 'Main Course', description: 'Baked wheat dumplings dunked in aromatic five-lentil dal and served with sweet churma.', price: 240, image: 'https://images.pexels.com/photos/6413424/pexels-photo-6413424.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false },
      { id: 'dish-1604', name: 'Gatte Ki Sabzi', category: 'Main Course', description: 'Chickpea flour dumplings simmered in tangy yogurt-based gravy with Rajasthani spices.', price: 180, image: 'https://images.pexels.com/photos/4004471/pexels-photo-4004471.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false },
      { id: 'dish-1605', name: 'Malpua', category: 'Desserts', description: 'Sweet fried pancakes soaked in sugar syrup with cardamom and garnished with rabri.', price: 120, image: 'https://images.pexels.com/photos/4004464/pexels-photo-4004464.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false },
      { id: 'dish-1606', name: 'Bajra Roti', category: 'Breads', description: 'Rustic pearl millet flatbread served hot with ghee — a wholesome Rajasthani staple.', price: 40, image: 'https://images.pexels.com/photos/4197455/pexels-photo-4197455.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false }
    ]
  },
  {
    id: 'rest-018',
    name: 'Oven Fresh Bakehouse',
    slug: 'oven-fresh-bakehouse',
    logoImage: 'https://images.pexels.com/photos/7543099/pexels-photo-7543099.jpeg',
    coverImage: '/images/swadisht/restaurants/oven_fresh_bakehouse.png',
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
      { id: 'dish-1701', name: 'Artisan Sourdough', category: 'Bakery', description: 'Slow-fermented sourdough with a crispy crust and chewy open crumb using heirloom wheat.', price: 180, image: 'https://images.pexels.com/photos/4197492/pexels-photo-4197492.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: true },
      { id: 'dish-1702', name: 'Croissant', category: 'Bakery', description: 'Flaky buttery croissant with honeyed layers, baked golden every morning for peak freshness.', price: 120, image: 'https://images.pexels.com/photos/4197495/pexels-photo-4197495.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: true },
      { id: 'dish-1703', name: 'Tiramisu', category: 'Desserts', description: 'Classic Italian tiramisu with mascarpone cream, espresso-soaked ladyfingers, and cocoa dust.', price: 220, image: 'https://images.pexels.com/photos/3996419/pexels-photo-3996419.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: true },
      { id: 'dish-1704', name: 'Banana Walnut Muffin', category: 'Bakery', description: 'Moist banana muffin studded with crunchy walnuts — freshly baked and naturally sweetened.', price: 90, image: 'https://images.pexels.com/photos/8695497/pexels-photo-8695497.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false },
      { id: 'dish-1705', name: 'Matcha Latte', category: 'Beverages', description: 'Ceremonial grade matcha whisked with oat milk for a creamy and antioxidant-rich drink.', price: 180, image: 'https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false },
      { id: 'dish-1706', name: 'Cheesecake Slice', category: 'Desserts', description: 'Dense and velvety New York-style cheesecake on a buttery graham cracker crust.', price: 200, image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false }
    ]
  },
  {
    id: 'rest-019',
    name: 'Kebab & Grill House',
    slug: 'kebab-and-grill-house',
    logoImage: 'https://images.pexels.com/photos/12737811/pexels-photo-12737811.jpeg',
    coverImage: '/images/swadisht/restaurants/kebab_grill_house.png',
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
      { id: 'dish-1801', name: 'Seekh Kebab', category: 'Starters', description: 'Minced mutton blended with herbs and spices, skewered and grilled in a flaming charcoal tandoor.', price: 360, image: 'https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg?w=600&h=400&fit=crop', isVeg: false, isBestseller: true },
      { id: 'dish-1802', name: 'Kakori Kebab', category: 'Starters', description: 'Ultra-smooth mutton kebabs with raw papaya and subtle aromatic spices — melt-in-mouth texture.', price: 420, image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?w=600&h=400&fit=crop', isVeg: false, isBestseller: true },
      { id: 'dish-1803', name: 'Reshmi Kebab', category: 'Starters', description: 'Silky chicken kebab marinated in cream, cashew, and fresh herbs for a delicate flavor.', price: 340, image: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?w=600&h=400&fit=crop', isVeg: false, isBestseller: false },
      { id: 'dish-1804', name: 'Bihari Murgh', category: 'Main Course', description: 'Succulent chicken cooked with mustard and poppy seeds in a richly spiced Bihari-style gravy.', price: 380, image: 'https://images.pexels.com/photos/3407777/pexels-photo-3407777.jpeg?w=600&h=400&fit=crop', isVeg: false, isBestseller: false },
      { id: 'dish-1805', name: 'Laccha Paratha', category: 'Breads', description: 'Multi-layered whole wheat paratha cooked with ghee — crispy outside, fluffy layers inside.', price: 80, image: 'https://images.pexels.com/photos/3735149/pexels-photo-3735149.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false }
    ]
  },
  {
    id: 'rest-020',
    name: 'Noodle Bar Asia',
    slug: 'noodle-bar-asia',
    logoImage: 'https://images.pexels.com/photos/28895969/pexels-photo-28895969.jpeg',
    coverImage: '/images/swadisht/restaurants/noodle_bar_asia.png',
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
      { id: 'dish-1901', name: 'Ramen Bowl', category: 'Japanese', description: 'Rich tonkotsu broth with ramen noodles, soft-boiled egg, chashu pork, nori, and bamboo shoots.', price: 480, image: 'https://images.pexels.com/photos/1640769/pexels-photo-1640769.jpeg?w=600&h=400&fit=crop', isVeg: false, isBestseller: true },
      { id: 'dish-1902', name: 'Pad Thai', category: 'Thai', description: 'Stir-fried rice noodles with tamarind sauce, tofu, bean sprouts, spring onion, and crushed peanuts.', price: 380, image: 'https://images.pexels.com/photos/1640769/pexels-photo-1640769.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: true },
      { id: 'dish-1903', name: 'Dim Sum Platter', category: 'Chinese', description: 'Assorted steamed and fried dim sum including har gow, siu mai, and vegetable gyoza.', price: 320, image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=600&h=400&fit=crop', isVeg: false, isBestseller: false },
      { id: 'dish-1904', name: 'Green Thai Curry', category: 'Thai', description: 'Fragrant coconut milk green curry with vegetables or chicken, basil, and kaffir lime leaves.', price: 360, image: 'https://images.pexels.com/photos/4197444/pexels-photo-4197444.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false },
      { id: 'dish-1905', name: 'Bao Buns', category: 'Starters', description: 'Steamed fluffy bao buns filled with crispy pork belly or spiced tofu and pickled daikon.', price: 280, image: 'https://images.pexels.com/photos/4911986/pexels-photo-4911986.jpeg?w=600&h=400&fit=crop', isVeg: false, isBestseller: false }
    ]
  },
  {
    id: 'rest-021',
    name: 'Malabar Mess',
    slug: 'malabar-mess',
    logoImage: 'https://images.pexels.com/photos/13243817/pexels-photo-13243817.jpeg',
    coverImage: '/images/swadisht/restaurants/malabar_mess.png',
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
      { id: 'dish-2001', name: 'Malabar Chicken Biryani', category: 'Biryani', description: 'Fragrant Malabar-style biryani with small-grain kaima rice, whole spices, and caramelized onions.', price: 360, image: 'https://images.pexels.com/photos/4518672/pexels-photo-4518672.jpeg?w=600&h=400&fit=crop', isVeg: false, isBestseller: true },
      { id: 'dish-2002', name: 'Chemeen Mappas', category: 'Main Course', description: 'Coastal prawn curry in coconut milk with whole spices, tomato, and Malabar pepper.', price: 400, image: 'https://images.pexels.com/photos/5718095/pexels-photo-5718095.jpeg?w=600&h=400&fit=crop', isVeg: false, isBestseller: true },
      { id: 'dish-2003', name: 'Pathiri', category: 'Breads', description: 'Thin lacy rice flour flatbreads — a Malabar specialty best paired with coastal curries.', price: 60, image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false },
      { id: 'dish-2004', name: 'Thalassery Mutton Curry', category: 'Main Course', description: 'Bold mutton curry marinated with Thalassery spice blend and slow-simmered in coconut gravy.', price: 440, image: 'https://images.pexels.com/photos/60616/fried-chicken-restaurant-60616.jpeg?w=600&h=400&fit=crop', isVeg: false, isBestseller: false },
      { id: 'dish-2005', name: 'Ari Payasam', category: 'Desserts', description: 'Creamy rice kheer cooked in coconut milk with jaggery, cardamom, and cashews.', price: 110, image: 'https://images.pexels.com/photos/5718092/pexels-photo-5718092.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false }
    ]
  },
  {
    id: 'rest-022',
    name: 'Pasta & More',
    slug: 'pasta-and-more',
    logoImage: 'https://images.pexels.com/photos/5411629/pexels-photo-5411629.jpeg',
    coverImage: '/images/swadisht/restaurants/pasta_and_more.png',
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
      { id: 'dish-2101', name: 'Cacio e Pepe', category: 'Italian', description: 'Roman classic — spaghetti tossed with Pecorino, Parmigiano, and freshly cracked black pepper.', price: 420, image: 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: true },
      { id: 'dish-2102', name: 'Penne Arrabbiata', category: 'Italian', description: 'Fiery tomato-garlic sauce with penne pasta, olives, capers, and fresh basil leaves.', price: 360, image: 'https://images.pexels.com/photos/1640780/pexels-photo-1640780.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: true },
      { id: 'dish-2103', name: 'Chicken Carbonara', category: 'Italian', description: 'Creamy egg-based sauce with grilled chicken, pancetta, Pecorino, and silky pasta.', price: 480, image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?w=600&h=400&fit=crop', isVeg: false, isBestseller: false },
      { id: 'dish-2104', name: 'Focaccia', category: 'Breads', description: 'Soft herb-loaded Italian flatbread brushed with olive oil, sea salt, and rosemary.', price: 200, image: 'https://images.pexels.com/photos/1640776/pexels-photo-1640776.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false },
      { id: 'dish-2105', name: 'Panna Cotta', category: 'Desserts', description: 'Velvety Italian cream dessert with berry coulis — silky smooth and perfectly chilled.', price: 240, image: 'https://images.pexels.com/photos/1640778/pexels-photo-1640778.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false },
      { id: 'dish-2106', name: 'Bruschetta', category: 'Starters', description: 'Grilled bread rubbed with garlic, topped with ripe tomatoes, basil, and drizzled olive oil.', price: 220, image: 'https://images.pexels.com/photos/1640779/pexels-photo-1640779.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false }
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
  let filtered = [...RESTAURANTS  ,
  {
    id: 'rest-new-001',
    name: 'The Coastal Kitchen',
    slug: 'coastal-kitchen',
    video: '/video/restaurants/ANDHRAFISH.mp4',
    coverImage: 'https://images.pexels.com/photos/3296402/pexels-photo-3296402.jpeg?w=600&h=320&fit=crop',
    logoImage: 'https://images.pexels.com/photos/566346/pexels-photo-566346.jpeg?w=200',
    images: [
      'https://images.pexels.com/photos/3296402/pexels-photo-3296402.jpeg?w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/566346/pexels-photo-566346.jpeg?w=800&h=600&fit=crop'
    ],
    rating: 4.6, ratingCount: 2100,
    cuisines: ['Seafood', 'Coastal', 'Kerala'],
    priceForTwo: 500, deliveryTime: '35-45 mins',
    location: { area: 'Whitefield', city: 'Bangalore', coordinates: { lat: 12.9698, lng: 77.7499 } },
    offers: [{ title: '30% OFF', description: 'Up to ₹120 on orders above ₹299', code: 'COASTAL30', discount: 30 }],
    features: { pureVeg: false, acceptsVouchers: true, hasParking: true, servesAlcohol: false },
    timings: { open: '11:00 AM', close: '11:00 PM', days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
    menu: [
      { id: 'coast-001', name: 'Fish Curry - Kerala Style', category: 'Main Course', description: 'Coconut milk-based fish curry with raw mango and curry leaves.', price: 380, image: 'https://images.pexels.com/photos/1640781/pexels-photo-1640781.jpeg?w=600&h=400&fit=crop', isVeg: false, isBestseller: true },
      { id: 'coast-002', name: 'Prawn Masala', category: 'Main Course', description: 'Juicy prawns cooked in a tangy onion-tomato gravy with coastal spices.', price: 450, image: 'https://images.pexels.com/photos/1640782/pexels-photo-1640782.jpeg?w=600&h=400&fit=crop', isVeg: false, isBestseller: true },
      { id: 'coast-003', name: 'Crab Roast', category: 'Starters', description: 'Dry-roasted crab with pepper and coconut masala, a coastal specialty.', price: 580, image: 'https://images.pexels.com/photos/1640783/pexels-photo-1640783.jpeg?w=600&h=400&fit=crop', isVeg: false, isBestseller: false },
      { id: 'coast-004', name: 'Appam', category: 'Breads', description: 'Lacy fermented rice pancakes, best paired with stew or curry.', price: 80, image: 'https://images.pexels.com/photos/1640784/pexels-photo-1640784.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: true },
      { id: 'coast-005', name: 'Malabar Parotta', category: 'Breads', description: 'Layered, flaky flatbread made from maida — a Kerala street classic.', price: 60, image: 'https://images.pexels.com/photos/1640785/pexels-photo-1640785.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false },
      { id: 'coast-006', name: 'Karimeen Pollichathu', category: 'Main Course', description: 'Pearl spot fish marinated in spices and grilled in banana leaf.', price: 520, image: 'https://images.pexels.com/photos/1640786/pexels-photo-1640786.jpeg?w=600&h=400&fit=crop', isVeg: false, isBestseller: false },
      { id: 'coast-007', name: 'Coconut Prawn Curry', category: 'Main Course', description: 'Prawns in a light coconut-based broth with turmeric and green chilli.', price: 420, image: 'https://images.pexels.com/photos/1640787/pexels-photo-1640787.jpeg?w=600&h=400&fit=crop', isVeg: false, isBestseller: false },
      { id: 'coast-008', name: 'Fish Tikka', category: 'Starters', description: 'Boneless fish marinated in yogurt-spice mix and tandoor-grilled.', price: 340, image: 'https://images.pexels.com/photos/1640788/pexels-photo-1640788.jpeg?w=600&h=400&fit=crop', isVeg: false, isBestseller: false },
      { id: 'coast-009', name: 'Payasam - Semiya', category: 'Desserts', description: 'Sweet vermicelli dessert in sweetened condensed milk with cashews.', price: 120, image: 'https://images.pexels.com/photos/1640789/pexels-photo-1640789.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false },
      { id: 'coast-010', name: 'Chemmeen Biryani', category: 'Rice', description: 'Prawn dum biryani layered with fragrant basmati and coastal spices.', price: 480, image: 'https://images.pexels.com/photos/1640790/pexels-photo-1640790.jpeg?w=600&h=400&fit=crop', isVeg: false, isBestseller: true }
    ]
  },
  {
    id: 'rest-new-002',
    name: 'Bombay Street Bites',
    slug: 'bombay-street-bites',
    video: '/video/restaurants/CHOLE BHATURE.mp4',
    coverImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=600&h=320&fit=crop',
    logoImage: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?w=200',
    images: [
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=800&h=600&fit=crop'
    ],
    rating: 4.4, ratingCount: 1850,
    cuisines: ['Street Food', 'Mumbai', 'Chaat'],
    priceForTwo: 250, deliveryTime: '20-30 mins',
    location: { area: 'JP Nagar', city: 'Bangalore', coordinates: { lat: 12.9063, lng: 77.5857 } },
    offers: [{ title: '50% OFF', description: 'Upto ₹80 on first order', code: 'BOMBAY50', discount: 50 }],
    features: { pureVeg: true, acceptsVouchers: true, hasParking: false, servesAlcohol: false },
    timings: { open: '10:00 AM', close: '11:00 PM', days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
    menu: [
      { id: 'bom-001', name: 'Pav Bhaji', category: 'Main Course', description: 'Spiced mashed vegetable curry served with buttered pav buns.', price: 180, image: 'https://images.pexels.com/photos/7474259/pexels-photo-7474259.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: true },
      { id: 'bom-002', name: 'Vada Pav', category: 'Starters', description: "Mumbai's iconic street burger — spiced potato fritter in a soft bun.", price: 60, image: 'https://images.pexels.com/photos/4911986/pexels-photo-4911986.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: true },
      { id: 'bom-003', name: 'Pani Puri', category: 'Starters', description: 'Hollow crispy puris filled with tangy tamarind water and chickpeas.', price: 90, image: 'https://images.pexels.com/photos/4911986/pexels-photo-4911986.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: true },
      { id: 'bom-004', name: 'Bhel Puri', category: 'Starters', description: 'Puffed rice tossed with chutneys, onions, tomatoes and sev.', price: 100, image: 'https://images.pexels.com/photos/4911986/pexels-photo-4911986.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false },
      { id: 'bom-005', name: 'Sev Puri', category: 'Starters', description: 'Crispy puris topped with potatoes, chutneys and fine sev noodles.', price: 110, image: 'https://images.pexels.com/photos/4911986/pexels-photo-4911986.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false },
      { id: 'bom-006', name: 'Misal Pav', category: 'Main Course', description: 'Spicy sprouted lentil curry with farsan served with pav.', price: 160, image: 'https://images.pexels.com/photos/6413424/pexels-photo-6413424.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false },
      { id: 'bom-007', name: 'Dahi Puri', category: 'Starters', description: 'Puris filled with sweet yogurt, chutneys, and pomegranate pearls.', price: 120, image: 'https://images.pexels.com/photos/4911986/pexels-photo-4911986.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false },
      { id: 'bom-008', name: 'Aam Panna', category: 'Beverages', description: 'Raw mango cooler with mint and black salt — refreshing summer drink.', price: 70, image: 'https://images.pexels.com/photos/4004471/pexels-photo-4004471.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false },
      { id: 'bom-009', name: 'Kulfi Falooda', category: 'Desserts', description: 'Rose milk falooda topped with dense pistachio kulfi and basil seeds.', price: 180, image: 'https://images.pexels.com/photos/4004464/pexels-photo-4004464.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: true },
      { id: 'bom-010', name: 'Dabeli', category: 'Starters', description: 'Kutchi-style spiced potato filling in a bun with pomegranate and peanuts.', price: 80, image: 'https://images.pexels.com/photos/4197455/pexels-photo-4197455.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false }
    ]
  },
  {
    id: 'rest-new-003',
    name: 'Pan-Asian Kitchen',
    slug: 'pan-asian-kitchen',
    video: '/video/restaurants/WOK.mp4',
    coverImage: 'https://images.pexels.com/photos/955137/pexels-photo-955137.jpeg?w=600&h=320&fit=crop',
    logoImage: 'https://images.pexels.com/photos/4518635/pexels-photo-4518635.jpeg?w=200',
    images: [
      'https://images.pexels.com/photos/955137/pexels-photo-955137.jpeg?w=800&h=600&fit=crop'
    ],
    rating: 4.5, ratingCount: 1620,
    cuisines: ['Chinese', 'Thai', 'Japanese', 'Pan-Asian'],
    priceForTwo: 600, deliveryTime: '30-40 mins',
    location: { area: 'Marathahalli', city: 'Bangalore', coordinates: { lat: 12.9563, lng: 77.7011 } },
    offers: [{ title: '20% OFF', description: 'On orders above ₹499', code: 'ASIAN20', discount: 20 }],
    features: { pureVeg: false, acceptsVouchers: true, hasParking: true, servesAlcohol: false },
    timings: { open: '11:30 AM', close: '11:00 PM', days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
    menu: [
      { id: 'pan-001', name: 'Dimsums - Chicken', category: 'Starters', description: 'Steamed chicken dumplings served with a ginger-chilli dipping sauce.', price: 280, image: 'https://images.pexels.com/photos/4197492/pexels-photo-4197492.jpeg?w=600&h=400&fit=crop', isVeg: false, isBestseller: true },
      { id: 'pan-002', name: 'Pad Thai Noodles', category: 'Main Course', description: 'Wok-fried rice noodles with egg, bean sprouts and tamarind sauce.', price: 350, image: 'https://images.pexels.com/photos/1640769/pexels-photo-1640769.jpeg?w=600&h=400&fit=crop', isVeg: false, isBestseller: true },
      { id: 'pan-003', name: 'Sushi Platter - 8 Pcs', category: 'Starters', description: 'Chef selection of nigiri and maki rolls with wasabi and pickled ginger.', price: 580, image: 'https://images.pexels.com/photos/4197495/pexels-photo-4197495.jpeg?w=600&h=400&fit=crop', isVeg: false, isBestseller: false },
      { id: 'pan-004', name: 'Tom Yum Soup', category: 'Soups', description: 'Fragrant Thai hot and sour soup with mushrooms, lemongrass and kaffir lime.', price: 280, image: 'https://images.pexels.com/photos/3996419/pexels-photo-3996419.jpeg?w=600&h=400&fit=crop', isVeg: false, isBestseller: false },
      { id: 'pan-005', name: 'Green Thai Curry', category: 'Main Course', description: 'Aromatic green curry with coconut milk, vegetables and jasmine rice.', price: 420, image: 'https://images.pexels.com/photos/8695497/pexels-photo-8695497.jpeg?w=600&h=400&fit=crop', isVeg: false, isBestseller: true },
      { id: 'pan-006', name: 'Kung Pao Chicken', category: 'Main Course', description: 'Spicy Sichuan-style chicken with peanuts, chillies and Sichuan pepper.', price: 380, image: 'https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg?w=600&h=400&fit=crop', isVeg: false, isBestseller: false },
      { id: 'pan-007', name: 'Veg Fried Rice', category: 'Rice', description: 'Wok-tossed jasmine rice with seasonal vegetables and soy seasoning.', price: 220, image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false },
      { id: 'pan-008', name: 'Miso Soup', category: 'Soups', description: 'Classic Japanese miso broth with silken tofu, wakame and spring onion.', price: 180, image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false },
      { id: 'pan-009', name: 'Mango Sticky Rice', category: 'Desserts', description: 'Thai sweet sticky rice with fresh mango slices and coconut cream drizzle.', price: 220, image: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: true },
      { id: 'pan-010', name: 'Spring Roll Platter', category: 'Starters', description: 'Crispy pan-fried spring rolls with glass noodles and sweet chilli dip.', price: 250, image: 'https://images.pexels.com/photos/4518672/pexels-photo-4518672.jpeg?w=600&h=400&fit=crop', isVeg: true, isBestseller: false }
    ]
  }
];

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

