export const categories = [
  { id: 'all', name: 'All Products', icon: '', color: '#0c831f' },
  { id: 'vegetables-fruits', name: 'Vegetables & Fruits', icon: '', color: '#10b981' },
  { id: 'dairy-breakfast', name: 'Dairy & Breakfast', icon: '', color: '#3b82f6' },
  { id: 'munchies', name: 'Munchies', icon: '', color: '#f59e0b' },
  { id: 'cold-drinks', name: 'Cold Drinks & Juices', icon: '', color: '#ef4444' },
  { id: 'instant-frozen', name: 'Instant & Frozen Food', icon: '', color: '#8b5cf6' },
  { id: 'tea-coffee', name: 'Tea, Coffee & Health', icon: '', color: '#78350f' },
  { id: 'bakery-biscuits', name: 'Bakery & Biscuits', icon: '', color: '#d97706' },
  { id: 'sweet-tooth', name: 'Sweet Tooth', icon: '', color: '#ec4899' },
  { id: 'atta-rice-dal', name: 'Atta, Rice & Dal', icon: '', color: '#eab308' },
  { id: 'masala-oil', name: 'Masala, Oil & More', icon: '', color: '#dc2626' },
  { id: 'sauces-spreads', name: 'Sauces & Spreads', icon: '', color: '#f97316' },
  { id: 'organic-healthy', name: 'Organic & Healthy', icon: '', color: '#059669' },
  { id: 'baby-care', name: 'Baby Care', icon: '', color: '#06b6d4' },
  { id: 'pharma-wellness', name: 'Pharma & Wellness', icon: '', color: '#0891b2' },
  { id: 'cleaning', name: 'Cleaning Essentials', icon: '', color: '#0284c7' },
  { id: 'home-office', name: 'Home & Office', icon: '', color: '#6366f1' },
  { id: 'personal-care', name: 'Personal Care', icon: '', color: '#a855f7' },
  { id: 'pet-care', name: 'Pet Care', icon: '', color: '#d946ef' },
];

export const products = [

  // ========== VEGETABLES & FRUITS ==========
  {
    id: 'veg-001', name: 'Tomato - Hybrid', brand: 'Fresho', category: 'vegetables-fruits',
    price: 28, mrp: 35, discount: 20, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://bittmanproject.com/wp-content/uploads/engin-akyurt-HrCatSbULFY-unsplash-1536x1152.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.2, reviews: 1240
  },
  {
    id: 'veg-002', name: 'Onion', brand: 'Fresho', category: 'vegetables-fruits',
    price: 35, mrp: 40, discount: 12, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://plantix.net/en/library/assets/custom/crop-images/onion.jpeg',
    inStock: true, tags: ['Bestseller'], rating: 4.1, reviews: 980
  },
  {
    id: 'veg-003', name: 'Potato', brand: 'Fresho', category: 'vegetables-fruits',
    price: 22, mrp: 28, discount: 21, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://plantix.net/en/library/assets/custom/crop-images/potato.jpeg',
    inStock: true, tags: ['Bestseller'], rating: 4.3, reviews: 1560
  },
  {
    id: 'veg-004', name: 'Capsicum - Green', brand: 'Fresho', category: 'vegetables-fruits',
    price: 45, mrp: 55, discount: 18, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRohaOfIlSYh5TqW2TuBDKjFGld9KPnOCMFr0VGdD4lMacqV7skC_Fz_kIuzMNzKpIJ-AV4LK1obXbDq6yD8CPEPd0u9hcN2g',
    inStock: true, rating: 4.0, reviews: 450
  },
  {
    id: 'veg-005', name: 'Carrot', brand: 'Fresho', category: 'vegetables-fruits',
    price: 38, mrp: 45, discount: 15, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Vegetable-Carrot-Bundle-wStalks.jpg/1920px-Vegetable-Carrot-Bundle-wStalks.jpg',
    inStock: true, rating: 4.4, reviews: 780
  },
  {
    id: 'veg-006', name: 'Cucumber', brand: 'Fresho', category: 'vegetables-fruits',
    price: 32, mrp: 40, discount: 20, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/71ob4ifemQL._SL1500_.jpg',
    inStock: true, rating: 4.2, reviews: 560
  },
  {
    id: 'veg-007', name: 'Cauliflower', brand: 'Fresho', category: 'vegetables-fruits',
    price: 42, mrp: 50, discount: 16, unit: '1 pc', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAdvd65y45I_CZd_8SrBnLaDLAWUjJpo_B13lCPysQsQ&s=10',
    inStock: true, rating: 4.1, reviews: 340
  },
  {
    id: 'veg-008', name: 'Cabbage', brand: 'Fresho', category: 'vegetables-fruits',
    price: 28, mrp: 35, discount: 20, unit: '1 pc', deliveryTime: '11 MINS',
    image: 'https://www.freshpoint.com/wp-content/uploads/2020/02/Freshpoint-green-cabbage.jpg',
    inStock: true, rating: 4.0, reviews: 290
  },
  {
    id: 'veg-009', name: 'Brinjal', brand: 'Fresho', category: 'vegetables-fruits',
    price: 35, mrp: 42, discount: 16, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://frugivore-bucket.s3.amazonaws.com/media/package/img_one/2019-12-19/Brinjal_Round_Small.jpg',
    inStock: true, rating: 3.9, reviews: 210
  },
  {
    id: 'veg-010', name: 'Ladies Finger (Bhindi)', brand: 'Fresho', category: 'vegetables-fruits',
    price: 48, mrp: 60, discount: 20, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://kyssafarms.com/cdn/shop/products/lady-finger.jpg?v=1600955405',
    inStock: true, rating: 4.2, reviews: 380
  },
  {
    id: 'fruit-001', name: 'Banana - Robusta', brand: 'Fresho', category: 'vegetables-fruits',
    price: 55, mrp: 65, discount: 15, unit: '6 pcs', deliveryTime: '11 MINS',
    image: 'https://www.bbassets.com/media/uploads/p/l/40084197_1-fresho-banana-robusta-direct-institutional.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 2100
  },
  {
    id: 'fruit-002', name: 'Apple - Shimla', brand: 'Fresho', category: 'vegetables-fruits',
    price: 165, mrp: 195, discount: 15, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://www.shoponezeros.com/cdn/shop/products/apples-shimla-onezeros-in-35305146876102.webp?v=1722448819&width=3840',
    inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 1890
  },
  {
    id: 'fruit-003', name: 'Watermelon', brand: 'Fresho', category: 'vegetables-fruits',
    price: 45, mrp: 55, discount: 18, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://www.bbassets.com/media/uploads/p/l/40075148_7-fresho-watermelon-saraswati-small.jpg',
    inStock: true, rating: 4.3, reviews: 670
  },
  {
    id: 'fruit-004', name: 'Mango - Alphonso', brand: 'Fresho', category: 'vegetables-fruits',
    price: 285, mrp: 350, discount: 18, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://alphonsomango.in/cdn/shop/articles/mango-alphonso-magic-tropical-delight-unveiled-8815689.jpg?v=1781591152&width=450',
    inStock: true, tags: ['Premium'], rating: 4.7, reviews: 1240
  },
  {
    id: 'fruit-005', name: 'Orange', brand: 'Fresho', category: 'vegetables-fruits',
    price: 95, mrp: 115, discount: 17, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://tiimg.tistatic.com/fp/1/006/433/natural-fresh-orange-fruits-494.jpg',
    inStock: true, rating: 4.4, reviews: 890
  },
  {
    id: 'fruit-006', name: 'Grapes - Green', brand: 'Fresho', category: 'vegetables-fruits',
    price: 125, mrp: 145, discount: 13, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://www.dial4trade.com/uploaded_files/product_images/thumbs/green-grapes-u-1354019129787084857.webp',
    inStock: true, rating: 4.5, reviews: 1120
  },
  {
    id: 'fruit-007', name: 'Pomegranate', brand: 'Fresho', category: 'vegetables-fruits',
    price: 185, mrp: 220, discount: 15, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://www.jivabhumi.com/cdn/shop/products/Pomagranate_HD.jpg?v=1669634899&width=800',
    inStock: true, rating: 4.6, reviews: 780
  },
  {
    id: 'fruit-008', name: 'Papaya', brand: 'Fresho', category: 'vegetables-fruits',
    price: 38, mrp: 48, discount: 20, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://www.eastwestseed.com/wp-content/uploads/2024/11/13111-Fortuna-F1.jpg',
    inStock: true, rating: 4.2, reviews: 450
  },
  {
    id: 'fruit-009', name: 'Pineapple', brand: 'Fresho', category: 'vegetables-fruits',
    price: 65, mrp: 80, discount: 18, unit: '1 pc', deliveryTime: '11 MINS',
    image: 'https://www.dole.com/sites/default/files/styles/3072w2304h-webp-80/public/media/2025-01/pineaple.png.webp?itok=_qES0HFO-Aq7JXtLm-gWUAdzB7',
    inStock: true, rating: 4.4, reviews: 620
  },
  {
    id: 'fruit-010', name: 'Sweet Lime (Mosambi)', brand: 'Fresho', category: 'vegetables-fruits',
    price: 85, mrp: 100, discount: 15, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://tiimg.tistatic.com/fp/2/008/634/sweet-lime-226.jpg',
    inStock: true, rating: 4.3, reviews: 340
  },

  // ========== DAIRY & BREAKFAST ==========
  {
    id: 'dairy-001', name: 'Amul Taaza Toned Fresh Milk', brand: 'Amul', category: 'dairy-breakfast',
    price: 27, mrp: 30, discount: 10, unit: '500 ml', deliveryTime: '11 MINS',
    image: 'https://www.bbassets.com/media/uploads/p/l/40090894_7-amul-taaza.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 3450
  },
  {
    id: 'dairy-002', name: 'Amul Gold Full Cream Fresh Milk', brand: 'Amul', category: 'dairy-breakfast',
    price: 32, mrp: 35, discount: 8, unit: '500 ml', deliveryTime: '11 MINS',
    image: 'https://www.bbassets.com/media/uploads/p/l/40090893_8-amul-amul-gold.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.7, reviews: 2890
  },
  {
    id: 'dairy-003', name: 'Mother Dairy Classic Curd', brand: 'Mother Dairy', category: 'dairy-breakfast',
    price: 30, mrp: 35, discount: 14, unit: '400 g', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/41Y6doN+b+L._SY300_SX300_QL70_FMwebp_.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 2340
  },
  {
    id: 'dairy-004', name: 'Amul Butter - Salted', brand: 'Amul', category: 'dairy-breakfast',
    price: 58, mrp: 60, discount: 3, unit: '100 g', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/717GgfVk6YL._SL1500_.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.8, reviews: 4560
  },
  {
    id: 'dairy-005', name: 'Amul Cheese Slices', brand: 'Amul', category: 'dairy-breakfast',
    price: 135, mrp: 145, discount: 6, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcS6DV-4j73k7Hw-KWfWWN-ArSqiOSVUDuI-2qtSqllU6DYZ8lIBZ__Q_xIYiw2biaAc9EvIRZjvQsG3UvCEKdco1GssmMLFAryEQbu4N8xgW9rPyeR6Llzdow',
    inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 1890
  },
  {
    id: 'dairy-006', name: 'Amul Fresh Cream', brand: 'Amul', category: 'dairy-breakfast',
    price: 52, mrp: 55, discount: 5, unit: '250 ml', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQsHLc5tmVNB-f1cEfE7ykVw3JiFJDGrMfFKT3eMB6fOe9X69JNxBLWrFLtfB_Zpa8CX-FziT0YdBFIxcKA_S2Wf4SMVpDt',
    inStock: true, rating: 4.5, reviews: 1230
  },
  {
    id: 'dairy-007', name: 'Britannia Bread - Whole Wheat', brand: 'Britannia', category: 'dairy-breakfast',
    price: 45, mrp: 50, discount: 10, unit: '450 g', deliveryTime: '11 MINS',
    image: 'https://www.bbassets.com/media/uploads/p/l/40162924_7-britannia-100-whole-wheat-bread.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.4, reviews: 2670
  },
  {
    id: 'dairy-008', name: 'Harvest Gold Bread - White', brand: 'Harvest Gold', category: 'dairy-breakfast',
    price: 40, mrp: 45, discount: 11, unit: '400 g', deliveryTime: '11 MINS',
    image: 'https://www.bbassets.com/media/uploads/p/l/40026515_3-harvest-gold-bread-white.jpg',
    inStock: true, rating: 4.3, reviews: 1890
  },
  {
    id: 'dairy-009', name: 'Amul Masti Buttermilk', brand: 'Amul', category: 'dairy-breakfast',
    price: 20, mrp: 22, discount: 9, unit: '200 ml', deliveryTime: '11 MINS',
    image: 'https://tajstores.co.uk/wp-content/uploads/2025/07/DSC_0008-scaled.jpg',
    inStock: true, rating: 4.4, reviews: 980
  },
  {
    id: 'dairy-010', name: 'Nestle Milkmaid', brand: 'Nestle', category: 'dairy-breakfast',
    price: 125, mrp: 135, discount: 7, unit: '380 g', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/71oKHCI7CTL._SX679_.jpg',
    inStock: true, rating: 4.7, reviews: 1450
  },

  // ========== MUNCHIES ==========
  {
    id: 'munch-001', name: "Lays Potato Chips - India's Magic Masala", brand: 'Lays', category: 'munchies',
    price: 20, mrp: 20, discount: 0, unit: '52 g', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/718qfcSpwQL._SX679_.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 5670
  },
  {
    id: 'munch-002', name: 'Kurkure Masala Munch', brand: 'Kurkure', category: 'munchies',
    price: 20, mrp: 20, discount: 0, unit: '78 g', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/71sOPzrW0mL._SL1500_.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.4, reviews: 4230
  },
  {
    id: 'munch-003', name: "Haldiram's Aloo Bhujia", brand: "Haldiram's", category: 'munchies',
    price: 55, mrp: 60, discount: 8, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/71j1PeR4paL._SL1397_.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 3890
  },
  {
    id: 'munch-004', name: 'Bingo! Mad Angles - Achari Masti', brand: 'Bingo', category: 'munchies',
    price: 20, mrp: 20, discount: 0, unit: '72.5 g', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/81hXWabtSEL._SL1500_.jpg',
    inStock: true, rating: 4.3, reviews: 2340
  },
  {
    id: 'munch-005', name: 'Doritos Nacho Cheese', brand: 'Doritos', category: 'munchies',
    price: 30, mrp: 30, discount: 0, unit: '60 g', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRRd8FwrLpcJ94_p1G8TUI5J8S--mvEl58ExDTU5RMshTDmZ5jXQx8U_uw38gBmcvDEMUV58XVciiVncQt3k2ydg09UzTKBGHdhCWcRVM4',
    inStock: true, rating: 4.5, reviews: 1890
  },
  {
    id: 'munch-006', name: 'Pringles Original', brand: 'Pringles', category: 'munchies',
    price: 99, mrp: 110, discount: 10, unit: '107 g', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQjLSArDEfU7CVp9LrdC1Jx4BR0U_DXY8x4vDMBv8LUL6k7waAFJ_ytPTBVhk_MTSix-V21HGLIBE0a47wPPB6R83Obw2UnO7qieWbXL_XZbscJG2_Si6tN_Q',
    inStock: true, rating: 4.6, reviews: 2670
  },
  {
    id: 'munch-007', name: "Haldiram's Moong Dal", brand: "Haldiram's", category: 'munchies',
    price: 50, mrp: 55, discount: 9, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://www.haldirams.com/media/catalog/product/cache/71134970afb779eb7860339989626b7e/m/o/moong_dal_1_1.jpg',
    inStock: true, rating: 4.5, reviews: 1560
  },
  {
    id: 'munch-008', name: 'Bikaji Bhujia Sev', brand: 'Bikaji', category: 'munchies',
    price: 45, mrp: 50, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/71kbgLkWWDL._SY741_.jpg',
    inStock: true, rating: 4.4, reviews: 1230
  },
  {
    id: 'munch-009', name: 'Balaji Wafers - Masala Masti', brand: 'Balaji', category: 'munchies',
    price: 10, mrp: 10, discount: 0, unit: '35 g', deliveryTime: '11 MINS',
    image: 'https://www.bbassets.com/media/uploads/p/l/40053583_4-balaji-magic-masala-chips.jpg',
    inStock: true, rating: 4.2, reviews: 890
  },
  {
    id: 'munch-010', name: 'Uncle Chipps Spicy Treat', brand: 'Uncle Chipps', category: 'munchies',
    price: 20, mrp: 20, discount: 0, unit: '55 g', deliveryTime: '11 MINS',
    image: 'https://www.bbassets.com/media/uploads/p/l/40015993_11-uncle-chips-spicy-treat.jpg',
    inStock: true, rating: 4.3, reviews: 1120
  },

  // ========== COLD DRINKS & JUICES ==========
  {
    id: 'drink-001', name: 'Coca-Cola Soft Drink', brand: 'Coca-Cola', category: 'cold-drinks',
    price: 40, mrp: 45, discount: 11, unit: '750 ml', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTib0fQ31yzglF2Igh51qPqrstRCLMFQwRVXysw1q3UI6vPyVcJMfIoYaChGwxnC75Z6bS6yUZ2NTkhT_5eMLjaWwsK7W_EesOWlvkXr2bN2dvA9dka1gpJfQ',
    inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 3450
  },
  {
    id: 'drink-002', name: 'Sprite Lime Flavoured Soft Drink', brand: 'Sprite', category: 'cold-drinks',
    price: 40, mrp: 45, discount: 11, unit: '750 ml', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=540/da/cms-assets/cms/product/70d53a08-e366-445e-a02c-84609edb4b7d.png',
    inStock: true, tags: ['Bestseller'], rating: 4.4, reviews: 2890
  },
  {
    id: 'drink-003', name: 'Tropicana Mixed Fruit Juice', brand: 'Tropicana', category: 'cold-drinks',
    price: 110, mrp: 120, discount: 8, unit: '1 l', deliveryTime: '11 MINS',
    image: 'https://www.bbassets.com/media/uploads/p/l/40199584_3-tropicana-mixed-fruit-delight.jpg',
    inStock: true, rating: 4.6, reviews: 1890
  },
  {
    id: 'drink-004', name: 'Real Fruit Power - Mixed Fruit', brand: 'Real', category: 'cold-drinks',
    price: 95, mrp: 105, discount: 9, unit: '1 l', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/71ccvWtmXXL._SL1500_.jpg',
    inStock: true, rating: 4.5, reviews: 1560
  },
  {
    id: 'drink-005', name: 'Pepsi Black', brand: 'Pepsi', category: 'cold-drinks',
    price: 40, mrp: 45, discount: 11, unit: '750 ml', deliveryTime: '11 MINS',
    image: 'https://www.bbassets.com/media/uploads/p/l/40329604_3-pepsi-zero-sugar-soft-drink.jpg',
    inStock: true, rating: 4.3, reviews: 1230
  },

  // ========== INSTANT & FROZEN FOOD ==========
  {
    id: 'instant-001', name: 'Maggi 2-Minute Masala Noodles', brand: 'Maggi', category: 'instant-frozen',
    price: 14, mrp: 15, discount: 6, unit: '70 g', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/81kD9TwLGaS._SL1500_.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.7, reviews: 8900
  },
  {
    id: 'instant-002', name: 'Yippee! Magic Masala Noodles', brand: 'Yippee', category: 'instant-frozen',
    price: 12, mrp: 14, discount: 14, unit: '70 g', deliveryTime: '11 MINS',
    image: 'https://www.bbassets.com/media/uploads/p/l/40202195_1-sunfeast-yippee-noodles-magic-masala.jpg',
    inStock: true, rating: 4.4, reviews: 3450
  },
  {
    id: 'instant-003', name: 'McCain French Fries', brand: 'McCain', category: 'instant-frozen',
    price: 135, mrp: 150, discount: 10, unit: '420 g', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/81HB2Q0Jc0L._SL1500_.jpg',
    inStock: true, rating: 4.5, reviews: 2340
  },

  // ========== TEA, COFFEE & HEALTH ==========
  {
    id: 'tea-001', name: 'Tata Tea Gold', brand: 'Tata Tea', category: 'tea-coffee',
    price: 235, mrp: 250, discount: 6, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/61NQbV3f4vL._SL1000_.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 4560
  },
  {
    id: 'tea-002', name: 'Nescafe Classic Coffee', brand: 'Nescafe', category: 'tea-coffee',
    price: 320, mrp: 350, discount: 8, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQuw4KJh5EHOrt86Qvx30UOlIeBfK7WwXL9oW2lnUnkE0Owom-IPNlYOe0LAukG5gK7AZthMV6jfT6msf7LoyuK0JEb69TXZFBYMZtZuofKhErQ-nsJ_kDPAiY',
    inStock: true, tags: ['Bestseller'], rating: 4.7, reviews: 3890
  },
  {
    id: 'tea-003', name: 'Red Label Natural Care Tea', brand: 'Red Label', category: 'tea-coffee',
    price: 265, mrp: 285, discount: 7, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/619-JepwmIL._SL1000_.jpg',
    inStock: true, rating: 4.5, reviews: 2670
  },

  // ========== BAKERY & BISCUITS ==========
  {
    id: 'bakery-001', name: 'Parle-G Gold Biscuits', brand: 'Parle', category: 'bakery-biscuits',
    price: 10, mrp: 10, discount: 0, unit: '100 g', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/61kZskdmJzL._SL1000_.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 12340
  },
  {
    id: 'bakery-002', name: 'Britannia Good Day Butter Cookies', brand: 'Britannia', category: 'bakery-biscuits',
    price: 35, mrp: 40, discount: 12, unit: '150 g', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/61FsBt3SB4L._SL1500_.jpg',
    inStock: true, rating: 4.5, reviews: 5670
  },
  {
    id: 'bakery-003', name: 'Sunfeast Dark Fantasy Choco Fills', brand: 'Sunfeast', category: 'bakery-biscuits',
    price: 40, mrp: 45, discount: 11, unit: '150 g', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/7152Ne7KQML._SL1500_.jpg',
    inStock: true, rating: 4.7, reviews: 4230
  },

  // ========== SWEET TOOTH ==========
  {
    id: 'sweet-001', name: 'Cadbury Dairy Milk Chocolate', brand: 'Cadbury', category: 'sweet-tooth',
    price: 45, mrp: 50, discount: 10, unit: '55 g', deliveryTime: '11 MINS',
    image: 'https://rukminim1.flixcart.com/image/1536/1536/xif0q/rakhi-set/g/r/0/1-cwrs010021-caratwala-original-imags7ghhvscyenp.jpeg?q=90',
    inStock: true, tags: ['Bestseller'], rating: 4.8, reviews: 8900
  },
  {
    id: 'sweet-002', name: 'KitKat Chocolate', brand: 'KitKat', category: 'sweet-tooth',
    price: 20, mrp: 20, discount: 0, unit: '27 g', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQGvm8rjcAmw7_V-jS_RPBSSvkg-KLeTUr4TqjUZs-XPvp3pFYwldy04dBzCYIh3vGCQ0c12ytmnoj_zxmqSe46QvVMQ9o7GWd1N3RS94yZWPEtHfere6laTQ',
    inStock: true, rating: 4.6, reviews: 5670
  },
  {
    id: 'sweet-003', name: '5 Star Chocolate', brand: '5 Star', category: 'sweet-tooth',
    price: 10, mrp: 10, discount: 0, unit: '22 g', deliveryTime: '11 MINS',
    image: 'https://rukminim2.flixcart.com/image/1536/1536/xif0q/chocolate/e/p/y/-original-imahzn5pyjjedtpy.jpeg?q=90',
    inStock: true, rating: 4.5, reviews: 3450
  },

  // ========== ATTA, RICE & DAL ==========
  {
    id: 'atta-001', name: 'Aashirvaad Whole Wheat Atta', brand: 'Aashirvaad', category: 'atta-rice-dal',
    price: 285, mrp: 310, discount: 8, unit: '5 kg', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSHrbIi4MG08IKpFCL-U-cqdwZdtDuutpEH030v0BmViJfSA-SKKrx3IbslJJ0rPzSGyNFCPvW-9zuZFxAsecdNKBGCwJhk',
    inStock: true, tags: ['Bestseller'], rating: 4.7, reviews: 6780
  },
  {
    id: 'atta-002', name: 'India Gate Basmati Rice', brand: 'India Gate', category: 'atta-rice-dal',
    price: 525, mrp: 575, discount: 8, unit: '5 kg', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/41jhOEK5MWL._SX342_SY445_FMwebp_.jpg',
    inStock: true, rating: 4.6, reviews: 4560
  },
  {
    id: 'atta-003', name: 'Tata Sampann Toor Dal', brand: 'Tata Sampann', category: 'atta-rice-dal',
    price: 145, mrp: 160, discount: 9, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/61HA0lc+dHL._SL1000_.jpg',
    inStock: true, rating: 4.5, reviews: 2340
  },

  // ========== MASALA, OIL & MORE ==========
  {
    id: 'masala-001', name: 'Fortune Sunflower Refined Oil', brand: 'Fortune', category: 'masala-oil',
    price: 185, mrp: 200, discount: 7, unit: '1 l', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcS5zvO9nxNwh5LzZ-M_QqBHH2Yg_KEI5hxSTTLBXlmViR5y8LnmMuJOnP5Y0x5CqESjRdt9VGWhqihi3T5ACVR1_iXVsNkl',
    inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 3890
  },
  {
    id: 'masala-002', name: 'MDH Chana Masala', brand: 'MDH', category: 'masala-oil',
    price: 95, mrp: 105, discount: 9, unit: '100 g', deliveryTime: '11 MINS',
    image: 'https://www.bbassets.com/media/uploads/p/l/100004426-2_1-mdh-masala-chana.jpg',
    inStock: true, rating: 4.6, reviews: 2670
  },
  {
    id: 'masala-003', name: 'Everest Garam Masala', brand: 'Everest', category: 'masala-oil',
    price: 85, mrp: 95, discount: 10, unit: '100 g', deliveryTime: '11 MINS',
    image: 'https://rukminim1.flixcart.com/image/1536/1536/jyafukw0/spice-masala/f/b/p/100-garam-masala-100-gram-box-everest-powder-original-imafgdfbzyupkdzn.jpeg?q=90',
    inStock: true, rating: 4.5, reviews: 1890
  },

  // ========== SAUCES & SPREADS ==========
  {
    id: 'sauce-001', name: 'Kissan Fresh Tomato Ketchup', brand: 'Kissan', category: 'sauces-spreads',
    price: 95, mrp: 105, discount: 9, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/61+GTUzi7JL._SL1000_.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 4560
  },
  {
    id: 'sauce-002', name: 'Maggi Hot & Sweet Tomato Chilli Sauce', brand: 'Maggi', category: 'sauces-spreads',
    price: 85, mrp: 95, discount: 10, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/71EPAd9EJ1L._SX679_.jpg',
    inStock: true, rating: 4.5, reviews: 2340
  },
  {
    id: 'sauce-003', name: 'Nutella Hazelnut Spread', brand: 'Nutella', category: 'sauces-spreads',
    price: 385, mrp: 420, discount: 8, unit: '350 g', deliveryTime: '11 MINS',
    image: 'https://www.styledotty.com/images/detailed/38/2255393912.webp',
    inStock: true, rating: 4.7, reviews: 3450
  },

  // ========== ORGANIC & HEALTHY ==========
  {
    id: 'organic-001', name: 'Organic India Tulsi Green Tea', brand: 'Organic India', category: 'organic-healthy',
    price: 185, mrp: 210, discount: 11, unit: '25 tea bags', deliveryTime: '11 MINS',
    image: 'https://organicindia.com/cdn/shop/files/TulsiOriginal_19b7d37f-377c-4a5c-b1e4-8449cdcd5a60.png?v=1767461001&width=1206',
    inStock: true, rating: 4.6, reviews: 1890
  },
  {
    id: 'organic-002', name: 'Soulfull Ragi Bites', brand: 'Soulfull', category: 'organic-healthy',
    price: 125, mrp: 140, discount: 10, unit: '250 g', deliveryTime: '11 MINS',
    image: 'https://www.tatanutrikorner.com/cdn/shop/files/RagiBitesEnhanced_ChocoFills500g_FOPcopy_bf3037c0-4c65-4071-afc7-0de4b318135a.jpg?v=1731513329&width=990',
    inStock: true, rating: 4.5, reviews: 1230
  },
  {
    id: 'gym-001', name: 'Yoga Bar 26g Protein Milk Shake - Chocolate', brand: 'Yogabar', category: 'organic-healthy',
    price: 98, mrp: 131, discount: 25, unit: '250 ml', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSqZEIW4lsAadP_AemecJ4X8jJsma_3aC5ReGRLoOtI9fK4IIeyQ6-Ue1hAJyE-VFwF6trZXNr0WG-Y0WidClZUu6n-gvgQ',
    inStock: true, tags: ['Premium'], rating: 4.6, reviews: 320
  },
  {
    id: 'gym-002', name: 'Yogabar 10g Protein Bars - Blueberry Blast', brand: 'Yogabar', category: 'organic-healthy',
    price: 44, mrp: 65, discount: 32, unit: '50 g', deliveryTime: '11 MINS',
    image: 'https://www.bbassets.com/media/uploads/p/l/40329061_2-yoga-bar-10-g-protein-bar-blueberry-blast-gluten-free-raw-cold-pressed-date-unsweetened-premium-whey.jpg',
    inStock: true, rating: 4.4, reviews: 150
  },
  {
    id: 'gym-003', name: 'Yogabar Multigrain Energy Bars - Chocolate Chunk', brand: 'Yogabar', category: 'organic-healthy',
    price: 30, mrp: 45, discount: 33, unit: '35 g', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/71DFBj7n6zL._SL1500_.jpg',
    inStock: true, rating: 4.3, reviews: 110
  },
  {
    id: 'gym-004', name: 'RiteBite Max Protein Barbeque - Multigrain', brand: 'RiteBite', category: 'organic-healthy',
    price: 42, mrp: 45, discount: 6, unit: '60 g', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/71ZYysMVsWL._SL1500_.jpg',
    inStock: true, rating: 4.1, reviews: 90
  },
  {
    id: 'gym-005', name: 'GNC Pro Performance Complete Whey Protein Powder', brand: 'GNC', category: 'organic-healthy',
    price: 4527, mrp: 5689, discount: 20, unit: '1.81 kg', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/71ZYysMVsWL._SL1500_.jpg',
    inStock: true, tags: ['Premium', 'Bestseller'], rating: 4.7, reviews: 880
  },
  {
    id: 'gym-006', name: 'Oziva Bioactive Plant Protein - Vanilla', brand: 'Oziva', category: 'organic-healthy',
    price: 1559, mrp: 2799, discount: 44, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://rukminim1.flixcart.com/image/1536/1536/xif0q/protein-supplement/r/k/l/-original-imah3acfyzzua4pv.jpeg?q=90',
    inStock: true, rating: 4.5, reviews: 460
  },
  {
    id: 'gym-007', name: 'Yoga Bar Power Up 20g - Coffee Crush', brand: 'Yogabar', category: 'organic-healthy',
    price: 94, mrp: 125, discount: 24, unit: '70 g', deliveryTime: '11 MINS',
    image: 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-3000-3000,pr-true,f-auto,q-40,dpr-2/cms/product_variant/b623f44e-8047-4e12-bf86-51ce852a8ff3/Yoga-Bar-Power-Up-20g-Protein-Bar-Coffee-Crush-No-Added-Sugar-Whey-Protein-Concentrate-Isolate.jpg',
    inStock: true, rating: 4.4, reviews: 180
  },
  {
    id: 'gym-008', name: 'Yoga Bar Protein Minis - Choco Peanut Butter', brand: 'Yogabar', category: 'organic-healthy',
    price: 121, mrp: 175, discount: 30, unit: '7 x 20 g', deliveryTime: '11 MINS',
    image: 'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-3000-3000,pr-true,f-auto,q-40,dpr-2/cms/product_variant/f1a9dbd5-48c7-4461-bab8-9a89f7839fdd/Yoga-Bar-Protein-Minis-Choco-Peanut-Butter-7-Pieces-4g-Protein-High-Fibre.jpeg',
    inStock: true, rating: 4.5, reviews: 220
  },

  // ========== BABY CARE ==========
  {
    id: 'baby-001', name: 'Pampers Baby Dry Pants', brand: 'Pampers', category: 'baby-care',
    price: 999, mrp: 1099, discount: 9, unit: '56 pants', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/71k315tD9fL._SX679_.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.7, reviews: 5670
  },
  {
    id: 'baby-002', name: 'Cerelac Wheat Apple', brand: 'Cerelac', category: 'baby-care',
    price: 235, mrp: 260, discount: 9, unit: '300 g', deliveryTime: '11 MINS',
    image: 'https://www.bbassets.com/media/uploads/p/l/40128261_13-nestle-cerelac-baby-cereal-with-milk-wheat-apple-carrot-from-6-12-months-rich-in-iron.jpg',
    inStock: true, rating: 4.6, reviews: 2340
  },

  // ========== PHARMA & WELLNESS ==========
  {
    id: 'pharma-001', name: 'Dettol Antiseptic Liquid', brand: 'Dettol', category: 'pharma-wellness',
    price: 125, mrp: 140, discount: 10, unit: '250 ml', deliveryTime: '11 MINS',
    image: 'https://static1.industrybuying.com/products/cleaning/cleaning-liquid-essentials/floor-cleaner/CLE.FLO.129001353_1739271627840.webp',
    inStock: true, rating: 4.6, reviews: 3450
  },
  {
    id: 'pharma-002', name: 'Vicks Vaporub', brand: 'Vicks', category: 'pharma-wellness',
    price: 95, mrp: 105, discount: 9, unit: '50 ml', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/418D-H9rwzL._SY300_SX300_QL70_FMwebp_.jpg',
    inStock: true, rating: 4.5, reviews: 2670
  },

  // ========== CLEANING ESSENTIALS ==========
  {
    id: 'clean-001', name: 'Vim Dishwash Gel', brand: 'Vim', category: 'cleaning',
    price: 125, mrp: 140, discount: 10, unit: '750 ml', deliveryTime: '11 MINS',
    image: 'https://rukminim1.flixcart.com/image/1536/1536/ky4qgsw0/dish-washing-bar/g/z/y/dish-cleaning-gel-with-power-of-lemons-750-ml-1-750-vim-original-imagafmbyff9448w.jpeg?q=90',
    inStock: true, rating: 4.5, reviews: 2340
  },
  {
    id: 'clean-002', name: 'Harpic Toilet Cleaner', brand: 'Harpic', category: 'cleaning',
    price: 185, mrp: 210, discount: 11, unit: '1 l', deliveryTime: '11 MINS',
    image: 'https://rukminim3.flixcart.com/image/1114/972/xif0q/toilet-cleaner/q/g/j/-original-imahgafbwru2zg5z.jpeg?q=60&crop=false',
    inStock: true, rating: 4.6, reviews: 1890
  },

  // ========== HOME & OFFICE ==========
  {
    id: 'home-001', name: 'Scotch Brite Scrub Pad', brand: 'Scotch Brite', category: 'home-office',
    price: 35, mrp: 40, discount: 12, unit: '3 pcs', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/91U+RHGI9+S._SX679_.jpg',
    inStock: true, rating: 4.5, reviews: 1560
  },

  // ========== PERSONAL CARE ==========
  {
    id: 'personal-001', name: 'Colgate Total Toothpaste', brand: 'Colgate', category: 'personal-care',
    price: 95, mrp: 110, discount: 13, unit: '140 g', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/51bl+0mzMvL._SX679_.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 4560
  },
  {
    id: 'personal-002', name: 'Dove Soap', brand: 'Dove', category: 'personal-care',
    price: 65, mrp: 75, discount: 13, unit: '100 g', deliveryTime: '11 MINS',
    image: 'https://velocitymarketplace.in/wp-content/uploads/2024/08/dove-posted.png',
    inStock: true, rating: 4.7, reviews: 3890
  },

  // ========== PET CARE ==========
  {
    id: 'pet-001', name: 'Pedigree Adult Dog Food', brand: 'Pedigree', category: 'pet-care',
    price: 385, mrp: 425, discount: 9, unit: '1.2 kg', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/71Uo37EfcxL._SX522_.jpg',
    inStock: true, rating: 4.5, reviews: 1890
  },
  {
    id: 'pet-002', name: 'Whiskas Cat Food', brand: 'Whiskas', category: 'pet-care',
    price: 185, mrp: 210, discount: 11, unit: '480 g', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/416wh4quUlL._SY300_SX300_QL70_FMwebp_.jpg',
    inStock: true, rating: 4.4, reviews: 1230
  },

  // ========== DISH INGREDIENTS ==========
  {
    id: 'dish-paneer', name: 'Milky Mist Paneer', brand: 'Milky Mist', category: 'dairy-breakfast',
    price: 82, mrp: 130, discount: 37, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/NI_CATALOG/IMAGES/CIW/2024/11/15/21652c20-7ab6-434f-8f41-30e8e1a8d839_688_1.png',
    inStock: true, tags: ['Bestseller', 'Protein Rich'], rating: 4.6, reviews: 860
  },
  {
    id: 'dish-marinade', name: 'Everest Tikhalal Powder Pouch', brand: 'Everest', category: 'masala-oil',
    price: 52, mrp: 60, discount: 13, unit: '100 g', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/71UnlVpvTgL._SL1500_.jpg',
    inStock: true, rating: 4.5, reviews: 180
  },
  {
    id: 'dish-yogurt', name: 'Milky Mist Greek Yogurt', brand: 'Milky Mist', category: 'dairy-breakfast',
    price: 35, mrp: 55, discount: 36, unit: '1 pc (100 g)', deliveryTime: '11 MINS',
    image: 'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/NI_CATALOG/IMAGES/ciw/2025/12/17/0d351d02-7e7a-40c0-b600-6f9048b54094_7BXZQMWFVT_MN_16122025.png',
    inStock: true, rating: 4.6, reviews: 260
  },
  {
    id: 'dish-ggpaste', name: 'Catch Ginger Garlic Paste', brand: 'Catch', category: 'masala-oil',
    price: 17, mrp: 28, discount: 39, unit: '1 pack (100 g)', deliveryTime: '11 MINS',
    image: 'https://www.mystore.in/s/62ea2c599d1398fa16dbae0a/g/83763f83160640789d2abb347c9a6210/ginger-garlic-paste-fop-af4e5ec5-98cf-4b7e-89f4-ddac6bcca977-800x800.png',
    inStock: true, rating: 4.6, reviews: 225
  }
];

export function getProductsByCategory(categoryId) {
  if (categoryId === 'all') return products;
  return products.filter(p => p.category === categoryId);
}

export function searchProducts(query) {
  const lowerQuery = query.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.brand.toLowerCase().includes(lowerQuery)
  );
}

export function getProductById(id) {
  return products.find(p => p.id === id);
}

export function getCategoryById(id) {
  return categories.find(c => c.id === id);
}

export function getFeaturedProducts() {
  return products.filter(p => p.tags && p.tags.includes('Bestseller')).slice(0, 20);
}

export function getProductsByTag(tag) {
  return products.filter(p => p.tags && p.tags.includes(tag));
}
