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
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/All.png" 
  },
  { 
    id: "vegetables-fruits", 
    name: "Veggies & Fruits", 
    color: "#10b981", 
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Fruits.png" 
  },
  { 
    id: "dairy-breakfast", 
    name: "Dairy & Breakfast", 
    color: "#3b82f6", 
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Dairy.png" 
  },
  { 
    id: "munchies", 
    name: "Munchies", 
    color: "#f59e0b", 
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Munchies.png" 
  },
  { 
    id: "cold-drinks", 
    name: "Cold Drinks", 
    color: "#ef4444", 
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Cold.png" 
  },
  { 
    id: "instant-frozen", 
    name: "Instant & Frozen", 
    color: "#8b5cf6", 
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Instant.png" 
  },
  { 
    id: "tea-coffee", 
    name: "Tea & Coffee", 
    color: "#78350f", 
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Tea.png" 
  },
  { 
    id: "bakery-biscuits", 
    name: "Bakery & Biscuits", 
    color: "#d97706", 
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Bakery.png" 
  },
  { 
    id: "sweet-tooth", 
    name: "Sweet Tooth", 
    color: "#ec4899", 
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Sweets.png" 
  },
  { 
    id: "atta-rice-dal", 
    name: "Atta, Rice & Dal", 
    color: "#eab308", 
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Atta.png" 
  },
  { 
    id: "masala-oil", 
    name: "Masala & Oil", 
    color: "#dc2626", 
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Masala.png" 
  },
  { 
    id: "sauces-spreads", 
    name: "Sauces & Spreads", 
    color: "#f97316", 
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Sauces.png" 
  },
  { 
    id: "organic-healthy", 
    name: "Organic & Healthy", 
    color: "#059669", 
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Organic.png" 
  },
  { 
    id: "baby-care", 
    name: "Baby Care", 
    color: "#06b6d4", 
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Baby.png" 
  },
  { 
    id: "pharma-wellness", 
    name: "Pharma & Wellness", 
    color: "#0891b2", 
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Pharma.png" 
  },
  { 
    id: "cleaning", 
    name: "Cleaning", 
    color: "#0284c7", 
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Cleaning.png" 
  },
  { 
    id: "home-office", 
    name: "Home & Office", 
    color: "#6366f1", 
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Home.png" 
  },
  { 
    id: "personal-care", 
    name: "Personal Care", 
    color: "#a855f7", 
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Personal.png" 
  },
  { 
    id: "pet-care", 
    name: "Pet Care", 
    color: "#d946ef", 
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Pet.png" 
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
