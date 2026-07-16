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
  { id: 'seafood', name: 'Seafood & Fish', icon: '🐟', color: '#0ea5e9' },
  { id: 'meat-poultry', name: 'Meat & Poultry', icon: '🍗', color: '#b45309' },
  { id: 'frozen-snacks', name: 'Frozen Snacks', icon: '🧊', color: '#6366f1' },
  { id: 'international-foods', name: 'World Foods', icon: '🌍', color: '#10b981' },
  { id: 'health-supplements', name: 'Health Supplements', icon: '💊', color: '#22d3ee' },
  { id: 'kitchenware', name: 'Kitchenware', icon: '🍳', color: '#f59e0b' },
];

export const products = [
  {
    id: 'grok2-001', name: 'Fish Fillet - Rohu', brand: 'FreshCatch', category: 'seafood',
    price: 220, mrp: 260, discount: 15, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://www.bing.com/images/search?view=detailV2&ccid=tzSG4vrg&id=C1A269D87564C4BA3EFFD9CB5904E34E60524E38&thid=OIP.tzSG4vrgsu0IFjX7yh4TKQHaE8&mediaurl=https%3a%2f%2fstatic.vecteezy.com%2fsystem%2fresources%2fpreviews%2f011%2f224%2f689%2fnon_2x%2ffish-fillet-on-wooden-board-with-ingredients-for-cooking-fresh-raw-pangasius-fish-fillet-with-herb-and-spices-black-pepper-lemon-lime-meat-dolly-fish-tilapia-striped-catfish-free-photo.JPG&exph=980&expw=1468&q=Fish+Fillet&FORM=IRPRST&ck=53D7152854CDC0A2979D4B85282F8940&selectedIndex=0&itb=0',
    inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-002', name: 'Prawns - Medium', brand: 'FreshCatch', category: 'seafood',
    price: 380, mrp: 420, discount: 9, unit: '500 g', deliveryTime: '11 MINS',
    image: 'hhttps://www.bing.com/images/search?view=detailV2&ccid=K2GSx5yi&id=6F65C0B48EB2BC5E208B0BB97BF3A39D893F82B0&thid=OIP.K2GSx5yiBKoV44CoNyMtHwHaE8&mediaurl=https%3a%2f%2foceansbestlk.com%2fwp-content%2fuploads%2f2025%2f11%2fprawns-medium.jpg&exph=1000&expw=1500&q=Prawns+-+Medium&FORM=IRPRST&ck=0FC061FA3B79A2F3BB1E69307CA71BC8&selectedIndex=1&itb=0',
    inStock: true, tags: ['Premium'], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-003', name: 'Tuna Steak', brand: 'OceanFresh', category: 'seafood',
    price: 450, mrp: 510, discount: 11, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://tse3.mm.bing.net/th/id/OIP.bj4IKh-jNArkxObijQluvwHaLG?r=0&w=2667&h=4000&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: [], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-004', name: 'Sardines - Fresh', brand: 'OceanFresh', category: 'seafood',
    price: 110, mrp: 130, discount: 15, unit: '250 g', deliveryTime: '11 MINS',
    image: 'https://www.seriouseats.com/thmb/gCf5Tr0ZnOC3TTxloh1-2ORrdoo=/1500x1125/filters:fill(auto,1)/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__2018__01__20170117-how-to-clean-sardines-vicky-wasik1-13fbba78ebbd4f78acc258f27d1d471b.jpg',
    inStock: true, tags: [], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-005', name: 'Crab - Mud', brand: 'FreshCatch', category: 'seafood',
    price: 520, mrp: 580, discount: 10, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://www.thenews.com.pk/assets/uploads/akhbar/2020-11-07/740061_3594861_mud-crab_akhbar.jpg',
    inStock: true, tags: ['Premium'], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-006', name: 'Chicken Breast - Boneless', brand: 'FarmFresh', category: 'meat-poultry',
    price: 280, mrp: 320, discount: 12, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-007', name: 'Mutton Keema', brand: 'PureGoat', category: 'meat-poultry',
    price: 480, mrp: 530, discount: 9, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://tse3.mm.bing.net/th/id/OIP.czucgxt1OktWS_2rD9POHQHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: [], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-008', name: 'Chicken Wings', brand: 'FarmFresh', category: 'meat-poultry',
    price: 220, mrp: 260, discount: 15, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://www.bing.com/images/search?view=detailV2&ccid=jdMBDsBM&id=B78E88322C48E3772778C25C7E43C4323DE8A01B&thid=OIP.jdMBDsBMSJVuxTbFyl1nOAHaLH&mediaurl=https%3a%2f%2fwww.restlesschipotle.com%2fwp-content%2fuploads%2f2022%2f08%2fCrispy-Oven-Baked-Chicken-Wings-12.jpg&exph=1800&expw=1200&q=Chicken+Wings&FORM=IRPRST&ck=372B6CEE5940B89E0C66534A177C2F59&selectedIndex=3&itb=0',
    inStock: true, tags: [], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-009', name: 'Pork Ribs', brand: 'MeatMaster', category: 'meat-poultry',
    price: 520, mrp: 580, discount: 10, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://www.bing.com/images/search?view=detailV2&ccid=gDgqSp%2fZ&id=AD28DF41304AC1501155CC3E08CE68F0428EDC6F&thid=OIP.gDgqSp_ZEzaB-CjBRFrDYgHaLH&mediaurl=https%3a%2f%2fi.pinimg.com%2foriginals%2fd4%2fab%2f50%2fd4ab505266163cd766ca6ad786bc90f6.jpg&exph=1200&expw=800&q=BBQ+Baked+Country+Style+Pork+Ribs+Recipe&FORM=IRPRST&ck=15E6C1F1FB15872585650B760115488B&selectedIndex=8&itb=0',
    inStock: true, tags: ['Premium'], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-010', name: 'Duck Leg', brand: 'MeatMaster', category: 'meat-poultry',
    price: 440, mrp: 490, discount: 10, unit: '2 pcs', deliveryTime: '11 MINS',
    image: 'https://www.bing.com/images/search?view=detailV2&ccid=xqLa7CA4&id=D3D71F9941C40E8DE5D1887DED9C33320E83F168&thid=OIP.xqLa7CA4Oqa2uhhMSJKB5wHaF7&mediaurl=https%3a%2f%2fi.pinimg.com%2foriginals%2f5c%2ff9%2f82%2f5cf9822445c7059060e6d4a7b49639c4.jpg&exph=834&expw=1043&q=Duck+Leg&FORM=IRPRST&ck=B9E2A9A0A25D498600686BD850AA4516&selectedIndex=0&itb=0',
    inStock: true, tags: [], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-011', name: 'Veg Momos - Frozen', brand: 'MomoCo', category: 'frozen-snacks',
    price: 120, mrp: 145, discount: 17, unit: '12 pcs', deliveryTime: '11 MINS',
    image: 'https://th.bing.com/th/id/OIP._gwRWigwlf3-AKIFhfsDLQHaHa?w=193&h=193&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-012', name: 'Chicken Nuggets', brand: 'GoldenBite', category: 'frozen-snacks',
    price: 180, mrp: 210, discount: 14, unit: '400 g', deliveryTime: '11 MINS',
    image: 'https://bakeitwithlove.com/wp-content/uploads/2021/05/Air-Fryer-Chicken-Nuggets-sq.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-013', name: 'Spring Rolls - Veg', brand: 'AsianKitchen', category: 'frozen-snacks',
    price: 140, mrp: 160, discount: 12, unit: '6 pcs', deliveryTime: '11 MINS',
    image: 'https://tse3.mm.bing.net/th/id/OIP.0Ew2XaaDTji1teJ4QDROcgHaIG?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: [], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-014', name: 'French Fries - Shoestring', brand: 'CrispyBite', category: 'frozen-snacks',
    price: 90, mrp: 110, discount: 18, unit: '400 g', deliveryTime: '11 MINS',
    image: 'https://i0.wp.com/www.aspicyperspective.com/wp-content/uploads/2021/11/Shoestring-Fries-Julienne-Cut-20.jpg?resize=1153%2C1536&ssl=1',
    inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-015', name: 'Pizza Base - Ready', brand: 'PizzaHub', category: 'frozen-snacks',
    price: 115, mrp: 135, discount: 15, unit: '2 pcs', deliveryTime: '11 MINS',
    image: 'hhttps://www.bbassets.com/media/uploads/p/l/40226318-2_1-super-pizza-base-half-baked-ready-to-bake.jpg',
    inStock: true, tags: [], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-016', name: 'Soy Sauce - Dark', brand: 'TasteOfAsia', category: 'international-foods',
    price: 95, mrp: 115, discount: 17, unit: '250 ml', deliveryTime: '11 MINS',
    image: 'https://tse3.mm.bing.net/th/id/OIP.qsjyWYRGmQvqPNR55S9SEAHaJQ?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: [], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-017', name: 'Pasta - Penne', brand: 'ItaliaKitchen', category: 'international-foods',
    price: 110, mrp: 130, discount: 15, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://www.bing.com/images/search?view=detailV2&ccid=b6P%2fZ4hj&id=FF7FEDC84DA1FBC09407D33324C99277D574E9E6&thid=OIP.b6P_Z4hjO6szI9CME2hrqAHaJf&mediaurl=https%3a%2f%2ftheclevermeal.com%2fwp-content%2fuploads%2f2021%2f07%2fpenne-arrabbiata_1b.jpg&exph=1500&expw=1170&q=Pasta+-+Penne&FORM=IRPRST&ck=50752409A18A05C8E2A90EAF5209268F&selectedIndex=7&itb=0',
    inStock: true, tags: [], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-018', name: 'Sriracha Chilli Sauce', brand: 'SpicyWorld', category: 'international-foods',
    price: 140, mrp: 165, discount: 15, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcwGSmtiHJn04RTPH9M24ymrOkPkNifn8JMqi_jLyJoEGqIfHeW7UcT3te&s=10',
    inStock: true, tags: [], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-019', name: 'Tahini Paste', brand: 'MiddleEastFoods', category: 'international-foods',
    price: 220, mrp: 255, discount: 13, unit: '250 g', deliveryTime: '11 MINS',
    image: 'https://th.bing.com/th/id/OIP.GcIr6hwlMZVeiVH1JBaWewHaHa?w=181&h=181&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    inStock: true, tags: ['Premium'], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-020', name: 'Quinoa White', brand: 'HealthAisle', category: 'international-foods',
    price: 395, mrp: 450, discount: 12, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://tse3.mm.bing.net/th/id/OIP.iAKs7ulBoab87wcuHu1KtAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['Organic'], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-021', name: 'Whey Protein - Vanilla', brand: 'NutriPro', category: 'health-supplements',
    price: 1299, mrp: 1499, discount: 13, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://tse2.mm.bing.net/th/id/OIP.2h-vvZEl-rxQ8Zj7a3j63AHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['Premium'], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-022', name: 'Vitamin D3 Tablets', brand: 'HealthFirst', category: 'health-supplements',
    price: 399, mrp: 449, discount: 11, unit: '60 tabs', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg?w=300',
    inStock: true, tags: [], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-023', name: 'Fish Oil Capsules', brand: 'OmegaLife', category: 'health-supplements',
    price: 495, mrp: 550, discount: 10, unit: '90 caps', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/3683101/pexels-photo-3683101.jpeg?w=300',
    inStock: true, tags: [], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-024', name: 'Ashwagandha Extract', brand: 'AyurNature', category: 'health-supplements',
    price: 349, mrp: 399, discount: 12, unit: '60 caps', deliveryTime: '11 MINS',
    image: 'https://tse4.mm.bing.net/th/id/OIP.9M5Wc__djpPzsKzTuh0gAwHaHa?r=0&w=1000&h=1000&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['Organic'], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-025', name: 'Multivitamin Gummies', brand: 'KidsNutri', category: 'health-supplements',
    price: 299, mrp: 349, discount: 14, unit: '30 pcs', deliveryTime: '11 MINS',
    image: 'https://www.bing.com/images/search?view=detailV2&ccid=jHJrgGJR&id=3F44ADC431E90C551992A9494AB70BF9CC633EFD&thid=OIP.jHJrgGJRBXG_NZxgl27ewgHaHa&mediaurl=https%3A%2F%2Fi5.walmartimages.com%2Fasr%2F954b2397-ad4c-4edf-8fad-8028401c33ac_1.8e90d4e61e940046387a8bedeed79376.jpeg&exph=2365&expw=2365&q=Multivitamin+Gummies&FORM=IRPRST&ck=B8A644B52852C84578E6D58C4B94FBEF&selectedIndex=2&itb=0&cw=1375&ch=659&ajaxhist=0&ajaxserp=0',
    inStock: true, tags: [], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-026', name: 'Steel Kadai - 24cm', brand: 'KitchenPro', category: 'kitchenware',
    price: 649, mrp: 749, discount: 13, unit: '1 pc', deliveryTime: '11 MINS',
    image: 'https://www.bing.com/images/search?view=detailV2&ccid=6b%2ft5VF4&id=AAAED8BBD5D93B027DA11CD15FDAF4CFF4D12CB0&thid=OIP.6b_t5VF48QUJrnAww_wxtgHaHa&mediaurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.e9bfede55178f10509ae7030c3fc31b6%3frik%3dsCzR9M%252f02l%252fRHA%26riu%3dhttp%253a%252f%252fwww.latifs.co.uk%252fcdn%252fshop%252ffiles%252f8906106597753.png%253fcrop%253dcenter%2526height%253d1200%2526v%253d1763125259%2526width%253d1200%26ehk%3dT9w6s0Q9Prb1aLCT0jzJGBhNAOvle2qIZZmz%252fYSVe%252bU%253d%26risl%3d%26pid%3dImgRaw%26r%3d0&exph=1200&expw=1200&q=Steel+Kadai+-+24cm&FORM=IRPRST&ck=BA8858E9536298D7EE6BC22302FFFC43&selectedIndex=0&itb=0',
    inStock: true, tags: [], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-027', name: 'Non-Stick Tawa', brand: 'CookSmart', category: 'kitchenware',
    price: 449, mrp: 519, discount: 13, unit: '1 pc', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/71jeUINL5-L._AC_.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-028', name: 'Bamboo Cutting Board', brand: 'EcoKitchen', category: 'kitchenware',
    price: 299, mrp: 349, discount: 14, unit: '1 pc', deliveryTime: '11 MINS',
    image: 'https://thumbs.dreamstime.com/b/eco-friendly-bamboo-cutting-board-featuring-juice-groove-ideal-chopping-fruits-vegetables-bamboo-cutting-board-juice-387501463.jpg',
    inStock: true, tags: ['Organic'], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-029', name: 'Glass Food Containers Set', brand: 'StoreSafe', category: 'kitchenware',
    price: 799, mrp: 899, discount: 11, unit: '4 pcs', deliveryTime: '11 MINS',
    image: 'https://images-na.ssl-images-amazon.com/images/I/81TRdYFjbOL._AC_SL1500_.jpg',
    inStock: true, tags: [], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-030', name: 'Silicone Spatula Set', brand: 'FlexiCook', category: 'kitchenware',
    price: 199, mrp: 239, discount: 16, unit: '3 pcs', deliveryTime: '11 MINS',
    image: 'https://i5.walmartimages.com/seo/Wanbasion-5-Piece-Silicone-Spatula-Set-Heat-Resistant-Colorful-Rubber-Baking-Set-Kitchen-Dishwasher-Safe-Nonstick-Cookware-Cooking-Mixing-Multicolor2_9285e841-c22c-4449-95a5-8c1a7046617c.6522c46edce7d1432ff65ca355dfe63b.jpeg',
    inStock: true, tags: [], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-031', name: 'Dragon Fruit', brand: 'Fresho', category: 'vegetables-fruits',
    price: 180, mrp: 210, discount: 14, unit: '1 pc', deliveryTime: '11 MINS',
    image: 'https://th.bing.com/th/id/R.2d8ef0bff04fedcf73edbcbff8575769?rik=whPGEVmQWcuDvg&riu=http%3a%2f%2fspecialtyproduce.com%2fsppics%2f9461.png&ehk=ckvUlMyUTdaoRTXvJkWq4qXyX942l36UBu4FVMxV9jc%3d&risl=&pid=ImgRaw&r=0',
    inStock: true, tags: ['Exotic'], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-032', name: 'Avocado', brand: 'Fresho', category: 'vegetables-fruits',
    price: 140, mrp: 165, discount: 15, unit: '2 pcs', deliveryTime: '11 MINS',
    image: 'https://images.healthshots.com/healthshots/en/uploads/2024/04/04153309/avocado-1.jpg',
    inStock: true, tags: ['Premium'], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-033', name: 'Kiwi Fruit', brand: 'Fresho', category: 'vegetables-fruits',
    price: 120, mrp: 145, discount: 17, unit: '4 pcs', deliveryTime: '11 MINS',
    image: 'https://healthjade.net/wp-content/uploads/2017/09/kiwi-fruit.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-034', name: 'Broccoli Crown', brand: 'Fresho', category: 'vegetables-fruits',
    price: 85, mrp: 100, discount: 15, unit: '300 g', deliveryTime: '11 MINS',
    image: 'https://www.kroger.com/product/images/large/front/0000000003082',
    inStock: true, tags: ['Organic'], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-035', name: 'Baby Spinach', brand: 'Fresho', category: 'vegetables-fruits',
    price: 55, mrp: 65, discount: 15, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://thumbs.dreamstime.com/b/fresh-baby-spinach-leaves-textured-background-close-up-114689515.jpg',
    inStock: true, tags: ['Organic'], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-036', name: 'Greek Yogurt - Plain', brand: 'Danone', category: 'dairy-breakfast',
    price: 145, mrp: 169, discount: 14, unit: '400 g', deliveryTime: '11 MINS',
    image: 'https://tse3.mm.bing.net/th/id/OIP.iieMkYpFuJnmQD6fgS_oZgHaFS?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-037', name: 'Almond Milk', brand: 'Oatly', category: 'dairy-breakfast',
    price: 220, mrp: 259, discount: 15, unit: '750 mL', deliveryTime: '11 MINS',
    image: 'hhttps://i5.walmartimages.com/asr/962f8710-05cb-4f3f-a6f9-3bce9126d3e6_1.e84fa1e230d50b0a8307d20f097c96d1.jpeg',
    inStock: true, tags: ['Vegan'], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-038', name: 'Granola - Honey Oat', brand: 'NutriMix', category: 'dairy-breakfast',
    price: 269, mrp: 309, discount: 12, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://tse4.mm.bing.net/th/id/OIP.zLnuIWTcyeskGZ-Q1I4TuAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-039', name: 'Cream Cheese', brand: 'Britannia', category: 'dairy-breakfast',
    price: 195, mrp: 225, discount: 13, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://tse3.mm.bing.net/th/id/OIP.EpRFplYNjAk95fgsxOSdKAHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: [], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-040', name: 'Oat Milk', brand: 'GoodMilk', category: 'dairy-breakfast',
    price: 199, mrp: 229, discount: 13, unit: '750 mL', deliveryTime: '11 MINS',
    image: 'https://myquietkitchen.com/wp-content/uploads/2023/05/best-oat-milk-recipe-2.jpg',
    inStock: true, tags: ['Vegan'], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-041', name: 'Cold Brew Coffee', brand: 'BlueTokai', category: 'tea-coffee',
    price: 349, mrp: 399, discount: 12, unit: '250 ml', deliveryTime: '11 MINS',
    image: 'https://www.simplyrecipes.com/thmb/7zYXgL4vpOhXfa04v7_vPO4Dv84=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Cold-Brew-Coffee-LEAD-6-896c6872ac3e421ca4d88f29b528b349.jpg',
    inStock: true, tags: ['Premium'], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-042', name: 'Green Tea - Jasmine', brand: 'Tetley', category: 'tea-coffee',
    price: 175, mrp: 199, discount: 12, unit: '25 bags', deliveryTime: '11 MINS',
    image: 'https://twinings.com.au/cdn/shop/files/TWIN_070177227913-0.jpg?v=1698815904&width=2040',
    inStock: true, tags: ['Organic'], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-043', name: 'Matcha Powder', brand: 'ZenTea', category: 'tea-coffee',
    price: 499, mrp: 569, discount: 12, unit: '100 g', deliveryTime: '11 MINS',
    image: 'https://i5.walmartimages.com/seo/Organic-Ceremonial-Matcha-Powder-Premium-Matcha-Powder-100g_72c0e0ab-2036-4551-abf6-5f83412e47a1.f63d04cbd3070d0b65564d6d80550107.jpeg',
    inStock: true, tags: ['Premium'], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-044', name: 'Turmeric Latte Mix', brand: 'GoldenSpice', category: 'tea-coffee',
    price: 249, mrp: 289, discount: 13, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://tse4.mm.bing.net/th/id/OIP.bZ-cxDV1KtfThvCrHjFgVQHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['Organic'], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-045', name: 'Masala Chai Blend', brand: 'ChaiWala', category: 'tea-coffee',
    price: 145, mrp: 169, discount: 14, unit: '250 g', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/71OcGOmM5cL._AC_SL1500_.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-046', name: 'Sourdough Bread', brand: 'ArtisanBake', category: 'bakery-biscuits',
    price: 189, mrp: 219, discount: 13, unit: '400 g', deliveryTime: '11 MINS',
    image: 'https://sugarspunrun.com/wp-content/uploads/2023/02/My-sourdough-bread-recipe-1-of-1.jpg',
    inStock: true, tags: ['Artisan'], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-047', name: 'Whole Wheat Croissant', brand: 'BakeFresh', category: 'bakery-biscuits',
    price: 95, mrp: 115, discount: 17, unit: '4 pcs', deliveryTime: '11 MINS',
    image: 'https://tse1.mm.bing.net/th/id/OIP.40lMoW4H2mHgt4bsIQOgPgHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: [], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-048', name: 'Dark Chocolate Brownie', brand: 'SweetNest', category: 'bakery-biscuits',
    price: 165, mrp: 195, discount: 15, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://tse2.mm.bing.net/th/id/OIP.ET3mgD83t8--pCUlDUONgwHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-049', name: 'Ragi Cookies', brand: 'HealthBake', category: 'bakery-biscuits',
    price: 120, mrp: 145, discount: 17, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://tse1.explicit.bing.net/th/id/OIP._lJ7XyaGxMmCO4nAw5yiswHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['Organic'], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-050', name: 'Banana Walnut Loaf', brand: 'BakeFresh', category: 'bakery-biscuits',
    price: 145, mrp: 169, discount: 14, unit: '300 g', deliveryTime: '11 MINS',
    image: 'https://nourishplate.com/wp-content/uploads/2018/06/Banana-and-Walnut-Cake5-683x1024.jpg',
    inStock: true, tags: [], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-051', name: 'Ghee - Pure Cow', brand: 'Amul', category: 'masala-oil',
    price: 699, mrp: 799, discount: 12, unit: '500 ml', deliveryTime: '11 MINS',
    image: 'https://tse4.mm.bing.net/th/id/OIP.zzne7g5owdJ6d0tNQUuBegHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['Premium'], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-052', name: 'Mustard Oil - Cold Pressed', brand: 'KachchiGhani', category: 'masala-oil',
    price: 215, mrp: 249, discount: 13, unit: '750 mL', deliveryTime: '11 MINS',
    image: 'https://th.bing.com/th/id/OIP.3-wqqfhhONsbm9Uqwt0YNAHaHa?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: [], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-053', name: 'Chaat Masala', brand: 'MDH', category: 'masala-oil',
    price: 65, mrp: 79, discount: 17, unit: '100 g', deliveryTime: '11 MINS',
    image: 'https://tse3.mm.bing.net/th/id/OIP.dDDRNNFcrxBkHQA12cYY5AHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-054', name: 'Biryani Masala', brand: 'Shan', category: 'masala-oil',
    price: 85, mrp: 99, discount: 14, unit: '50 g', deliveryTime: '11 MINS',
    image: 'https://th.bing.com/th/id/OIP.QIBY7VyoyAEWBPyb7pT5YQHaI_?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: [], rating: 4.5, reviews: 120
  },
  {
    id: 'grok2-055', name: 'Extra Virgin Olive Oil', brand: 'Figaro', category: 'masala-oil',
    price: 649, mrp: 729, discount: 11, unit: '500 ml', deliveryTime: '11 MINS',
    image: 'https://tse4.mm.bing.net/th/id/OIP.wIKYn-cCSFQoyLgLD5Dh7wHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['Premium'], rating: 4.5, reviews: 120
  },

  {
    id: 'grok-new-001', name: 'Guava Nectar Fruit Juice', brand: 'Crunchy Bites', category: 'cold-drinks',
    price: 32, mrp: 37, discount: 10, unit: '750 mL', deliveryTime: '11 MINS',
    image: 'https://i5.walmartimages.com/asr/d1739cb9-e4cc-4aab-9f01-a184c38b9986_1.bb434b6c5204b2488721b1195710b003.jpeg',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 11
  },
  {
    id: 'grok-new-002', name: 'Blueberry Greek Yogurt', brand: 'Grokly Fresh', category: 'dairy-breakfast',
    price: 34, mrp: 39, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://th.bing.com/th/id/OIP.TDmiaFcZLhU5sGxCE8KP9AHaHa?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 12
  },
  {
    id: 'grok-new-003', name: 'Sour Cream & Onion Potato Crisps', brand: 'Crunchy Bites', category: 'munchies',
    price: 36, mrp: 41, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://tse4.mm.bing.net/th/id/OIP.hucttx8dwducqW-WlcULIwHaHg?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 13
  },
  {
    id: 'grok-new-004', name: 'Sparkling Apple Cider', brand: 'Crunchy Bites', category: 'cold-drinks',
    price: 38, mrp: 43, discount: 10, unit: '750 mL', deliveryTime: '11 MINS',
    image: 'https://www.bing.com/search?q=Sparkling+Apple+Cider&cvid=e533b9b51f93497f9909ddca79d1febd&gs_lcrp=EgRlZGdlKgYIABBFGDkyBggAEEUYOdIBBzg3NmowajeoAgiwAgE&FORM=ANAB01&PC=HCTS',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 14
  },
  {
    id: 'grok-new-005', name: 'Artisanal Salted Butter', brand: 'Grokly Fresh', category: 'dairy-breakfast',
    price: 40, mrp: 45, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://tse2.mm.bing.net/th/id/OIP.DK8fQT8cqShI8L7y6JcKmgHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 15
  },
  {
    id: 'grok-new-006', name: 'Slow Roasted Salted Cashews', brand: 'Crunchy Bites', category: 'munchies',
    price: 42, mrp: 47, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://tse3.mm.bing.net/th/id/OIP.z9XrTcSZORj5DN86dASGuwHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 16
  },
  {
    id: 'grok-new-007', name: 'Organic Litchi Drink', brand: 'Crunchy Bites', category: 'cold-drinks',
    price: 44, mrp: 49, discount: 10, unit: '750 mL', deliveryTime: '11 MINS',
    image: 'https://produits.bienmanger.com/39428-0w0h0_Lytchee_Eloa_Aloe_Vera_Drink.jpg',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 17
  },
  {
    id: 'grok-new-008', name: 'Fresh Mozzarella Bocconcini', brand: 'Grokly Fresh', category: 'dairy-breakfast',
    price: 46, mrp: 51, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://tse2.mm.bing.net/th/id/OIP.tATN8xZ0UCQe3LOjijMe0gHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 18
  },
  {
    id: 'grok-new-009', name: 'Jalapeno Cheddar Popcorn', brand: 'Crunchy Bites', category: 'munchies',
    price: 48, mrp: 53, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://target.scene7.com/is/image/Target/GUEST_096926df-6fb6-41ce-83f5-d060a34be17f',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 19
  },
  {
    id: 'grok-new-010', name: 'Sugar-Free Ginger Ale', brand: 'Crunchy Bites', category: 'cold-drinks',
    price: 50, mrp: 55, discount: 10, unit: '750 mL', deliveryTime: '11 MINS',
    image: 'https://i5.walmartimages.com/asr/49176d73-12ee-4605-a277-1eb863ec5378.9c21b2060cd0722bc4cddc21e29d659a.jpeg',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 20
  },
  {
    id: 'grok-new-011', name: 'Organic Creamy Almond Butter', brand: 'Grokly Fresh', category: 'dairy-breakfast',
    price: 52, mrp: 57, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/81cAq7-0miL._SL1500_.jpg',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 21
  },
  {
    id: 'grok-new-012', name: 'Dark Chocolate Oats Granola Bars', brand: 'Crunchy Bites', category: 'munchies',
    price: 54, mrp: 59, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://tse3.mm.bing.net/th/id/OIP.1aYo0x4viC4b-PT8r4RDnQHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 22
  },
  {
    id: 'grok-new-013', name: 'Valencia Orange Cold Pressed Juice', brand: 'Crunchy Bites', category: 'cold-drinks',
    price: 56, mrp: 61, discount: 10, unit: '750 mL', deliveryTime: '11 MINS',
    image: 'https://th.bing.com/th/id/OIP.4LKzWkOmyqn4Jae-y0rQKgHaHa?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 23
  },
  {
    id: 'grok-new-014', name: 'Free Range Brown Eggs', brand: 'Grokly Fresh', category: 'dairy-breakfast',
    price: 58, mrp: 63, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://th.bing.com/th/id/OIP.sUucWEgy3Cqvjt96vqkReQHaFL?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 24
  },
  {
    id: 'grok-new-015', name: 'Baked Ragi & Herbs Crackers', brand: 'Crunchy Bites', category: 'munchies',
    price: 60, mrp: 65, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://img-global.cpcdn.com/recipes/0cac7dc626f60048/1200x630cq80/photo.jpg',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 25
  },
  {
    id: 'grok-new-016', name: 'Hydroponic Cherry Tomatoes', brand: 'Crunchy Bites', category: 'cold-drinks',
    price: 62, mrp: 67, discount: 10, unit: '750 mL', deliveryTime: '11 MINS',
    image: 'https://tse1.mm.bing.net/th/id/OIP.fksRd6yMyPS8LTol2TruCgHaEP?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 26
  },
  {
    id: 'grok-new-017', name: 'Fresh Import Hass Avocados', brand: 'Grokly Fresh', category: 'dairy-breakfast',
    price: 64, mrp: 69, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://tse3.mm.bing.net/th/id/OIP.u611XgknD5psGEVZJIbPcwHaE2?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 27
  },
  {
    id: 'grok-new-018', name: 'Hydroponic Romaine Lettuce', brand: 'Crunchy Bites', category: 'munchies',
    price: 66, mrp: 71, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://th.bing.com/th/id/OIP.H5-ikF5Ic3c2qscisyqxCgHaE7?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 28
  },
  {
    id: 'grok-new-019', name: 'Organic Sona Masuri Rice', brand: 'Crunchy Bites', category: 'cold-drinks',
    price: 68, mrp: 73, discount: 10, unit: '750 mL', deliveryTime: '11 MINS',
    image: 'https://i5.walmartimages.com/seo/Laxmi-Organic-Sona-Masoori-Rice-10lbs_5d68c36a-c513-4eef-a175-1d4220313d0a.bac65bf316ffe3dad6f406b2db89f79a.jpeg',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 29
  },
  {
    id: 'grok-new-020', name: 'Unpolished Toor Dal', brand: 'Grokly Fresh', category: 'dairy-breakfast',
    price: 70, mrp: 75, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/61HA0lc+dHL.jpg',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 30
  },
  {
    id: 'grok-new-021', name: 'Gluten-Free Multi-grain Flour', brand: 'Crunchy Bites', category: 'munchies',
    price: 72, mrp: 77, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/91b+4sD4y5L._AC_SL1500_.jpg',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 31
  },
  {
    id: 'grok-new-022', name: 'Cold Pressed Yellow Mustard Oil', brand: 'Crunchy Bites', category: 'cold-drinks',
    price: 74, mrp: 79, discount: 10, unit: '750 mL', deliveryTime: '11 MINS',
    image: 'https://tse1.mm.bing.net/th/id/OIP.oCRbTvWGdASP3f8XSaFc7QHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 32
  },
  {
    id: 'grok-new-023', name: 'Organic Alleppey Turmeric Powder', brand: 'Grokly Fresh', category: 'dairy-breakfast',
    price: 76, mrp: 81, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://tse4.mm.bing.net/th/id/OIP.rPYXQ59jDQ140QFurqX41gHaGh?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 33
  },
  {
    id: 'grok-new-024', name: 'Extra Virgin Olive Oil', brand: 'Crunchy Bites', category: 'munchies',
    price: 78, mrp: 83, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://tse4.mm.bing.net/th/id/OIP.wIKYn-cCSFQoyLgLD5Dh7wHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 34
  },
  {
    id: 'grok-new-025', name: 'Pure Aloe Vera Skin Gel', brand: 'Crunchy Bites', category: 'cold-drinks',
    price: 80, mrp: 85, discount: 10, unit: '750 mL', deliveryTime: '11 MINS',
    image: 'https://tse4.mm.bing.net/th/id/OIP.C2JbQx8t6L4v5mrX5wrX6wHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 35
  },
  {
    id: 'grok-new-026', name: 'Tea Tree & Neem Face Wash', brand: 'Grokly Fresh', category: 'dairy-breakfast',
    price: 82, mrp: 87, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://tse3.mm.bing.net/th/id/OIP.uYSdFHdPKWGY3dA0gbuMyQHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 36
  },
  {
    id: 'grok-new-027', name: 'Shea Butter Deep Nourish Lotion', brand: 'Crunchy Bites', category: 'munchies',
    price: 84, mrp: 89, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://ourkaris.com/cdn/shop/files/SheaButterDeepNourishing.jpg?v=1712321986&width=1080',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 37
  },
  {
    id: 'grok-new-028', name: 'Grain-Free Chicken Dog Food', brand: 'Crunchy Bites', category: 'cold-drinks',
    price: 86, mrp: 91, discount: 10, unit: '750 mL', deliveryTime: '11 MINS',
    image: 'https://i5.walmartimages.com/seo/Freshpet-Select-Chicken-Vegetable-Formula-Roasted-Meal-Bites-Fresh-Dog-Food-Grain-Free-1-75lb-Bag_dd562607-716d-472e-b631-ee7d06d70ff2_1.804555687033c2a7b2ec13baf5890f23.jpeg',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 38
  },
  {
    id: 'grok-new-029', name: 'Salmon & Tuna Cat Treats', brand: 'Grokly Fresh', category: 'dairy-breakfast',
    price: 88, mrp: 93, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://tse3.mm.bing.net/th/id/OIP.HMYZyUE0JwpC4HGWiuuULwHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 39
  },
  {
    id: 'grok-new-030', name: 'Ayurvedic Tulsi & Ginger Cough Syrup', brand: 'Crunchy Bites', category: 'munchies',
    price: 90, mrp: 95, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://cdn01.pharmeasy.in/dam/products_otc/I42053/dr-vaidyas-tulsi-ginger-cough-syrup-ayurvedic-syrup-for-cough-and-throat-irritation-pack-of-2-2-1669710667.jpg?dim=700x0&dpr=1&q=100',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 40
  },
  {
    id: 'grok-new-031', name: 'Daily Multivitamin Gummies', brand: 'Crunchy Bites', category: 'cold-drinks',
    price: 92, mrp: 97, discount: 10, unit: '750 mL', deliveryTime: '11 MINS',
    image: 'https://tse4.mm.bing.net/th/id/OIP.4RjanSK9jzI8l2yOQCc9sAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 41
  },
  {
    id: 'grok-new-032', name: 'Classic Sweet Basil Pesto', brand: 'Grokly Fresh', category: 'dairy-breakfast',
    price: 94, mrp: 99, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://tse4.mm.bing.net/th/id/OIP.WPJa5GWXm7qN2372RTBjrgHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 42
  },
  {
    id: 'grok-new-033', name: 'Spicy Szechuan Chilli Stir-Fry Paste', brand: 'Crunchy Bites', category: 'munchies',
    price: 96, mrp: 101, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://tse1.mm.bing.net/th/id/OIP.S0C6tvS6eRSq1UOZ1eVD0gHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 43
  },
  {
    id: 'grok-new-034', name: 'Fresh Atlantic Salmon Fillet', brand: 'Crunchy Bites', category: 'cold-drinks',
    price: 98, mrp: 103, discount: 10, unit: '750 mL', deliveryTime: '11 MINS',
    image: 'https://tse1.explicit.bing.net/th/id/OIP.u7JRyg5K0jYvezLI8V7R9wHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 44
  },
  {
    id: 'grok-new-035', name: 'Cleaned Tiger Prawns', brand: 'Grokly Fresh', category: 'dairy-breakfast',
    price: 100, mrp: 105, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://cdn.grofers.com/da/cms-assets/cms/product/1c56c70e-75c6-49d8-a881-688399cd9d88.jpg',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 45
  },
  {
    id: 'grok-new-036', name: 'Tender Chicken Breast Boneless', brand: 'Crunchy Bites', category: 'munchies',
    price: 102, mrp: 107, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://th.bing.com/th/id/OIP.8zcGGxcmznhbFdIrGbMpzAHaEc?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 46
  },
  {
    id: 'grok-new-037', name: 'Lean Minced Mutton Keema', brand: 'Crunchy Bites', category: 'cold-drinks',
    price: 104, mrp: 109, discount: 10, unit: '750 mL', deliveryTime: '11 MINS',
    image: 'https://th.bing.com/th/id/OIP.s-hBDZsnmKNLa1lzs955ZgHaHa?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 47
  },
  {
    id: 'grok-new-038', name: 'Frozen Cheese Corn Nuggets', brand: 'Grokly Fresh', category: 'dairy-breakfast',
    price: 106, mrp: 111, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://tiimg.tistatic.com/fp/1/009/271/cheese-corn-nuggets-100.jpg',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 48
  },
  {
    id: 'grok-new-039', name: 'Frozen Cocktail Veg Spring Rolls', brand: 'Crunchy Bites', category: 'munchies',
    price: 108, mrp: 113, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://th.bing.com/th/id/R.5ab4810b7d5b4b1675f699fb8a89bf73?rik=TCi8xHFmQv%2fQ4A&riu=http%3a%2f%2fclickathome.com.au%2fcdn%2fshop%2ffiles%2fcocktailspringroll.webp%3fv%3d1753262514&ehk=rq5vGY7COmMkndZBVm4Dbjc89an%2b8GboTNuuXFjTx%2fU%3d&risl=&pid=ImgRaw&r=0',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 49
  },
  {
    id: 'grok-new-040', name: '70% Cocoa Belgian Dark Chocolate', brand: 'Crunchy Bites', category: 'cold-drinks',
    price: 110, mrp: 115, discount: 10, unit: '750 mL', deliveryTime: '11 MINS',
    image: 'https://media.nedigital.sg/fairprice/fpol/media/images/product/XL/13214054_XL1_20220320.jpg?w=1200&q=70',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 50
  },
  {
    id: 'grok-new-041', name: 'Tin of Soft Rasgullas', brand: 'Grokly Fresh', category: 'dairy-breakfast',
    price: 112, mrp: 117, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://www.mystore.in/s/62ea2c599d1398fa16dbae0a/67b31dd135d57760b6c155cd/8904004405729_1-800x800.png',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 51
  },
  {
    id: 'grok-new-042', name: 'Darjeeling Loose Leaf Black Tea', brand: 'Crunchy Bites', category: 'munchies',
    price: 114, mrp: 119, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://tse2.mm.bing.net/th/id/OIP.VI34WnT3BWSQE69Vdb7MsgHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 52
  },
  {
    id: 'grok-new-043', name: 'Roasted Arabica Coffee Beans', brand: 'Crunchy Bites', category: 'cold-drinks',
    price: 116, mrp: 121, discount: 10, unit: '750 mL', deliveryTime: '11 MINS',
    image: 'https://tse1.mm.bing.net/th/id/OIP.o26AxKPqKqhJmIJVE4l5PQHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 53
  },
  {
    id: 'grok-new-044', name: 'Raw Organic Forest Honey', brand: 'Grokly Fresh', category: 'dairy-breakfast',
    price: 118, mrp: 123, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://tse2.mm.bing.net/th/id/OIP.FpIr-euaiRGAZc_VBYwBTAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 54
  },
  {
    id: 'grok-new-045', name: 'Organic White Quinoa Seeds', brand: 'Crunchy Bites', category: 'munchies',
    price: 120, mrp: 125, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://organicandwholesale.com/wp-content/uploads/2021/11/organic_white_quinoa_seeds_1kg_front.jpg',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 55
  },
  {
    id: 'grok-new-046', name: 'Tri-Ply Stainless Steel Kadai', brand: 'Crunchy Bites', category: 'cold-drinks',
    price: 122, mrp: 127, discount: 10, unit: '750 mL', deliveryTime: '11 MINS',
    image: 'https://tse4.mm.bing.net/th/id/OIP.oeMp6jOkUeca5J1FYsPC6AHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 56
  },
  {
    id: 'grok-new-047', name: 'Cast Iron Non-Stick Tawa', brand: 'Grokly Fresh', category: 'dairy-breakfast',
    price: 124, mrp: 129, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/71jozF7IThL._AC_.jpg',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 57
  },
  {
    id: 'grok-new-048', name: 'Gluten-Free Penne Pasta', brand: 'Crunchy Bites', category: 'munchies',
    price: 126, mrp: 131, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://i5.walmartimages.com/asr/5879db53-53d8-4104-822f-a658a0d43cbd.3e4f92e3db04004b8572ded6653bb68f.jpeg',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 58
  },
  {
    id: 'grok-new-049', name: 'Authentic Tahini Sesame Paste', brand: 'Crunchy Bites', category: 'cold-drinks',
    price: 128, mrp: 133, discount: 10, unit: '750 mL', deliveryTime: '11 MINS',
    image: 'https://tse4.mm.bing.net/th/id/OIP.W1AB-9LuzU-jtuXi8NOalgHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 59
  },
  {
    id: 'grok-new-050', name: 'Organic Bamboo Baby Wipes', brand: 'Grokly Fresh', category: 'dairy-breakfast',
    price: 130, mrp: 135, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://tse1.mm.bing.net/th/id/OIP.ruCF5q4WFmkbV8DACaB1FwHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 60
  },
  {
    id: 'grok-new-051', name: 'Mild Baby Shampoo & Wash', brand: 'Crunchy Bites', category: 'munchies',
    price: 132, mrp: 137, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://tse4.mm.bing.net/th/id/OIP.sLtC-tgduA1_Oy1p_WRqTQHaIp?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 61
  },
  {
    id: 'grok-new-052', name: 'Natural Plant-Based Dishwashing Gel', brand: 'Crunchy Bites', category: 'cold-drinks',
    price: 134, mrp: 139, discount: 10, unit: '750 mL', deliveryTime: '11 MINS',
    image: 'https://www.borngood.in/cdn/shop/products/1-website.png?v=1698988609&width=1445',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 62
  },
  {
    id: 'grok-new-053', name: 'Lavender Laundry Liquid Detergent', brand: 'Grokly Fresh', category: 'dairy-breakfast',
    price: 136, mrp: 141, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://tse1.mm.bing.net/th/id/OIP.j1aT-efdXfWXOrMrr6hsiAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 63
  },
  {
    id: 'grok-new-054', name: 'Imported Maple Syrup', brand: 'Crunchy Bites', category: 'munchies',
    price: 138, mrp: 143, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://tse1.mm.bing.net/th/id/OIP.1fx3qYrsmbFEWq_J4ouTywHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 64
  },
  {
    id: 'grok-new-055', name: 'Italian Balsamic Vinegar of Modena', brand: 'Crunchy Bites', category: 'cold-drinks',
    price: 140, mrp: 145, discount: 10, unit: '750 mL', deliveryTime: '11 MINS',
    image: 'https://th.bing.com/th/id/R.3b102efd936764b818d22db6fa418c75?rik=4X4rHtxNgGAa1w&riu=http%3a%2f%2fyummybazaar.com%2fcdn%2fshop%2fproducts%2feb871dc996c311b484-10df-429c-b81f-57ed0a90d709.jpg%3fv%3d1667857255&ehk=TXv6EQZEMtQ2%2fRbgfMbD6LAE2mF6ThiJUfH4Ov9OCZA%3d&risl=&pid=ImgRaw&r=0',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 65
  },


  // ========== VEGETABLES & FRUITS ==========
  {
    id: 'veg-001', name: 'Tomato - Hybrid', brand: 'Fresho', category: 'vegetables-fruits',
    price: 28, mrp: 35, discount: 20, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1199562/pexels-photo-1199562.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.2, reviews: 1240
  },
  {
    id: 'veg-002', name: 'Onion', brand: 'Fresho', category: 'vegetables-fruits',
    price: 35, mrp: 40, discount: 12, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/533360/pexels-photo-533360.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.1, reviews: 980
  },
  {
    id: 'veg-003', name: 'Potato', brand: 'Fresho', category: 'vegetables-fruits',
    price: 22, mrp: 28, discount: 21, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1435706/pexels-photo-1435706.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.3, reviews: 1560
  },
  {
    id: 'veg-004', name: 'Capsicum - Green', brand: 'Fresho', category: 'vegetables-fruits',
    price: 45, mrp: 55, discount: 18, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?w=300',
    inStock: true, rating: 4.0, reviews: 450
  },
  {
    id: 'veg-005', name: 'Carrot', brand: 'Fresho', category: 'vegetables-fruits',
    price: 38, mrp: 45, discount: 15, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg?w=300',
    inStock: true, rating: 4.4, reviews: 780
  },
  {
    id: 'veg-006', name: 'Cucumber', brand: 'Fresho', category: 'vegetables-fruits',
    price: 32, mrp: 40, discount: 20, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=300',
    inStock: true, rating: 4.2, reviews: 560
  },
  {
    id: 'veg-007', name: 'Cauliflower', brand: 'Fresho', category: 'vegetables-fruits',
    price: 42, mrp: 50, discount: 16, unit: '1 pc', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1023354/pexels-photo-1023354.jpeg?w=300',
    inStock: true, rating: 4.1, reviews: 340
  },
  {
    id: 'veg-008', name: 'Cabbage', brand: 'Fresho', category: 'vegetables-fruits',
    price: 28, mrp: 35, discount: 20, unit: '1 pc', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg?w=300',
    inStock: true, rating: 4.0, reviews: 290
  },
  {
    id: 'veg-009', name: 'Brinjal', brand: 'Fresho', category: 'vegetables-fruits',
    price: 35, mrp: 42, discount: 16, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/768094/pexels-photo-768094.jpeg?w=300',
    inStock: true, rating: 3.9, reviews: 210
  },
  {
    id: 'veg-010', name: 'Ladies Finger (Bhindi)', brand: 'Fresho', category: 'vegetables-fruits',
    price: 48, mrp: 60, discount: 20, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1560932/pexels-photo-1560932.jpeg?w=300',
    inStock: true, rating: 4.2, reviews: 380
  },
  {
    id: 'fruit-001', name: 'Banana - Robusta', brand: 'Fresho', category: 'vegetables-fruits',
    price: 55, mrp: 65, discount: 15, unit: '6 pcs', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/2284166/pexels-photo-2284166.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 2100
  },
  {
    id: 'fruit-002', name: 'Apple - Shimla', brand: 'Fresho', category: 'vegetables-fruits',
    price: 165, mrp: 195, discount: 15, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 1890
  },
  {
    id: 'fruit-003', name: 'Watermelon', brand: 'Fresho', category: 'vegetables-fruits',
    price: 45, mrp: 55, discount: 18, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1453499/pexels-photo-1453499.jpeg?w=300',
    inStock: true, rating: 4.3, reviews: 670
  },
  {
    id: 'fruit-004', name: 'Mango - Alphonso', brand: 'Fresho', category: 'vegetables-fruits',
    price: 285, mrp: 350, discount: 18, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/3629537/pexels-photo-3629537.jpeg?w=300',
    inStock: true, tags: ['Premium'], rating: 4.7, reviews: 1240
  },
  {
    id: 'fruit-005', name: 'Orange', brand: 'Fresho', category: 'vegetables-fruits',
    price: 95, mrp: 115, discount: 17, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/3735149/pexels-photo-3735149.jpeg?w=300',
    inStock: true, rating: 4.4, reviews: 890
  },
  {
    id: 'fruit-006', name: 'Grapes - Green', brand: 'Fresho', category: 'vegetables-fruits',
    price: 125, mrp: 145, discount: 13, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1643456/pexels-photo-1643456.jpeg?w=300',
    inStock: true, rating: 4.5, reviews: 1120
  },
  {
    id: 'fruit-007', name: 'Pomegranate', brand: 'Fresho', category: 'vegetables-fruits',
    price: 185, mrp: 220, discount: 15, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1199562/pexels-photo-1199562.jpeg?w=300',
    inStock: true, rating: 4.6, reviews: 780
  },
  {
    id: 'fruit-008', name: 'Papaya', brand: 'Fresho', category: 'vegetables-fruits',
    price: 38, mrp: 48, discount: 20, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/533360/pexels-photo-533360.jpeg?w=300',
    inStock: true, rating: 4.2, reviews: 450
  },
  {
    id: 'fruit-009', name: 'Pineapple', brand: 'Fresho', category: 'vegetables-fruits',
    price: 65, mrp: 80, discount: 18, unit: '1 pc', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1435706/pexels-photo-1435706.jpeg?w=300',
    inStock: true, rating: 4.4, reviews: 620
  },
  {
    id: 'fruit-010', name: 'Sweet Lime (Mosambi)', brand: 'Fresho', category: 'vegetables-fruits',
    price: 85, mrp: 100, discount: 15, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?w=300',
    inStock: true, rating: 4.3, reviews: 340
  },

  // ========== DAIRY & BREAKFAST ==========
  {
    id: 'dairy-001', name: 'Amul Taaza Toned Fresh Milk', brand: 'Amul', category: 'dairy-breakfast',
    price: 27, mrp: 30, discount: 10, unit: '500 ml', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/704569/pexels-photo-704569.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 3450, returnable: true
  },
  {
    id: 'dairy-002', name: 'Amul Gold Full Cream Fresh Milk', brand: 'Amul', category: 'dairy-breakfast',
    price: 32, mrp: 35, discount: 8, unit: '500 ml', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.7, reviews: 2890, returnable: true
  },
  {
    id: 'dairy-003', name: 'Mother Dairy Classic Curd', brand: 'Mother Dairy', category: 'dairy-breakfast',
    price: 30, mrp: 35, discount: 14, unit: '400 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/357573/pexels-photo-357573.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 2340, returnable: true
  },
  {
    id: 'dairy-004', name: 'Amul Butter - Salted', brand: 'Amul', category: 'dairy-breakfast',
    price: 58, mrp: 60, discount: 3, unit: '100 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/209540/pexels-photo-209540.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.8, reviews: 4560
  },
  {
    id: 'dairy-005', name: 'Amul Cheese Slices', brand: 'Amul', category: 'dairy-breakfast',
    price: 135, mrp: 145, discount: 6, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/302905/pexels-photo-302905.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 1890
  },
  {
    id: 'dairy-006', name: 'Amul Fresh Cream', brand: 'Amul', category: 'dairy-breakfast',
    price: 52, mrp: 55, discount: 5, unit: '250 ml', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/128402/pexels-photo-128402.jpeg?w=300',
    inStock: true, rating: 4.5, reviews: 1230, returnable: true
  },
  {
    id: 'dairy-007', name: 'Britannia Bread - Whole Wheat', brand: 'Britannia', category: 'dairy-breakfast',
    price: 45, mrp: 50, discount: 10, unit: '450 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/277253/pexels-photo-277253.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.4, reviews: 2670
  },
  {
    id: 'dairy-008', name: 'Harvest Gold Bread - White', brand: 'Harvest Gold', category: 'dairy-breakfast',
    price: 40, mrp: 45, discount: 11, unit: '400 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?w=300',
    inStock: true, rating: 4.3, reviews: 1890
  },
  {
    id: 'dairy-009', name: 'Amul Masti Buttermilk', brand: 'Amul', category: 'dairy-breakfast',
    price: 20, mrp: 22, discount: 9, unit: '200 ml', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?w=300',
    inStock: true, rating: 4.4, reviews: 980, returnable: true
  },
  {
    id: 'dairy-010', name: 'Nestle Milkmaid', brand: 'Nestle', category: 'dairy-breakfast',
    price: 125, mrp: 135, discount: 7, unit: '380 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg?w=300',
    inStock: true, rating: 4.7, reviews: 1450
  },

  // ========== MUNCHIES ==========
  {
    id: 'munch-001', name: "Lays Potato Chips - India's Magic Masala", brand: 'Lays', category: 'munchies',
    price: 20, mrp: 20, discount: 0, unit: '52 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1600711/pexels-photo-1600711.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 5670
  },
  {
    id: 'munch-002', name: 'Kurkure Masala Munch', brand: 'Kurkure', category: 'munchies',
    price: 20, mrp: 20, discount: 0, unit: '78 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.4, reviews: 4230
  },
  {
    id: 'munch-003', name: "Haldiram's Aloo Bhujia", brand: "Haldiram's", category: 'munchies',
    price: 55, mrp: 60, discount: 8, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1028704/pexels-photo-1028704.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 3890
  },
  {
    id: 'munch-004', name: 'Bingo! Mad Angles - Achari Masti', brand: 'Bingo', category: 'munchies',
    price: 20, mrp: 20, discount: 0, unit: '72.5 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?w=300',
    inStock: true, rating: 4.3, reviews: 2340
  },
  {
    id: 'munch-005', name: 'Doritos Nacho Cheese', brand: 'Doritos', category: 'munchies',
    price: 30, mrp: 30, discount: 0, unit: '60 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/952344/pexels-photo-952344.jpeg?w=300',
    inStock: true, rating: 4.5, reviews: 1890
  },
  {
    id: 'munch-006', name: 'Pringles Original', brand: 'Pringles', category: 'munchies',
    price: 99, mrp: 110, discount: 10, unit: '107 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?w=300',
    inStock: true, rating: 4.6, reviews: 2670
  },
  {
    id: 'munch-007', name: "Haldiram's Moong Dal", brand: "Haldiram's", category: 'munchies',
    price: 50, mrp: 55, discount: 9, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/2611517/pexels-photo-2611517.jpeg?w=300',
    inStock: true, rating: 4.5, reviews: 1560
  },
  {
    id: 'munch-008', name: 'Bikaji Bhujia Sev', brand: 'Bikaji', category: 'munchies',
    price: 45, mrp: 50, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1600711/pexels-photo-1600711.jpeg?w=300',
    inStock: true, rating: 4.4, reviews: 1230
  },
  {
    id: 'munch-009', name: 'Balaji Wafers - Masala Masti', brand: 'Balaji', category: 'munchies',
    price: 10, mrp: 10, discount: 0, unit: '35 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=300',
    inStock: true, rating: 4.2, reviews: 890
  },
  {
    id: 'munch-010', name: 'Uncle Chipps Spicy Treat', brand: 'Uncle Chipps', category: 'munchies',
    price: 20, mrp: 20, discount: 0, unit: '55 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1028704/pexels-photo-1028704.jpeg?w=300',
    inStock: true, rating: 4.3, reviews: 1120
  },

  // ========== COLD DRINKS & JUICES ==========
  {
    id: 'drink-001', name: 'Coca-Cola Soft Drink', brand: 'Coca-Cola', category: 'cold-drinks',
    price: 40, mrp: 45, discount: 11, unit: '750 ml', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/339696/pexels-photo-339696.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 3450
  },
  {
    id: 'drink-002', name: 'Sprite Lime Flavoured Soft Drink', brand: 'Sprite', category: 'cold-drinks',
    price: 40, mrp: 45, discount: 11, unit: '750 ml', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/158053/ketchup-fast-food-eating-158053.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.4, reviews: 2890
  },
  {
    id: 'drink-003', name: 'Tropicana Mixed Fruit Juice', brand: 'Tropicana', category: 'cold-drinks',
    price: 110, mrp: 120, discount: 8, unit: '1 l', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg?w=300',
    inStock: true, rating: 4.6, reviews: 1890
  },
  {
    id: 'drink-004', name: 'Real Fruit Power - Mixed Fruit', brand: 'Real', category: 'cold-drinks',
    price: 95, mrp: 105, discount: 9, unit: '1 l', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?w=300',
    inStock: true, rating: 4.5, reviews: 1560
  },
  {
    id: 'drink-005', name: 'Pepsi Black', brand: 'Pepsi', category: 'cold-drinks',
    price: 40, mrp: 45, discount: 11, unit: '750 ml', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/3407777/pexels-photo-3407777.jpeg?w=300',
    inStock: true, rating: 4.3, reviews: 1230
  },

  // ========== INSTANT & FROZEN FOOD ==========
  {
    id: 'instant-001', name: 'Maggi 2-Minute Masala Noodles', brand: 'Maggi', category: 'instant-frozen',
    price: 14, mrp: 15, discount: 6, unit: '70 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/8697474/pexels-photo-8697474.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.7, reviews: 8900
  },
  {
    id: 'instant-002', name: 'Yippee! Magic Masala Noodles', brand: 'Yippee', category: 'instant-frozen',
    price: 12, mrp: 14, discount: 14, unit: '70 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/5718095/pexels-photo-5718095.jpeg?w=300',
    inStock: true, rating: 4.4, reviews: 3450
  },
  {
    id: 'instant-003', name: 'McCain French Fries', brand: 'McCain', category: 'instant-frozen',
    price: 135, mrp: 150, discount: 10, unit: '420 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/5718092/pexels-photo-5718092.jpeg?w=300',
    inStock: true, rating: 4.5, reviews: 2340
  },

  // ========== TEA, COFFEE & HEALTH ==========
  {
    id: 'tea-001', name: 'Tata Tea Gold', brand: 'Tata Tea', category: 'tea-coffee',
    price: 235, mrp: 250, discount: 6, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/685527/pexels-photo-685527.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 4560
  },
  {
    id: 'tea-002', name: 'Nescafe Classic Coffee', brand: 'Nescafe', category: 'tea-coffee',
    price: 320, mrp: 350, discount: 8, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/3020919/pexels-photo-3020919.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.7, reviews: 3890
  },
  {
    id: 'tea-003', name: 'Red Label Natural Care Tea', brand: 'Red Label', category: 'tea-coffee',
    price: 265, mrp: 285, discount: 7, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1415555/pexels-photo-1415555.jpeg?w=300',
    inStock: true, rating: 4.5, reviews: 2670
  },

  // ========== BAKERY & BISCUITS ==========
  {
    id: 'bakery-001', name: 'Parle-G Gold Biscuits', brand: 'Parle', category: 'bakery-biscuits',
    price: 10, mrp: 10, discount: 0, unit: '100 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 12340
  },
  {
    id: 'bakery-002', name: 'Britannia Good Day Butter Cookies', brand: 'Britannia', category: 'bakery-biscuits',
    price: 35, mrp: 40, discount: 12, unit: '150 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/53464/cinnamon-roll-rolls-pastry-sweet-53464.jpeg?w=300',
    inStock: true, rating: 4.5, reviews: 5670
  },
  {
    id: 'bakery-003', name: 'Sunfeast Dark Fantasy Choco Fills', brand: 'Sunfeast', category: 'bakery-biscuits',
    price: 40, mrp: 45, discount: 11, unit: '150 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/2422291/pexels-photo-2422291.jpeg?w=300',
    inStock: true, rating: 4.7, reviews: 4230
  },

  // ========== SWEET TOOTH ==========
  {
    id: 'sweet-001', name: 'Cadbury Dairy Milk Chocolate', brand: 'Cadbury', category: 'sweet-tooth',
    price: 45, mrp: 50, discount: 10, unit: '55 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/3321560/pexels-photo-3321560.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.8, reviews: 8900
  },
  {
    id: 'sweet-002', name: 'KitKat Chocolate', brand: 'KitKat', category: 'sweet-tooth',
    price: 20, mrp: 20, discount: 0, unit: '27 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?w=300',
    inStock: true, rating: 4.6, reviews: 5670
  },
  {
    id: 'sweet-003', name: '5 Star Chocolate', brand: '5 Star', category: 'sweet-tooth',
    price: 10, mrp: 10, discount: 0, unit: '22 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg?w=300',
    inStock: true, rating: 4.5, reviews: 3450
  },

  // ========== ATTA, RICE & DAL ==========
  {
    id: 'atta-001', name: 'Aashirvaad Whole Wheat Atta', brand: 'Aashirvaad', category: 'atta-rice-dal',
    price: 285, mrp: 310, discount: 8, unit: '5 kg', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.7, reviews: 6780
  },
  {
    id: 'atta-002', name: 'India Gate Basmati Rice', brand: 'India Gate', category: 'atta-rice-dal',
    price: 525, mrp: 575, discount: 8, unit: '5 kg', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?w=300',
    inStock: true, rating: 4.6, reviews: 4560
  },
  {
    id: 'atta-003', name: 'Tata Sampann Toor Dal', brand: 'Tata Sampann', category: 'atta-rice-dal',
    price: 145, mrp: 160, discount: 9, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg?w=300',
    inStock: true, rating: 4.5, reviews: 2340
  },

  // ========== MASALA, OIL & MORE ==========
  {
    id: 'masala-001', name: 'Fortune Sunflower Refined Oil', brand: 'Fortune', category: 'masala-oil',
    price: 185, mrp: 200, discount: 7, unit: '1 l', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1435706/pexels-photo-1435706.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 3890
  },
  {
    id: 'masala-002', name: 'MDH Chana Masala', brand: 'MDH', category: 'masala-oil',
    price: 95, mrp: 105, discount: 9, unit: '100 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/4004464/pexels-photo-4004464.jpeg?w=300',
    inStock: true, rating: 4.6, reviews: 2670
  },
  {
    id: 'masala-003', name: 'Everest Garam Masala', brand: 'Everest', category: 'masala-oil',
    price: 85, mrp: 95, discount: 10, unit: '100 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?w=300',
    inStock: true, rating: 4.5, reviews: 1890
  },

  // ========== SAUCES & SPREADS ==========
  {
    id: 'sauce-001', name: 'Kissan Fresh Tomato Ketchup', brand: 'Kissan', category: 'sauces-spreads',
    price: 95, mrp: 105, discount: 9, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/3659862/pexels-photo-3659862.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 4560
  },
  {
    id: 'sauce-002', name: 'Maggi Hot & Sweet Tomato Chilli Sauce', brand: 'Maggi', category: 'sauces-spreads',
    price: 85, mrp: 95, discount: 10, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/434258/pexels-photo-434258.jpeg?w=300',
    inStock: true, rating: 4.5, reviews: 2340
  },
  {
    id: 'sauce-003', name: 'Nutella Hazelnut Spread', brand: 'Nutella', category: 'sauces-spreads',
    price: 385, mrp: 420, discount: 8, unit: '350 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/6996072/pexels-photo-6996072.jpeg?w=300',
    inStock: true, rating: 4.7, reviews: 3450
  },

  // ========== ORGANIC & HEALTHY ==========
  {
    id: 'organic-001', name: 'Organic India Tulsi Green Tea', brand: 'Organic India', category: 'organic-healthy',
    price: 185, mrp: 210, discount: 11, unit: '25 tea bags', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/3735149/pexels-photo-3735149.jpeg?w=300',
    inStock: true, rating: 4.6, reviews: 1890
  },
  {
    id: 'organic-002', name: 'Soulfull Ragi Bites', brand: 'Soulfull', category: 'organic-healthy',
    price: 125, mrp: 140, discount: 10, unit: '250 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?w=300',
    inStock: true, rating: 4.5, reviews: 1230
  },
  {
    id: 'gym-001', name: 'Yoga Bar 26g Protein Milk Shake - Chocolate', brand: 'Yogabar', category: 'organic-healthy',
    price: 98, mrp: 131, discount: 25, unit: '250 ml', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/3629537/pexels-photo-3629537.jpeg?w=300',
    inStock: true, tags: ['Premium'], rating: 4.6, reviews: 320
  },
  {
    id: 'gym-002', name: 'Yogabar 10g Protein Bars - Blueberry Blast', brand: 'Yogabar', category: 'organic-healthy',
    price: 44, mrp: 65, discount: 32, unit: '50 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=300',
    inStock: true, rating: 4.4, reviews: 150
  },
  {
    id: 'gym-003', name: 'Yogabar Multigrain Energy Bars - Chocolate Chunk', brand: 'Yogabar', category: 'organic-healthy',
    price: 30, mrp: 45, discount: 33, unit: '35 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1199562/pexels-photo-1199562.jpeg?w=300',
    inStock: true, rating: 4.3, reviews: 110
  },
  {
    id: 'gym-004', name: 'RiteBite Max Protein Barbeque - Multigrain', brand: 'RiteBite', category: 'organic-healthy',
    price: 42, mrp: 45, discount: 6, unit: '60 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1435706/pexels-photo-1435706.jpeg?w=300',
    inStock: true, rating: 4.1, reviews: 90
  },
  {
    id: 'gym-005', name: 'GNC Pro Performance Complete Whey Protein Powder', brand: 'GNC', category: 'organic-healthy',
    price: 4527, mrp: 5689, discount: 20, unit: '1.81 kg', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/3735149/pexels-photo-3735149.jpeg?w=300',
    inStock: true, tags: ['Premium', 'Bestseller'], rating: 4.7, reviews: 880
  },
  {
    id: 'gym-006', name: 'Oziva Bioactive Plant Protein - Vanilla', brand: 'Oziva', category: 'organic-healthy',
    price: 1559, mrp: 2799, discount: 44, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?w=300',
    inStock: true, rating: 4.5, reviews: 460
  },
  {
    id: 'gym-007', name: 'Yoga Bar Power Up 20g - Coffee Crush', brand: 'Yogabar', category: 'organic-healthy',
    price: 94, mrp: 125, discount: 24, unit: '70 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/3629537/pexels-photo-3629537.jpeg?w=300',
    inStock: true, rating: 4.4, reviews: 180
  },
  {
    id: 'gym-008', name: 'Yoga Bar Protein Minis - Choco Peanut Butter', brand: 'Yogabar', category: 'organic-healthy',
    price: 121, mrp: 175, discount: 30, unit: '7 x 20 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=300',
    inStock: true, rating: 4.5, reviews: 220
  },

  // ========== BABY CARE ==========
  {
    id: 'baby-001', name: 'Pampers Baby Dry Pants', brand: 'Pampers', category: 'baby-care',
    price: 999, mrp: 1099, discount: 9, unit: '56 pants', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/35537/child-children-girl-happy.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.7, reviews: 5670
  },
  {
    id: 'baby-002', name: 'Cerelac Wheat Apple', brand: 'Cerelac', category: 'baby-care',
    price: 235, mrp: 260, discount: 9, unit: '300 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/35188/pexels-photo-35188.jpeg?w=300',
    inStock: true, rating: 4.6, reviews: 2340
  },

  // ========== PHARMA & WELLNESS ==========
  {
    id: 'pharma-001', name: 'Dettol Antiseptic Liquid', brand: 'Dettol', category: 'pharma-wellness',
    price: 125, mrp: 140, discount: 10, unit: '250 ml', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/593451/pexels-photo-593451.jpeg?w=300',
    inStock: true, rating: 4.6, reviews: 3450
  },
  {
    id: 'pharma-002', name: 'Vicks Vaporub', brand: 'Vicks', category: 'pharma-wellness',
    price: 95, mrp: 105, discount: 9, unit: '50 ml', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg?w=300',
    inStock: true, rating: 4.5, reviews: 2670
  },

  // ========== CLEANING ESSENTIALS ==========
  {
    id: 'clean-001', name: 'Vim Dishwash Gel', brand: 'Vim', category: 'cleaning',
    price: 125, mrp: 140, discount: 10, unit: '750 ml', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/4239031/pexels-photo-4239031.jpeg?w=300',
    inStock: true, rating: 4.5, reviews: 2340
  },
  {
    id: 'clean-002', name: 'Harpic Toilet Cleaner', brand: 'Harpic', category: 'cleaning',
    price: 185, mrp: 210, discount: 11, unit: '1 l', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/4239075/pexels-photo-4239075.jpeg?w=300',
    inStock: true, rating: 4.6, reviews: 1890
  },

  // ========== HOME & OFFICE ==========
  {
    id: 'home-001', name: 'Scotch Brite Scrub Pad', brand: 'Scotch Brite', category: 'home-office',
    price: 35, mrp: 40, discount: 12, unit: '3 pcs', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?w=300',
    inStock: true, rating: 4.5, reviews: 1560
  },

  // ========== PERSONAL CARE ==========
  {
    id: 'personal-001', name: 'Colgate Total Toothpaste', brand: 'Colgate', category: 'personal-care',
    price: 95, mrp: 110, discount: 13, unit: '140 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/3735629/pexels-photo-3735629.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 4560
  },
  {
    id: 'personal-002', name: 'Dove Soap', brand: 'Dove', category: 'personal-care',
    price: 65, mrp: 75, discount: 13, unit: '100 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/3659862/pexels-photo-3659862.jpeg?w=300',
    inStock: true, rating: 4.7, reviews: 3890
  },

  // ========== PET CARE ==========
  {
    id: 'pet-001', name: 'Pedigree Adult Dog Food', brand: 'Pedigree', category: 'pet-care',
    price: 385, mrp: 425, discount: 9, unit: '1.2 kg', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?w=300',
    inStock: true, rating: 4.5, reviews: 1890
  },
  {
    id: 'pet-002', name: 'Whiskas Cat Food', brand: 'Whiskas', category: 'pet-care',
    price: 185, mrp: 210, discount: 11, unit: '480 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/209037/pexels-photo-209037.jpeg?w=300',
    inStock: true, rating: 4.4, reviews: 1230
  },

  // ========== DISH INGREDIENTS ==========
  {
    id: 'dish-paneer', name: 'Milky Mist Paneer', brand: 'Milky Mist', category: 'dairy-breakfast',
    price: 82, mrp: 130, discount: 37, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/704569/pexels-photo-704569.jpeg?w=300',
    inStock: true, tags: ['Bestseller', 'Protein Rich'], rating: 4.6, reviews: 860
  },
  {
    id: 'dish-marinade', name: 'Everest Tikhalal Powder Pouch', brand: 'Everest', category: 'masala-oil',
    price: 52, mrp: 60, discount: 13, unit: '100 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1441419/pexels-photo-1441419.jpeg?w=300',
    inStock: true, rating: 4.5, reviews: 180
  },
  {
    id: 'dish-yogurt', name: 'Milky Mist Greek Yogurt', brand: 'Milky Mist', category: 'dairy-breakfast',
    price: 35, mrp: 55, discount: 36, unit: '1 pc (100 g)', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?w=300',
    inStock: true, rating: 4.6, reviews: 260
  },
  {
    id: 'dish-ginger-garlic', name: 'Ginger Garlic Paste', brand: 'Everest', category: 'masala-oil',
    price: 45, mrp: 58, discount: 22, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg?w=300',
    inStock: true, rating: 4.6, reviews: 225
  },

  // ═══════════════════ EXPANSION: 75 NEW SKUS ═══════════════════

  // ── Vegetables & Fruits (9 new) ──
  { id: 'veg-011', name: 'Spinach', brand: 'Fresho', category: 'vegetables-fruits', price: 25, mrp: 32, discount: 22, unit: '200 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.3, reviews: 620 },
  { id: 'veg-012', name: 'Garlic', brand: 'Fresho', category: 'vegetables-fruits', price: 30, mrp: 38, discount: 21, unit: '100 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=300', inStock: true, rating: 4.4, reviews: 880 },
  { id: 'veg-013', name: 'Ginger', brand: 'Fresho', category: 'vegetables-fruits', price: 28, mrp: 35, discount: 20, unit: '100 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/1023354/pexels-photo-1023354.jpeg?w=300', inStock: true, rating: 4.2, reviews: 490 },
  { id: 'veg-014', name: 'Green Chilli', brand: 'Fresho', category: 'vegetables-fruits', price: 18, mrp: 24, discount: 25, unit: '100 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg?w=300', inStock: true, rating: 4.0, reviews: 310 },
  { id: 'veg-015', name: 'Banana - Robusta', brand: 'Fresho', category: 'vegetables-fruits', price: 42, mrp: 50, discount: 16, unit: '6 pcs', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/768094/pexels-photo-768094.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 1420 },
  { id: 'veg-016', name: 'Apple - Royal Gala', brand: 'Fresho', category: 'vegetables-fruits', price: 120, mrp: 150, discount: 20, unit: '4 pcs (apx 700 g)', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/1560932/pexels-photo-1560932.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 2100 },
  { id: 'veg-017', name: 'Mango - Alphonso', brand: 'Fresho', category: 'vegetables-fruits', price: 160, mrp: 200, discount: 20, unit: '3 pcs (apx 600 g)', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/2284166/pexels-photo-2284166.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.8, reviews: 3200 },
  { id: 'veg-018', name: 'Sweet Corn', brand: 'Fresho', category: 'vegetables-fruits', price: 35, mrp: 45, discount: 22, unit: '2 pcs', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?w=300', inStock: true, rating: 4.3, reviews: 520 },
  { id: 'veg-029', name: 'Bottle Gourd (Lauki)', brand: 'Fresho', category: 'vegetables-fruits', price: 30, mrp: 38, discount: 21, unit: '1 pc (apx 500 g)', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/1453499/pexels-photo-1453499.jpeg?w=300', inStock: true, rating: 4.0, reviews: 240 },

  // ── Dairy & Breakfast (7 new) ──
  { id: 'dairy-011', name: 'Amul Mozzarella Cheese Block', brand: 'Amul', category: 'dairy-breakfast', price: 110, mrp: 130, discount: 15, unit: '200 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/357573/pexels-photo-357573.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.7, reviews: 1850 },
  { id: 'dairy-012', name: 'Mother Dairy Mishti Doi', brand: 'Mother Dairy', category: 'dairy-breakfast', price: 40, mrp: 50, discount: 20, unit: '400 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/209540/pexels-photo-209540.jpeg?w=300', inStock: true, rating: 4.5, reviews: 920 },
  { id: 'dairy-013', name: 'Epigamia Greek Yogurt - Mango', brand: 'Epigamia', category: 'dairy-breakfast', price: 60, mrp: 75, discount: 20, unit: '90 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/302905/pexels-photo-302905.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 1340 },
  { id: 'dairy-014', name: 'Amul Cream - Fresh', brand: 'Amul', category: 'dairy-breakfast', price: 30, mrp: 38, discount: 21, unit: '100 ml', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/128402/pexels-photo-128402.jpeg?w=300', inStock: true, rating: 4.4, reviews: 660 },
  { id: 'dairy-015', name: 'Saffola Oats - Classic', brand: 'Saffola', category: 'dairy-breakfast', price: 130, mrp: 165, discount: 21, unit: '500 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/277253/pexels-photo-277253.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 2200 },
  { id: 'dairy-016', name: 'Kellogg Corn Flakes - Original', brand: 'Kellogg', category: 'dairy-breakfast', price: 125, mrp: 155, discount: 19, unit: '500 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.4, reviews: 1800 },
  { id: 'dairy-017', name: 'Amul Lassi - Rose', brand: 'Amul', category: 'dairy-breakfast', price: 30, mrp: 38, discount: 21, unit: '200 ml', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?w=300', inStock: true, rating: 4.3, reviews: 780 },

  // ── Munchies (8 new) ──
  { id: 'munch-011', name: "Lay's Classic Salted Chips", brand: "Lay's", category: 'munchies', price: 20, mrp: 20, discount: 0, unit: '52 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.3, reviews: 3100 },
  { id: 'munch-012', name: 'Kurkure Masala Munch', brand: 'Kurkure', category: 'munchies', price: 10, mrp: 10, discount: 0, unit: '22 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/2611517/pexels-photo-2611517.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.2, reviews: 4100 },
  { id: 'munch-013', name: 'Bingo! Mad Angles', brand: 'Bingo', category: 'munchies', price: 20, mrp: 20, discount: 0, unit: '55 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/1600711/pexels-photo-1600711.jpeg?w=300', inStock: true, rating: 4.1, reviews: 1640 },
  { id: 'munch-014', name: 'Parle G Biscuits', brand: 'Parle', category: 'munchies', price: 10, mrp: 10, discount: 0, unit: '200 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 5600 },
  { id: 'munch-015', name: 'Too Yumm! Multigrain Chips', brand: 'Too Yumm', category: 'munchies', price: 25, mrp: 30, discount: 17, unit: '65 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/1028704/pexels-photo-1028704.jpeg?w=300', inStock: true, rating: 4.0, reviews: 820 },
  { id: 'munch-016', name: 'Pringles Original', brand: 'Pringles', category: 'munchies', price: 115, mrp: 150, discount: 23, unit: '134 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?w=300', inStock: true, rating: 4.6, reviews: 2800 },

  // ── Cold Drinks & Juices (6 new) ──
  { id: 'drinks-001', name: 'Coca Cola - Can', brand: 'Coca Cola', category: 'cold-drinks', price: 45, mrp: 50, discount: 10, unit: '330 ml', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/3407777/pexels-photo-3407777.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.3, reviews: 4100 },
  { id: 'drinks-002', name: 'Tropicana Orange Juice', brand: 'Tropicana', category: 'cold-drinks', price: 90, mrp: 110, discount: 18, unit: '750 mL', deliveryTime: '11 MINS', image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQe2crfoOA9eHV4KyN7G7zJgwHIZkfMzFvJ1I0CPeh4HEmr7oEySen8xVXOVUj6uGpG0yFHOtPee-X3xKqsYNTH7kcvfRxez-pJdUy-Yp2x1fL6FOCvPM-aFg', inStock: true, tags: ['Bestseller'], rating: 4.4, reviews: 2600 },
  { id: 'drinks-003', name: 'Paper Boat Aamras', brand: 'Paper Boat', category: 'cold-drinks', price: 35, mrp: 45, discount: 22, unit: '250 ml', deliveryTime: '11 MINS', image: 'data:image/webp;base64,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', inStock: true, rating: 4.5, reviews: 1780 },
  { id: 'drinks-004', name: 'Red Bull Energy Drink', brand: 'Red Bull', category: 'cold-drinks', price: 125, mrp: 150, discount: 17, unit: '250 ml', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxDd6NXWRktcbWajDDupnthJVize-RaGWkZErOWqqXi1ZUmPgTrEPZ0xE7-vczxgjTvzILVxPA8VEtsWG3Ynn9MYAqQyO8Dm5vxBCrnJqYKw&s=10', inStock: true, rating: 4.4, reviews: 2100 },
  { id: 'drinks-005', name: 'Sprite - Bottle', brand: 'Sprite', category: 'cold-drinks', price: 40, mrp: 45, discount: 11, unit: '750 ml', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/544961/pexels-photo-544961.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.2, reviews: 3400 },
  { id: 'drinks-006', name: 'Real Mixed Fruit Juice', brand: 'Real', category: 'cold-drinks', price: 75, mrp: 90, discount: 17, unit: '750 mL', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/339696/pexels-photo-339696.jpeg?w=300', inStock: true, rating: 4.3, reviews: 1560 },

  // ── Instant & Frozen (6 new) ──
  { id: 'instant-007', name: 'McCain Smiles Potato Snacks', brand: 'McCain', category: 'instant-frozen', price: 130, mrp: 165, discount: 21, unit: '415 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/5718092/pexels-photo-5718092.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 2800 },
  { id: 'instant-004', name: 'Haldiram Instant Poha', brand: 'Haldiram', category: 'instant-frozen', price: 45, mrp: 55, discount: 18, unit: '240 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/6210764/pexels-photo-6210764.jpeg?w=300', inStock: true, rating: 4.2, reviews: 1100 },
  { id: 'instant-005', name: 'Ching Schezwan Chutney', brand: "Ching's", category: 'instant-frozen', price: 55, mrp: 70, discount: 21, unit: '250 g', deliveryTime: '11 MINS', image: 'data:image/jpeg;base64,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', inStock: true, rating: 4.4, reviews: 1980 },
  { id: 'instant-006', name: 'MTR Instant Poha Mix', brand: 'MTR', category: 'instant-frozen', price: 55, mrp: 70, discount: 21, unit: '500 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/4518673/pexels-photo-4518673.jpeg?w=300', inStock: true, rating: 4.3, reviews: 900 },

  // ── Tea & Coffee (5 new) ──
  { id: 'tea-006', name: 'Tata Tea Gold', brand: 'Tata Tea', category: 'tea-coffee', price: 130, mrp: 165, discount: 21, unit: '250 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 4800 },
  { id: 'tea-007', name: 'Nescafe Classic Instant Coffee', brand: 'Nescafe', category: 'tea-coffee', price: 95, mrp: 120, discount: 21, unit: '50 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 3600 },
  { id: 'tea-008', name: 'Bru Roasted & Ground Coffee', brand: 'Bru', category: 'tea-coffee', price: 75, mrp: 95, discount: 21, unit: '100 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?w=300', inStock: true, rating: 4.4, reviews: 2100 },
  { id: 'tea-004', name: "Lipton Green Tea - Honey Lemon", brand: 'Lipton', category: 'tea-coffee', price: 175, mrp: 220, discount: 20, unit: '25 bags', deliveryTime: '11 MINS', image: 'data:image/jpeg;base64,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', inStock: true, rating: 4.3, reviews: 1560 },
  { id: 'tea-005', name: 'Blue Tokai Filter Coffee', brand: 'Blue Tokai', category: 'tea-coffee', price: 395, mrp: 450, discount: 12, unit: '250 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/544961/pexels-photo-544961.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.8, reviews: 2800 },

  // ── Bakery & Biscuits (5 new) ──
  { id: 'bakery-006', name: 'Britannia Good Day Cashew Cookies', brand: 'Britannia', category: 'bakery-biscuits', price: 30, mrp: 35, discount: 14, unit: '100 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 3900 },
  { id: 'bakery-007', name: "Oreo Original Cookies", brand: 'Oreo', category: 'bakery-biscuits', price: 35, mrp: 40, discount: 12, unit: '120 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/205961/pexels-photo-205961.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.7, reviews: 5200 },
  { id: 'bakery-008', name: 'Monginis Butterscotch Pastry', brand: 'Monginis', category: 'bakery-biscuits', price: 60, mrp: 75, discount: 20, unit: '1 pc', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/205961/pexels-photo-205961.jpeg?w=300', inStock: true, rating: 4.3, reviews: 880 },
  { id: 'bakery-005', name: 'Britannia Multigrain Bread', brand: 'Britannia', category: 'bakery-biscuits', price: 48, mrp: 58, discount: 17, unit: '400 g (16 slices)', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/3892469/pexels-photo-3892469.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.4, reviews: 1780 },

  // ── Sweet Tooth (4 new) ──
  { id: 'sweet-005', name: 'Dairy Milk Silk Chocolate', brand: 'Cadbury', category: 'sweet-tooth', price: 99, mrp: 130, discount: 24, unit: '60 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/1854652/pexels-photo-1854652.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.8, reviews: 6400 },
  { id: 'sweet-006', name: 'KitKat Chocolate Bar', brand: 'Nestle', category: 'sweet-tooth', price: 35, mrp: 40, discount: 12, unit: '36.5 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/1126728/pexels-photo-1126728.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 4200 },
  { id: 'sweet-007', name: 'Milkmaid Condensed Milk', brand: 'Nestle', category: 'sweet-tooth', price: 75, mrp: 90, discount: 17, unit: '400 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?w=300', inStock: true, rating: 4.6, reviews: 1400 },
  { id: 'sweet-004', name: 'Munch Chocolate Bar', brand: 'Nestle', category: 'sweet-tooth', price: 10, mrp: 10, discount: 0, unit: '12.7 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/1028704/pexels-photo-1028704.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.3, reviews: 3800 },

  // ── Atta, Rice & Dal (5 new) ──
  { id: 'atta-011', name: 'Fortune Basmati Rice - Premium', brand: 'Fortune', category: 'atta-rice-dal', price: 145, mrp: 180, discount: 19, unit: '1 kg', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 2800 },
  { id: 'atta-012', name: 'Aashirvaad Multigrain Atta', brand: 'Aashirvaad', category: 'atta-rice-dal', price: 220, mrp: 280, discount: 21, unit: '5 kg', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/7474259/pexels-photo-7474259.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 3600 },
  { id: 'atta-013', name: 'Tata Sampann Masoor Dal', brand: 'Tata Sampann', category: 'atta-rice-dal', price: 85, mrp: 105, discount: 19, unit: '500 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?w=300', inStock: true, rating: 4.4, reviews: 960 },
  { id: 'atta-014', name: 'Chana Dal - Tata Sampann', brand: 'Tata Sampann', category: 'atta-rice-dal', price: 95, mrp: 120, discount: 21, unit: '500 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/6413424/pexels-photo-6413424.jpeg?w=300', inStock: true, rating: 4.3, reviews: 720 },
  { id: 'atta-015', name: 'Dawat Biryani Basmati Rice', brand: 'Dawat', category: 'atta-rice-dal', price: 190, mrp: 240, discount: 21, unit: '1 kg', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.7, reviews: 4100 },

  // ── Masala & Oil (5 new) ──
  { id: 'masala-011', name: 'Everest Rajwadi Garam Masala', brand: 'Everest', category: 'masala-oil', price: 55, mrp: 70, discount: 21, unit: '50 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/6996072/pexels-photo-6996072.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 2800 },
  { id: 'masala-014', name: 'Patanjali Cow Ghee', brand: 'Patanjali', category: 'masala-oil', price: 180, mrp: 220, discount: 18, unit: '200 ml', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/4004471/pexels-photo-4004471.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 2600 },
  { id: 'masala-015', name: 'Saffola Gold Oil', brand: 'Saffola', category: 'masala-oil', price: 175, mrp: 220, discount: 20, unit: '750 mL', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/1435706/pexels-photo-1435706.jpeg?w=300', inStock: true, rating: 4.3, reviews: 1440 },

  // ── Sauces & Spreads (4 new) ──
  { id: 'sauce-005', name: "Maggi Hot & Sweet Tomato Chilli Sauce", brand: 'Maggi', category: 'sauces-spreads', price: 75, mrp: 90, discount: 17, unit: '400 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/4198025/pexels-photo-4198025.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 3200 },
  { id: 'sauce-006', name: "Kissan Mixed Fruit Jam", brand: 'Kissan', category: 'sauces-spreads', price: 80, mrp: 100, discount: 20, unit: '500 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 2400 },
  { id: 'sauce-004', name: "Heinz Tomato Ketchup", brand: 'Heinz', category: 'sauces-spreads', price: 95, mrp: 120, discount: 21, unit: '450 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/1435706/pexels-photo-1435706.jpeg?w=300', inStock: true, rating: 4.5, reviews: 2900 },

  // ── Organic & Healthy (4 new) ──
  { id: 'organic-005', name: 'True Elements Rolled Oats', brand: 'True Elements', category: 'organic-healthy', price: 220, mrp: 280, discount: 21, unit: '1 kg', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/1199562/pexels-photo-1199562.jpeg?w=300', inStock: true, rating: 4.5, reviews: 1640 },
  { id: 'organic-003', name: 'Patanjali Raw Honey', brand: 'Patanjali', category: 'organic-healthy', price: 100, mrp: 125, discount: 20, unit: '250 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/1435706/pexels-photo-1435706.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.4, reviews: 2200 },
  { id: 'organic-004', name: "Dr. Oetker Peanut Butter - Creamy", brand: "Dr. Oetker", category: 'organic-healthy', price: 145, mrp: 180, discount: 19, unit: '400 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/3735149/pexels-photo-3735149.jpeg?w=300', inStock: true, rating: 4.7, reviews: 3100 },

  // ── Personal Care (4 new) ──
  { id: 'care-001', name: "Dove Beauty Bar Soap", brand: 'Dove', category: 'personal-care', price: 45, mrp: 55, discount: 18, unit: '100 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/4041279/pexels-photo-4041279.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 3600 },
  { id: 'care-002', name: "Head & Shoulders Anti-Dandruff Shampoo", brand: "Head & Shoulders", category: 'personal-care', price: 170, mrp: 210, discount: 19, unit: '340 ml', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/4234218/pexels-photo-4234218.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 2900 },
  { id: 'care-003', name: "Colgate MaxFresh Toothpaste", brand: 'Colgate', category: 'personal-care', price: 65, mrp: 80, discount: 19, unit: '150 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/3735629/pexels-photo-3735629.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 4200 },
  { id: 'care-004', name: "Nivea Moisturizing Cream", brand: 'Nivea', category: 'personal-care', price: 95, mrp: 120, discount: 21, unit: '100 ml', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/3659862/pexels-photo-3659862.jpeg?w=300', inStock: true, rating: 4.4, reviews: 1900 },

  // ── Cleaning (4 new) ──
  { id: 'clean-005', name: "Surf Excel Quick Wash Detergent", brand: 'Surf Excel', category: 'cleaning', price: 95, mrp: 120, discount: 21, unit: '500 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/5591581/pexels-photo-5591581.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 4100 },
  { id: 'clean-006', name: "Vim Dishwash Liquid - Lemon", brand: 'Vim', category: 'cleaning', price: 60, mrp: 75, discount: 20, unit: '500 ml', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/4239098/pexels-photo-4239098.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 3200 },
  { id: 'clean-003', name: "Harpic Power Plus Toilet Cleaner", brand: 'Harpic', category: 'cleaning', price: 80, mrp: 100, discount: 20, unit: '500 ml', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/4239031/pexels-photo-4239031.jpeg?w=300', inStock: true, rating: 4.4, reviews: 2400 },
  { id: 'clean-004', name: "Dettol Original Handwash", brand: 'Dettol', category: 'cleaning', price: 75, mrp: 95, discount: 21, unit: '250 ml', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/4239075/pexels-photo-4239075.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 3900 },

  // ── Pharma & Wellness (3 new) ──
  { id: 'pharma-004', name: "Himalaya Ashwagandha Tablets", brand: 'Himalaya', category: 'pharma-wellness', price: 140, mrp: 175, discount: 20, unit: '60 tabs', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/3683101/pexels-photo-3683101.jpeg?w=300', inStock: true, rating: 4.5, reviews: 2100 },
  { id: 'pharma-005', name: "Baidyanath Chyawanprash", brand: 'Baidyanath', category: 'pharma-wellness', price: 145, mrp: 185, discount: 22, unit: '500 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/139398/thermometer-headache-pain-pills-139398.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 1880 },
  { id: 'pharma-003', name: "Evion Vitamin E Capsules", brand: 'Evion', category: 'pharma-wellness', price: 90, mrp: 115, discount: 22, unit: '30 caps', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/593451/pexels-photo-593451.jpeg?w=300', inStock: true, rating: 4.4, reviews: 1640 },

  // ── Baby Care (3 new) ──
  { id: 'baby-004', name: "Pampers Active Baby Diapers - S", brand: 'Pampers', category: 'baby-care', price: 320, mrp: 400, discount: 20, unit: '44 count', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/6849/feet-bed-baby-room-35537.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.7, reviews: 4400 },
  { id: 'baby-005', name: "Johnson's Baby Powder", brand: "Johnson's", category: 'baby-care', price: 85, mrp: 105, discount: 19, unit: '200 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/265987/pexels-photo-265987.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 3200 },
  { id: 'baby-003', name: "Cerelac Wheat & Honey Infant Cereal", brand: 'Cerelac', category: 'baby-care', price: 140, mrp: 175, discount: 20, unit: '300 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/35537/child-children-girl-happy.jpeg?w=300', inStock: true, rating: 4.5, reviews: 2100 }
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
