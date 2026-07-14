// Mock data for InstaStyle module
// This will be replaced with real Firebase data later

export const categories = [
  { id: 'men', name: 'Men', slug: 'men' },
  { id: 'women', name: 'Women', slug: 'women' },
  { id: 'kids', name: 'Kids', slug: 'kids' },
  { id: 'accessories', name: 'Accessories', slug: 'accessories' },
];

export const subcategories = {
  men: ['T-Shirts', 'Shirts', 'Jeans', 'Trousers', 'Jackets', 'Shoes'],
  women: ['Dresses', 'Tops', 'Jeans', 'Skirts', 'Jackets', 'Shoes'],
  kids: ['T-Shirts', 'Dresses', 'Jeans', 'Shorts', 'Jackets', 'Shoes'],
  accessories: ['Bags', 'Watches', 'Sunglasses', 'Belts', 'Wallets', 'Jewelry'],
};

export const brands = [
  'Urban Basics',
  'StyleHub',
  'TrendSetters',
  'ClassicWear',
  'ModernFit',
  'ElegantTouch',
  'Aura Atelier',
  'PremiumLine',
];

export const products = [
  // ── New Premium Products ──
  {
    id: 'prod_039',
    sku: 'INS-MEN-WLOV-39',
    name: 'Sleek Wool Overcoat',
    brand: 'PremiumLine',
    category: 'men',
    subcategory: 'Jackets',
    price: 7999,
    discountedPrice: 5999,
    discountPercentage: 25,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Charcoal', hex: '#36454F', images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=800&fit=crop'] }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=800&fit=crop', alt: 'Sleek Wool Overcoat', isPrimary: true, order: 1 }
    ],
    description: 'A premium wool-blend overcoat with a tailored silhouette, perfect for layering during colder months.',
    material: '60% Wool, 40% Polyester',
    careInstructions: 'Dry clean only',
    features: ['Tailored fit', 'Notched lapels', 'Side pockets', 'Premium lining'],
    inStock: true,
    inventory: { S: 5, M: 8, L: 10, XL: 6 },
    rating: 4.8,
    reviewCount: 42,
    tags: ['men', 'jacket', 'overcoat', 'wool', 'premium'],
    isFeatured: true,
    slug: 'sleek-wool-overcoat',
  },
  {
    id: 'prod_040',
    sku: 'INS-MEN-CGJG-40',
    name: 'Urban Cargo Joggers',
    brand: 'Urban Basics',
    category: 'men',
    subcategory: 'Trousers',
    price: 2199,
    discountedPrice: 1699,
    discountPercentage: 23,
    sizes: ['30', '32', '34', '36'],
    colors: [
      { name: 'Sand', hex: '#E6D2B5', images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop'] }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop', alt: 'Cargo Joggers', isPrimary: true, order: 1 }
    ],
    description: 'Durable and highly functional cargo joggers with an elasticated waistband and utility pockets.',
    material: '98% Cotton, 2% Elastane',
    careInstructions: 'Machine wash cold, tumble dry low',
    features: ['Utility cargo pockets', 'Elasticated cuffs', 'Adjustable drawstring'],
    inStock: true,
    inventory: { '30': 12, '32': 15, '34': 10, '36': 8 },
    rating: 4.6,
    reviewCount: 56,
    tags: ['men', 'joggers', 'trousers', 'cargo', 'casual'],
    isFeatured: false,
    slug: 'urban-cargo-joggers',
  },
  {
    id: 'prod_041',
    sku: 'INS-WMN-VLTG-41',
    name: 'Velvet Evening Gown',
    brand: 'ElegantTouch',
    category: 'women',
    subcategory: 'Dresses',
    price: 4599,
    discountedPrice: 3899,
    discountPercentage: 15,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Burgundy', hex: '#800020', images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop'] }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop', alt: 'Velvet Evening Gown', isPrimary: true, order: 1 }
    ],
    description: 'An elegant, body-skimming evening gown crafted from luxurious plush velvet with a side leg slit.',
    material: '95% Polyester, 5% Spandex',
    careInstructions: 'Dry clean only',
    features: ['Plush velvet fabric', 'Leg slit', 'Concealed back zip', 'Off-shoulder design'],
    inStock: true,
    inventory: { XS: 4, S: 8, M: 12, L: 6 },
    rating: 4.9,
    reviewCount: 38,
    tags: ['women', 'dress', 'gown', 'velvet', 'eveningwear'],
    isFeatured: true,
    slug: 'velvet-evening-gown',
  },
  {
    id: 'prod_042',
    sku: 'INS-WMN-OKNS-42',
    name: 'Oversized Knit Sweater',
    brand: 'TrendSetters',
    category: 'women',
    subcategory: 'Tops',
    price: 2499,
    discountedPrice: 1999,
    discountPercentage: 20,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Oatmeal', hex: '#EAE6DF', images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=800&fit=crop'] }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=800&fit=crop', alt: 'Oversized Knit Sweater', isPrimary: true, order: 1 }
    ],
    description: 'Chunky, warm knit sweater featuring a relaxed oversized silhouette and ribbed crew neckline.',
    material: '70% Acrylic, 30% Wool',
    careInstructions: 'Hand wash cold lay flat to dry',
    features: ['Chunky knit', 'Oversized fit', 'Ribbed cuffs and hem'],
    inStock: true,
    inventory: { S: 10, M: 14, L: 12, XL: 8 },
    rating: 4.7,
    reviewCount: 65,
    tags: ['women', 'sweater', 'knit', 'cozy', 'tops'],
    isFeatured: false,
    slug: 'oversized-knit-sweater',
  },
  {
    id: 'prod_043',
    sku: 'INS-KID-HWJK-43',
    name: 'Kids Hooded Windbreaker',
    brand: 'Urban Basics',
    category: 'kids',
    subcategory: 'Jackets',
    price: 1799,
    discountedPrice: 1399,
    discountPercentage: 22,
    sizes: ['4-5Y', '6-7Y', '8-9Y', '10-11Y'],
    colors: [
      { name: 'Yellow', hex: '#FFD700', images: ['https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=600&h=800&fit=crop'] }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=600&h=800&fit=crop', alt: 'Kids Windbreaker', isPrimary: true, order: 1 }
    ],
    description: 'Lightweight water-resistant windbreaker jacket featuring a cozy mesh hood and dynamic colorblocking.',
    material: '100% Polyester',
    careInstructions: 'Machine wash cold delicate',
    features: ['Water-resistant', 'Mesh hood lining', 'Zippered pockets'],
    inStock: true,
    inventory: { '4-5Y': 8, '6-7Y': 12, '8-9Y': 10, '10-11Y': 6 },
    rating: 4.5,
    reviewCount: 19,
    tags: ['kids', 'jacket', 'windbreaker', 'outdoor'],
    isFeatured: true,
    slug: 'kids-hooded-windbreaker',
  },
  {
    id: 'prod_044',
    sku: 'INS-KID-CBPD-44',
    name: 'Chambray Play Dress',
    brand: 'ElegantTouch',
    category: 'kids',
    subcategory: 'Dresses',
    price: 1499,
    discountedPrice: 1199,
    discountPercentage: 20,
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    colors: [
      { name: 'Light Blue', hex: '#ADD8E6', images: ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=800&fit=crop'] }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=800&fit=crop', alt: 'Chambray Play Dress', isPrimary: true, order: 1 }
    ],
    description: 'Lovely soft cotton chambray dress with a tiered skirt and cute embroidered shoulder details.',
    material: '100% Cotton Chambray',
    careInstructions: 'Machine wash warm with similar colors',
    features: ['Tiered silhouette', 'Embroidered accents', 'Button back closure'],
    inStock: true,
    inventory: { '2-3Y': 6, '4-5Y': 10, '6-7Y': 8, '8-9Y': 5 },
    rating: 4.8,
    reviewCount: 22,
    tags: ['kids', 'dress', 'chambray', 'cotton', 'casual'],
    isFeatured: false,
    slug: 'chambray-play-dress',
  },
  {
    id: 'prod_045',
    sku: 'INS-ACC-MLCH-45',
    name: 'Minimalist Leather Cardholder',
    brand: 'StyleHub',
    category: 'accessories',
    subcategory: 'Wallets',
    price: 999,
    discountedPrice: 799,
    discountPercentage: 20,
    sizes: ['One Size'],
    colors: [
      { name: 'Tan', hex: '#D2B48C', images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop'] }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop', alt: 'Leather Cardholder', isPrimary: true, order: 1 }
    ],
    description: 'Ultra-slim genuine leather cardholder with multiple card slots and a central slip compartment.',
    material: 'Genuine Cowhide Leather',
    careInstructions: 'Wipe clean with a dry cloth',
    features: ['Slim design', '4 card slots', 'Central cash pocket'],
    inStock: true,
    inventory: { 'One Size': 25 },
    rating: 4.6,
    reviewCount: 34,
    tags: ['accessories', 'cardholder', 'wallet', 'leather', 'minimalist'],
    isFeatured: true,
    slug: 'minimalist-leather-cardholder',
  },
  {
    id: 'prod_046',
    sku: 'INS-ACC-RTSG-46',
    name: 'Retro Acetate Sunglasses',
    brand: 'TrendSetters',
    category: 'accessories',
    subcategory: 'Sunglasses',
    price: 1599,
    discountedPrice: 1299,
    discountPercentage: 19,
    sizes: ['One Size'],
    colors: [
      { name: 'Tortoiseshell', hex: '#3B2712', images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=800&fit=crop'] }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=800&fit=crop', alt: 'Retro Sunglasses', isPrimary: true, order: 1 }
    ],
    description: 'Bold tortoiseshell frame sunglasses made from thick acetate with protective polarized dark lenses.',
    material: 'Acetate frame, TAC polarized lenses',
    careInstructions: 'Clean with protective pouch/cloth',
    features: ['100% UV Protection', 'Polarized lenses', 'Sturdy hinges'],
    inStock: true,
    inventory: { 'One Size': 20 },
    rating: 4.7,
    reviewCount: 41,
    tags: ['accessories', 'sunglasses', 'retro', 'polarized'],
    isFeatured: false,
    slug: 'retro-acetate-sunglasses',
  },
  {
    id: 'prod_013',
    sku: 'INS-MEN-VSJK-13',
    name: 'Vintage Suede Jacket',
    brand: 'PremiumLine',
    category: 'men',
    subcategory: 'Jackets',
    price: 3999,
    discountedPrice: 3199,
    discountPercentage: 20,
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Brown', hex: '#8B4513', images: ['https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&h=800&fit=crop'] }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&h=800&fit=crop', alt: 'Suede Jacket', isPrimary: true, order: 1 }
    ],
    description: 'Superb quality vintage suede bomber jacket with front zipper closure and side pockets. Extremely soft lining.',
    material: 'Suede Leather',
    careInstructions: 'Dry clean only',
    features: ['YKK Zipper', 'Ribbed collar', 'Inner pocket'],
    inStock: true,
    inventory: { M: 5, L: 8, XL: 4 },
    rating: 4.8,
    reviewCount: 54,
    tags: ['jacket', 'vintage', 'premium', 'suede'],
    isFeatured: true,
    slug: 'vintage-suede-jacket',
  },
  {
    id: 'prod_014',
    sku: 'INS-WMN-PSMD-14',
    name: 'Pleated Satin Midi Dress',
    brand: 'ElegantTouch',
    category: 'women',
    subcategory: 'Dresses',
    price: 3499,
    discountedPrice: 2799,
    discountPercentage: 20,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Emerald', hex: '#0F52BA', images: ['https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=800&fit=crop'] }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=800&fit=crop', alt: 'Pleated Satin Dress', isPrimary: true, order: 1 }
    ],
    description: 'Elegant pleated midi dress made from premium satin. Perfect for evening parties and special events.',
    material: '100% Satin Polyester',
    careInstructions: 'Hand wash cold',
    features: ['Pleated skirt', 'V-neck', 'Adjustable waist tie'],
    inStock: true,
    inventory: { S: 10, M: 12, L: 8, XL: 6 },
    rating: 4.7,
    reviewCount: 82,
    tags: ['dress', 'satin', 'pleated', 'elegant'],
    isFeatured: true,
    slug: 'pleated-satin-midi-dress',
  },
  {
    id: 'prod_015',
    sku: 'INS-KID-HDDJ-15',
    name: 'Kids Hooded Denim Jacket',
    brand: 'TrendSetters',
    category: 'kids',
    subcategory: 'Jackets',
    price: 1499,
    discountedPrice: 1199,
    discountPercentage: 20,
    sizes: ['4-5Y', '6-7Y', '8-9Y', '10-11Y'],
    colors: [
      { name: 'Denim Blue', hex: '#4682B4', images: ['https://images.unsplash.com/photo-1604917621956-10dfa7cce2e7?w=600&h=800&fit=crop'] }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1604917621956-10dfa7cce2e7?w=600&h=800&fit=crop', alt: 'Denim Jacket', isPrimary: true, order: 1 }
    ],
    description: 'Comfortable kids denim jacket with a soft grey cotton hood. Durable button closures and classic chest pockets.',
    material: '90% Cotton, 10% Polyester',
    careInstructions: 'Machine wash cold',
    features: ['Detachable hood', 'Metal buttons', 'Soft fleece sleeves'],
    inStock: true,
    inventory: { '4-5Y': 10, '6-7Y': 12, '8-9Y': 10, '10-11Y': 8 },
    rating: 4.6,
    reviewCount: 41,
    tags: ['kids', 'jacket', 'denim', 'hooded'],
    isFeatured: true,
    slug: 'kids-hooded-denim-jacket',
  },
  {
    id: 'prod_016',
    sku: 'INS-ACC-AVSG-16',
    name: 'Urban Aviator Sunglasses',
    brand: 'StyleHub',
    category: 'accessories',
    subcategory: 'Sunglasses',
    price: 1899,
    discountedPrice: 1499,
    discountPercentage: 21,
    sizes: ['One Size'],
    colors: [
      { name: 'Black Frame', hex: '#000000', images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=800&fit=crop'] }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=800&fit=crop', alt: 'Aviator Sunglasses', isPrimary: true, order: 1 }
    ],
    description: 'Classic black-framed aviators offering full UV protection. Sleek metallic temples and comfortable nose pads.',
    material: 'Metal alloy frame',
    careInstructions: 'Wipe with soft cloth',
    features: ['UV400 Protection', 'Polarized lenses', 'Shatterproof'],
    inStock: true,
    inventory: { 'One Size': 25 },
    rating: 4.8,
    reviewCount: 63,
    tags: ['accessories', 'sunglasses', 'aviator', 'polarized'],
    isFeatured: true,
    slug: 'urban-aviator-sunglasses',
  },
  {
    id: 'prod_017',
    sku: 'INS-WMN-CPJK-17',
    name: 'Women\'s Cropped Puffer Jacket',
    brand: 'ModernFit',
    category: 'women',
    subcategory: 'Jackets',
    price: 4599,
    discountedPrice: 3699,
    discountPercentage: 19,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Cream', hex: '#FFFDD0', images: ['https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop'] }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop', alt: 'Cropped Puffer Jacket', isPrimary: true, order: 1 }
    ],
    description: 'Stylish cropped puffer jacket for winter. Filled with high-density thermal insulation to keep you warm and cozy.',
    material: '100% Nylon Shell, Polyester Fill',
    careInstructions: 'Machine wash cold delicate',
    features: ['Stand collar', 'Drawcord hem', 'Zippered hand pockets'],
    inStock: true,
    inventory: { XS: 6, S: 10, M: 12, L: 8 },
    rating: 4.9,
    reviewCount: 75,
    tags: ['jacket', 'puffer', 'cropped', 'winter'],
    isFeatured: true,
    slug: 'womens-cropped-puffer-jacket',
  },
  {
    id: 'prod_018',
    name: 'Tailored Chino Trousers',
    brand: 'ClassicWear',
    category: 'men',
    subcategory: 'Trousers',
    price: 2599,
    discountedPrice: 1999,
    discountPercentage: 23,
    sizes: ['30', '32', '34', '36'],
    colors: [
      { name: 'Beige', hex: '#F5F5DC', images: ['https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=600&h=800&fit=crop'] }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=600&h=800&fit=crop', alt: 'Chino Trousers', isPrimary: true, order: 1 }
    ],
    description: 'Smart tailored chino trousers crafted from premium stretch-cotton twill. Perfect for both office and casual wear.',
    material: '98% Cotton, 2% Elastane',
    careInstructions: 'Machine wash warm',
    features: ['Stretch fabric', 'Button zip closure', 'Slant side pockets'],
    inStock: true,
    inventory: { '30': 10, '32': 14, '34': 12, '36': 8 },
    rating: 4.7,
    reviewCount: 94,
    tags: ['trousers', 'chinos', 'men', 'formal', 'office'],
    isFeatured: true,
    slug: 'tailored-chino-trousers',
  },
  {
    id: 'prod_019',
    name: 'Knit Halter Crop Top',
    brand: 'TrendSetters',
    category: 'women',
    subcategory: 'Tops',
    price: 1199,
    discountedPrice: 899,
    discountPercentage: 25,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Rust', hex: '#B7410E', images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop'] }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop', alt: 'Halter Top', isPrimary: true, order: 1 }
    ],
    description: 'Chic ribbed knit halter top featuring a mock neck and cross-back straps. Lightweight and breathable.',
    material: '80% Rayon, 20% Nylon',
    careInstructions: 'Hand wash cold lay flat',
    features: ['Halter neck', 'Ribbed texture', 'Stretchy fit'],
    inStock: true,
    inventory: { XS: 8, S: 12, M: 15, L: 9 },
    rating: 4.5,
    reviewCount: 52,
    tags: ['top', 'halter', 'knit', 'summer', 'women'],
    isFeatured: true,
    slug: 'knit-halter-crop-top',
  },
  // Thrift Marketplace Products
  {
    id: 't1',
    name: 'Vintage Leather Moto Jacket',
    brand: 'Saint Laurent',
    category: 'Outerwear',
    subcategory: 'Jackets',
    price: 45000,
    originalPrice: 120000,
    discountedPrice: 45000,
    sizes: ['M'],
    colors: [{ name: 'Black', hex: '#000000', images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80'] }],
    images: [{ url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80', alt: 'Moto Jacket', isPrimary: true, order: 1 }],
    description: 'Pre-owned vintage leather moto jacket. Condition: Excellent.',
    material: 'Leather',
    inStock: true,
    inventory: { M: 1 },
    rating: 5.0,
    reviewCount: 0,
    tags: ['thrift', 'vintage', 'leather', 'jacket'],
    isFeatured: false,
    slug: 'vintage-leather-moto-jacket',
  },
  {
    id: 't2',
    name: 'Classic Monogram Crossbody',
    brand: 'Gucci',
    category: 'Accessories',
    subcategory: 'Bags',
    price: 32000,
    originalPrice: 85000,
    discountedPrice: 32000,
    sizes: ['One Size'],
    colors: [{ name: 'Brown', hex: '#654321', images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80'] }],
    images: [{ url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80', alt: 'Gucci Bag', isPrimary: true, order: 1 }],
    description: 'Pre-owned Classic Monogram Crossbody. Condition: Good.',
    material: 'Canvas/Leather',
    inStock: true,
    inventory: { 'One Size': 1 },
    rating: 4.5,
    reviewCount: 2,
    tags: ['thrift', 'vintage', 'bag', 'gucci'],
    isFeatured: false,
    slug: 'classic-monogram-crossbody',
  },
  {
    id: 't3',
    name: 'Distressed Denim Jacket',
    brand: 'Levi\'s Vintage',
    category: 'Outerwear',
    subcategory: 'Jackets',
    price: 4500,
    originalPrice: 9000,
    discountedPrice: 4500,
    sizes: ['L'],
    colors: [{ name: 'Blue', hex: '#0000FF', images: ['https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&q=80'] }],
    images: [{ url: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&q=80', alt: 'Denim Jacket', isPrimary: true, order: 1 }],
    description: 'Pre-owned distressed denim jacket. Condition: Like New.',
    material: 'Denim',
    inStock: true,
    inventory: { L: 1 },
    rating: 4.8,
    reviewCount: 1,
    tags: ['thrift', 'vintage', 'denim', 'jacket'],
    isFeatured: false,
    slug: 'distressed-denim-jacket',
  },
  {
    id: 't4',
    name: 'Oversized Wool Blazer',
    brand: 'Balenciaga',
    category: 'Outerwear',
    subcategory: 'Jackets',
    price: 28000,
    originalPrice: 95000,
    discountedPrice: 28000,
    sizes: ['S'],
    colors: [{ name: 'Grey', hex: '#808080', images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80'] }],
    images: [{ url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80', alt: 'Wool Blazer', isPrimary: true, order: 1 }],
    description: 'Pre-owned oversized wool blazer. Condition: Excellent.',
    material: 'Wool',
    inStock: true,
    inventory: { S: 1 },
    rating: 4.9,
    reviewCount: 4,
    tags: ['thrift', 'vintage', 'blazer', 'wool'],
    isFeatured: false,
    slug: 'oversized-wool-blazer',
  },
  {
    id: 't5',
    name: 'Silk Slip Dress',
    brand: 'Reformation',
    category: 'women',
    subcategory: 'Dresses',
    price: 8500,
    originalPrice: 22000,
    discountedPrice: 8500,
    sizes: ['XS'],
    colors: [{ name: 'Black', hex: '#000000', images: ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80'] }],
    images: [{ url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80', alt: 'Slip Dress', isPrimary: true, order: 1 }],
    description: 'Pre-owned silk slip dress. Condition: Good.',
    material: 'Silk',
    inStock: true,
    inventory: { XS: 1 },
    rating: 4.6,
    reviewCount: 3,
    tags: ['thrift', 'vintage', 'dress', 'silk'],
    isFeatured: false,
    slug: 'silk-slip-dress',
  },
  {
    id: 't6',
    name: 'Chunky Knit Sweater',
    brand: 'Acne Studios',
    category: 'women',
    subcategory: 'Tops',
    price: 12000,
    originalPrice: 35000,
    discountedPrice: 12000,
    sizes: ['M'],
    colors: [{ name: 'Cream', hex: '#FFFDD0', images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80'] }],
    images: [{ url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80', alt: 'Knit Sweater', isPrimary: true, order: 1 }],
    description: 'Pre-owned chunky knit sweater. Condition: Fair.',
    material: 'Wool Blend',
    inStock: true,
    inventory: { M: 1 },
    rating: 4.2,
    reviewCount: 5,
    tags: ['thrift', 'vintage', 'sweater', 'knit'],
    isFeatured: false,
    slug: 'chunky-knit-sweater',
  },
  // ── New Premium Items ──
  {
    id: 'prod_020',
    name: 'Oversized Linen Blazer',
    brand: 'Aura Atelier',
    category: 'women',
    subcategory: 'Jackets',
    price: 4999,
    discountedPrice: 3799,
    discountPercentage: 24,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Ivory', hex: '#FFFFF0', images: ['https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&h=800&fit=crop'] },
      { name: 'Sage', hex: '#B2C0A8', images: ['https://images.unsplash.com/photo-1548549557-dbe9946621da?w=600&h=800&fit=crop'] },
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&h=800&fit=crop', alt: 'Linen Blazer', isPrimary: true, order: 1 },
      { url: 'https://images.unsplash.com/photo-1548549557-dbe9946621da?w=600&h=800&fit=crop', alt: 'Sage variant', isPrimary: false, order: 2 },
    ],
    description: 'Effortlessly chic oversized linen blazer for a relaxed yet polished look. Perfect over a slip dress or tailored trousers.',
    material: '100% Linen',
    careInstructions: 'Dry clean recommended, cool iron',
    features: ['Relaxed fit', 'Single button', 'Patch pockets', 'Breathable linen'],
    inStock: true,
    inventory: { XS: 6, S: 10, M: 12, L: 8, XL: 4 },
    rating: 4.8,
    reviewCount: 93,
    tags: ['blazer', 'linen', 'women', 'workwear', 'chic'],
    isFeatured: true,
    slug: 'oversized-linen-blazer',
  },
  {
    id: 'prod_021',
    name: 'Relaxed Fit Cargo Trousers',
    brand: 'ModernFit',
    category: 'men',
    subcategory: 'Trousers',
    price: 2299,
    discountedPrice: 1799,
    discountPercentage: 22,
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'Olive', hex: '#556B2F', images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop'] },
      { name: 'Khaki', hex: '#C3B091', images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop'] },
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop', alt: 'Cargo Trousers Olive', isPrimary: true, order: 1 },
      { url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop', alt: 'Cargo Trousers Khaki', isPrimary: false, order: 2 },
    ],
    description: 'Relaxed fit cargo trousers with functional pockets. Made from a durable cotton-twill blend for all-day comfort.',
    material: '98% Cotton, 2% Elastane',
    careInstructions: 'Machine wash cold, tumble dry low',
    features: ['Multiple pockets', 'Drawstring waist', 'Tapered leg', 'Durable twill'],
    inStock: true,
    inventory: { '28': 7, '30': 12, '32': 16, '34': 10, '36': 5 },
    rating: 4.6,
    reviewCount: 112,
    tags: ['cargo', 'trousers', 'men', 'casual', 'utility'],
    isFeatured: false,
    slug: 'relaxed-fit-cargo-trousers',
  },
  {
    id: 'prod_022',
    name: 'Satin Wrap Midi Dress',
    brand: 'ElegantTouch',
    category: 'women',
    subcategory: 'Dresses',
    price: 3899,
    discountedPrice: 2999,
    discountPercentage: 23,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Midnight Blue', hex: '#191970', images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop'] },
      { name: 'Blush', hex: '#FFAEB9', images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop'] },
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop', alt: 'Satin Wrap Dress', isPrimary: true, order: 1 },
      { url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop', alt: 'Blush variant', isPrimary: false, order: 2 },
    ],
    description: 'Luxurious satin wrap midi dress with a flattering V-neckline and adjustable tie waist. Day-to-evening versatility at its finest.',
    material: '100% Satin Polyester',
    careInstructions: 'Hand wash cold, hang dry',
    features: ['Wrap silhouette', 'Midi length', 'V-neckline', 'Tie waist'],
    inStock: true,
    inventory: { XS: 5, S: 10, M: 12, L: 7 },
    rating: 4.9,
    reviewCount: 187,
    tags: ['dress', 'satin', 'midi', 'elegant', 'party'],
    isFeatured: true,
    slug: 'satin-wrap-midi-dress',
  },
  {
    id: 'prod_023',
    name: 'Structured Tote Bag',
    brand: 'StyleHub',
    category: 'accessories',
    subcategory: 'Bags',
    price: 3499,
    discountedPrice: 2799,
    discountPercentage: 20,
    sizes: ['One Size'],
    colors: [
      { name: 'Camel', hex: '#C19A6B', images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop'] },
      { name: 'Black', hex: '#000000', images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=800&fit=crop'] },
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop', alt: 'Structured Tote Camel', isPrimary: true, order: 1 },
      { url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=800&fit=crop', alt: 'Black Tote', isPrimary: false, order: 2 },
    ],
    description: 'A structured tote bag crafted from premium vegan leather. Spacious interior with an interior zipper pocket and magnetic closure.',
    material: 'Premium Vegan Leather',
    careInstructions: 'Wipe with damp cloth',
    features: ['Magnetic closure', 'Interior pocket', 'Shoulder straps', 'Spacious interior'],
    inStock: true,
    inventory: { 'One Size': 25 },
    rating: 4.7,
    reviewCount: 204,
    tags: ['tote', 'bag', 'accessories', 'work', 'leather'],
    isFeatured: true,
    slug: 'structured-tote-bag',
  },
  {
    id: 'prod_024',
    name: 'Ribbed Knit Cardigan',
    brand: 'TrendSetters',
    category: 'women',
    subcategory: 'Tops',
    price: 2199,
    discountedPrice: 1699,
    discountPercentage: 23,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Caramel', hex: '#C68642', images: ['https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=600&h=800&fit=crop'] },
      { name: 'Grey', hex: '#808080', images: ['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop'] },
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=600&h=800&fit=crop', alt: 'Ribbed Cardigan', isPrimary: true, order: 1 },
    ],
    description: 'Cozy ribbed knit cardigan with a relaxed open-front silhouette. Layer over everything from dresses to jeans.',
    material: '70% Acrylic, 30% Wool',
    careInstructions: 'Hand wash cold, lay flat to dry',
    features: ['Open front', 'Ribbed texture', 'Drop shoulders', 'Side pockets'],
    inStock: true,
    inventory: { XS: 8, S: 14, M: 16, L: 10, XL: 6 },
    rating: 4.7,
    reviewCount: 145,
    tags: ['cardigan', 'knit', 'women', 'cozy', 'layering'],
    isFeatured: false,
    slug: 'ribbed-knit-cardigan',
  },
  {
    id: 'prod_025',
    name: 'Oxford Button-Down Shirt',
    brand: 'ClassicWear',
    category: 'men',
    subcategory: 'Shirts',
    price: 2099,
    discountedPrice: 1599,
    discountPercentage: 24,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Blue Stripe', hex: '#5B8DB8', images: ['https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&h=800&fit=crop'] },
      { name: 'White', hex: '#FFFFFF', images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop'] },
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&h=800&fit=crop', alt: 'Oxford Shirt', isPrimary: true, order: 1 },
    ],
    description: 'A wardrobe essential. Classic Oxford weave button-down shirt that goes from smart-casual to formal with ease.',
    material: '100% Oxford Cotton',
    careInstructions: 'Machine wash cold, iron on medium heat',
    features: ['Button-down collar', 'Chest pocket', 'Regular fit', 'Oxford weave'],
    inStock: true,
    inventory: { S: 9, M: 14, L: 18, XL: 11, XXL: 6 },
    rating: 4.8,
    reviewCount: 221,
    tags: ['shirt', 'oxford', 'men', 'formal', 'classic'],
    isFeatured: true,
    slug: 'oxford-button-down-shirt',
  },
  {
    id: 'prod_026',
    name: 'Wide-Leg Palazzo Trousers',
    brand: 'ElegantTouch',
    category: 'women',
    subcategory: 'Trousers',
    price: 2799,
    discountedPrice: 2199,
    discountPercentage: 21,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Black', hex: '#000000', images: ['https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=600&h=800&fit=crop'] },
      { name: 'Champagne', hex: '#F7E7CE', images: ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=800&fit=crop'] },
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=600&h=800&fit=crop', alt: 'Palazzo Trousers', isPrimary: true, order: 1 },
    ],
    description: 'Flowing wide-leg palazzo trousers with an elasticated waistband. Wear with a fitted top or cropped blazer for a sophisticated look.',
    material: '100% Georgette',
    careInstructions: 'Hand wash cold, hang dry',
    features: ['Wide leg', 'Elastic waist', 'Flowing fabric', 'Full length'],
    inStock: true,
    inventory: { XS: 7, S: 11, M: 14, L: 9, XL: 5 },
    rating: 4.6,
    reviewCount: 99,
    tags: ['trousers', 'palazzo', 'women', 'elegant', 'wide-leg'],
    isFeatured: false,
    slug: 'wide-leg-palazzo-trousers',
  },
  {
    id: 'prod_027',
    name: 'Premium Hoodie',
    brand: 'Urban Basics',
    category: 'men',
    subcategory: 'T-Shirts',
    price: 2499,
    discountedPrice: 1899,
    discountPercentage: 24,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Charcoal', hex: '#36454F', images: ['https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=600&h=800&fit=crop'] },
      { name: 'Navy', hex: '#001F3F', images: ['https://images.unsplash.com/photo-1542574271-7f3b92e6c821?w=600&h=800&fit=crop'] },
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=600&h=800&fit=crop', alt: 'Premium Hoodie', isPrimary: true, order: 1 },
    ],
    description: 'Ultra-soft premium cotton-fleece hoodie with a relaxed fit. Features a kangaroo pocket and adjustable drawstring hood.',
    material: '80% Cotton, 20% Polyester Fleece',
    careInstructions: 'Machine wash cold, tumble dry low',
    features: ['Kangaroo pocket', 'Adjustable drawstring', 'Soft fleece inner', 'Ribbed cuffs'],
    inStock: true,
    inventory: { S: 10, M: 16, L: 18, XL: 14, XXL: 7 },
    rating: 4.9,
    reviewCount: 312,
    tags: ['hoodie', 'casual', 'men', 'comfort', 'streetwear'],
    isFeatured: true,
    slug: 'premium-hoodie',
  },
  {
    id: 'prod_028',
    name: 'Silk Camisole Top',
    brand: 'Aura Atelier',
    category: 'women',
    subcategory: 'Tops',
    price: 1899,
    discountedPrice: 1499,
    discountPercentage: 21,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Champagne', hex: '#F7E7CE', images: ['https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&h=800&fit=crop'] },
      { name: 'Black', hex: '#000000', images: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&h=800&fit=crop'] },
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&h=800&fit=crop', alt: 'Silk Camisole', isPrimary: true, order: 1 },
    ],
    description: 'Delicate silk camisole top with adjustable spaghetti straps and a lace-trimmed hem. Wear alone or layer under a blazer.',
    material: '100% Mulberry Silk',
    careInstructions: 'Hand wash cold only',
    features: ['Lace trim', 'Adjustable straps', 'Satin finish', 'Layerable'],
    inStock: true,
    inventory: { XS: 9, S: 13, M: 11, L: 7 },
    rating: 4.8,
    reviewCount: 168,
    tags: ['camisole', 'silk', 'women', 'luxury', 'top'],
    isFeatured: false,
    slug: 'silk-camisole-top',
  },
  {
    id: 'prod_029',
    name: 'Chunky Platform Sneakers',
    brand: 'TrendSetters',
    category: 'accessories',
    subcategory: 'Shoes',
    price: 5499,
    discountedPrice: 4299,
    discountPercentage: 22,
    sizes: ['36', '37', '38', '39', '40', '41'],
    colors: [
      { name: 'White', hex: '#FFFFFF', images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop'] },
      { name: 'Black', hex: '#000000', images: ['https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=800&fit=crop'] },
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop', alt: 'Platform Sneakers White', isPrimary: true, order: 1 },
      { url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=800&fit=crop', alt: 'Platform Sneakers Black', isPrimary: false, order: 2 },
    ],
    description: 'Statement chunky platform sneakers that elevate any look. Cushioned footbed for all-day comfort.',
    material: 'Vegan leather upper, rubber platform sole',
    careInstructions: 'Wipe with damp cloth',
    features: ['Chunky platform', 'Lace-up closure', 'Cushioned insole', 'Non-slip sole'],
    inStock: true,
    inventory: { '36': 6, '37': 10, '38': 14, '39': 12, '40': 8, '41': 5 },
    rating: 4.7,
    reviewCount: 253,
    tags: ['shoes', 'sneakers', 'platform', 'accessories', 'streetwear'],
    isFeatured: true,
    slug: 'chunky-platform-sneakers',
  },
  {
    id: 'prod_030',
    name: 'Denim Corset Top',
    brand: 'StyleHub',
    category: 'women',
    subcategory: 'Tops',
    price: 1799,
    discountedPrice: 1399,
    discountPercentage: 22,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Vintage Blue', hex: '#5B7FA6', images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop'] },
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop', alt: 'Denim Corset Top', isPrimary: true, order: 1 },
    ],
    description: 'A trendy denim corset top with boning details and back lace-up. The perfect blend of structure and denim heritage.',
    material: '100% Denim Cotton',
    careInstructions: 'Machine wash cold, hang dry',
    features: ['Boning structure', 'Back lace-up', 'Square neckline', 'Boned bodice'],
    inStock: true,
    inventory: { XS: 8, S: 12, M: 10, L: 6 },
    rating: 4.5,
    reviewCount: 121,
    tags: ['corset', 'denim', 'women', 'trendy', 'top'],
    isFeatured: false,
    slug: 'denim-corset-top',
  },
  {
    id: 'prod_031',
    name: 'Premium Linen Summer Shirt',
    brand: 'Urban Basics',
    category: 'men',
    subcategory: 'Shirts',
    price: 1899,
    discountedPrice: 1499,
    discountPercentage: 21,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Sky Blue', hex: '#87CEEB', images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop'] }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop', alt: 'Linen Shirt', isPrimary: true, order: 1 }
    ],
    description: 'Lightweight and breathable premium linen shirt, perfect for warm summer days.',
    material: '100% Linen',
    careInstructions: 'Machine wash cold, line dry',
    features: ['Breathable', 'Classic collar', 'Button-up cuffs'],
    inStock: true,
    inventory: { S: 12, M: 18, L: 15, XL: 10 },
    rating: 4.6,
    reviewCount: 78,
    tags: ['men', 'shirt', 'linen', 'summer', 'casual'],
    isFeatured: true,
    slug: 'premium-linen-summer-shirt',
  },
  {
    id: 'prod_032',
    name: 'Tailored Wool Blend Blazer',
    brand: 'PremiumLine',
    category: 'men',
    subcategory: 'Jackets',
    price: 6499,
    discountedPrice: 4999,
    discountPercentage: 23,
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Navy', hex: '#001F3F', images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=800&fit=crop'] }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=800&fit=crop', alt: 'Tailored Blazer', isPrimary: true, order: 1 }
    ],
    description: 'Sharp, tailored blazer in a premium wool blend. Ideal for formal and smart-casual occasions.',
    material: '70% Wool, 30% Polyester',
    careInstructions: 'Dry clean only',
    features: ['Classic fit', 'Notched lapels', 'Two-button closure'],
    inStock: true,
    inventory: { M: 8, L: 12, XL: 6 },
    rating: 4.8,
    reviewCount: 92,
    tags: ['men', 'jacket', 'blazer', 'formal', 'wool'],
    isFeatured: true,
    slug: 'tailored-wool-blend-blazer',
  },
  {
    id: 'prod_033',
    name: 'Bohemian Floral Maxi Dress',
    brand: 'ElegantTouch',
    category: 'women',
    subcategory: 'Dresses',
    price: 3299,
    discountedPrice: 2499,
    discountPercentage: 24,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Floral Red', hex: '#FF4D4D', images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop'] }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop', alt: 'Maxi Dress', isPrimary: true, order: 1 }
    ],
    description: 'Beautiful, flowing bohemian maxi dress with a vibrant floral print and relaxed silhouette.',
    material: '100% Rayon',
    careInstructions: 'Hand wash cold, hang dry',
    features: ['Flowing fit', 'Adjustable waist tie', 'V-neckline'],
    inStock: true,
    inventory: { XS: 5, S: 10, M: 12, L: 8 },
    rating: 4.7,
    reviewCount: 110,
    tags: ['women', 'dress', 'maxi', 'floral', 'bohemian'],
    isFeatured: true,
    slug: 'bohemian-floral-maxi-dress',
  },
  {
    id: 'prod_034',
    name: 'Classic Double-Breasted Trench Coat',
    brand: 'ClassicWear',
    category: 'women',
    subcategory: 'Jackets',
    price: 4999,
    discountedPrice: 3999,
    discountPercentage: 20,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Beige', hex: '#D2B48C', images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop'] }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop', alt: 'Trench Coat', isPrimary: true, order: 1 }
    ],
    description: 'Timeless double-breasted trench coat with waist belt. A premium outerwear staple for any wardrobe.',
    material: '100% Cotton Gabardine',
    careInstructions: 'Dry clean only',
    features: ['Double-breasted', 'Removable belt', 'Water-resistant'],
    inStock: true,
    inventory: { S: 6, M: 10, L: 12, XL: 7 },
    rating: 4.9,
    reviewCount: 143,
    tags: ['women', 'jacket', 'trench-coat', 'classic', 'outerwear'],
    isFeatured: true,
    slug: 'classic-double-breasted-trench-coat',
  },
  {
    id: 'prod_035',
    name: 'Organic Cotton Kids Dungarees',
    brand: 'Urban Basics',
    category: 'kids',
    subcategory: 'Jeans',
    price: 1599,
    discountedPrice: 1199,
    discountPercentage: 25,
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    colors: [
      { name: 'Denim', hex: '#4B6584', images: ['https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&h=800&fit=crop'] }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&h=800&fit=crop', alt: 'Kids Dungarees', isPrimary: true, order: 1 }
    ],
    description: 'Adorable dungarees crafted from soft, organic cotton denim. Features adjustable straps and multiple pockets.',
    material: '100% Organic Cotton',
    careInstructions: 'Machine wash warm',
    features: ['Adjustable straps', 'Organic material', 'Chest pocket'],
    inStock: true,
    inventory: { '2-3Y': 8, '4-5Y': 12, '6-7Y': 10, '8-9Y': 7 },
    rating: 4.8,
    reviewCount: 36,
    tags: ['kids', 'dungarees', 'organic', 'denim', 'casual'],
    isFeatured: true,
    slug: 'organic-cotton-kids-dungarees',
  },
  {
    id: 'prod_036',
    name: 'Cozy Teddy Fleece Jacket',
    brand: 'TrendSetters',
    category: 'kids',
    subcategory: 'Jackets',
    price: 1899,
    discountedPrice: 1399,
    discountPercentage: 26,
    sizes: ['4-5Y', '6-7Y', '8-9Y', '10-11Y'],
    colors: [
      { name: 'Cream', hex: '#FDF0ED', images: ['https://images.unsplash.com/photo-1540479859555-17af45c78602?w=600&h=800&fit=crop'] }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1540479859555-17af45c78602?w=600&h=800&fit=crop', alt: 'Teddy Fleece', isPrimary: true, order: 1 }
    ],
    description: 'Ultra-warm and cozy teddy fleece jacket for kids. Perfect for chilly days.',
    material: '100% Polyester Fleece',
    careInstructions: 'Machine wash cold delicate',
    features: ['Soft texture', 'Side pockets', 'Full zipper'],
    inStock: true,
    inventory: { '4-5Y': 10, '6-7Y': 15, '8-9Y': 12, '10-11Y': 8 },
    rating: 4.7,
    reviewCount: 48,
    tags: ['kids', 'jacket', 'fleece', 'teddy', 'cozy'],
    isFeatured: true,
    slug: 'cozy-teddy-fleece-jacket',
  },
  {
    id: 'prod_037',
    name: 'Minimalist Leather Backpack',
    brand: 'StyleHub',
    category: 'accessories',
    subcategory: 'Bags',
    price: 3499,
    discountedPrice: 2799,
    discountPercentage: 20,
    sizes: ['One Size'],
    colors: [
      { name: 'Tan Brown', hex: '#B27A50', images: ['https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=600&h=800&fit=crop'] }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=600&h=800&fit=crop', alt: 'Leather Backpack', isPrimary: true, order: 1 }
    ],
    description: 'Sleek, minimalist leather backpack featuring clean lines and a spacious laptop sleeve.',
    material: 'Genuine Cowhide Leather',
    careInstructions: 'Treat with leather conditioner',
    features: ['Laptop sleeve', 'Padded straps', 'Minimalist design'],
    inStock: true,
    inventory: { 'One Size': 15 },
    rating: 4.8,
    reviewCount: 89,
    tags: ['bag', 'backpack', 'accessories', 'leather', 'minimalist'],
    isFeatured: true,
    slug: 'minimalist-leather-backpack',
  },
  {
    id: 'prod_038',
    name: 'Handcrafted Chelsea Boots',
    brand: 'ModernFit',
    category: 'accessories',
    subcategory: 'Shoes',
    price: 4599,
    discountedPrice: 3599,
    discountPercentage: 21,
    sizes: ['38', '39', '40', '41', '42', '43'],
    colors: [
      { name: 'Suede Charcoal', hex: '#3C3C3C', images: ['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&h=800&fit=crop'] }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&h=800&fit=crop', alt: 'Chelsea Boots', isPrimary: true, order: 1 }
    ],
    description: 'Premium handcrafted Chelsea boots made from water-resistant suede leather with durable elastic side panels.',
    material: 'Suede leather upper, rubber sole',
    careInstructions: 'Use suede protector spray',
    features: ['Elastic side panels', 'Pull tab', 'Handcrafted'],
    inStock: true,
    inventory: { '38': 5, '39': 8, '40': 12, '41': 10, '42': 8, '43': 6 },
    rating: 4.7,
    reviewCount: 104,
    tags: ['shoes', 'boots', 'chelsea', 'accessories', 'leather'],
    isFeatured: true,
    slug: 'handcrafted-chelsea-boots',
  }
];

const normalizeCategoryId = (value) => {
  if (!value) return '';

  if (typeof value === 'string') {
    return value.trim().toLowerCase();
  }

  if (typeof value === 'object') {
    return normalizeCategoryId(value.id || value.slug || value.name);
  }

  return '';
};

const normalizeColorName = (value) => {
  if (!value) return '';

  if (typeof value === 'string') {
    return value.trim().toLowerCase();
  }

  if (typeof value === 'object') {
    return normalizeColorName(value.name || value.color || value.label);
  }

  return '';
};

const normalizeSizeValue = (value) => {
  if (value === undefined || value === null) return '';
  return String(value).trim();
};

export function getProductCategoryIds(product) {
  if (!product) return [];

  if (Array.isArray(product.categories) && product.categories.length > 0) {
    return [...new Set(product.categories.map(normalizeCategoryId).filter(Boolean))];
  }

  const categoryId = normalizeCategoryId(product.category);
  return categoryId ? [categoryId] : [];
}

export function getProductVariants(product) {
  if (!product) return [];

  if (Array.isArray(product.variants) && product.variants.length > 0) {
    return product.variants.map((variant) => ({
      ...variant,
      size: normalizeSizeValue(variant.size),
      color: normalizeColorName(variant.color || variant.colorName || variant.color_id || variant.colorId),
      stock: typeof variant.stock === 'number' ? variant.stock : Number(variant.stock || 0),
      price: variant.price !== undefined && variant.price !== null ? variant.price : (product.discountedPrice || product.price),
    }));
  }

  const sizes = Array.isArray(product.sizes) && product.sizes.length > 0
    ? product.sizes
    : Object.keys(product.inventory || {});
  const colors = Array.isArray(product.colors) && product.colors.length > 0
    ? product.colors
    : [null];

  return sizes.flatMap((size) => {
    return colors.map((color) => ({
      size: normalizeSizeValue(size),
      color: normalizeColorName(color),
      stock: product.inventory?.[size] || 0,
      price: product.discountedPrice || product.price,
      image: color?.images?.[0] || product.images?.[0]?.url || '',
    }));
  });
}

// Helper functions
export function getProductById(id) {
  return products.find(p => p.id === id);
}

export function getProductsByCategory(category) {
  return products.filter(p => p.category === category);
}

export function getProductsBySubcategory(category, subcategory) {
  return products.filter(p => p.category === category && p.subcategory === subcategory);
}

export function getFeaturedProducts() {
  return products.filter(p => p.isFeatured);
}

export function searchProducts(query) {
  const lowerQuery = query.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.brand.toLowerCase().includes(lowerQuery) ||
    p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export function filterProducts(filters) {
  let filtered = [...products];

  if (filters.category && filters.category.length > 0) {
    filtered = filtered.filter(p => filters.category.includes(p.category));
  }

  if (filters.subcategory && filters.subcategory.length > 0) {
    filtered = filtered.filter(p => filters.subcategory.includes(p.subcategory));
  }

  if (filters.brand && filters.brand.length > 0) {
    filtered = filtered.filter(p => filters.brand.includes(p.brand));
  }

  if (filters.size && filters.size.length > 0) {
    filtered = filtered.filter(p =>
      filters.size.some(size => p.sizes.includes(size))
    );
  }

  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    filtered = filtered.filter(p => {
      const price = p.discountedPrice || p.price;
      return price >= min && price <= max;
    });
  }

  return filtered;
}

export function sortProducts(products, sortBy) {
  const sorted = [...products];

  switch (sortBy) {
    case 'price-low-high':
      return sorted.sort((a, b) => {
        const priceA = a.discountedPrice || a.price;
        const priceB = b.discountedPrice || b.price;
        return priceA - priceB;
      });

    case 'price-high-low':
      return sorted.sort((a, b) => {
        const priceA = a.discountedPrice || a.price;
        const priceB = b.discountedPrice || b.price;
        return priceB - priceA;
      });

    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);

    case 'newest':
      return sorted.reverse();

    default:
      return sorted;
  }
}

products.forEach(p => {
  if (!p.sku) {
    const catCode = p.category ? p.category.substring(0, 3).toUpperCase() : 'GEN';
    const nameCode = p.name ? p.name.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase() : 'ITM';
    const idNum = p.id ? p.id.replace(/[^0-9]/g, '') : '00';
    const padNum = idNum ? idNum.padStart(2, '0') : '01';
    p.sku = `INS-${catCode}-${nameCode}-${padNum}`;
  }
});

// Hydrate custom products from localStorage dynamically on client side initialization
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('instastyle_custom_products');
    if (saved) {
      const custom = JSON.parse(saved);
      if (Array.isArray(custom)) {
        custom.forEach(cp => {
          if (!products.some(p => p.id === cp.id)) {
            products.push(cp);
          }
        });
      }
    }
  } catch (error) {
    console.error("Failed to hydrate custom products in mockData:", error);
  }
}


