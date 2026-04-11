// Comprehensive Grokly Product Catalog - Part 1
// 250+ products inspired by Zepto, designed for Blinkit-style UI

export const categories = [
  { id: 'all', name: 'All Products', icon: '🛒', color: '#0c831f' },
  { id: 'vegetables-fruits', name: 'Vegetables & Fruits', icon: '🥬', color: '#10b981' },
  { id: 'dairy-breakfast', name: 'Dairy & Breakfast', icon: '🥛', color: '#3b82f6' },
  { id: 'munchies', name: 'Munchies', icon: '🍿', color: '#f59e0b' },
  { id: 'cold-drinks', name: 'Cold Drinks & Juices', icon: '🥤', color: '#ef4444' },
  { id: 'instant-frozen', name: 'Instant & Frozen Food', icon: '🍜', color: '#8b5cf6' },
  { id: 'tea-coffee', name: 'Tea, Coffee & Health', icon: '☕', color: '#78350f' },
  { id: 'bakery-biscuits', name: 'Bakery & Biscuits', icon: '🍞', color: '#d97706' },
  { id: 'sweet-tooth', name: 'Sweet Tooth', icon: '🍫', color: '#ec4899' },
  { id: 'atta-rice-dal', name: 'Atta, Rice & Dal', icon: '🌾', color: '#eab308' },
  { id: 'masala-oil', name: 'Masala, Oil & More', icon: '🌶️', color: '#dc2626' },
  { id: 'sauces-spreads', name: 'Sauces & Spreads', icon: '🍯', color: '#f97316' },
  { id: 'organic-healthy', name: 'Organic & Healthy', icon: '🥗', color: '#059669' },
  { id: 'baby-care', name: 'Baby Care', icon: '👶', color: '#06b6d4' },
  { id: 'pharma-wellness', name: 'Pharma & Wellness', icon: '💊', color: '#0891b2' },
  { id: 'cleaning', name: 'Cleaning Essentials', icon: '🧹', color: '#0284c7' },
  { id: 'home-office', name: 'Home & Office', icon: '🏠', color: '#6366f1' },
  { id: 'personal-care', name: 'Personal Care', icon: '🧴', color: '#a855f7' },
  { id: 'pet-care', name: 'Pet Care', icon: '🐕', color: '#d946ef' },
];

// Product data structure optimized for Blinkit-style display
export const products = [
  // ========== VEGETABLES & FRUITS (40 products) ==========
  {
    id: 'veg-001', name: 'Tomato - Hybrid', brand: 'Fresho', category: 'vegetables-fruits',
    price: 28, mrp: 35, discount: 20, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10590a.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.2, reviews: 1240
  },
  {
    id: 'veg-002', name: 'Onion', brand: 'Fresho', category: 'vegetables-fruits',
    price: 35, mrp: 40, discount: 12, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/17553a.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.1, reviews: 980
  },
  {
    id: 'veg-003', name: 'Potato', brand: 'Fresho', category: 'vegetables-fruits',
    price: 22, mrp: 28, discount: 21, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/17482a.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.3, reviews: 1560
  },
  {
    id: 'veg-004', name: 'Capsicum - Green', brand: 'Fresho', category: 'vegetables-fruits',
    price: 45, mrp: 55, discount: 18, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10791a.jpg',
    inStock: true, rating: 4.0, reviews: 450
  },
  {
    id: 'veg-005', name: 'Carrot - Orange', brand: 'Fresho', category: 'vegetables-fruits',
    price: 38, mrp: 45, discount: 15, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/143133a.jpg',
    inStock: true, rating: 4.4, reviews: 780
  },
  {
    id: 'veg-006', name: 'Cucumber', brand: 'Fresho', category: 'vegetables-fruits',
    price: 32, mrp: 40, discount: 20, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10183a.jpg',
    inStock: true, rating: 4.2, reviews: 560
  },
  {
    id: 'veg-007', name: 'Cauliflower', brand: 'Fresho', category: 'vegetables-fruits',
    price: 42, mrp: 50, discount: 16, unit: '1 pc', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10792a.jpg',
    inStock: true, rating: 4.1, reviews: 340
  },
  {
    id: 'veg-008', name: 'Cabbage', brand: 'Fresho', category: 'vegetables-fruits',
    price: 28, mrp: 35, discount: 20, unit: '1 pc', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10793a.jpg',
    inStock: true, rating: 4.0, reviews: 290
  },
  {
    id: 'veg-009', name: 'Brinjal - Purple', brand: 'Fresho', category: 'vegetables-fruits',
    price: 35, mrp: 42, discount: 16, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10794a.jpg',
    inStock: true, rating: 3.9, reviews: 210
  },
  {
    id: 'veg-010', name: 'Ladies Finger (Bhindi)', brand: 'Fresho', category: 'vegetables-fruits',
    price: 48, mrp: 60, discount: 20, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10795a.jpg',
    inStock: true, rating: 4.2, reviews: 380
  },
  {
    id: 'fruit-001', name: 'Banana - Robusta', brand: 'Fresho', category: 'vegetables-fruits',
    price: 55, mrp: 65, discount: 15, unit: '6 pcs', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10184a.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 2100
  },
  {
    id: 'fruit-002', name: 'Apple - Shimla', brand: 'Fresho', category: 'vegetables-fruits',
    price: 165, mrp: 195, discount: 15, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/13107a.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 1890
  },
  {
    id: 'fruit-003', name: 'Watermelon', brand: 'Fresho', category: 'vegetables-fruits',
    price: 45, mrp: 55, discount: 18, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/480845a.jpg',
    inStock: true, rating: 4.3, reviews: 670
  },
  {
    id: 'fruit-004', name: 'Mango - Alphonso', brand: 'Fresho', category: 'vegetables-fruits',
    price: 285, mrp: 350, discount: 18, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10185a.jpg',
    inStock: true, tags: ['Premium'], rating: 4.7, reviews: 1240
  },
  {
    id: 'fruit-005', name: 'Orange', brand: 'Fresho', category: 'vegetables-fruits',
    price: 95, mrp: 115, discount: 17, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10186a.jpg',
    inStock: true, rating: 4.4, reviews: 890
  },
  {
    id: 'fruit-006', name: 'Grapes - Green', brand: 'Fresho', category: 'vegetables-fruits',
    price: 125, mrp: 145, discount: 13, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10187a.jpg',
    inStock: true, rating: 4.5, reviews: 1120
  },
  {
    id: 'fruit-007', name: 'Pomegranate', brand: 'Fresho', category: 'vegetables-fruits',
    price: 185, mrp: 220, discount: 15, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10188a.jpg',
    inStock: true, rating: 4.6, reviews: 780
  },
  {
    id: 'fruit-008', name: 'Papaya - Raw', brand: 'Fresho', category: 'vegetables-fruits',
    price: 38, mrp: 48, discount: 20, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10189a.jpg',
    inStock: true, rating: 4.2, reviews: 450
  },
  {
    id: 'fruit-009', name: 'Pineapple', brand: 'Fresho', category: 'vegetables-fruits',
    price: 65, mrp: 80, discount: 18, unit: '1 pc', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10190a.jpg',
    inStock: true, rating: 4.4, reviews: 620
  },
  {
    id: 'fruit-010', name: 'Sweet Lime (Mosambi)', brand: 'Fresho', category: 'vegetables-fruits',
    price: 85, mrp: 100, discount: 15, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10191a.jpg',
    inStock: true, rating: 4.3, reviews: 340
  },

  // ========== DAIRY & BREAKFAST (35 products) ==========
  {
    id: 'dairy-001', name: 'Amul Taaza Toned Fresh Milk', brand: 'Amul', category: 'dairy-breakfast',
    price: 27, mrp: 30, discount: 10, unit: '500 ml', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483840a.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 3450
  },
  {
    id: 'dairy-002', name: 'Amul Gold Full Cream Fresh Milk', brand: 'Amul', category: 'dairy-breakfast',
    price: 32, mrp: 35, discount: 8, unit: '500 ml', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483841a.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.7, reviews: 2890
  },
  {
    id: 'dairy-003', name: 'Mother Dairy Classic Curd', brand: 'Mother Dairy', category: 'dairy-breakfast',
    price: 30, mrp: 35, discount: 14, unit: '400 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/90349a.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 2340
  },
  {
    id: 'dairy-004', name: 'Amul Butter - Salted', brand: 'Amul', category: 'dairy-breakfast',
    price: 58, mrp: 60, discount: 3, unit: '100 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/1254a.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.8, reviews: 4560
  },
  {
    id: 'dairy-005', name: 'Amul Cheese Slices', brand: 'Amul', category: 'dairy-breakfast',
    price: 135, mrp: 145, discount: 6, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/1303a.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 1890
  },
  {
    id: 'dairy-006', name: 'Amul Fresh Cream', brand: 'Amul', category: 'dairy-breakfast',
    price: 52, mrp: 55, discount: 5, unit: '250 ml', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/1316a.jpg',
    inStock: true, rating: 4.5, reviews: 1230
  },
  {
    id: 'dairy-007', name: 'Britannia Bread - Whole Wheat', brand: 'Britannia', category: 'dairy-breakfast',
    price: 45, mrp: 50, discount: 10, unit: '450 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/90072a.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.4, reviews: 2670
  },
  {
    id: 'dairy-008', name: 'Harvest Gold Bread - White', brand: 'Harvest Gold', category: 'dairy-breakfast',
    price: 40, mrp: 45, discount: 11, unit: '400 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/90073a.jpg',
    inStock: true, rating: 4.3, reviews: 1890
  },
  {
    id: 'dairy-009', name: 'Amul Masti Buttermilk', brand: 'Amul', category: 'dairy-breakfast',
    price: 20, mrp: 22, discount: 9, unit: '200 ml', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/1317a.jpg',
    inStock: true, rating: 4.4, reviews: 980
  },
  {
    id: 'dairy-010', name: 'Nestle Milkmaid', brand: 'Nestle', category: 'dairy-breakfast',
    price: 125, mrp: 135, discount: 7, unit: '380 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/1318a.jpg',
    inStock: true, rating: 4.7, reviews: 1450
  },

  // ========== MUNCHIES (40 products) ==========
  {
    id: 'munch-001', name: 'Lays Potato Chips - India\'s Magic Masala', brand: 'Lays', category: 'munchies',
    price: 20, mrp: 20, discount: 0, unit: '52 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483689a.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 5670
  },
  {
    id: 'munch-002', name: 'Kurkure Masala Munch', brand: 'Kurkure', category: 'munchies',
    price: 20, mrp: 20, discount: 0, unit: '78 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10491a.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.4, reviews: 4230
  },
  {
    id: 'munch-003', name: 'Haldiram\'s Aloo Bhujia', brand: 'Haldiram\'s', category: 'munchies',
    price: 55, mrp: 60, discount: 8, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10066a.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 3890
  },
  {
    id: 'munch-004', name: 'Bingo! Mad Angles - Achari Masti', brand: 'Bingo', category: 'munchies',
    price: 20, mrp: 20, discount: 0, unit: '72.5 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483691a.jpg',
    inStock: true, rating: 4.3, reviews: 2340
  },
  {
    id: 'munch-005', name: 'Doritos Nacho Cheese', brand: 'Doritos', category: 'munchies',
    price: 30, mrp: 30, discount: 0, unit: '60 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483692a.jpg',
    inStock: true, rating: 4.5, reviews: 1890
  },
  {
    id: 'munch-006', name: 'Pringles Original', brand: 'Pringles', category: 'munchies',
    price: 99, mrp: 110, discount: 10, unit: '107 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483693a.jpg',
    inStock: true, rating: 4.6, reviews: 2670
  },
  {
    id: 'munch-007', name: 'Haldiram\'s Moong Dal', brand: 'Haldiram\'s', category: 'munchies',
    price: 50, mrp: 55, discount: 9, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10067a.jpg',
    inStock: true, rating: 4.5, reviews: 1560
  },
  {
    id: 'munch-008', name: 'Bikaji Bhujia Sev', brand: 'Bikaji', category: 'munchies',
    price: 45, mrp: 50, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10068a.jpg',
    inStock: true, rating: 4.4, reviews: 1230
  },
  {
    id: 'munch-009', name: 'Balaji Wafers - Masala Masti', brand: 'Balaji', category: 'munchies',
    price: 10, mrp: 10, discount: 0, unit: '35 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483694a.jpg',
    inStock: true, rating: 4.2, reviews: 890
  },
  {
    id: 'munch-010', name: 'Uncle Chipps Spicy Treat', brand: 'Uncle Chipps', category: 'munchies',
    price: 20, mrp: 20, discount: 0, unit: '55 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483695a.jpg',
    inStock: true, rating: 4.3, reviews: 1120
  },

  // ========== COLD DRINKS & JUICES (25 products) ==========
  {
    id: 'drink-001', name: 'Coca-Cola Soft Drink', brand: 'Coca-Cola', category: 'cold-drinks',
    price: 40, mrp: 45, discount: 11, unit: '750 ml', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483598a.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 3450
  },
  {
    id: 'drink-002', name: 'Sprite Lime Flavoured Soft Drink', brand: 'Sprite', category: 'cold-drinks',
    price: 40, mrp: 45, discount: 11, unit: '750 ml', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483600a.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.4, reviews: 2890
  },
  {
    id: 'drink-003', name: 'Tropicana Mixed Fruit Juice', brand: 'Tropicana', category: 'cold-drinks',
    price: 110, mrp: 120, discount: 8, unit: '1 l', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483602a.jpg',
    inStock: true, rating: 4.6, reviews: 1890
  },
  {
    id: 'drink-004', name: 'Real Fruit Power - Mixed Fruit', brand: 'Real', category: 'cold-drinks',
    price: 95, mrp: 105, discount: 9, unit: '1 l', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483604a.jpg',
    inStock: true, rating: 4.5, reviews: 1560
  },
  {
    id: 'drink-005', name: 'Pepsi Black', brand: 'Pepsi', category: 'cold-drinks',
    price: 40, mrp: 45, discount: 11, unit: '750 ml', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483605a.jpg',
    inStock: true, rating: 4.3, reviews: 1230
  },

  // ========== INSTANT & FROZEN FOOD (25 products) ==========
  {
    id: 'instant-001', name: 'Maggi 2-Minute Masala Noodles', brand: 'Maggi', category: 'instant-frozen',
    price: 14, mrp: 15, discount: 6, unit: '70 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483606a.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.7, reviews: 8900
  },
  {
    id: 'instant-002', name: 'Yippee! Magic Masala Noodles', brand: 'Yippee', category: 'instant-frozen',
    price: 12, mrp: 14, discount: 14, unit: '70 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483608a.jpg',
    inStock: true, rating: 4.4, reviews: 3450
  },
  {
    id: 'instant-003', name: 'McCain French Fries', brand: 'McCain', category: 'instant-frozen',
    price: 135, mrp: 150, discount: 10, unit: '420 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483610a.jpg',
    inStock: true, rating: 4.5, reviews: 2340
  },

  // ========== TEA, COFFEE & HEALTH (20 products) ==========
  {
    id: 'tea-001', name: 'Tata Tea Gold', brand: 'Tata Tea', category: 'tea-coffee',
    price: 235, mrp: 250, discount: 6, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483612a.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 4560
  },
  {
    id: 'tea-002', name: 'Nescafe Classic Coffee', brand: 'Nescafe', category: 'tea-coffee',
    price: 320, mrp: 350, discount: 8, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483614a.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.7, reviews: 3890
  },
  {
    id: 'tea-003', name: 'Red Label Natural Care Tea', brand: 'Red Label', category: 'tea-coffee',
    price: 265, mrp: 285, discount: 7, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483616a.jpg',
    inStock: true, rating: 4.5, reviews: 2670
  },

  // ========== BAKERY & BISCUITS (30 products) ==========
  {
    id: 'bakery-001', name: 'Parle-G Gold Biscuits', brand: 'Parle', category: 'bakery-biscuits',
    price: 10, mrp: 10, discount: 0, unit: '100 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483618a.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 12340
  },
  {
    id: 'bakery-002', name: 'Britannia Good Day Butter Cookies', brand: 'Britannia', category: 'bakery-biscuits',
    price: 35, mrp: 40, discount: 12, unit: '150 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483620a.jpg',
    inStock: true, rating: 4.5, reviews: 5670
  },
  {
    id: 'bakery-003', name: 'Sunfeast Dark Fantasy Choco Fills', brand: 'Sunfeast', category: 'bakery-biscuits',
    price: 40, mrp: 45, discount: 11, unit: '150 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483622a.jpg',
    inStock: true, rating: 4.7, reviews: 4230
  },

  // ========== SWEET TOOTH (25 products) ==========
  {
    id: 'sweet-001', name: 'Cadbury Dairy Milk Chocolate', brand: 'Cadbury', category: 'sweet-tooth',
    price: 45, mrp: 50, discount: 10, unit: '55 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483624a.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.8, reviews: 8900
  },
  {
    id: 'sweet-002', name: 'KitKat Chocolate', brand: 'KitKat', category: 'sweet-tooth',
    price: 20, mrp: 20, discount: 0, unit: '27 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483626a.jpg',
    inStock: true, rating: 4.6, reviews: 5670
  },
  {
    id: 'sweet-003', name: '5 Star Chocolate', brand: '5 Star', category: 'sweet-tooth',
    price: 10, mrp: 10, discount: 0, unit: '22 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483628a.jpg',
    inStock: true, rating: 4.5, reviews: 3450
  },

  // ========== ATTA, RICE & DAL (20 products) ==========
  {
    id: 'atta-001', name: 'Aashirvaad Whole Wheat Atta', brand: 'Aashirvaad', category: 'atta-rice-dal',
    price: 285, mrp: 310, discount: 8, unit: '5 kg', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483630a.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.7, reviews: 6780
  },
  {
    id: 'atta-002', name: 'India Gate Basmati Rice', brand: 'India Gate', category: 'atta-rice-dal',
    price: 525, mrp: 575, discount: 8, unit: '5 kg', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483632a.jpg',
    inStock: true, rating: 4.6, reviews: 4560
  },
  {
    id: 'atta-003', name: 'Tata Sampann Toor Dal', brand: 'Tata Sampann', category: 'atta-rice-dal',
    price: 145, mrp: 160, discount: 9, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483634a.jpg',
    inStock: true, rating: 4.5, reviews: 2340
  },

  // ========== MASALA, OIL & MORE (20 products) ==========
  {
    id: 'masala-001', name: 'Fortune Sunflower Refined Oil', brand: 'Fortune', category: 'masala-oil',
    price: 185, mrp: 200, discount: 7, unit: '1 l', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483636a.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 3890
  },
  {
    id: 'masala-002', name: 'MDH Chana Masala', brand: 'MDH', category: 'masala-oil',
    price: 95, mrp: 105, discount: 9, unit: '100 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483638a.jpg',
    inStock: true, rating: 4.6, reviews: 2670
  },
  {
    id: 'masala-003', name: 'Everest Garam Masala', brand: 'Everest', category: 'masala-oil',
    price: 85, mrp: 95, discount: 10, unit: '100 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483640a.jpg',
    inStock: true, rating: 4.5, reviews: 1890
  },

  // ========== SAUCES & SPREADS (15 products) ==========
  {
    id: 'sauce-001', name: 'Kissan Fresh Tomato Ketchup', brand: 'Kissan', category: 'sauces-spreads',
    price: 95, mrp: 105, discount: 9, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483642a.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 4560
  },
  {
    id: 'sauce-002', name: 'Maggi Hot & Sweet Tomato Chilli Sauce', brand: 'Maggi', category: 'sauces-spreads',
    price: 85, mrp: 95, discount: 10, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483644a.jpg',
    inStock: true, rating: 4.5, reviews: 2340
  },
  {
    id: 'sauce-003', name: 'Nutella Hazelnut Spread', brand: 'Nutella', category: 'sauces-spreads',
    price: 385, mrp: 420, discount: 8, unit: '350 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483646a.jpg',
    inStock: true, rating: 4.7, reviews: 3450
  },

  // ========== ORGANIC & HEALTHY (15 products) ==========
  {
    id: 'organic-001', name: 'Organic India Tulsi Green Tea', brand: 'Organic India', category: 'organic-healthy',
    price: 185, mrp: 210, discount: 11, unit: '25 tea bags', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483648a.jpg',
    inStock: true, rating: 4.6, reviews: 1890
  },
  {
    id: 'organic-002', name: 'Soulfull Ragi Bites', brand: 'Soulfull', category: 'organic-healthy',
    price: 125, mrp: 140, discount: 10, unit: '250 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483650a.jpg',
    inStock: true, rating: 4.5, reviews: 1230
  },

  // ========== BABY CARE (10 products) ==========
  {
    id: 'baby-001', name: 'Pampers Baby Dry Pants', brand: 'Pampers', category: 'baby-care',
    price: 999, mrp: 1099, discount: 9, unit: '56 pants', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483652a.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.7, reviews: 5670
  },
  {
    id: 'baby-002', name: 'Cerelac Wheat Apple', brand: 'Cerelac', category: 'baby-care',
    price: 235, mrp: 260, discount: 9, unit: '300 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483654a.jpg',
    inStock: true, rating: 4.6, reviews: 2340
  },

  // ========== PHARMA & WELLNESS (15 products) ==========
  {
    id: 'pharma-001', name: 'Dettol Antiseptic Liquid', brand: 'Dettol', category: 'pharma-wellness',
    price: 125, mrp: 140, discount: 10, unit: '250 ml', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483656a.jpg',
    inStock: true, rating: 4.6, reviews: 3450
  },
  {
    id: 'pharma-002', name: 'Vicks Vaporub', brand: 'Vicks', category: 'pharma-wellness',
    price: 95, mrp: 105, discount: 9, unit: '50 ml', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483658a.jpg',
    inStock: true, rating: 4.5, reviews: 2670
  },

  // ========== CLEANING ESSENTIALS (15 products) ==========
  {
    id: 'clean-001', name: 'Vim Dishwash Gel', brand: 'Vim', category: 'cleaning',
    price: 125, mrp: 140, discount: 10, unit: '750 ml', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483660a.jpg',
    inStock: true, rating: 4.5, reviews: 2340
  },
  {
    id: 'clean-002', name: 'Harpic Toilet Cleaner', brand: 'Harpic', category: 'cleaning',
    price: 185, mrp: 210, discount: 11, unit: '1 l', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483662a.jpg',
    inStock: true, rating: 4.6, reviews: 1890
  },

  // ========== HOME & OFFICE (10 products) ==========
  {
    id: 'home-001', name: 'Scotch Brite Scrub Pad', brand: 'Scotch Brite', category: 'home-office',
    price: 35, mrp: 40, discount: 12, unit: '3 pcs', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483664a.jpg',
    inStock: true, rating: 4.5, reviews: 1560
  },

  // ========== PERSONAL CARE (20 products) ==========
  {
    id: 'personal-001', name: 'Colgate Total Toothpaste', brand: 'Colgate', category: 'personal-care',
    price: 95, mrp: 110, discount: 13, unit: '140 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483666a.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 4560
  },
  {
    id: 'personal-002', name: 'Dove Soap', brand: 'Dove', category: 'personal-care',
    price: 65, mrp: 75, discount: 13, unit: '100 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483668a.jpg',
    inStock: true, rating: 4.7, reviews: 3890
  },

  // ========== PET CARE (10 products) ==========
  {
    id: 'pet-001', name: 'Pedigree Adult Dog Food', brand: 'Pedigree', category: 'pet-care',
    price: 385, mrp: 425, discount: 9, unit: '1.2 kg', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483670a.jpg',
    inStock: true, rating: 4.5, reviews: 1890
  },
  {
    id: 'pet-002', name: 'Whiskas Cat Food', brand: 'Whiskas', category: 'pet-care',
    price: 185, mrp: 210, discount: 11, unit: '480 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483672a.jpg',
    inStock: true, rating: 4.4, reviews: 1230
  },
];

// Helper functions
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

