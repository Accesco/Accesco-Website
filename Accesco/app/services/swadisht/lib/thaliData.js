/**
 * Thali Engine Data Module
 * @module lib/thaliData
 * @description Festival and traditional thali recipes with cultural context
 */

export const THALI_RECIPES = [
  {
    id: 'sunday-lunch-thali',
    name: 'Sunday Lunch Thali',
    category: 'Traditional',
    festival: null,
    description: 'Complete North Indian family meal experience',
    image: '/images/thalis/sunday.jpg',
    price: 499,
    serves: 2,
    prepTime: '45 mins',
    components: [
      {
        name: 'Dal Makhani',
        description: 'Creamy black lentils slow-cooked overnight',
        quantity: '250g',
        farmChainId: 'dal-001',
        isVeg: true,
        calories: 280
      },
      {
        name: 'Paneer Butter Masala',
        description: 'Cottage cheese in rich tomato gravy',
        quantity: '200g',
        farmChainId: 'paneer-001',
        isVeg: true,
        calories: 320
      },
      {
        name: 'Mixed Vegetable',
        description: 'Seasonal vegetables in aromatic spices',
        quantity: '150g',
        farmChainId: 'veg-001',
        isVeg: true,
        calories: 120
      },
      {
        name: 'Raita',
        description: 'Yogurt with cucumber and spices',
        quantity: '100g',
        farmChainId: 'dairy-001',
        isVeg: true,
        calories: 80
      },
      {
        name: 'Roti/Naan',
        description: 'Fresh Indian bread',
        quantity: '6 pieces',
        farmChainId: 'wheat-001',
        isVeg: true,
        calories: 240
      },
      {
        name: 'Basmati Rice',
        description: 'Steamed aromatic rice',
        quantity: '200g',
        farmChainId: 'rice-001',
        isVeg: true,
        calories: 260
      },
      {
        name: 'Pickle & Papad',
        description: 'Traditional accompaniments',
        quantity: '50g',
        farmChainId: 'pickle-001',
        isVeg: true,
        calories: 60
      },
      {
        name: 'Gulab Jamun',
        description: 'Sweet milk dumplings in sugar syrup',
        quantity: '4 pieces',
        farmChainId: 'sweet-001',
        isVeg: true,
        calories: 280
      }
    ],
    culturalStory: {
      title: 'The Sunday Lunch Tradition',
      content: 'In North Indian households, Sunday lunch is more than just a meal—it\'s a weekly ritual that brings families together. This elaborate spread represents the love and care that goes into preparing a feast for loved ones. Each dish is carefully crafted to balance flavors, textures, and nutrition, creating a complete dining experience that has been passed down through generations.',
      traditions: [
        'Families gather around the table',
        'Elders are served first',
        'Food is eaten with hands for better connection',
        'Leftovers are shared with neighbors'
      ],
      origin: 'North India',
      significance: 'Family bonding and tradition'
    },
    cookingOptions: [
      {
        type: 'fully-cooked',
        name: 'Ready to Eat',
        description: 'Fully prepared, just heat and serve',
        price: 499,
        deliveryTime: '45-60 mins',
        available: true
      },
      {
        type: 'semi-prepared',
        name: 'Semi-Prepared',
        description: 'Pre-cut ingredients with recipe, cook at home',
        price: 399,
        deliveryTime: '2-3 hours',
        available: true
      },
      {
        type: 'raw-kit',
        name: 'Raw Ingredients Kit',
        description: 'Fresh ingredients with detailed recipe',
        price: 349,
        deliveryTime: '4-5 hours',
        available: true
      }
    ],
    customization: {
      spiceLevel: ['Mild', 'Medium', 'Hot'],
      portionSize: ['Regular', 'Large (+₹100)', 'Family Pack (+₹200)'],
      dietaryOptions: ['Pure Veg', 'Jain', 'No Onion-Garlic']
    },
    nutritionInfo: {
      calories: 1640,
      protein: 48,
      carbs: 220,
      fats: 52,
      fiber: 18,
      servingSize: '1 thali (for 1 person)'
    },
    tags: ['Traditional', 'Family Meal', 'North Indian', 'Vegetarian'],
    rating: 4.7,
    reviewCount: 342,
    isBestseller: true
  },
  {
    id: 'eid-special-thali',
    name: 'Eid Special Thali',
    category: 'Festival',
    festival: 'Eid-ul-Fitr',
    description: 'Authentic Eid celebration meal',
    image: '/images/thalis/eid.jpg',
    price: 699,
    serves: 2,
    prepTime: '60 mins',
    components: [
      {
        name: 'Mutton Biryani',
        description: 'Aromatic rice with tender mutton',
        quantity: '400g',
        farmChainId: 'mutton-001',
        isVeg: false,
        calories: 520
      },
      {
        name: 'Sheer Khurma',
        description: 'Vermicelli pudding with dates and nuts',
        quantity: '200g',
        farmChainId: 'dairy-002',
        isVeg: true,
        calories: 280
      },
      {
        name: 'Seekh Kebab',
        description: 'Spiced minced meat skewers',
        quantity: '6 pieces',
        farmChainId: 'mutton-002',
        isVeg: false,
        calories: 340
      },
      {
        name: 'Korma',
        description: 'Rich creamy curry',
        quantity: '250g',
        farmChainId: 'mutton-003',
        isVeg: false,
        calories: 380
      },
      {
        name: 'Shahi Tukda',
        description: 'Royal bread pudding',
        quantity: '4 pieces',
        farmChainId: 'sweet-002',
        isVeg: true,
        calories: 320
      },
      {
        name: 'Premium Dates',
        description: 'Medjool dates',
        quantity: '100g',
        farmChainId: 'dates-001',
        isVeg: true,
        calories: 280
      },
      {
        name: 'Raita',
        description: 'Cooling yogurt side',
        quantity: '150g',
        farmChainId: 'dairy-003',
        isVeg: true,
        calories: 90
      }
    ],
    culturalStory: {
      title: 'Eid-ul-Fitr Celebration',
      content: 'Eid marks the end of Ramadan, a month of fasting and spiritual reflection. The Eid feast is a celebration of community, gratitude, and sharing. Traditional recipes are prepared with love, often starting the night before. The meal begins with dates, following the Sunnah, and includes rich, aromatic dishes that have been perfected over centuries in Muslim households across India.',
      traditions: [
        'Breaking fast with dates',
        'Sharing food with neighbors',
        'Preparing special sweets',
        'Family gatherings and prayers',
        'Wearing new clothes',
        'Giving charity (Zakat al-Fitr)'
      ],
      origin: 'Islamic Tradition',
      significance: 'Celebration of faith and community'
    },
    cookingOptions: [
      {
        type: 'fully-cooked',
        name: 'Ready to Eat',
        description: 'Fully prepared, authentic taste',
        price: 699,
        deliveryTime: '60-75 mins',
        available: true
      },
      {
        type: 'semi-prepared',
        name: 'Semi-Prepared',
        description: 'Marinated meats with recipe',
        price: 599,
        deliveryTime: '3-4 hours',
        available: true
      }
    ],
    customization: {
      meatOption: ['Mutton', 'Chicken', 'Mixed'],
      spiceLevel: ['Mild', 'Medium', 'Hot'],
      portionSize: ['Regular', 'Large (+₹150)', 'Family Pack (+₹300)']
    },
    nutritionInfo: {
      calories: 2210,
      protein: 78,
      carbs: 260,
      fats: 68,
      fiber: 14,
      servingSize: '1 thali (for 1 person)'
    },
    tags: ['Festival', 'Eid', 'Mughlai', 'Non-Vegetarian'],
    rating: 4.9,
    reviewCount: 567,
    isBestseller: true
  },
  {
    id: 'onam-sadya-thali',
    name: 'Onam Sadya',
    category: 'Festival',
    festival: 'Onam',
    description: 'Traditional Kerala feast on banana leaf',
     image: '/images/thalis/onam.jpg',
    price: 599,
    serves: 1,
    prepTime: '90 mins',
    components: [
      {
        name: 'Rice',
        description: 'Kerala red rice or white rice',
        quantity: '300g',
        farmChainId: 'rice-002',
        isVeg: true,
        calories: 390
      },
      {
        name: 'Sambar',
        description: 'Lentil and vegetable stew',
        quantity: '200g',
        farmChainId: 'dal-002',
        isVeg: true,
        calories: 180
      },
      {
        name: 'Avial',
        description: 'Mixed vegetables in coconut gravy',
        quantity: '150g',
        farmChainId: 'veg-002',
        isVeg: true,
        calories: 160
      },
      {
        name: 'Thoran',
        description: 'Stir-fried vegetables with coconut',
        quantity: '100g',
        farmChainId: 'veg-003',
        isVeg: true,
        calories: 120
      },
      {
        name: 'Pachadi',
        description: 'Sweet and sour curry',
        quantity: '100g',
        farmChainId: 'veg-004',
        isVeg: true,
        calories: 90
      },
      {
        name: 'Payasam',
        description: 'Sweet pudding dessert',
        quantity: '150g',
        farmChainId: 'sweet-003',
        isVeg: true,
        calories: 240
      },
      {
        name: 'Banana Chips',
        description: 'Crispy fried banana slices',
        quantity: '50g',
        farmChainId: 'snack-001',
        isVeg: true,
        calories: 180
      },
      {
        name: 'Pickle & Papadam',
        description: 'Traditional accompaniments',
        quantity: '50g',
        farmChainId: 'pickle-002',
        isVeg: true,
        calories: 80
      }
    ],
    culturalStory: {
      title: 'Onam - Kerala\'s Harvest Festival',
      content: 'Onam Sadya is the grand feast served during Kerala\'s harvest festival. Traditionally served on a banana leaf, this elaborate meal consists of 26 dishes representing the abundance of the harvest season. The meal is a symbol of unity, prosperity, and the rich culinary heritage of Kerala. Each dish has its place on the leaf, and there\'s a specific order in which they should be eaten.',
      traditions: [
        'Served on fresh banana leaf',
        'Eaten with right hand only',
        'Specific placement of dishes',
        'Multiple servings offered',
        'Payasam served at the end',
        'Community feast (Onasadya)'
      ],
      origin: 'Kerala, South India',
      significance: 'Harvest celebration and cultural pride'
    },
    cookingOptions: [
      {
        type: 'fully-cooked',
        name: 'Ready to Eat',
        description: 'Complete sadya with banana leaf',
        price: 599,
        deliveryTime: '60-75 mins',
        available: true
      },
      {
        type: 'semi-prepared',
        name: 'Semi-Prepared',
        description: 'Pre-cut vegetables with recipes',
        price: 499,
        deliveryTime: '3-4 hours',
        available: true
      }
    ],
    customization: {
      riceType: ['Red Rice', 'White Rice'],
      payasamType: ['Paal Payasam', 'Parippu Payasam', 'Ada Pradhaman'],
      portionSize: ['Regular', 'Large (+₹100)']
    },
    nutritionInfo: {
      calories: 1440,
      protein: 32,
      carbs: 240,
      fats: 38,
      fiber: 22,
      servingSize: '1 sadya (for 1 person)'
    },
    tags: ['Festival', 'Onam', 'Kerala', 'Vegetarian', 'Traditional'],
    rating: 4.8,
    reviewCount: 423,
    isBestseller: true,
    servingStyle: 'Banana leaf presentation'
  },
  {
    id: 'navratri-thali',
    name: 'Navratri Vrat Thali',
    category: 'Festival',
    festival: 'Navratri',
    description: 'Special fasting meal for Navratri',
     image: '/images/thalis/navratri.jpg',
    price: 399,
    serves: 1,
    prepTime: '40 mins',
    components: [
      {
        name: 'Sabudana Khichdi',
        description: 'Tapioca pearls with peanuts',
        quantity: '200g',
        farmChainId: 'sabudana-001',
        isVeg: true,
        calories: 280
      },
      {
        name: 'Kuttu Ki Puri',
        description: 'Buckwheat flour bread',
        quantity: '4 pieces',
        farmChainId: 'kuttu-001',
        isVeg: true,
        calories: 240
      },
      {
        name: 'Aloo Jeera',
        description: 'Cumin-flavored potatoes',
        quantity: '150g',
        farmChainId: 'potato-001',
        isVeg: true,
        calories: 180
      },
      {
        name: 'Vrat Wale Chawal',
        description: 'Sama rice preparation',
        quantity: '150g',
        farmChainId: 'sama-001',
        isVeg: true,
        calories: 200
      },
      {
        name: 'Fruit Raita',
        description: 'Yogurt with seasonal fruits',
        quantity: '100g',
        farmChainId: 'dairy-004',
        isVeg: true,
        calories: 120
      },
      {
        name: 'Makhana Kheer',
        description: 'Fox nuts pudding',
        quantity: '150g',
        farmChainId: 'sweet-004',
        isVeg: true,
        calories: 220
      }
    ],
    culturalStory: {
      title: 'Navratri - Nine Nights of Devotion',
      content: 'Navratri is a nine-night festival dedicated to Goddess Durga. During this period, devotees observe fasting and consume only specific foods. The Navratri Vrat Thali is specially prepared using ingredients permitted during the fast, ensuring both spiritual adherence and nutritional balance. Each dish is prepared without onion, garlic, or regular grains.',
      traditions: [
        'Nine days of fasting',
        'No onion or garlic',
        'Special grains only',
        'Rock salt instead of regular salt',
        'Evening prayers and aarti',
        'Breaking fast with prasad'
      ],
      origin: 'Pan-India',
      significance: 'Spiritual purification and devotion'
    },
    cookingOptions: [
      {
        type: 'fully-cooked',
        name: 'Ready to Eat',
        description: 'Freshly prepared vrat meal',
        price: 399,
        deliveryTime: '40-50 mins',
        available: true
      }
    ],
    customization: {
      spiceLevel: ['Mild', 'Medium'],
      portionSize: ['Regular', 'Large (+₹80)'],
      sweetOption: ['Makhana Kheer', 'Sabudana Kheer']
    },
    nutritionInfo: {
      calories: 1240,
      protein: 28,
      carbs: 180,
      fats: 42,
      fiber: 12,
      servingSize: '1 thali (for 1 person)'
    },
    tags: ['Festival', 'Navratri', 'Fasting', 'Vegetarian', 'No Onion-Garlic'],
    rating: 4.6,
    reviewCount: 289,
    isBestseller: false,
    specialNote: 'Prepared with rock salt and vrat-approved ingredients only'
  }
];

export function getThaliById(id) {
  return THALI_RECIPES.find(t => t.id === id);
}

export function getThalisByCategory(category) {
  if (category === 'all') return THALI_RECIPES;
  return THALI_RECIPES.filter(t => t.category.toLowerCase() === category.toLowerCase());
}

export function getThalisByFestival(festival) {
  return THALI_RECIPES.filter(t => t.festival === festival);
}

export function getBestsellerThalis() {
  return THALI_RECIPES.filter(t => t.isBestseller);
}

export function calculateThaliNutrition(thaliId, servings = 1) {
  const thali = getThaliById(thaliId);
  if (!thali) return null;
  
  return {
    calories: thali.nutritionInfo.calories * servings,
    protein: thali.nutritionInfo.protein * servings,
    carbs: thali.nutritionInfo.carbs * servings,
    fats: thali.nutritionInfo.fats * servings,
    fiber: thali.nutritionInfo.fiber * servings
  };
}
