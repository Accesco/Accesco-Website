/**
 * Grokly Data Layer
 * Product catalog, categories, and banner data
 * @version 1.0.0
 */

/**
 * Product Categories
 * @type {Array<{id: string, name: string, color: string, image: string}>}
 */
export const categories = [
  { 
    id: "all", 
    name: "All", 
    color: "#0c831f", 
    image: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=100&h=100&fit=crop"
  },
 {
  id: "vegetables-fruits",
  name: "Veggies & Fruits",
  color: "#10b981",
  image: "https://i.pinimg.com/736x/27/33/5d/27335dd021a80576927344e039bfc8b5.jpg"
},
  { 
    id: "dairy-breakfast", 
    name: "Dairy & Breakfast", 
    color: "#3b82f6", 
    image: "https://www.bbassets.com/media/uploads/p/xl/1229504_3-bb-combo-kelloggs-corn-flakes-original12-kg-amul-taaza-homogenised-toned-milk-1l.jpg"
  },
  { 
    id: "munchies", 
    name: "Munchies", 
    color: "#f59e0b", 
    image: "https://media.potatopro.com/pepsico-parters-india-1-1200.jpg"
  },
  { 
    id: "cold-drinks", 
    name: "Cold Drinks", 
    color: "#ef4444", 
    image: "https://tiimg.tistatic.com/fp/1/007/193/cold-drink-delicious-taste-with-meals-100ml-300ml-500ml-1l-1-25l-2l--403.jpg"
  },
  { 
    id: "instant-frozen", 
    name: "Instant & Frozen", 
    color: "#8b5cf6", 
    image: "https://i.pinimg.com/736x/5c/94/22/5c94225787c1aadb6413d34b971cd9c4.jpg"
  },
  { 
    id: "tea-coffee", 
    name: "Tea & Coffee", 
    color: "#78350f", 
    image: "https://i.pinimg.com/736x/e5/b1/71/e5b171de4141e19b43672dcf8d97bc83.jpg"
  },
  { 
    id: "bakery-biscuits", 
    name: "Bakery & Biscuits", 
    color: "#d97706", 
    image: "https://i.pinimg.com/736x/6e/a6/fc/6ea6fce4eb1eb56c0deaab3591764a6c.jpg"
  },
  { 
    id: "sweet-tooth", 
    name: "Sweet Tooth", 
    color: "#ec4899", 
    image: "https://image.cdn.shpy.in/505502/cat/510341_cat-1777546355286.png?width=300&format=webp"
  },
  { 
    id: "atta-rice-dal", 
    name: "Atta, Rice & Dal", 
    color: "#eab308", 
    image: "https://i.pinimg.com/736x/3f/3e/1c/3f3e1c1939f840427f22e84270ed23c8.jpg"
  },
  { 
    id: "masala-oil", 
    name: "Masala & Oil", 
    color: "#dc2626", 
    image: "https://i0.wp.com/gujcomart.in/wp-content/uploads/2025/10/Masala-Oil.png?resize=300%2C286&ssl=1"
  },
  { 
    id: "sauces-spreads", 
    name: "Sauces & Spreads", 
    color: "#f97316", 
    image: "https://i.pinimg.com/736x/f7/82/d5/f782d5aac4dd45ee808486bc45a9a7bb.jpg"
  },
  { 
    id: "organic-healthy", 
    name: "Organic & Healthy", 
    color: "#059669", 
    image: "https://i.pinimg.com/736x/34/19/8a/34198aee64c74f6509df366441a282e4.jpg"
  },
  { 
    id: "baby-care", 
    name: "Baby Care", 
    color: "#06b6d4", 
    image: "https://i.pinimg.com/736x/9e/f0/2d/9ef02d1fe925f71760c7b25b79ac0f19.jpg"
  },
  { 
    id: "pharma-wellness", 
    name: "Pharma & Wellness", 
    color: "#0891b2", 
    image: "https://img.magnific.com/free-vector/healthcare-medications-composition-with-images-pills-blisters-capsules-jars-drops-syrups-vector-illustration_1284-71689.jpg?semt=ais_hybrid&w=740&q=80"
  },
  { 
    id: "cleaning", 
    name: "Cleaning", 
    color: "#0284c7", 
    image: "https://t3.ftcdn.net/jpg/02/37/15/86/360_F_237158635_AkhWPaSELIoGtgoeiJHPRwwjZg4ug5vh.jpg"
  },
  { 
    id: "home-office", 
    name: "Home & Office", 
    color: "#6366f1", 
    image: "https://media.istockphoto.com/id/1213573873/photo/group-of-colorful-school-supplies-isolated-on-white.jpg?s=612x612&w=0&k=20&c=xFC6dFBxjH4OKbTk51RlzVL_qwP8Yl5MCJZZD8lC45M="
  },
  { 
    id: "personal-care", 
    name: "Personal Care", 
    color: "#a855f7", 
    image: "https://i.pinimg.com/736x/9c/30/2c/9c302c867ad42eae00f1c4074a251b9c.jpg"
  },
  { 
    id: "pet-care", 
    name: "Pet Care", 
    color: "#d946ef", 
    image: "https://m.media-amazon.com/images/I/7145CWRtZXL.jpg"
  },
];

/**
 * Promotional Banners
 * @type {Array<{bg: string, tag: string, title: string, sub: string}>}
 */
export const banners = [
  { 
    bg: "linear-gradient(135deg,#0c831f,#065f17)", 
    tag: "UP TO 30% OFF", 
    title: "Farm Fresh Veggies", 
    sub: "Direct from farm to your door in 11 mins" 
  },
  { 
    bg: "linear-gradient(135deg,#1d4ed8,#1e40af)", 
    tag: "BESTSELLERS", 
    title: "Dairy Essentials", 
    sub: "Amul, Mother Dairy & 100+ brands" 
  },
  { 
    bg: "linear-gradient(135deg,#b45309,#92400e)", 
    tag: "SAVE BIG TODAY", 
    title: "Morning Bliss", 
    sub: "Tea, Coffee & Healthy Drinks" 
  },
  { 
    bg: "linear-gradient(135deg,#7c3aed,#5b21b6)", 
    tag: "NEW ARRIVALS", 
    title: "Sweet Cravings", 
    sub: "Chocolates, candy & more treats" 
  },
];

// Import products from existing file
export { products } from '../../../../lib/groklyProducts';

/**
 * Get category by ID
 * @param {string} categoryId - Category ID
 * @returns {Object|undefined} Category object
 */
export function getCategoryById(categoryId) {
  return categories.find(cat => cat.id === categoryId);
}

/**
 * Get products by category
 * @param {string} categoryId - Category ID ('all' returns all products)
 * @returns {Array} Filtered products
 */
export function getProductsByCategory(categoryId, productsArray) {
  if (categoryId === 'all') return productsArray;
  return productsArray.filter(product => product.category === categoryId);
}

/**
 * Search products by query
 * @param {string} query - Search query
 * @param {Array} productsArray - Products array
 * @returns {Array} Matching products
 */
export function searchProducts(query, productsArray) {
  if (!query || query.trim() === '') return productsArray;
  
  const lowerQuery = query.toLowerCase().trim();
  return productsArray.filter(product => 
    product.name.toLowerCase().includes(lowerQuery) ||
    product.brand.toLowerCase().includes(lowerQuery) ||
    product.category.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get product by ID
 * @param {string} productId - Product ID
 * @param {Array} productsArray - Products array
 * @returns {Object|undefined} Product object
 */
export function getProductById(productId, productsArray) {
  return productsArray.find(product => product.id === productId);
}

/**
 * Get featured/bestseller products
 * @param {Array} productsArray - Products array
 * @param {number} limit - Maximum number of products to return
 * @returns {Array} Featured products
 */
export function getFeaturedProducts(productsArray, limit = 20) {
  return productsArray
    .filter(product => product.tags && product.tags.includes('Bestseller'))
    .slice(0, limit);
}

/**
 * Get products by tag
 * @param {string} tag - Tag name
 * @param {Array} productsArray - Products array
 * @returns {Array} Products with the specified tag
 */
export function getProductsByTag(tag, productsArray) {
  return productsArray.filter(product => 
    product.tags && product.tags.includes(tag)
  );
}

/**
 * Sort products
 * @param {Array} productsArray - Products array
 * @param {string} sortBy - Sort criteria ('price-low', 'price-high', 'rating', 'discount')
 * @returns {Array} Sorted products
 */
export function sortProducts(productsArray, sortBy) {
  const sorted = [...productsArray];
  
  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'discount':
      return sorted.sort((a, b) => b.disc - a.disc);
    default:
      return sorted;
  }
}
