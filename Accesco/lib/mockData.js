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
  // Men's T-Shirts
  {
    id: 'prod_001',
    name: 'Classic Cotton T-Shirt',
    brand: 'Urban Basics',
    category: 'men',
    subcategory: 'T-Shirts',
    price: 999,
    discountedPrice: 799,
    discountPercentage: 20,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { 
        name: 'Black', 
        hex: '#000000', 
        images: [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
          'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=800&fit=crop',
        ]
      },
      { 
        name: 'White', 
        hex: '#FFFFFF', 
        images: [
          'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&h=800&fit=crop',
          'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=800&fit=crop',
        ]
      },
      { 
        name: 'Navy', 
        hex: '#001F3F', 
        images: [
          'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&h=800&fit=crop',
          'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop',
        ]
      },
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop', alt: 'Front view', isPrimary: true, order: 1 },
      { url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=800&fit=crop', alt: 'Back view', isPrimary: false, order: 2 },
      { url: 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&h=800&fit=crop', alt: 'Side view', isPrimary: false, order: 3 },
      { url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=800&fit=crop', alt: 'Detail view', isPrimary: false, order: 4 },
    ],
    description: 'Premium quality cotton t-shirt with a comfortable fit. Perfect for everyday wear, this classic piece features a crew neck and short sleeves. Made from 100% breathable cotton for all-day comfort.',
    material: '100% Cotton',
    careInstructions: 'Machine wash cold, tumble dry low, do not bleach',
    features: ['Breathable fabric', 'Pre-shrunk', 'Tagless collar', 'Reinforced seams'],
    inStock: true,
    inventory: { S: 10, M: 15, L: 20, XL: 12, XXL: 5 },
    rating: 4.5,
    reviewCount: 128,
    tags: ['casual', 'everyday', 'basic', 'cotton'],
    isFeatured: true,
    slug: 'classic-cotton-t-shirt',
  },
  {
    id: 'prod_002',
    name: 'Slim Fit Denim Jeans',
    brand: 'ModernFit',
    category: 'men',
    subcategory: 'Jeans',
    price: 2499,
    discountedPrice: 1999,
    discountPercentage: 20,
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { 
        name: 'Dark Blue', 
        hex: '#1E3A5F', 
        images: [
          'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop',
          'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop',
        ]
      },
      { 
        name: 'Light Blue', 
        hex: '#6FA8DC', 
        images: [
          'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&h=800&fit=crop',
          'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&h=800&fit=crop',
        ]
      },
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop', alt: 'Front view', isPrimary: true, order: 1 },
      { url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop', alt: 'Back view', isPrimary: false, order: 2 },
      { url: 'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&h=800&fit=crop', alt: 'Side view', isPrimary: false, order: 3 },
    ],
    description: 'Modern slim fit jeans crafted from premium denim. Features a comfortable mid-rise waist and tapered leg for a contemporary look. Perfect for both casual and semi-formal occasions.',
    material: '98% Cotton, 2% Elastane',
    careInstructions: 'Machine wash cold, hang dry, iron on low heat',
    features: ['Stretch denim', 'Five-pocket design', 'Button fly', 'Belt loops'],
    inStock: true,
    inventory: { '28': 8, '30': 12, '32': 15, '34': 10, '36': 6 },
    rating: 4.7,
    reviewCount: 89,
    tags: ['denim', 'casual', 'slim-fit', 'jeans'],
    isFeatured: true,
    slug: 'slim-fit-denim-jeans',
  },
  // More Men's Products
  {
    id: 'prod_006',
    name: 'Casual Polo Shirt',
    brand: 'Aura Atelier',
    category: 'men',
    subcategory: 'Shirts',
    price: 1299,
    discountedPrice: 999,
    discountPercentage: 23,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Navy', hex: '#001F3F', images: ['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&h=800&fit=crop'] },
      { name: 'White', hex: '#FFFFFF', images: ['https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=600&h=800&fit=crop'] },
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&h=800&fit=crop', alt: 'Front view', isPrimary: true, order: 1 },
    ],
    description: 'Classic polo shirt perfect for casual outings. Made from breathable cotton blend.',
    material: '60% Cotton, 40% Polyester',
    careInstructions: 'Machine wash cold',
    features: ['Collar', 'Button placket', 'Short sleeves'],
    inStock: true,
    inventory: { S: 8, M: 12, L: 15, XL: 10 },
    rating: 4.3,
    reviewCount: 67,
    tags: ['polo', 'casual', 'shirt'],
    isFeatured: false,
    slug: 'casual-polo-shirt',
  },
  {
    id: 'prod_007',
    name: 'Leather Jacket',
    brand: 'PremiumLine',
    category: 'men',
    subcategory: 'Jackets',
    price: 5999,
    discountedPrice: 4799,
    discountPercentage: 20,
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Black', hex: '#000000', images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop'] },
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop', alt: 'Front view', isPrimary: true, order: 1 },
    ],
    description: 'Premium leather jacket with modern fit. Perfect for adding edge to any outfit.',
    material: 'Genuine Leather',
    careInstructions: 'Professional leather cleaning only',
    features: ['Zipper closure', 'Multiple pockets', 'Inner lining'],
    inStock: true,
    inventory: { M: 5, L: 8, XL: 6 },
    rating: 4.9,
    reviewCount: 45,
    tags: ['jacket', 'leather', 'premium'],
    isFeatured: true,
    slug: 'leather-jacket',
  },
  {
    id: 'prod_003',
    name: 'Formal Cotton Shirt',
    brand: 'ClassicWear',
    category: 'men',
    subcategory: 'Shirts',
    price: 1799,
    discountedPrice: null,
    discountPercentage: 0,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { 
        name: 'White', 
        hex: '#FFFFFF', 
        images: [
          'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop',
          'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&h=800&fit=crop',
        ]
      },
      { 
        name: 'Light Blue', 
        hex: '#ADD8E6', 
        images: [
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop',
          'https://images.unsplash.com/photo-1598032895397-b9c644f8c3c7?w=600&h=800&fit=crop',
        ]
      },
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop', alt: 'Front view', isPrimary: true, order: 1 },
      { url: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&h=800&fit=crop', alt: 'Detail view', isPrimary: false, order: 2 },
    ],
    description: 'Crisp formal cotton shirt perfect for office wear. Features a classic collar, button-down front, and long sleeves. Made from premium cotton for a professional look.',
    material: '100% Cotton',
    careInstructions: 'Machine wash cold, iron on medium heat, dry clean recommended',
    features: ['Wrinkle-resistant', 'Classic collar', 'Button cuffs', 'Chest pocket'],
    inStock: true,
    inventory: { S: 5, M: 10, L: 12, XL: 8, XXL: 3 },
    rating: 4.6,
    reviewCount: 56,
    tags: ['formal', 'office', 'shirt', 'cotton'],
    isFeatured: false,
    slug: 'formal-cotton-shirt',
  },
  // Women's Collection
  {
    id: 'prod_004',
    name: 'Floral Summer Dress',
    brand: 'ElegantTouch',
    category: 'women',
    subcategory: 'Dresses',
    price: 2999,
    discountedPrice: 2399,
    discountPercentage: 20,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { 
        name: 'Pink Floral', 
        hex: '#FFB6C1', 
        images: [
          'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop',
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop',
        ]
      },
      { 
        name: 'Blue Floral', 
        hex: '#87CEEB', 
        images: [
          'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop',
          'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop',
        ]
      },
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop', alt: 'Front view', isPrimary: true, order: 1 },
      { url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop', alt: 'Back view', isPrimary: false, order: 2 },
      { url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop', alt: 'Side view', isPrimary: false, order: 3 },
    ],
    description: 'Beautiful floral print summer dress with a flattering A-line silhouette. Perfect for casual outings and summer parties. Features adjustable straps and a comfortable fit.',
    material: '95% Polyester, 5% Elastane',
    careInstructions: 'Hand wash cold, hang dry, do not bleach',
    features: ['Floral print', 'Adjustable straps', 'A-line fit', 'Knee length'],
    inStock: true,
    inventory: { XS: 6, S: 12, M: 15, L: 10, XL: 5 },
    rating: 4.8,
    reviewCount: 142,
    tags: ['dress', 'summer', 'floral', 'casual'],
    isFeatured: true,
    slug: 'floral-summer-dress',
  },
  // More Women's Products
  {
    id: 'prod_008',
    name: 'Casual Crop Top',
    brand: 'TrendSetters',
    category: 'women',
    subcategory: 'Tops',
    price: 899,
    discountedPrice: 699,
    discountPercentage: 22,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Pink', hex: '#FFB6C1', images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop'] },
      { name: 'Black', hex: '#000000', images: ['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=800&fit=crop'] },
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop', alt: 'Front view', isPrimary: true, order: 1 },
    ],
    description: 'Trendy crop top perfect for summer. Comfortable and stylish.',
    material: '95% Cotton, 5% Elastane',
    careInstructions: 'Machine wash cold',
    features: ['Crop length', 'Stretchy fabric', 'Round neck'],
    inStock: true,
    inventory: { XS: 10, S: 15, M: 12, L: 8 },
    rating: 4.4,
    reviewCount: 92,
    tags: ['crop-top', 'casual', 'summer'],
    isFeatured: false,
    slug: 'casual-crop-top',
  },
  {
    id: 'prod_009',
    name: 'Elegant Maxi Skirt',
    brand: 'ElegantTouch',
    category: 'women',
    subcategory: 'Skirts',
    price: 1899,
    discountedPrice: 1499,
    discountPercentage: 21,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Burgundy', hex: '#800020', images: ['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=800&fit=crop'] },
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=800&fit=crop', alt: 'Front view', isPrimary: true, order: 1 },
    ],
    description: 'Flowing maxi skirt perfect for elegant occasions. Features elastic waistband.',
    material: '100% Polyester',
    careInstructions: 'Hand wash cold',
    features: ['Maxi length', 'Elastic waist', 'Flowing fabric'],
    inStock: true,
    inventory: { S: 7, M: 10, L: 8, XL: 5 },
    rating: 4.6,
    reviewCount: 73,
    tags: ['skirt', 'maxi', 'elegant'],
    isFeatured: false,
    slug: 'elegant-maxi-skirt',
  },
  {
    id: 'prod_005',
    name: 'High-Waist Skinny Jeans',
    brand: 'TrendSetters',
    category: 'women',
    subcategory: 'Jeans',
    price: 2199,
    discountedPrice: 1759,
    discountPercentage: 20,
    sizes: ['26', '28', '30', '32', '34'],
    colors: [
      { 
        name: 'Black', 
        hex: '#000000', 
        images: [
          'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop',
          'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=600&h=800&fit=crop',
        ]
      },
      { 
        name: 'Dark Blue', 
        hex: '#1E3A5F', 
        images: [
          'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600&h=800&fit=crop',
          'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop',
        ]
      },
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop', alt: 'Front view', isPrimary: true, order: 1 },
      { url: 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=600&h=800&fit=crop', alt: 'Back view', isPrimary: false, order: 2 },
    ],
    description: 'Trendy high-waist skinny jeans that hug your curves perfectly. Made with stretch denim for comfort and style. Perfect for creating versatile looks.',
    material: '92% Cotton, 6% Polyester, 2% Elastane',
    careInstructions: 'Machine wash cold, tumble dry low',
    features: ['High-waist', 'Stretch denim', 'Skinny fit', 'Five pockets'],
    inStock: true,
    inventory: { '26': 8, '28': 14, '30': 16, '32': 12, '34': 7 },
    rating: 4.6,
    reviewCount: 98,
    tags: ['jeans', 'skinny', 'high-waist', 'denim'],
    isFeatured: true,
    slug: 'high-waist-skinny-jeans',
  },
  // Kids Products
  {
    id: 'prod_010',
    name: 'Kids Graphic T-Shirt',
    brand: 'Urban Basics',
    category: 'kids',
    subcategory: 'T-Shirts',
    price: 599,
    discountedPrice: 449,
    discountPercentage: 25,
    sizes: ['4-5Y', '6-7Y', '8-9Y', '10-11Y'],
    colors: [
      { name: 'Blue', hex: '#4169E1', images: ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=800&fit=crop'] },
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=800&fit=crop', alt: 'Front view', isPrimary: true, order: 1 },
    ],
    description: 'Fun graphic t-shirt for kids. Soft and comfortable cotton fabric.',
    material: '100% Cotton',
    careInstructions: 'Machine wash cold',
    features: ['Graphic print', 'Soft fabric', 'Durable'],
    inStock: true,
    inventory: { '4-5Y': 10, '6-7Y': 12, '8-9Y': 15, '10-11Y': 8 },
    rating: 4.7,
    reviewCount: 134,
    tags: ['kids', 't-shirt', 'graphic'],
    isFeatured: true,
    slug: 'kids-graphic-tshirt',
  },
  // Accessories
  {
    id: 'prod_011',
    name: 'Leather Crossbody Bag',
    brand: 'StyleHub',
    category: 'accessories',
    subcategory: 'Bags',
    price: 2499,
    discountedPrice: 1999,
    discountPercentage: 20,
    sizes: ['One Size'],
    colors: [
      { name: 'Brown', hex: '#8B4513', images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop'] },
      { name: 'Black', hex: '#000000', images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=800&fit=crop'] },
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop', alt: 'Front view', isPrimary: true, order: 1 },
    ],
    description: 'Stylish leather crossbody bag with adjustable strap. Perfect for everyday use.',
    material: 'Genuine Leather',
    careInstructions: 'Wipe with damp cloth',
    features: ['Adjustable strap', 'Multiple compartments', 'Zipper closure'],
    inStock: true,
    inventory: { 'One Size': 20 },
    rating: 4.8,
    reviewCount: 156,
    tags: ['bag', 'leather', 'crossbody', 'accessories'],
    isFeatured: true,
    slug: 'leather-crossbody-bag',
  },
  {
    id: 'prod_012',
    name: 'Classic Aviator Sunglasses',
    brand: 'StyleHub',
    category: 'accessories',
    subcategory: 'Sunglasses',
    price: 1299,
    discountedPrice: 999,
    discountPercentage: 23,
    sizes: ['One Size'],
    colors: [
      { name: 'Gold Frame', hex: '#FFD700', images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=800&fit=crop'] },
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=800&fit=crop', alt: 'Front view', isPrimary: true, order: 1 },
    ],
    description: 'Classic aviator sunglasses with UV protection. Timeless style.',
    material: 'Metal Frame, Polycarbonate Lens',
    careInstructions: 'Clean with microfiber cloth',
    features: ['UV protection', 'Metal frame', 'Classic design'],
    inStock: true,
    inventory: { 'One Size': 30 },
    rating: 4.5,
    reviewCount: 89,
    tags: ['sunglasses', 'aviator', 'accessories'],
    isFeatured: false,
    slug: 'classic-aviator-sunglasses',
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
    colors: [{ name: 'Black', hex: '#000000', images: ['https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80'] }],
    images: [{ url: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80', alt: 'Slip Dress', isPrimary: true, order: 1 }],
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
    colors: [{ name: 'Cream', hex: '#FFFDD0', images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80'] }],
    images: [{ url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80', alt: 'Knit Sweater', isPrimary: true, order: 1 }],
    description: 'Pre-owned chunky knit sweater. Condition: Fair.',
    material: 'Wool Blend',
    inStock: true,
    inventory: { M: 1 },
    rating: 4.2,
    reviewCount: 5,
    tags: ['thrift', 'vintage', 'sweater', 'knit'],
    isFeatured: false,
    slug: 'chunky-knit-sweater',
  }
];

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

