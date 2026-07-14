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
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ0uwjB22P65gWpKVrJLeL89SeN-GSfbk8FVb9oPteFg&s',
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
    image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSNvD6tlj9od2Jfsrx9RAIcwuIyjAUHEExkcIkNmitBB_z59apx78vaPCtgLsawXS3gR_iLYD_QYp9NlOXO9fs5T4pr03IG',
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
    id: 'dish-ginger-garlic', name: 'Ginger Garlic Paste', brand: 'Everest', category: 'masala-oil',
    price: 45, mrp: 58, discount: 22, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://www.mystore.in/s/62ea2c599d1398fa16dbae0a/g/83763f83160640789d2abb347c9a6210/ginger-garlic-paste-fop-af4e5ec5-98cf-4b7e-89f4-ddac6bcca977-800x800.png',
    inStock: true, rating: 4.6, reviews: 225
  },

  // ═══════════════════ EXPANSION: 75 NEW SKUS ═══════════════════

  // ── Vegetables & Fruits (9 new) ──
  { id: 'veg-011', name: 'Spinach', brand: 'Fresho', category: 'vegetables-fruits', price: 25, mrp: 32, discount: 22, unit: '200 g', deliveryTime: '11 MINS', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=150&h=150&fit=crop', inStock: true, tags: ['Bestseller'], rating: 4.3, reviews: 620 },
  { id: 'veg-012', name: 'Garlic', brand: 'Fresho', category: 'vegetables-fruits', price: 30, mrp: 38, discount: 21, unit: '100 g', deliveryTime: '11 MINS', image: 'https://m.media-amazon.com/images/I/71vpJSiNYeL.jpg', inStock: true, rating: 4.4, reviews: 880 },
  { id: 'veg-013', name: 'Ginger', brand: 'Fresho', category: 'vegetables-fruits', price: 28, mrp: 35, discount: 20, unit: '100 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoULYd8tLrXG5jtpwewia6WvKqE2Io_mlmLIq0abcRng&s=10', inStock: true, rating: 4.2, reviews: 490 },
  { id: 'veg-014', name: 'Green Chilli', brand: 'Fresho', category: 'vegetables-fruits', price: 18, mrp: 24, discount: 25, unit: '100 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTr_HXQc_sJUaln_u6qrReV705KtCbWUvRn_WybH1abw&s=10', inStock: true, rating: 4.0, reviews: 310 },
  { id: 'veg-015', name: 'Banana - Robusta', brand: 'Fresho', category: 'vegetables-fruits', price: 42, mrp: 50, discount: 16, unit: '6 pcs', deliveryTime: '11 MINS', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=150&h=150&fit=crop', inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 1420 },
  { id: 'veg-016', name: 'Apple - Royal Gala', brand: 'Fresho', category: 'vegetables-fruits', price: 120, mrp: 150, discount: 20, unit: '4 pcs (apx 700 g)', deliveryTime: '11 MINS', image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=150&h=150&fit=crop', inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 2100 },
  { id: 'veg-017', name: 'Mango - Alphonso', brand: 'Fresho', category: 'vegetables-fruits', price: 160, mrp: 200, discount: 20, unit: '3 pcs (apx 600 g)', deliveryTime: '11 MINS', image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=150&h=150&fit=crop', inStock: true, tags: ['Bestseller'], rating: 4.8, reviews: 3200 },
  { id: 'veg-018', name: 'Sweet Corn', brand: 'Fresho', category: 'vegetables-fruits', price: 35, mrp: 45, discount: 22, unit: '2 pcs', deliveryTime: '11 MINS', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=150&h=150&fit=crop', inStock: true, rating: 4.3, reviews: 520 },
  { id: 'veg-029', name: 'Bottle Gourd (Lauki)', brand: 'Fresho', category: 'vegetables-fruits', price: 30, mrp: 38, discount: 21, unit: '1 pc (apx 500 g)', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkuMilB-za1FPp0b_kvZIco0l7Y-jxN0NxC-LRz9cdcYHzJw2MkG7W7Ko&s=10', inStock: true, rating: 4.0, reviews: 240 },

  // ── Dairy & Breakfast (7 new) ──
  { id: 'dairy-011', name: 'Amul Mozzarella Cheese Block', brand: 'Amul', category: 'dairy-breakfast', price: 110, mrp: 130, discount: 15, unit: '200 g', deliveryTime: '11 MINS', image: 'https://www.bbassets.com/media/uploads/p/l/100019887_3-amul-pizza-cheese-mozzarella.jpg', inStock: true, tags: ['Bestseller'], rating: 4.7, reviews: 1850 },
  { id: 'dairy-012', name: 'Mother Dairy Mishti Doi', brand: 'Mother Dairy', category: 'dairy-breakfast', price: 40, mrp: 50, discount: 20, unit: '400 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm3Nn7jUvezDRhmBzqoC23bUHn7VSVyfR7pp38H8vZWQ&s', inStock: true, rating: 4.5, reviews: 920 },
  { id: 'dairy-013', name: 'Epigamia Greek Yogurt - Mango', brand: 'Epigamia', category: 'dairy-breakfast', price: 60, mrp: 75, discount: 20, unit: '90 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEYA3Q8O8_DOyhnC9cSI0NcUdf2ypBzRZrUN-VCBE-kA&s=10p', inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 1340 },
  { id: 'dairy-014', name: 'Amul Cream - Fresh', brand: 'Amul', category: 'dairy-breakfast', price: 30, mrp: 38, discount: 21, unit: '100 ml', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgMTl70xTp2l4H9d0DaECIgoqAl76-9Sv3B7Kw0IYBCA&s=10', inStock: true, rating: 4.4, reviews: 660 },
  { id: 'dairy-015', name: 'Saffola Oats - Classic', brand: 'Saffola', category: 'dairy-breakfast', price: 130, mrp: 165, discount: 21, unit: '500 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRS5B-FYjXYuCpr2lXoWikB3f_hgoX6PvN-6goJu6ZWw6v2y3JpzB23XcJvVkI3YPAgXBl4omxMVd5TsPViAj1eU2oIuGOnibAH-vUbV7625XFXxQPxKb3fqSLhXl_FYSwTpa3s8y7Hs4o&usqp=CAc', inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 2200 },
  { id: 'dairy-016', name: 'Kellogg Corn Flakes - Original', brand: 'Kellogg', category: 'dairy-breakfast', price: 125, mrp: 155, discount: 19, unit: '500 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQaGvZ0nfvwbSvyoa-Ibwpa0N2QzA1nPyS8JqfDBV5Rh0hgAmJsbrd4dikRXZ78ilFeGwXUSuH-pXwjNrbx6y_1drncZ7Rs', inStock: true, tags: ['Bestseller'], rating: 4.4, reviews: 1800 },
  { id: 'dairy-017', name: 'Amul Lassi - Rose', brand: 'Amul', category: 'dairy-breakfast', price: 30, mrp: 38, discount: 21, unit: '200 ml', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGfuG4tYYn1ODd9U3jkis3jkAXIy3AJ-mHTN4Obncr8A&s=10', inStock: true, rating: 4.3, reviews: 780 },

  // ── Munchies (8 new) ──
  { id: 'munch-001', name: "Lay's Classic Salted Chips", brand: "Lay's", category: 'munchies', price: 20, mrp: 20, discount: 0, unit: '52 g', deliveryTime: '11 MINS', image: 'https://m.media-amazon.com/images/I/71axGdrNHoL._AC_UF894,1000_QL80_.jpg', inStock: true, tags: ['Bestseller'], rating: 4.3, reviews: 3100 },
  { id: 'munch-003', name: 'Kurkure Masala Munch', brand: 'Kurkure', category: 'munchies', price: 10, mrp: 10, discount: 0, unit: '22 g', deliveryTime: '11 MINS', image: 'https://m.media-amazon.com/images/I/71LyKlizpuL._AC_UF894,1000_QL80_.jpg', inStock: true, tags: ['Bestseller'], rating: 4.2, reviews: 4100 },
  { id: 'munch-004', name: 'Bingo! Mad Angles', brand: 'Bingo', category: 'munchies', price: 20, mrp: 20, discount: 0, unit: '55 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpPNQiIWynamBqxS6WutTYiP-SXwJeDrJ-yvHeEi0dCQ&s=10', inStock: true, rating: 4.1, reviews: 1640 },
  { id: 'munch-006', name: 'Parle G Biscuits', brand: 'Parle', category: 'munchies', price: 10, mrp: 10, discount: 0, unit: '200 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-y8mvkxDAFuGVNBrAx03J_FIImpY0yO7p01NXe-7V7Q&s=10', inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 5600 },
  { id: 'munch-007', name: 'Too Yumm! Multigrain Chips', brand: 'Too Yumm', category: 'munchies', price: 25, mrp: 30, discount: 17, unit: '65 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmrvjdNPPU-WpYSpYohydfOLTERTCldWyinDy1GE6KJg&s=10', inStock: true, rating: 4.0, reviews: 820 },
  { id: 'munch-008', name: 'Pringles Original', brand: 'Pringles', category: 'munchies', price: 115, mrp: 150, discount: 23, unit: '134 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzGczMEwP6anVJzG9hDGfUxuJ4oi75BwuA_CVpOED8Ww&s=10', inStock: true, rating: 4.6, reviews: 2800 },

  // ── Cold Drinks & Juices (6 new) ──
  { id: 'drinks-001', name: 'Coca Cola - Can', brand: 'Coca Cola', category: 'cold-drinks', price: 45, mrp: 50, discount: 10, unit: '330 ml', deliveryTime: '11 MINS', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=150&h=150&fit=crop', inStock: true, tags: ['Bestseller'], rating: 4.3, reviews: 4100 },
  { id: 'drinks-002', name: 'Tropicana Orange Juice', brand: 'Tropicana', category: 'cold-drinks', price: 90, mrp: 110, discount: 18, unit: '1 L', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVYprOE9NSRseRU9SROKgNBQDMETQkWRIoBVrjRjqG9Q&s', inStock: true, tags: ['Bestseller'], rating: 4.4, reviews: 2600 },
  { id: 'drinks-003', name: 'Paper Boat Aamras', brand: 'Paper Boat', category: 'cold-drinks', price: 35, mrp: 45, discount: 22, unit: '250 ml', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrZ6w3C5YSw93QUxfzXnmaPQGLfQLBu6FDtZI-Oi8oJA&s=10', inStock: true, rating: 4.5, reviews: 1780 },
  { id: 'drinks-004', name: 'Red Bull Energy Drink', brand: 'Red Bull', category: 'cold-drinks', price: 125, mrp: 150, discount: 17, unit: '250 ml', deliveryTime: '11 MINS', image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSME0I7AuVN7WJZPiHXUXkUVZYq2c1P4w0hnoXqxmXzBJQzknkDapGsB7fw3Id9t1uc6YYPIs111EnpyIncqoWOIxQnoc157BIXkUEyrXT4', inStock: true, rating: 4.4, reviews: 2100 },
  { id: 'drinks-005', name: 'Sprite - Bottle', brand: 'Sprite', category: 'cold-drinks', price: 40, mrp: 45, discount: 11, unit: '750 ml', deliveryTime: '11 MINS', image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSkRLd4TTIbvfegN-1KWbnBLWSHzrByzUKxYUWUsHCFsRiEQkOjzxGMQMaWlOonMP4J0WdWPkaL-WimX7PiAmB5lTqMpFbwkSi_DgtrOe9Ly5M0F6WUxsfRPpY', inStock: true, tags: ['Bestseller'], rating: 4.2, reviews: 3400 },
  { id: 'drinks-006', name: 'Real Mixed Fruit Juice', brand: 'Real', category: 'cold-drinks', price: 75, mrp: 90, discount: 17, unit: '1 L', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgZK-FZp16Jje34qZUB5wmmpkZPbeDSF9kKU3qepaxlA&s=10', inStock: true, rating: 4.3, reviews: 1560 },

  // ── Instant & Frozen (6 new) ──
  { id: 'instant-003', name: 'McCain Smiles Potato Snacks', brand: 'McCain', category: 'instant-frozen', price: 130, mrp: 165, discount: 21, unit: '415 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyHRhvgLHcpQdd5u-hgVFP9s79dTIfre0w6-2dHR1qzg&s=10', inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 2800 },
  { id: 'instant-004', name: 'Haldiram Instant Poha', brand: 'Haldiram', category: 'instant-frozen', price: 45, mrp: 55, discount: 18, unit: '240 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJsz4-CPq3swtGBgNOFdBGaOmtxUrH3PLTi3huv78phA&s=10', inStock: true, rating: 4.2, reviews: 1100 },
  { id: 'instant-005', name: 'Ching Schezwan Chutney', brand: "Ching's", category: 'instant-frozen', price: 55, mrp: 70, discount: 21, unit: '250 g', deliveryTime: '11 MINS', image: 'data:image/jpeg;base64,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', inStock: true, rating: 4.4, reviews: 1980 },
  { id: 'instant-006', name: 'MTR Instant Poha Mix', brand: 'MTR', category: 'instant-frozen', price: 55, mrp: 70, discount: 21, unit: '500 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQ3nPvdCKtoIK4MZiWjL4XRcbvuVfJbshAlxwqzNzX4x0MARCdE6c5xc_crjV_y_mRciwePrXEDRF-kdoAvbQA3cC7VC1sU', inStock: true, rating: 4.3, reviews: 900 },

  // ── Tea & Coffee (5 new) ──
  { id: 'tea-001', name: 'Tata Tea Gold', brand: 'Tata Tea', category: 'tea-coffee', price: 130, mrp: 165, discount: 21, unit: '250 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg6JdzDIKVqHi3u59_AyEglK2reGE518lu0H90M_4Zlg&s=10', inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 4800 },
  { id: 'tea-002', name: 'Nescafe Classic Instant Coffee', brand: 'Nescafe', category: 'tea-coffee', price: 95, mrp: 120, discount: 21, unit: '50 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSRucBGs3GIwJ6UXJvwY7trXwc_irMUkoWn_pXpw0iNTxaQ6oIroGrdbWSFNYtiLEnW0IKGrMVVIcgJy6yN3BvRWC-q8XpfXA', inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 3600 },
  { id: 'tea-003', name: 'Bru Roasted & Ground Coffee', brand: 'Bru', category: 'tea-coffee', price: 75, mrp: 95, discount: 21, unit: '100 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBjcYxgTsjJLta2Ztw__inoPGFbpqC-WNLB6hRYP5uMA&s', inStock: true, rating: 4.4, reviews: 2100 },
  { id: 'tea-004', name: "Lipton Green Tea - Honey Lemon", brand: 'Lipton', category: 'tea-coffee', price: 175, mrp: 220, discount: 20, unit: '25 bags', deliveryTime: '11 MINS', image: 'data:image/jpeg;base64,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', inStock: true, rating: 4.3, reviews: 1560 },
  { id: 'tea-005', name: 'Blue Tokai Filter Coffee', brand: 'Blue Tokai', category: 'tea-coffee', price: 395, mrp: 450, discount: 12, unit: '250 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEjoYdNwu_Dd3ui6KWDfuEpGBwHRtRf7Va_OgcRzcmMA&s=10', inStock: true, tags: ['Bestseller'], rating: 4.8, reviews: 2800 },

  // ── Bakery & Biscuits (5 new) ──
  { id: 'bakery-001', name: 'Britannia Good Day Cashew Cookies', brand: 'Britannia', category: 'bakery-biscuits', price: 30, mrp: 35, discount: 14, unit: '100 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpH6vDwvxGy6JrmG_YfFinf8b4u6c0aFmoO0xr7i49Ew&s=10', inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 3900 },
  { id: 'bakery-002', name: "Oreo Original Cookies", brand: 'Oreo', category: 'bakery-biscuits', price: 35, mrp: 40, discount: 12, unit: '120 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRB6ixaY80fz1W8mUfx7zVhF_0Js8YOirPZfFAtLByUzV1MilcJQW7iJ6U&s=10', inStock: true, tags: ['Bestseller'], rating: 4.7, reviews: 5200 },
  { id: 'bakery-003', name: 'Monginis Butterscotch Pastry', brand: 'Monginis', category: 'bakery-biscuits', price: 60, mrp: 75, discount: 20, unit: '1 pc', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqnryX_OLakTbTjUV3H6hty5yK2LO838Omw9iM4RhDZg&s=10', inStock: true, rating: 4.3, reviews: 880 },
  { id: 'bakery-005', name: 'Britannia Multigrain Bread', brand: 'Britannia', category: 'bakery-biscuits', price: 48, mrp: 58, discount: 17, unit: '400 g (16 slices)', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhW9GFmJseVmJk_-cTIciZlvG8KXFjrUnuB9WHze_49g&s=10', inStock: true, tags: ['Bestseller'], rating: 4.4, reviews: 1780 },

  // ── Sweet Tooth (4 new) ──
  { id: 'sweet-001', name: 'Dairy Milk Silk Chocolate', brand: 'Cadbury', category: 'sweet-tooth', price: 99, mrp: 130, discount: 24, unit: '60 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5KYf9HOizK2A8F31ncHT8tUTmL80vu9cMYHvRIMNqiQ&s', inStock: true, tags: ['Bestseller'], rating: 4.8, reviews: 6400 },
  { id: 'sweet-002', name: 'KitKat Chocolate Bar', brand: 'Nestle', category: 'sweet-tooth', price: 35, mrp: 40, discount: 12, unit: '36.5 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQALCHQ54GD6f7rCHjOH6jTZ5a5UZgstC5jKQAdbNHcwQ&s=10', inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 4200 },
  { id: 'sweet-003', name: 'Milkmaid Condensed Milk', brand: 'Nestle', category: 'sweet-tooth', price: 75, mrp: 90, discount: 17, unit: '400 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_26_sWPzyO91xSRcfmZ440TjQ0JcBWIxsTgJuVbIAGQ&s=10', inStock: true, rating: 4.6, reviews: 1400 },
  { id: 'sweet-004', name: 'Munch Chocolate Bar', brand: 'Nestle', category: 'sweet-tooth', price: 10, mrp: 10, discount: 0, unit: '12.7 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHNWvaqhRee0AsJFtgkeih89TL9PB3SPh0-nISDUAc3A&s=10', inStock: true, tags: ['Bestseller'], rating: 4.3, reviews: 3800 },

  // ── Atta, Rice & Dal (5 new) ──
  { id: 'atta-011', name: 'Fortune Basmati Rice - Premium', brand: 'Fortune', category: 'atta-rice-dal', price: 145, mrp: 180, discount: 19, unit: '1 kg', deliveryTime: '11 MINS', image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcShXGB4uQE_FiDDf7Fji78C6NqcvdhRlleiY4wezELK3hod-BBpBkVoLF8uRvOe1N-JHpIsfaiIludz14WpdUZNPpJz5L80s5h26MTOSykJjfwRSgrF8NuItEo', inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 2800 },
  { id: 'atta-012', name: 'Aashirvaad Multigrain Atta', brand: 'Aashirvaad', category: 'atta-rice-dal', price: 220, mrp: 280, discount: 21, unit: '5 kg', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRzddKb7OjZ9QW8fsvcNvKBQUVuLhn0eUFUPfDt8w4wEeTyzISRFFNl4gQzKGw3BANAwwKUuLSqaAW-9O7UlC68oNkVTiIw8AyIckpvfy0a', inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 3600 },
  { id: 'atta-013', name: 'Tata Sampann Masoor Dal', brand: 'Tata Sampann', category: 'atta-rice-dal', price: 85, mrp: 105, discount: 19, unit: '500 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRitOgesDOAXAIMnJpExDZ1KRuXZxiIMgpckcJakNxLDA&s=10', inStock: true, rating: 4.4, reviews: 960 },
  { id: 'atta-014', name: 'Chana Dal - Tata Sampann', brand: 'Tata Sampann', category: 'atta-rice-dal', price: 95, mrp: 120, discount: 21, unit: '500 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTvmi8CfbAd9GbK81fHVvM0uKkU7f0BOpA1UdH3sWuUA&s=10', inStock: true, rating: 4.3, reviews: 720 },
  { id: 'atta-015', name: 'Dawat Biryani Basmati Rice', brand: 'Dawat', category: 'atta-rice-dal', price: 190, mrp: 240, discount: 21, unit: '1 kg', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRl0PFrXvrgdtS8zah6P7cVQKSMDo6l56Oxnyyz5aAGGI_WMNp6PgeyGxnSuopmi8DJNyBPhXV1FwEzX81pqssXsZhzB9mINSI0h-qfH9aBl58dQjo4G5H5TTg', inStock: true, tags: ['Bestseller'], rating: 4.7, reviews: 4100 },

  // ── Masala & Oil (5 new) ──
  { id: 'masala-011', name: 'Everest Rajwadi Garam Masala', brand: 'Everest', category: 'masala-oil', price: 55, mrp: 70, discount: 21, unit: '50 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRih-3sdsqFIx6Ug0zyS0Er6FJEGqB_UGxB4IQtGpOIiA&s=10', inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 2800 },
  { id: 'masala-014', name: 'Patanjali Cow Ghee', brand: 'Patanjali', category: 'masala-oil', price: 180, mrp: 220, discount: 18, unit: '200 ml', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStGzrAEOkoVBoF9aJ4xyM_kbg3YfG80Lr8JxV5UGqsRg&s=10', inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 2600 },
  { id: 'masala-015', name: 'Saffola Gold Oil', brand: 'Saffola', category: 'masala-oil', price: 175, mrp: 220, discount: 20, unit: '1 L', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDNRMPqgttcT1lThAt-2WbdpSnZMZ4Dcw2mOslnWo19g&s=10', inStock: true, rating: 4.3, reviews: 1440 },

  // ── Sauces & Spreads (4 new) ──
  { id: 'sauce-001', name: "Maggi Hot & Sweet Tomato Chilli Sauce", brand: 'Maggi', category: 'sauces-spreads', price: 75, mrp: 90, discount: 17, unit: '400 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQF1h4g9Q_2yTC7yEo_tW8XNzBlrsElYlA6O7GhmjTv8VnTIBJUMX3j8CngpGZu8vjSSy81Uc2c87Wlx4tIWOM2WS5YaPjGAg', inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 3200 },
  { id: 'sauce-002', name: "Kissan Mixed Fruit Jam", brand: 'Kissan', category: 'sauces-spreads', price: 80, mrp: 100, discount: 20, unit: '500 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQ6kWYGUt_66jR3Y6sA8eyKdiT6NFi14olEUQbalmtk_4RNRyT2ZEsg7cBDar1vYnOc98lKh3ZPujUSMfn_Zh-yaFt6EzypqevY9wcsSJIO-E3AqHNQpFgqzg', inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 2400 },
  { id: 'sauce-004', name: "Heinz Tomato Ketchup", brand: 'Heinz', category: 'sauces-spreads', price: 95, mrp: 120, discount: 21, unit: '450 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSPrei92eefJ-ppqcU_Vt3NsWlLaEroNHUHifCn4H0ugVyLW0nZleF5qyjTxmVBmoFANaojmjRqv6AMqnpDK40yP7BgpiYtOtycnbpS4UNLDMG3WuRkKkkrKQ', inStock: true, rating: 4.5, reviews: 2900 },

  // ── Organic & Healthy (4 new) ──
  { id: 'organic-002', name: 'True Elements Rolled Oats', brand: 'True Elements', category: 'organic-healthy', price: 220, mrp: 280, discount: 21, unit: '1 kg', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAcGFLRPLneBUTE2vxHEJSEoHPRKpJ9ca7875WOP5hzA&s=10', inStock: true, rating: 4.5, reviews: 1640 },
  { id: 'organic-003', name: 'Patanjali Raw Honey', brand: 'Patanjali', category: 'organic-healthy', price: 100, mrp: 125, discount: 20, unit: '250 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMSBnfUbw0eKEb6X4Zx12h4su3QfQLPywxW5i3Zw-LOA&s=10', inStock: true, tags: ['Bestseller'], rating: 4.4, reviews: 2200 },
  { id: 'organic-004', name: "Dr. Oetker Peanut Butter - Creamy", brand: "Dr. Oetker", category: 'organic-healthy', price: 145, mrp: 180, discount: 19, unit: '400 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE-n08tls_IDIfa4hSPjhrCLdNw9XLtc2-1SWMg17QKNkGYPkOzDRdMc68&s=10', inStock: true, rating: 4.7, reviews: 3100 },

  // ── Personal Care (4 new) ──
  { id: 'care-001', name: "Dove Beauty Bar Soap", brand: 'Dove', category: 'personal-care', price: 45, mrp: 55, discount: 18, unit: '100 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQstSiALwfLNNutb2ni60LlbxOg6yjEoFp9bq0I7N2yFA&s=10', inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 3600 },
  { id: 'care-002', name: "Head & Shoulders Anti-Dandruff Shampoo", brand: "Head & Shoulders", category: 'personal-care', price: 170, mrp: 210, discount: 19, unit: '340 ml', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRtqovsjWs1U4nlnm-DcqCCm18AatJHo3Slfl3zow-VT9FhLppeJLbJywOvlvjqZ3dsRPk9LGNX-q5Grq9Vgk9J5rjnoE1wq3CMaHvG4JF99BAP1vfN3OuKWtzQlOSItLtJ&usqp=CAc', inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 2900 },
  { id: 'care-003', name: "Colgate MaxFresh Toothpaste", brand: 'Colgate', category: 'personal-care', price: 65, mrp: 80, discount: 19, unit: '150 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw1ojC3rH4YrRgPO4MVx5lF5ytIs6ZWYRz4GqAr-Ddfg&s=10', inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 4200 },
  { id: 'care-004', name: "Nivea Moisturizing Cream", brand: 'Nivea', category: 'personal-care', price: 95, mrp: 120, discount: 21, unit: '100 ml', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRig79ppA9jZUHr5ON6ZWtxTy8Tn8qYtKalyKdYc8pLlg&s=10', inStock: true, rating: 4.4, reviews: 1900 },

  // ── Cleaning (4 new) ──
  { id: 'clean-001', name: "Surf Excel Quick Wash Detergent", brand: 'Surf Excel', category: 'cleaning', price: 95, mrp: 120, discount: 21, unit: '500 g', deliveryTime: '11 MINS', image: 'https://images.unsplash.com/photo-1585441695325-21ebee1a2f07?w=150&h=150&fit=crohttps://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTFc6H-A9RzWDqece8Yv4Qxqsu-jA280ZSJ6vIshN3AS2ktQHCAUkqATFv2qDrlkdLswFr6E0Hw5o3VSjhHwnOE75CLK2wH', inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 4100 },
  { id: 'clean-002', name: "Vim Dishwash Liquid - Lemon", brand: 'Vim', category: 'cleaning', price: 60, mrp: 75, discount: 20, unit: '500 ml', deliveryTime: '11 MINS', image: 'https://m.media-amazon.com/images/I/51rhw--KcDL._AC_UF350,350_QL80_.jpg', inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 3200 },
  { id: 'clean-003', name: "Harpic Power Plus Toilet Cleaner", brand: 'Harpic', category: 'cleaning', price: 80, mrp: 100, discount: 20, unit: '500 ml', deliveryTime: '11 MINS', image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcS1ofum7q8O40y_oBlKavHjQzgcapEin5HutFB9Zy65HZbE0llbzKkWoFAMGuhhBQgto2sTkDmNZqPAkYaw4j1bE9izFQQDoTN2cQzB8FRHzqgQZCZ4Q-N5Hw', inStock: true, rating: 4.4, reviews: 2400 },
  { id: 'clean-004', name: "Dettol Original Handwash", brand: 'Dettol', category: 'cleaning', price: 75, mrp: 95, discount: 21, unit: '250 ml', deliveryTime: '11 MINS', image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSrpiXz3E3haiAyo7F2zVr3ae9DmUME0iPC1usOnTdXJQTchCQSDchTo1m7OEqnJuBq0TkfNj4udmCM778trdOUaRfP-T9uJg', inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 3900 },

  // ── Pharma & Wellness (3 new) ──
  { id: 'pharma-001', name: "Himalaya Ashwagandha Tablets", brand: 'Himalaya', category: 'pharma-wellness', price: 140, mrp: 175, discount: 20, unit: '60 tabs', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSloygWHssnVr3IXxgL7dsjtVin1siv4FFwECfxjdL1EkuVsfo501EYYDjflGv49GUSzGlgDO3fEN4Vx7qfS73YQFgyCZ8KPT3zEsrgvZwNQvnfsBvN0Q4U2lb_JUizsTmkig&usqp=CAc', inStock: true, rating: 4.5, reviews: 2100 },
  { id: 'pharma-002', name: "Baidyanath Chyawanprash", brand: 'Baidyanath', category: 'pharma-wellness', price: 145, mrp: 185, discount: 22, unit: '500 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9Ab3DIPU5jBpxYJE5drZ_2T3za5rZlE2YWvyACH4fYmo17ugIOplAOwI&s=10', inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 1880 },
  { id: 'pharma-003', name: "Evion Vitamin E Capsules", brand: 'Evion', category: 'pharma-wellness', price: 90, mrp: 115, discount: 22, unit: '30 caps', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg668fRczBLfNhDzLzGhfXrNMl_SPk8rtZ0MIjHq2V-Q&s=10', inStock: true, rating: 4.4, reviews: 1640 },

  // ── Baby Care (3 new) ──
  { id: 'baby-001', name: "Pampers Active Baby Diapers - S", brand: 'Pampers', category: 'baby-care', price: 320, mrp: 400, discount: 20, unit: '44 count', deliveryTime: '11 MINS', image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTzjbC14L5_RwkMvKbrVLBOroEtgiuRvAA-DmkMEEpsD3xw76ZyYANSDZCwdIikVJY8kfGew30vIaEh4tYste8qbX_jqc7Mz0z-jjV9K4k0DwOWFxWmaRRhR6Jtm3LrCbRc&usqp=CAc', inStock: true, tags: ['Bestseller'], rating: 4.7, reviews: 4400 },
  { id: 'baby-002', name: "Johnson's Baby Powder", brand: "Johnson's", category: 'baby-care', price: 85, mrp: 105, discount: 19, unit: '200 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQhumcdxHm_I0NVbIA5E7w_kPaf8-gzuMDMOpoFt8urVUDYRSEKD-5Ei9UuDSETbeQtI8DsI9esfW5k0COCskaV9zGKXEOJtOEXbBuMHsD4aY_ZEcz2f7LVFmuLSCSswG9ZYeDogw&usqp=CAc', inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 3200 },
  { id: 'baby-003', name: "Cerelac Wheat & Honey Infant Cereal", brand: 'Cerelac', category: 'baby-care', price: 140, mrp: 175, discount: 20, unit: '300 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQlyQC5RtjfGbL5xSStmsLBhR8YaEYQHByveCM6PY4hjdGUlJhQ_RhfBl8hMfZqVw2Vi9t-Ti0xK4B74y4giKWYAwUjpRtKAZudCVsEOPNdcrvgKD_Yz9h7PnQ_EtpJ5qVGnaBX0IQ&usqp=CAc', inStock: true, rating: 4.5, reviews: 2100 }
];

products.forEach(p => {
  if (!p.sku) {
    const catCode = p.category ? p.category.split('-')[0].substring(0, 3).toUpperCase() : 'GEN';
    const itemCode = p.name ? p.name.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase() : 'ITM';
    const idNum = p.id ? p.id.replace(/[^0-9]/g, '') : '00';
    const padNum = idNum ? idNum.padStart(2, '0') : '01';
    p.sku = `GRL-${catCode}-${itemCode}-${padNum}`;
  }
});

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
