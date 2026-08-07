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
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQu2dH58lAUR2p9YALjUIuTtpanZb-zUQtA_aagwY9Qg&s=10',
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
    id: 'grok-new-025', name: 'Pure Aloe Vera Skin Gel', brand: 'Crunchy Bites', category: 'personal-care',
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
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCR-ge1yMLXoNx-IG4u-56mdFRj5a2r7_Xt1vNfoXbmIhF35Yq',
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
    id: 'grok-new-050', name: 'Organic Bamboo Baby Wipes', brand: 'Grokly Fresh', category: 'personal-care',
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
  {
    id: 'grok-new-056', name: 'Masala Dosa Batter Pack', brand: 'Dosa Point', category: 'dairy-breakfast',
    price: 54, mrp: 69, discount: 22, unit: '1 kg', deliveryTime: '12 MINS',
    image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.7, reviews: 156
  },
  {
    id: 'grok-new-057', name: 'Paneer Butter Masala Meal Kit', brand: 'Swadishtt Kitchen', category: 'atta-rice-dal',
    price: 89, mrp: 109, discount: 18, unit: '700 g', deliveryTime: '15 MINS',
    image: 'https://images.pexels.com/photos/1640781/pexels-photo-1640781.jpeg?w=300',
    inStock: true, tags: ['Premium'], rating: 4.5, reviews: 98
  },
  {
    id: 'grok-new-058', name: 'Hakka Noodles Bowl', brand: 'China Wok Express', category: 'international-foods',
    price: 76, mrp: 89, discount: 15, unit: '450 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1640769/pexels-photo-1640769.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 214
  },
  {
    id: 'grok-new-059', name: 'Hyderabadi Chicken Dum Biryani', brand: 'Biryani House', category: 'atta-rice-dal',
    price: 149, mrp: 179, discount: 17, unit: '900 g', deliveryTime: '15 MINS',
    image: 'https://images.pexels.com/photos/4518672/pexels-photo-4518672.jpeg?w=300',
    inStock: true, tags: ['Premium'], rating: 4.8, reviews: 305
  },
  {
    id: 'grok-new-060', name: 'Margherita Pizza Base', brand: 'Pizza Corner', category: 'frozen-snacks',
    price: 115, mrp: 135, discount: 15, unit: '2 pcs', deliveryTime: '12 MINS',
    image: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?w=300',
    inStock: true, tags: ['New Arrival'], rating: 4.3, reviews: 76
  },
  {
    id: 'grok-new-061', name: 'Cold Brew Concentrate', brand: 'Cafe Mocha', category: 'tea-coffee',
    price: 129, mrp: 149, discount: 13, unit: '250 ml', deliveryTime: '10 MINS',
    image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?w=300',
    inStock: true, tags: ['Premium'], rating: 4.4, reviews: 84
  },
  {
    id: 'grok-new-062', name: 'Mango Lime Cooler', brand: 'Juice Junction', category: 'cold-drinks',
    price: 39, mrp: 49, discount: 20, unit: '500 mL', deliveryTime: '10 MINS',
    image: 'https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?w=300',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 64
  },
  {
    id: 'grok-new-063', name: 'Tandoori Chicken Marinade', brand: 'Royal Grill', category: 'masala-oil',
    price: 69, mrp: 89, discount: 22, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1441419/pexels-photo-1441419.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 142
  },
  {
    id: 'grok-new-064', name: 'Chicken Shawarma Wrap Kit', brand: 'Shawarma Hub', category: 'frozen-snacks',
    price: 119, mrp: 145, discount: 18, unit: '4 pcs', deliveryTime: '12 MINS',
    image: 'https://images.pexels.com/photos/4239098/pexels-photo-4239098.jpeg?w=300',
    inStock: true, tags: ['Premium'], rating: 4.7, reviews: 188
  },
  {
    id: 'grok-new-065', name: 'Butter Croissant Box', brand: 'BakeFresh', category: 'bakery-biscuits',
    price: 159, mrp: 189, discount: 16, unit: '6 pcs', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/4234218/pexels-photo-4234218.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.3, reviews: 91
  },
  {
    id: 'grok-new-066', name: 'Gulab Jamun Mini Pack', brand: 'Sweet Treats', category: 'sweet-tooth',
    price: 72, mrp: 89, discount: 19, unit: '12 pcs', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1640778/pexels-photo-1640778.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 203
  },
  {
    id: 'grok-new-067', name: 'Quinoa Crunch Salad Bowl', brand: 'Green Leaf', category: 'organic-healthy',
    price: 98, mrp: 119, discount: 18, unit: '350 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg?w=300',
    inStock: true, tags: ['New Arrival'], rating: 4.8, reviews: 73
  },
  {
    id: 'grok-new-068', name: 'Veg Spring Roll Party Pack', brand: 'Noodle Bar Asia', category: 'frozen-snacks',
    price: 84, mrp: 99, discount: 15, unit: '8 pcs', deliveryTime: '12 MINS',
    image: 'https://images.pexels.com/photos/4518672/pexels-photo-4518672.jpeg?w=300',
    inStock: true, tags: ['Premium'], rating: 4.4, reviews: 117
  },
  {
    id: 'grok-new-069', name: 'Paneer Tikka Kathi Roll Kit', brand: 'Kathi Room', category: 'international-foods',
    price: 109, mrp: 129, discount: 16, unit: '4 pcs', deliveryTime: '15 MINS',
    image: 'https://images.pexels.com/photos/1640781/pexels-photo-1640781.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 129
  },
  {
    id: 'grok-new-070', name: 'Masala Crunch Sticks', brand: 'Crunchy Bites', category: 'munchies',
    price: 42, mrp: 49, discount: 14, unit: '180 g', deliveryTime: '11 MINS',
    image: 'https://tse4.mm.bing.net/th/id/OIP.hucttx8dwducqW-WlcULIwHaHg?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['Bestseller'], rating: 4.4, reviews: 138
  },
  {
    id: 'grok-new-071', name: 'Roasted Peanut Mix', brand: 'Crunchy Bites', category: 'munchies',
    price: 36, mrp: 42, discount: 14, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://tse3.mm.bing.net/th/id/OIP.z9XrTcSZORj5DN86dASGuwHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    inStock: true, tags: ['New Arrival'], rating: 4.5, reviews: 96
  },
  {
    id: 'grok-new-072', name: 'Everyday Cooking Oil', brand: 'Saffola', category: 'masala-oil',
    price: 179, mrp: 219, discount: 18, unit: '1 L', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/1435706/pexels-photo-1435706.jpeg?w=300',
    inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 412
  },
  {
    id: 'grok-new-073', name: 'Tomato Puree Pack', brand: 'Kissan', category: 'sauces-spreads',
    price: 54, mrp: 65, discount: 17, unit: '450 g', deliveryTime: '11 MINS',
    image: 'https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg?w=300',
    inStock: true, tags: ['New Arrival'], rating: 4.4, reviews: 84
  },
  {
    id: 'grok-new-074', name: 'Premium Basmati Rice', brand: 'Fortune', category: 'atta-rice-dal',
    price: 145, mrp: 175, discount: 17, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQFiaJ6u7ozQNTDPxkQe2FDSe2d04XKsVyHnmDfQfoOlKGRHkZvOVbfl5XbEdvZYsRnJ9D3pCO6sZxvvshlrBVIEJpC6J4N5Ct9Y7o06pivBytr_NXFqKU8FQ',
    inStock: true, tags: ['Bestseller'], rating: 4.7, reviews: 256
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
    image: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTVmnStUAQP2eGmXg27v0o-rwhwaTbOYatdzDjjQFtTCH-yHYtj',
    inStock: true, tags: ['Bestseller'], rating: 4.1, reviews: 980
  },
  {
    id: 'veg-003', name: 'Potato', brand: 'Fresho', category: 'vegetables-fruits',
    price: 22, mrp: 28, discount: 21, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj9w2A1hdFIW_qGlKzPIreV22C39cTANwZRxJnVIkTo3LcwIhT5rUQ8BZV9vE6PnoRLf7dS0WIw0q_vAAKcBtdN0RbTn0pIZ-vX1PsH5bi&s=10',
    inStock: true, tags: ['Bestseller'], rating: 4.3, reviews: 1560
  },
  {
    id: 'veg-004', name: 'Capsicum - Green', brand: 'Fresho', category: 'vegetables-fruits',
    price: 45, mrp: 55, discount: 18, unit: '500 g', deliveryTime: '11 MINS',
    image: 'data:image/jpeg;base64,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',
    inStock: true, rating: 4.0, reviews: 450
  },
  {
    id: 'veg-005', name: 'Carrot', brand: 'Fresho', category: 'vegetables-fruits',
    price: 38, mrp: 45, discount: 15, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl1R53lsnPXQ8aJNaxEKZmFo6dMc2NQx_wa7CNKdg62Q&s=10',
    inStock: true, rating: 4.4, reviews: 780
  },
  {
    id: 'veg-006', name: 'Cucumber', brand: 'Fresho', category: 'vegetables-fruits',
    price: 32, mrp: 40, discount: 20, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSpXBLqblI3Ou1LAY61HNQa61bI_GewfP_obUMvM_oL8AT-1Au9HfYNipBTznO37sZiEsVbxrjtIt4m1kmJLBmoK98k0zIle2Ii7zVow&s=10',
    inStock: true, rating: 4.2, reviews: 560
  },
  {
    id: 'veg-007', name: 'Cauliflower', brand: 'Fresho', category: 'vegetables-fruits',
    price: 42, mrp: 50, discount: 16, unit: '1 pc', deliveryTime: '11 MINS',
    image: 'data:image/jpeg;base64,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',
    inStock: true, rating: 4.1, reviews: 340
  },
  {
    id: 'veg-008', name: 'Cabbage', brand: 'Fresho', category: 'vegetables-fruits',
    price: 28, mrp: 35, discount: 20, unit: '1 pc', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLVJqriNdHlw4EAQby_8LOzjEIvUkCRAwv7RDYacF40A&s=10',
    inStock: true, rating: 4.0, reviews: 290
  },
  {
    id: 'veg-009', name: 'Brinjal', brand: 'Fresho', category: 'vegetables-fruits',
    price: 35, mrp: 42, discount: 16, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwlXA3KwnuTsY9SjmLFGO_r58yrYYEaN7KKRMBsaBnSIvNsCNbVVMoyDqxfXGUmgzZaJClssNrCjAEBJlliACDu2qcnYYycY8s34u3ILNu&s=10',
    inStock: true, rating: 3.9, reviews: 210
  },
  {
    id: 'veg-010', name: 'Ladies Finger (Bhindi)', brand: 'Fresho', category: 'vegetables-fruits',
    price: 48, mrp: 60, discount: 20, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThiXMjOAHWxGVinoRCv4I0Wmo8tUQ39z-Y_4O0xgCsFHxJWQF6vipyVyReKd5ATUOTIRXdMr99vyvbcn5KfJZerlzD6gt7ps6IvVd2ltPJ&s=10',
    inStock: true, rating: 4.2, reviews: 380
  },
  {
    id: 'fruit-001', name: 'Banana - Robusta', brand: 'Fresho', category: 'vegetables-fruits',
    price: 55, mrp: 65, discount: 15, unit: '6 pcs', deliveryTime: '11 MINS',
    image: 'data:image/jpeg;base64,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',
    inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 2100
  },
  {
    id: 'fruit-002', name: 'Apple - Shimla', brand: 'Fresho', category: 'vegetables-fruits',
    price: 165, mrp: 195, discount: 15, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcT11V4j2KpoUBhoZx5ystsZoA5J4FDK_VHt2KLcrBW32L57eNAT01GE590Q5CiuLqXTOdQjDzhWDC9aRP3Zz3Q2bsp9FpJwqA',
    inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 1890
  },
  {
    id: 'fruit-003', name: 'Watermelon', brand: 'Fresho', category: 'vegetables-fruits',
    price: 45, mrp: 55, discount: 18, unit: '1 kg', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfiWSYDevLSK_iogsYVl298-p3OJtQe00uaVNQvsSWjdxoCSd2F1g_wmoj4SdRG_BSWSATgxfgrD_FfLv7jeast3UZGMCRUSqgj9YT3g&s',
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
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrzPNIDjHt2csErksNOXRtlZLwJtSg_h-TJ7AgxOej2I68yq4BUJRwIq1zNvkMSCelANEsi_83I-ZkRB1bpvjakwv1Zxh3aRHYYUVA5tc1Ng&s=10',
    inStock: true, rating: 4.4, reviews: 890
  },
  {
    id: 'fruit-006', name: 'Grapes - Green', brand: 'Fresho', category: 'vegetables-fruits',
    price: 125, mrp: 145, discount: 13, unit: '500 g', deliveryTime: '11 MINS',
    image: 'data:image/jpeg;base64,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',
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
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7CGVdEua8zgtpz9QXgYRdX6AAb5IjRw6VUP4WXipe14HC5RhTIwz3_Fbv0CR4slSzzTV_8bnB7yPlefs_qoGqgODKnL1BjsJXO8fXavZF&s=10',
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
    image: 'https://m.media-amazon.com/images/I/713SesS87nL.jpg',
    inStock: true, rating: 4.5, reviews: 1230, returnable: true
  },
  {
    id: 'dairy-007', name: 'Britannia Bread - Whole Wheat', brand: 'Britannia', category: 'dairy-breakfast',
    price: 45, mrp: 50, discount: 10, unit: '450 g', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcR-NNJl64jc2vol4Kl7fqDDfaE0eLdMohSIuMFhPjfAPdfQ8Y43ggxUG0l1jxZ5SOw5yDZVyV14B67DoBsWG9M7E-kyN7jaG4uNvFf9P0SP-ozdFulQAM6Jgg',
    inStock: true, tags: ['Bestseller'], rating: 4.4, reviews: 2670
  },
  {
    id: 'dairy-008', name: 'Harvest Gold Bread - White', brand: 'Harvest Gold', category: 'dairy-breakfast',
    price: 40, mrp: 45, discount: 11, unit: '400 g', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRD5K4EOnqdz8bkBVfIGpSuAkEGdbcoKgdUTrY93eSshJ8l-CzTOdmPNGITLcm0NnephnivSpTgboyI6RHYzekyYREtiu5VhygEqGtzUzpnS1iHAhORk1atL3Y',
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
    image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIALkAuQMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAAABgQFBwMCAf/EAFEQAAEDAgMFAgkGCQgJBQAAAAECAwQAEQUSIQYxQVFhE3EHFCIygZGhscEjQlJystEVJjZic4KS4fAkMzRjdKKzwhYlNUNEZIOT0hdTo8Px/8QAGgEAAgMBAQAAAAAAAAAAAAAAAAMEBQYCAf/EADIRAAIBAwIEAwcDBQEAAAAAAAECAAMEERIxBSFBcRMzUSIyYYGRsfAGFKE0QsHR4RX/2gAMAwEAAhEDEQA/ANxoooohCiuUh9qMyp59aUNoF1KUd1VScWemK/kTBQ2dzjo1Pcnl3n0UQl1XkrSkXUoDvNVi3C0AqXNSL7gVhPutf217akNE3R2iz0Rb2kD30Qk7tmz5qs31dfdX3tRwCj+qajF9z5rCgOa1gffUd7Euz0U7FbP5zl/uohJy3lIF+wcPdl++o7s9aAT4q56VAfGq9zFXj/NyWj9SMtXxqDJlzXLhL7oPSIn40Qk9/aBxn/gSf+sPuqtXtylCspw9V/0w+6qbEk4ittRE91HfHaHuFKimpinwTiLNx/Va/ZohNNZ2s7UXEBX/AHR91S2toe0/4B/9VST8RSFGbmpSCJt9P/YT91T2nZ6RZL2fn8h91qIR2bxltZsqLJR3pSfcTUpE6OvcpQ70KHwpFYxGQhdlKRm/NuD76uouLOot27LhH51//GiEZQ80dzifXXsG9VCMchqADiXEDqm49le/H8PIu3KbR1tl+6iEtaKrUuuuozRpKFgciFD1/vrkrFnYqrTI6lJ4ra1t3pOvqJohLeiuMWSzLZS9HcS42rcUmu1EIUUUUQhRRRRCLG27jiWoaEkhK1qFx9LS3xpVbxDEZ0xUZ1T8KK2bBpvyVKHMqGp9FMPhNfcj4NFdbOolp05+Sqq7BNqYEphDWKNJCgLBSxu7lDd7KaKLsmsDIiGuaSv4bHBk+G7GhC7EcZjvUfOV3k6mu7mLSlXyFLY6C9d0RMKkgORJSkjhqFJ/j014kYXqTHfYUORUR6t9Kj95FVMuLuJLp5urKvZur4JzoHyTbLX1UVzeYdaNlt6cwQa5JKTvzD9Q0Qkky3FD5Rbij0WEj2Cua3QoeaP1lKV7zXErQne4gem1fA4hR8laT6aIT442HAQRYH6ItUQYZGCsx7Ynq8v76nX5a14Vc8DRCfYUeK4VtJcSJSbFDS1+enmLnU3/AI1qonYauRJcRibzqRmPZtJOUBPDrepkuIzMQESGwoDcTvB6VAcw6UhORrE3uzG5t4hxI9dEIJwHDQPNUrvWa6IwqOzrHkSWDzbkLT7jUYwsSUr+nMK5Ds7e411Rg2Ku/PUerbTn/lRCWuHypiVPMS3RKa7P5F5SR2gXcWFx5wtffVJK/CLGIF9mGlSUkEpfUQhXvPuqYjZLF3TdL8tF+KSEe+pbOwstesvFpQH0VST8KJ7LHAlQcRiIexTDEwnVqKUFCzuHzsybFIqDjmKpwmS2jDcS8eaWfKhOqzqtxKVbx6b17TsHg7flTcRku9A4fiTXl+Vs7s+ysYVGbVII87z1evhXSoznCjMW9RKYy5xLLY2QtWJSWgFhBb7QpVpbUWv1t7qcKQ/BnNdxCXi77oA1asOXn/up8odSh0mFN1qLqXaFFFFczuFFFFEIl+FT8n2P7Wn7KqzyFuFaL4UxfZ1o8pSPsqrOoW4Vd8N8uZPjnnfKM+CoaIGdI3b9x9dTMRKoyc0Z5xHQqzD261UwXMqRapkpzOxrTKlFWqZIiqF26UMKcGRDik0+ctB9BFeDi0tI0CT6ajb6+FtRFdtZUD0kenxi9HINn5SWnaB9GjjZ9Fvvr6cfQoeXGCu9INVi2TX1uPrSTYUPjJ9Pi14dwPpJT2JdqLNRQL8kWqEnty7m8WNvq1ZR427SpzcXpSTZUR1Mkjidyf7RIsOWGgA5BQf+kPuq4j4002LCJl+q2BUdMXpXsRelc/tKPqZ1/wCjdHoJYp2oU35jDlugSPjXxe1khQ8lhY+soD3XqB4p0ryYvSuha0Jw19eHbH0nd3aierRDSE9Ssn4CucTFZ8yRlfeyDk2m3vvXFUXpXqGyUSUm1N8CgF5LI4urwuNT8p6cSFvOZypdjpnUVW9dLWKfzq6Zyn5V3vpZxYWcVT6AA2kS8ZmAJPWM/gjHyeKn+sbHsVWh1n/gjH8mxM/1yB/drQKpLrzmmrsv6dYUUUUiSoUUUUQih4UR+LSTyko9xrN4W4VpPhOH4sn+0I+NZtC3Crvhvl/OZTjvm/KWbCiFAcKsm0h9tz5VpAbBKi4rKBVfGbznur7ExGWxjK4zWHO4gluy8iDa1wSNDa5HDXlxo4jcNQQMnrF8Ds0unZKu2JJTGKVEKSQQdQa7CNpuqVh7fbx0PFGQLAUEk7gd1/431Yoh6bqEutaAneOPDRSqFRt0lCqKeVemohvuqZtM27CwCZJYUUOtoBSocPKA+NU2yeLvTcNnsyl3nRmFPNqUACpGW4PWxt6CKNZK6hJK0FUhTL6NE3aVYtQ+lJUSdiicBjYtN2nbiNyFKShowkuKUUqINgBru9F6sMMk4hiMOTLj7bspaijM/wBphyUlscyD8KU5I6/f/Uaqr6faNqYfSvYh6bqT8FxxxzEmPGdrluMglZacwvsw+kakJV6O+osTbCS9s1jKVTXziAdLkZwNWyNXQN9rDed+tLK1PzMYPDxzj34n0ryYfSlbE8Vdbg4SXMcxESpMJpww4EVC3FEpuVknnr6qudghFlR5cqNi+Iz1KUlDrU4+UwoX0y8L34culcEsq6jOwis2kCS1w+lckRcroNqYVMDlXBUcX3V4K8GtRvF5bFluG3GlPHUZVXp9dSyXFNpdaLmXNkCxmy87b7ajXrSZtO3lHpqdbVMtKu+oYTMvPBIP9X4kf+ZH2RT9SJ4JR/qmef8Am/8AImnuqq581pfWX9OsKKKKRJUKKKKIRS8Jv5Lq6Pt++s2gC5ArSvCYPxWc/TN++s5wpN1irrhxxSPeZfjQ1VwPhGHD2NAEi5O6rKJFWtwONthSVIcN1ovuOU2333H118woIaWlx0hKEglRO4aGlhzazEMN8ci+OFK2Fq8WSGmymx1+iSbk8xbrUS/LVG0CWfB6K0kNTrtHktIZwpic2suFYbLSEpuolVhprvsTU6FGd7PM+lKVK3JHDv4X7qhbFxVu7P4e/KUVqUjtEIO5AJJT6bEUyZLDdUMMSQx3lkyKuaa7Zirt20EbIYkd1kJ+2mk3GsOdg7O4JtHAAzeIojyrbilSMoJ9eX9mtXc7FSQh0tlK9MqrEK6da+SPF2Yq+2QnsEpsU5bi3K1SEuCmBjrI9S3DZOekxWKh+NF2ZnmYYUXK82iWWA8llztV70nnceq/CrEIhTJuMzZmJzcYaRCCZL0OChoG6kZSDm1KSAdRuSddKeHNqNn1wprUdnxpiFcPMiPZOgWqwCgAfMPptVlshiEPFcFRLgQUw4y1rSloJSNxteydKa9dwMlcfme8RToITpDZ/PpM7wvFVxcUwKJCxWPjsRbqEtRnogDsUaC4OpBA434cq4MTo8XZPanB5C+zn+Nl0MqSQcoWgE+yteYgQ4zinI8RhpavOU22Ek95FenWIuYuOstEqFipSRcjlSv3Izt+Zjf2pA96Y02FYVi0OZPxOXhcWZhjHYy2Gs97NoBR60k6dOdNPg/Tl/C2KwG8QmiQ62jtZWVvt7E3WO6/8a09q8VdjZiGnGBu3KTp7KWMV8IWA4Wp1lHjEhbRyER2/JCuIzEgaV6arVhpVec8FJKJDM3KX0rFsOizWYUmWy3JfVlabUrVRrtNPZxXnPotqPsrOp8uI7t3gy1QUuPu5Xg484fkk5lG2UaEpIWQTz6CpeK4vN2hx53CYEl+JCjIzy3mFZV6kAIB4G5F/SOGvHgkY7Znv7gEHPykPYxId2v2kdto2S0P27D2Io2uFk7uNePBk2UDHHlrLhU8hGdW9Vs5JPfcV72r8ttXSrClyrfT7SruRm2+v3l34JhbBZp5zD9hFPFJXgpFsAknnLV9lNOtVlx5rd5cWfkJ2hRRRSZJhRRRRCKnhL/JV7o839qs7wUXcrRvCT+Skn9I39sVm2EKyup66VccP8o95meLnFwvaOsVrtI6k8CNe6pv4Bwp8MiTh8Z92OmwWtsEnp1F77+dVcZ6SnDXZbTfySUqOYFOgHMFQPCmqBllMNyWbKStAcTyKSL/ABqtq1A1UsJf21JqdAKYk7eY7jGBpYj4fJTHBcUklDYuQENkb7/SO7pT1hWKNzdn42KK8lLscOrA4G2o9dxWc7cRzjO02H4Y055TiHVpJPHLb3tGo2z+PyGtiPEI+stuV2MdF/KK3NUepWdX6gHGpTUQ1Fcb9fnIa12Wq2dukgTX0Yn4QYeVKcrEtpGnNK867dMxV6BTkjGcXm4zLjS/Fk4altpxtKVJ7Q+W3ra+bib3GmnpTokJqJts1DiHO3Fjmy/pqEcqKvSo1Kwp0JxLaqb9EuJSegDih/hpp1RVIGOgH3iEcjIJ3JkDB1lOx+LyVee8sgn/ALaf/tNMmBbUrwnZbDsLwSKmdiXZKdeBNm2ApRPlHnqNLjv3ArV0x/B8m+hkPkJ6+WL+rsh6xVzshJXsrtAmBIIVExSMhSF8nMug/azJt1Sa6qqGVsjrt2nlJirDHLl95aK2rx6TtL+Cm1x2AmIlbqkNBQQsshalanUAk2F9TYXqhjLxCX/pHAxLFJUmJEDhU4pd1KUkLsBe+VJykkDflAqfsy32u2e0Cz/uoqo3ccyEf5TUTC2npGC7RyG2lFc6UtLVxbtLpc0BPRZpYVU2HQfWMLM3Mn1kWHib+EeDzKy4pKpctYQR83QAkdwSr0qB4V32zgNYZs7hGDMkdqotqUBxcyqzn1up9AHKuitk8Xm7L4fHeb7BbK1lpqxWFBSiSVlIJB1FtLAJN9TpbK2HlTvE3cYxF1clsDM40QnKngkAjQjfmtckm9dF0Das9T/yc6XIxjoJWyno48I6FOKBaiMrSpI11KVkIA4m7gFuelV+x+MuRU4rHDLj2LTVpU0hKbla05ib8rKNz0vTyzs5hcXEFTiw2t8JyoX5V06Wvqo+Vb52++u+jxaHGU8pDKCt4WcWUJzL+sQLq9N65DBhpx0H8TxhoOc+sWtiPH8NwSUVwnUo7RTgCxlU+SkJAAOth5RJ52txr7jzxcYzKGUqTcp5dKunnwAQnQdKWcacKyRepdJMsWPWVt1cDQFEdvBX+Trp5y1+5NOVJ/guFtmldZLnwpwqlr+a3eaS18hO0KKKKVJEKKKKIRX8JH5Jyv0jX2xWY4cbKSetaf4RxfZKX9dr7aay6Fuq64b5Z7zLcc5Vh2jLIUUbP4gGgsuLSSEpF78T7L1M2b2ywjDNnWk4hMSh5hPZpasStYtcWHrHLSuOCrUpGtcMcw+DMYLS/F2loUlw5ilOl7W9PDrUC5tBSZnBl3w/iXj0lpOPSRYmXEvCGEXLfZwlBBO9JW2VeztT6qkYHs07H2mmYy6hKYrKXHmkHzg6obrW3JJV7LVaRMPhxMTVN7FtUwDJ29jm0GXibA20uAKuUzNN9SCzafZ2IxIo0hva3BMz2I1iLe2c+REw5bwBcQlx0KS0gWACyq2osNw1I3VIwbZnHF4XiLDpbaRKVdS0WcWs2PEGwQcxvbyuFt9PTDjLIsy2hA3eSAK7+N9aGqP0Hp/E9WmnUxNa8Hi3sNYiTJi1KQrMFpIAbSb3QkG9rk3J42GgtVtthssMVabES6SkgpUmxUhQABNri4IAvY3BSDrqKvPG+tfDLHOl66mrVmN0U9OJW7MYA7h7T6sTdZeckCzoRHQ2XDe+Zah5SjfjcbzpfWmBJabRkSkZb3IOt/XVcqYOdcVzOtc+GXOTDxVQYEtHJIHGoT0vfrUHtnHswaGYpFz3VDjSRiklSIbiOwRcdre+dQ35edrH1V5UalQUtUOAJxrqVfcElPy+tVz8nrUl6EhTqmGpae3T81YsFd1VE9mTEVaQytA4K3pPppljf2dycU3GfTY/zK2/S5oDNRTieXnib1S4grNc1YquUk1WTfNNXSqAJRNULOMzRfBiLbLoPN9z3020qeDMfiowebrv2jTXWareY3eb218hOwhRRRSo+FFFFEIteEQX2Sm9C2f76ayyFuFar4Qh+KU79T7aayqFuFXXDfcPeZbj3mDtG/Z9F2z3VDxmO23MTJRHZU4m6jdsFSjbSx4HhVlsyAWzflUbG0KXJShsXUTXbAPUKttFq7UrZXTecY2JibnfQlaUrcXlC05SRmNjapK5yGE5nlhPQ76ppU1MUFpg5nB5zh3DuqLh8GXi0g5LhI1U6uqivxEKPDojOOsurThr1Catf2c88CXS8c4Mp9Kz8KhvYzIVoH7HkgVMXs+mJGzpQZCybC/Or7DMPgIYafWylKl79NAeVVzVarn2mlwtvSQeysTVO4u8MzSZKgdxAr0I2O5c5LiOil2NNWOTFRLMxMyXFHySE6gbtOdQYuIhxlKCAp/UFazp3nlbjUcn2sZMkBPZziUbX4fFyAtQTvual4ZLxWXLTF8WzqO9R0CRxJPKmWP2hjLSpyPclIWkHVN+NToqlRUKyNJIdFiEka93On0w4OQxERURG5Moi9tHI7FLGCwXS2qTdcmRexS3uNuRJ0HIXPCu+HIXh8NPieGtvONq8rKQkhu2mU8dwFq5YhEYlT3RLcCXEobF06kHXQ+ses13iNScMdKSouMg2vxFIv2etSameefzn8JzTt0VlYdOnSfJE6JiCkKHYtuIUQqPLRkUTYEjrpbS/fX1qS9nW4vO2CkrLTtuzXfdY8rn4a1JxNUZbCXJ0VL7B/3iR5SP46GoLERfYkYHiCH2baxZXlAevUfxrVE1pUopqZSB67j6jb5ySLmgzeGThvQzqqHDmtOqLDkNaEZ1KTYoI5+zhSXN8008YlMkKw5xiQwppwqy3NvKSN5FjzpHneaqtx+mjcNbM9ViQTy555D4zE8fWil0q01A9cTSvBqLbIxerjv+Iqmilnwci2yELqp3/EVTNS63mN3mitvJTsIUUUUuPhRRRRCLu3+uyc/uR9tNZTC3CtY29F9k8Q+qn7QrJ4W6rnhnuHvMvx7zB2jps+crHoqLj75jxlup0ccORJ5DiakYNoyO6ouPs+Mw28pt2Ttl9AdxqLxJmWm2mTOEorsgbpFuCGHpYEt9LTSdSFHVVPuFqYRhueB2LigNAFa3vuPvpeXsdDxJlJTKdbcFsrzViNeCgamw9nBgr6nPGZLpCCmykgXv3aemqDmg5bTVAKw35yy2ixrD9msF8cxc5Qu4QhJupZt5o5n3VJwNT2L4Ew7iCVx/Gm+0EcBSFNJIuBmBvm1BuLW3UtMbPR8a2ri4ljkjtI0FhHisR1fk51EkrVfqLW5p10GrgXu0c7RDhSVrISBbyUjW9OONOfWI55xKuctmGllhqGhUhlIUznXmKNOZ1663rlIRBU1eeGVvgXUrJcAHhcG9VW1eLMxgpxIStTruXMN6UDl6fdVPB2glzpgb7TJEV5yyi4SQOHWorbyQqkrmMrceMy0owoJCHNFqQpShodNL1KU7kS2qOUDJ8plynUj11AYmrIK2QtaUHybq863Go7UlSg44cwfCdNL7r8K7UYi2JMucOkJlfhLEBGCyt/sw4m915EJB46agjT6NfYrryHSHEoX5VsyVZr3rlhERqPsw02hSiUm61E5SpZ1UodSTXzD3GW1KVEYVmHn5lZiRzN9N9dt705G0uFR2lsOIR/NuJIKT800iuXZkHISlSFaEGxpyXJWwJcqSOzShPmk8aTHjncKuetXPBubOh2mZ/UqgU0frmXK3nJEXO8tSyE2BPKlad5qqaI4vh57qV5+5XfVzQVUBVRgCUNwSxRjuZp/g9FtkYHXtD/8AIqmOl/YMW2Tw/wCoo/3jTBWeq++3ebW38pewhRRRXEdCiiiiEoNuvyUxH6g+0KyaFuFap4Q3lM7IzylGckJFumYXPoFzWURASkKbXa+vMGrjhh9kiZrjq+0p+EcMFdGS3SqvaLFfwLNYlPIK4L3yElI4A+ar0a16wmSptwpcQbc06iue0CI2Ix1xXFpyuJt1B4Edxpl1b+KGT1iLK88AJUOwPPtGrBExJURUiI/dCk3S+hYsroRzoxJxcY9mt9SkgfOSNeetYbBxzGtl8SdRFWUhKvlGFaoVbpy4094X4TMLxRptnFmlRHk2GdKcyNOm/wB9ZepSOMYm1RxuJaOY5DhzIqlMKfYbKs6bXUEqNzbnrrb1cqtf9IMNkSJUeHLjsFvQptlWQehAI0t6utdYkrCp+RyA8y8UpuA3kSkHmRvqNKw3DMUXkxkRZTpNwl1CVZdOBIva3KuFbSNJnrAMcie5ioiJ6kuR0upSQgcdAOPOqr+SOONiIx2RS4U2QM1j1A4a1ZfgyA+WlKbK+wslorcKU3TuIsobutSkPSe3QlqSgJG+6yUj0X1r3WsCrStkRVxYqnQ2rtAcwCgEA94PDrXKGlx9aZs6WM61AMssJ5cAd57yPRV1LWt2O64oNobNggOAhSgOPSvjLzcRlTiuwbKUBLYBGZX7q8LZHKeAY3nVEiQtpxtMZXZKOXIpZBtz3aVXx8PXhy1yHsQklSrks5wG8t9Mx/i9VOMbXYfh7PykkBwDUNnUms+xvbLEMZWqNASW2jxG+3P95rwBjOuQjTthtW7ik5OD4W4VuPLstd/N5n0C+lWIPAcKV9jMKEZDkxzynHDlCj7SKaK1HCbfw6Rc9Zh/1FeCrXFFdl+8vYgvhp7qVZ/z++myF/sxXdSniBA7QncL1NpHm0hVxlaeJquw4tsphv6L4mr2l7YB7t9ksOVa1myn1E0w1nHOWJm2pAimoPpCiiiuYyFFFFEJXY/FVMwtxttGdaSFhH0rG5HpF6zmXslIZR45gSfGIitTGKrLb+rzHStXqIqGlLinWDkWo3UBuUeoplKq9JtSxFxbU7hNFQTJIshLcjsnApp4b23BlUPQakTkoccSSlJI42rSp8NiY32eIwGpCPzkBX/5VBK2Pwt65hSZUMj5oX2iB6FX9hFWVPiKk+2JQVuB1ApFFvrMp2vwgyWfH44u60mywPnJ5+j3UjOsIeF7WV9Ica3t/Y7FGr+Ly4UkcAoKaP8AmFIO0fg9x5mQZGG4S44hZ8tplxCgDzTqNOlqhXopu3i0j3EtOFG5pp4Fwu2x/wATOkrmQlhTbjiLbiDVtE2xxuKRkmuKt9JRPvqW/gONxTaTgmJNn+yOEesA1CdiFH9IirbP9Y0Un2iq8kdRLjGNjLNHhCxfXtA2u++6U6+yvf8A6gYjYAMNabvJH3VSiPEPBv8AaroiLD+i1+3Sz4fpOwG9ZYSNvcafNy6ATxJJqtcxXGsSJBfeUk8ECwqY03FbPklhPqqY2UqAyJdd6IQT7q51D+0T0L6mVEfBnHFZpThv9FOpPpq6wzDkPSBEjJCRvcI1yjmTxPKuiYeJSCEMQZKEn53YqFvZTVhWFvxI4ajQXSTqtxdklR663qVa0RVfNY4USFf3D0aWKC6nP8fGSGm0NNpbbFkJFgOleqmx8HlPEdvJixQeZzGrjD9nsMJHbPyJzh+YgZR6q0DcQooMLzmQTgd3VbVUOMyBFltpg9kklx1WgQjUmo7ezrzt3Z7aion5OKnzlnhf9/q409xMLW0gIiR2YTZ0JSLrI76sokFqN5SQVOHetWpNVlW6d8gcgZoqHDqVLSW5kTjgED8F4RGhm2ZtPlW3ZjqfaasKKKiywhRRRRCFFFFEIUUUUQhXhTaF+ckE87V7oohI6ojZ3FQ7j99cF4eo+Y+U+ip9FEJUuQZw/mpSf1r/AHVGdg4qoHymV95q/oohFJ7CMSVe8SOo9ctQHsBxZZ/2bGPpRT5RRCIjez2LDXxOOj9dPwqUjAMWIspUZP65+ApxoohFNGy81Y+VnNIH5qCr32ruzshHH9ImSHOibJHxploohKyLgGGxtURgo81qKvfVihtDacraEoTySLV6oohCiiiiEKKKKIQoooohP//Z',
    inStock: true, rating: 4.7, reviews: 1450
  },

  // ========== MUNCHIES ==========
  {
    id: 'munch-001', name: "Lays Potato Chips - India's Magic Masala", brand: 'Lays', category: 'munchies',
    price: 20, mrp: 20, discount: 0, unit: '52 g', deliveryTime: '11 MINS',
    image: 'data:image/jpeg;base64,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',
    inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 5670
  },
  {
    id: 'munch-002', name: 'Kurkure Masala Munch', brand: 'Kurkure', category: 'munchies',
    price: 20, mrp: 20, discount: 0, unit: '78 g', deliveryTime: '11 MINS',
    image: 'data:image/jpeg;base64,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',
    inStock: true, tags: ['Bestseller'], rating: 4.4, reviews: 4230
  },
  {
    id: 'munch-003', name: "Haldiram's Aloo Bhujia", brand: "Haldiram's", category: 'munchies',
    price: 55, mrp: 60, discount: 8, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://www.bbassets.com/media/uploads/p/l/70000834_6-haldirams-namkeen-aloo-bhujia-del.jpg',
    inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 3890
  },
  {
    id: 'munch-004', name: 'Bingo! Mad Angles - Achari Masti', brand: 'Bingo', category: 'munchies',
    price: 20, mrp: 20, discount: 0, unit: '72.5 g', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNhYO2dx4Ma5Ig4oMHcVrh_gqEEjwUqyYWd4IkW54R7w&s',
    inStock: true, rating: 4.3, reviews: 2340
  },
  {
    id: 'munch-005', name: 'Doritos Nacho Cheese', brand: 'Doritos', category: 'munchies',
    price: 30, mrp: 30, discount: 0, unit: '60 g', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcT6mJbWANsURCTYy7GTNCm0_Q89a1s2JD8ezqdECefT-nWiwXSpg1RZqAzikLptEvcRQ-PBggjkONU5xrOUKTqzxhFtrAaxvQ',
    inStock: true, rating: 4.5, reviews: 1890
  },
  {
    id: 'munch-006', name: 'Pringles Original', brand: 'Pringles', category: 'munchies',
    price: 99, mrp: 110, discount: 10, unit: '107 g', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTqx8PuzcICSwvWBpoClHAYc93Ffxe3NE9Xl4rKt2OtsW-kKWAr56K58iNfbim7j4PvBzVO8g0PSfRVb_FxaqXU9lJNuAWi',
    inStock: true, rating: 4.6, reviews: 2670
  },
  {
    id: 'munch-007', name: "Haldiram's Moong Dal", brand: "Haldiram's", category: 'munchies',
    price: 50, mrp: 55, discount: 9, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://rukminim1.flixcart.com/image/1500/1500/kgv5x8w0/snack-savourie/z/j/n/1-moong-dal-pouch-haldiram-s-original-imafwzuzdh7zxwz9.jpeg?q=70',
    inStock: true, rating: 4.5, reviews: 1560
  },
  {
    id: 'munch-008', name: 'Bikaji Bhujia Sev', brand: 'Bikaji', category: 'munchies',
    price: 45, mrp: 50, discount: 10, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcREpCJ97rm3qj-4p-W8rPwUsB5jNeh1LqbPJlteRC4sHku3Fz_5jJ-0tDfyAdLG5GT1FRrM6Sa2a3cR08LAnyTzCCGtm4L96ioZCH0oUiqG-8JiEtr_-jWd5gk',
    inStock: true, rating: 4.4, reviews: 1230
  },
  {
    id: 'munch-009', name: 'Balaji Wafers - Masala Masti', brand: 'Balaji', category: 'munchies',
    price: 10, mrp: 10, discount: 0, unit: '35 g', deliveryTime: '11 MINS',
    image: 'https://www.balajiwafers.com/cdn/shop/files/Crunchem_Masala_Masti_Wafers_Default_bc03ebaa-4c86-4de2-977b-c25c873ade91.png?v=1749561574&width=500',
    inStock: true, rating: 4.2, reviews: 890
  },
  {
    id: 'munch-010', name: 'Uncle Chipps Spicy Treat', brand: 'Uncle Chipps', category: 'munchies',
    price: 20, mrp: 20, discount: 0, unit: '55 g', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRO6XLjXyYhXMQ-GqDjRQo-Nxoj0mmV5mTDeXRkDeWNgQ&s',
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
    image: 'https://m.media-amazon.com/images/I/513-4QwNjSL.jpg',
    inStock: true, rating: 4.3, reviews: 1230
  },
  {
  id: 'drink-006',
  name: 'Real Orange Fruit Juice',
  brand: 'Real',
  category: 'cold-drinks',
  price: 105,
  mrp: 120,
  discount: 13,
  unit: '1 l',
  deliveryTime: '11 MINS',
  image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?w=300',
  inStock: true,
  tags: ['Healthy'],
  rating: 4.6,
  reviews: 1960
},
{
  id: 'drink-007',
  name: 'Minute Maid Pulpy Orange',
  brand: 'Minute Maid',
  category: 'cold-drinks',
  price: 95,
  mrp: 110,
  discount: 14,
  unit: '1 l',
  deliveryTime: '11 MINS',
  image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?w=300',
  inStock: true,
  rating: 4.5,
  reviews: 1725
},
{
  id: 'drink-008',
  name: 'Paper Boat Aamras Drink',
  brand: 'Paper Boat',
  category: 'cold-drinks',
  price: 65,
  mrp: 75,
  discount: 13,
  unit: '600 ml',
  deliveryTime: '11 MINS',
  image:  'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?w=300',
  inStock: true,
  tags: ['New'],
  rating: 4.7,
  reviews: 1480
},
{
  id: 'drink-009',
  name: 'Bisleri Soda Club',
  brand: 'Bisleri',
  category: 'cold-drinks',
  price: 35,
  mrp: 40,
  discount: 12,
  unit: '750 ml',
  deliveryTime: '11 MINS',
  image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?w=300',
  inStock: true,
  rating: 4.3,
  reviews: 1320
},
  // ========== INSTANT & FROZEN FOOD ==========
  {
    id: 'instant-001', name: 'Maggi 2-Minute Masala Noodles', brand: 'Maggi', category: 'instant-frozen',
    price: 14, mrp: 15, discount: 6, unit: '70 g', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfiklhD6yy9J6mwbCB8YuZEyHoiL52q9lehqcxxBQmog&s=10',
    inStock: true, tags: ['Bestseller'], rating: 4.7, reviews: 8900
  },
  {
    id: 'instant-002', name: 'Yippee! Magic Masala Noodles', brand: 'Yippee', category: 'instant-frozen',
    price: 12, mrp: 14, discount: 14, unit: '70 g', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTKK-kXKJY1bbgWqB8R2h_NuxcpW-Z0cd6Ga6OjZ1hQLoIoz1aUjbZ7tGOGI8CWPonhzffyKagK0PHuqscd6K5MFUtJDzpOVzxc0Bu2TDWpCDzHb2_-QUAR',
    inStock: true, rating: 4.4, reviews: 3450
  },
  {
    id: 'instant-003', name: 'McCain French Fries', brand: 'McCain', category: 'instant-frozen',
    price: 135, mrp: 150, discount: 10, unit: '420 g', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRsCijg60q8cI8KOsdJTF_0epv9DImQ1lz2TChJDtP2FXbHMokYnlBhn9ym1kU9TkWTCS3WVeHw-tk66-liFgzwlNTSuroF9w',
    inStock: true, rating: 4.5, reviews: 2340
  },

  // ========== TEA, COFFEE & HEALTH ==========
  {
    id: 'tea-001', name: 'Tata Tea Gold', brand: 'Tata Tea', category: 'tea-coffee',
    price: 235, mrp: 250, discount: 6, unit: '500 g', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRTsbd2Pjl2wReodWPqX4kLOp6PKA7GuxyhVfxa0WioO2edgbThe7GDf6gbGWHOZgE1y-PSGrRzRn71JVqWBdfpRuno3QmkZQ',
    inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 4560
  },
  {
    id: 'tea-002', name: 'Nescafe Classic Coffee', brand: 'Nescafe', category: 'tea-coffee',
    price: 320, mrp: 350, discount: 8, unit: '200 g', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSRucBGs3GIwJ6UXJvwY7trXwc_irMUkoWn_pXpw0iNTxaQ6oIroGrdbWSFNYtiLEnW0IKGrMVVIcgJy6yN3BvRWC-q8XpfXA',
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
    image: 'https://m.media-amazon.com/images/I/61FsBt3SB4L.jpg',
    inStock: true, rating: 4.5, reviews: 5670
  },
  {
    id: 'bakery-003', name: 'Sunfeast Dark Fantasy Choco Fills', brand: 'Sunfeast', category: 'bakery-biscuits',
    price: 40, mrp: 45, discount: 11, unit: '150 g', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/81IDtnSthyS.jpg',
    inStock: true, rating: 4.7, reviews: 4230
  },

  // ========== SWEET TOOTH ==========
  {
    id: 'sweet-001', name: 'Cadbury Dairy Milk Chocolate', brand: 'Cadbury', category: 'sweet-tooth',
    price: 45, mrp: 50, discount: 10, unit: '55 g', deliveryTime: '11 MINS',
    image: 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADrbWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAAAAAAAOcGl0bQAAAAAAAQAAAB5pbG9jAAAAAEQAAAEAAQAAAAEAAAETAAAJwwAAAChpaW5mAAAAAAABAAAAGmluZmUCAAAAAAEAAGF2MDFDb2xvcgAAAABqaXBycAAAAEtpcGNvAAAAFGlzcGUAAAAAAAAAsQAAALEAAAAQcGl4aQAAAAADCAgIAAAADGF2MUOBAAwAAAAAE2NvbHJuY2x4AAIAAgAGgAAAABdpcG1hAAAAAAAAAAEAAQQBAoMEAAAJy21kYXQSAAoKGB3sLBggQEDQgDKyExIAAooooUC0gap+gzxOIeMZiMzmhZSqPW0F0mh65ipsXxQZBLhXoDg3KP6ivEqRzbE/p5qj1Bo8IwsjrIFThbZAjXeitBEtv23T155U1Jcvj6Ga08XMl2vJaveDvJPH5SCTFHz8sknJZstMbhKtqfDgps+CVGwWCXLz0XJECxHvhRcq0PGAlqDDFl+TrVeMLosDDkC4+3x881tlBWBTLSAhNhOifFBjiIw41TwedKTB+0DL2szk09nfLRFAjlMEQv4HDg+ZYa2gUv3X+7V8X/hjkU92U8hxrMIvjYzDryJ+LJTxG6AmBUx3Eajxu+0ac+iDwDB91wzT1qb9v8dM8YK+g7YVpUrL7dOeWhqES3o2x/SkHcX1pG9/eyZSSUfyY5Ky5LKCeZAuRrd5Qzmcba3TSorW0VxeTiPgXJt4YuZIIg2xEP7A/adegWWFsMuteOuZbD92/FNFcmrHE1O/myHMyFu6RbTvA/5y6ZYeHVQVbVaCW6RWAPk32QRM+6cPl3y3HZoJy4zG8f6yEcdxovHzHJYjLaxlZeAM4fMSg/q2Vis3VNxCJmMinipYn0YQew57+bDHP+iuOQV30eWQ04KaYKKdhHkZJJ4EukDrIlBJk9xj7l6+TCJAHc6PSCZdRO31qwj92FLh2zneJfs/paadS+G00fNtCFzpBEnvO+v04H88yTag7yWwuS9CjVrH0xLQCYlclDQ/CdD1kUAT+n3+CP8SK5hbEyZIO4GNgHDQgdduloolOJHzljFFxYr8fwBbG/Yt9RaywF05LxM7i+FzBm5pkto4RRhzWm6jnxx3bdSqaPx+zhtTk7AzW6uCY6LGjXODgRroUd3czuTADvu6GqFSu8tHR29xHk/z/p/Kyy1wei6XBcFbkvu/OMxSu4fjSWNE9i/ZYunSuCX+/ztC4qLMXrCxNv6ay3KtJUnKlWbz3Yhf+IjpMFZTxwWFS57eOLpAk4EAwEDmGqyTU88/97ZHCw8ECpWFtJRK4CRKMhNVyzvkqiM/nFHZzNwffqqWudavdsDa0Bz3N4dTw/pGkcraTXo7968BHIUCTPVajufesgddFhIl6PMw1j88yFJs0EKoXokP2KnHuitX9C6gvXv/Ug7uSSSyaJDdYHzF0BiKgqgUVbfdrx5T3qZHJBFeWBtfpsg/ylgfDsm5YYWh5J589WQF2RkuehdZyIDkdJ31Nb2XM5j5CToRPLswTOO0t/1+w2iAx2HsltVNXvJIO5WwlOU1CvFBZV0Kq/SAFZtJQAa1ikbfMjAtL31rYaJXc1ZUHjEwvGA+1wZtfMuS+cY0FRbIQcuNlm22dIxYi8YMaYtZqeEzddMLhoa9kbhf5mYbCnZsgg/hczB9+EbgXkI9LrLaFHtwSesE55P1z7byUSv12bK+Bw9wYlNnQEWx8FZT0nabtzcxx7hU1C+2qiv9osCo8HCspQF5PkKovPwqqEAD3OJYijj3nGn0IL4HCpu5D87V6ivAdJJ7ogkyE3/xz5T2nv2pcjzCmU23+pSX5+/FMfjlbHc5evPOd58XFAmAEIP5HaeExroPSrtW9E9QhVL06m285NGZ44TG4I4EidENiMaOJndoD7n9sOfkiGxG0N2SuxmqvbIdp7O6RTFAhMD2+YHpE9rkmynWVyP/H900Y1lGw4g+nlHfYxe2PPMZI3XXSy8P/G5oFIX+2LQVxa/nZJzlBS5V/9ynHxQUf9R0ISBsllm7Zw33TXJNlgsE013/nM9arm+HZgh9yXzoBQTWGGxlPpd1YFTPe3eAvXwRiN2DLoLmrKXZn0ihJp8gNHvKTZJbQ7MmDRo0ngfu1RCbcHJoNigJOBpU1WPpA/xhV2OB6prj9rzUdw4S+uD99jI2QGDF91PsQac+AQlRnfBBQ28dWgVg0iqsY685ZHQZ5Cl4da1holcm/0IMn/H3TROZzX/zScmYPL/u1F9UzVeuSMMFeg0rTM++hVPox9A9v/n5fn56F1sbogMsb5Gh1/gfAUwNxW1korYVFqqVru2bai9puqSH8/6RGs+fMrr+YTRikeugTWQWgnSR7cGyF3VXtYq5m2pBCEcIxkWmxuJBAlqCbkKHCvaL0MxNJA3O7Iam/+UbnL0QTxgK5Or1FchNg3I3LO2BCIACkwCLyzXWmJKvnI0C5+dP5j+BvJwB6cRDt9UOtMhM8zOIxaEByCH/aTWMebxD1oXtRjXe6VbY0OwXz83aOOKmpw/4TPEdEXDy60bwQ6f5FDzJdl0ZP5OaN5ji6kCXsGXHdZQen7cd5YfmIoHlBEQXh5Xqhu9U6vl2IVwt4DWCFR60uryV0Xdt8w1wSV3FFz5vau0YuNI2UgrhU6hVNRFT+MsjCAiiy2iGqTxyzOb+WxJ4GXFxW3MWsGrASwZuhODS5H0LdfWVNa5QgT4qtps2IkUXe4d5vcBsldSY3B7UWCQv8z0yCrCQdqM0ftHe+6gnQxRYF/s4YzneXJElWYA0rlt+5k2jBlnww+TcGxqKtE17AtxUeU1l98qhHDYjVP9zSwRfY5lLMM8Yl7AApVuXDOG1cEOAe6qL3NgAMdH9vmCEXvB2j9l0goSPUezVAwbaC0Fkl5rsK/KK0VgVdrw7QMZZrShDozBQKhuIKYiCHbDlFhsBWZQ0e6JSKVPX6dQ1ssqx0UVGa47JCpPFMInRPl61wKRSSsQEbYX1JUrCXVMRZqpp+aEUbYpuyXCeMOAquuM4uSB4KAhlb834ODAjKFJXgyxfnmd4lqVJSQUMRNNI2LP0XB8sCcfO66BUFCGYLmfys/We1GHSKC1jr9xCOpNAmBBe5XXarRltAMtjXc9x+3Rl/mR33TKTQoSm2etvmQJix0Z0cJwfM7jfh7REZba1xJ28gc/7p18XqcCs7Np0ptvpkgFf/e5jm1i8FBBxk7ULQhmEiLt74s6GWklVZGu90TSCRc30pR2thfzARfjetgKSExuxC35rBM6LPLEezCdAopuYu0QNu/gmMSav4VQX8hbGZksGLBtWja4G5Qb+MXtxxc/vygpZjSknI5iOtV3acIWaOxSzZoq1nCISNBUY0Bh+qHly1jKAu2120aO0Buv1MVmV5AF4Q5VnIy1yOVEFYSvIWqo4m/aTvOMXyvqUBhHBojQR3r2DWGLhS6UYpY31Mr8+CA1FRyN31xv0S9m8QscMQmq09I02ZrP+sw9i228kogLHRLzGncHeBZtPnPoDuQM+ZN7ztI1XaTqEvih8fjLPmCpDuKCfKxvnsuNWNUlMWG1T2JEO55gDqao45u6314q8ydodjmHqQC4X4yRNLatoge96siokkfZh59g=',
    inStock: true, tags: ['Bestseller'], rating: 4.8, reviews: 8900
  },
  {
    id: 'sweet-002', name: 'KitKat Chocolate', brand: 'KitKat', category: 'sweet-tooth',
    price: 20, mrp: 20, discount: 0, unit: '27 g', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/71BdjHFKjTL.jpg',
    inStock: true, rating: 4.6, reviews: 5670
  },
  {
    id: 'sweet-003', name: '5 Star Chocolate', brand: '5 Star', category: 'sweet-tooth',
    price: 10, mrp: 10, discount: 0, unit: '22 g', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQ5ePRTc636hRfX50fJfrQY8kyvt1Dt2SPI-v1kHkR-VndCfUwo-OzrlYiKnTCU6qGJNy7VFNRlPyKkL1FgnrsWy2CC916YybmK9dlUMN1lJIRShbDm-cnN8LM',
    inStock: true, rating: 4.5, reviews: 3450
  },

  // ========== ATTA, RICE & DAL ==========
  {
    id: 'atta-001', name: 'Aashirvaad Whole Wheat Atta', brand: 'Aashirvaad', category: 'atta-rice-dal',
    price: 285, mrp: 310, discount: 8, unit: '5 kg', deliveryTime: '11 MINS',
    image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTLQnRUUhi3DFn1CMtRlOI9_4PduwKBGOppAUcZkIEmoCXOymFxVuCSuyBdy449FWq5JrsyCAX3ckKdZgL12e_GvOfv9z6ZMBkAnbQ_XSszaPbn1arC9Vl-gg',
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
    image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTEhMWFhUVGR8YGRgYFhgYGBkbFxgaGhcXHh4ZISggGxsmHhoeIjEiJSkrLi4uGCAzODMtNygtLisBCgoKDg0OGxAQGzIlHyUvMi0vLS8tMi8yLS0tLTUtLS0tMC8tLS0tLS8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBEQACEQEDEQH/xAAbAAEAAQUBAAAAAAAAAAAAAAAABAIDBQYHAf/EAEYQAAIBAwICBQcJBgQFBQAAAAECEQADEgQhMUEFEyJRYQYVMlNxgZEUI0JSkpOhscEHM2JygtEkssLwQ3ODouFUo8Pi8f/EABsBAQADAQEBAQAAAAAAAAAAAAACAwQBBQYH/8QANREAAgECAwQJBQACAwEBAQAAAAECAxESITEEQVHwEyIyYXGBkaGxBVLB0eEU8SMzQoIVcv/aAAwDAQACEQMRAD8A7jQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAcg12vui7cAu3PTb6bfWNeNKcsTzfqebKUrvMsecL3rbn3j1zHLi/UjilxHnC9625949McuL9RilxHnC9625949McuL9RilxHnC9625949McuL9RilxHnC9625949McuL9RilxHnC9625949McuL9RilxHnC9625949McuL9RilxHnC9625949McuL9RilxHnC9625949McuL9RilxHnC9625949McuL9RilxHnC9625949McuL9RilxHnC9625949McuL9RilxHnC9625949McuL9RilxHnC9625949McuL9RilxHnC9625949McuL9RilxHnC9625949McuL9RilxHnC9625949McuL9RilxHnC9625949McuL9RilxHnC9625949McuL9RilxOj+RF1m0ilmLHJtyST6R5mvS2Vt08zdQd4ZmfrQXCgFAKAUAoBQCgOSeUfRd2zfcMAVYlwwmIYk+48q8qrRcZO5586TTZjVQnmPiaqwkMJWNO3h8f8AzXLDCz35M3d+I/vXLHMLHyVu7/fxpZjCzz5M3cf9++lmMLHydvqn4GlmMLPOob6p+BpmLPgOpbuPwNMxZjqW7j8DTMWY6lu4/A0sxZ8B1Ldx+BpmLMdS31T8DTMWfAdQ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',
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
    image: 'https://www.quickpantry.in/cdn/shop/files/VimDishwashLiquidGel-Lemon120ml.jpg?v=1721151715',
    inStock: true, rating: 4.5, reviews: 2340
  },
  {
    id: 'clean-002', name: 'Harpic Toilet Cleaner', brand: 'Harpic', category: 'cleaning',
    price: 185, mrp: 210, discount: 11, unit: '1 l', deliveryTime: '11 MINS',
    image: 'https://m.media-amazon.com/images/I/51-CLgWAdWL.jpg',
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
    image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSlSc6sVTUZJXEtBYpZPy3eXdQTSSaF_2W1PHMt3m85GxFd1eCaCF68ANhkuPnwrJV-XnQw82NKU9aKYNayt8jjafE15lEq',
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
    image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRAlV4NbXqVYymEXPAho7_TNWzbi9KBX679ozlDXmA9vpTho1wXN0idtPVeQfnwPCs1-1Db_ZlBboX3OSfAsMsjaMAp5SbI2g',
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
  { id: 'veg-012', name: 'Garlic', brand: 'Fresho', category: 'vegetables-fruits', price: 30, mrp: 38, discount: 21, unit: '100 g', deliveryTime: '11 MINS', image: 'data:image/jpeg;base64,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', inStock: true, rating: 4.4, reviews: 880 },
  { id: 'veg-013', name: 'Ginger', brand: 'Fresho', category: 'vegetables-fruits', price: 28, mrp: 35, discount: 20, unit: '100 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTLM7P8Y5XaKaEUR6mB0zm6fTvm8QQJt7Rwh_O6I9S9A&s=10', inStock: true, rating: 4.2, reviews: 490 },
  { id: 'veg-014', name: 'Green Chilli', brand: 'Fresho', category: 'vegetables-fruits', price: 18, mrp: 24, discount: 25, unit: '100 g', deliveryTime: '11 MINS', image: 'data:image/jpeg;base64,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', inStock: true, rating: 4.0, reviews: 310 },
  { id: 'veg-015', name: 'Banana - Robusta', brand: 'Fresho', category: 'vegetables-fruits', price: 42, mrp: 50, discount: 16, unit: '6 pcs', deliveryTime: '11 MINS', image: 'data:image/jpeg;base64,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', inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 1420 },
  { id: 'veg-016', name: 'Apple - Royal Gala', brand: 'Fresho', category: 'vegetables-fruits', price: 120, mrp: 150, discount: 20, unit: '4 pcs (apx 700 g)', deliveryTime: '11 MINS', image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRbT28nIdCpnfIE__XLZFS2SFsSnbmfsvc1JCTwmauwDL0iOtDaa0aexk0qgC_javp3lvEIMptalspM0YkF0aCvqbJmGv0Bkw', inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 2100 },
  { id: 'veg-017', name: 'Mango - Alphonso', brand: 'Fresho', category: 'vegetables-fruits', price: 160, mrp: 200, discount: 20, unit: '3 pcs (apx 600 g)', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgzUqRLB5jr3N1p-l9x9oaGyp-1zL_FvXX_3XNKwqfapiWXxepgpn8h6CKWNNf8g3I2sRXgIuDKrVIsl1fjKXM7tf6EfxREAaRyKYdB8US&s=10', inStock: true, tags: ['Bestseller'], rating: 4.8, reviews: 3200 },
  { id: 'veg-018', name: 'Sweet Corn', brand: 'Fresho', category: 'vegetables-fruits', price: 35, mrp: 45, discount: 22, unit: '2 pcs', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSam3IHIAmcuvAzZbMqFeochnUl_mK8eoxR-ILSh20qrEKzrJrLedJylJPEj_YdwfHou_pl43R_ujqw48ytGxWAVTadolb_-lRRYmssV4xczw&s=10', inStock: true, rating: 4.3, reviews: 520 },
  { id: 'veg-029', name: 'Bottle Gourd (Lauki)', brand: 'Fresho', category: 'vegetables-fruits', price: 30, mrp: 38, discount: 21, unit: '1 pc (apx 500 g)', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpHLp_Av1lllYBLTLB8FUZHKeyEsk7mxevFkZlLjvoFZUe76eXGbRmIGwXH3YqoDs1Dl5-YA87tnLkGqoCSCjWpWLg4Ta2i-5N0NN6eslr&s=10', inStock: true, rating: 4.0, reviews: 240 },

  // ── Dairy & Breakfast (7 new) ──
  { id: 'dairy-011', name: 'Amul Mozzarella Cheese Block', brand: 'Amul', category: 'dairy-breakfast', price: 110, mrp: 130, discount: 15, unit: '200 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/357573/pexels-photo-357573.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.7, reviews: 1850 },
  { id: 'dairy-012', name: 'Mother Dairy Mishti Doi', brand: 'Mother Dairy', category: 'dairy-breakfast', price: 40, mrp: 50, discount: 20, unit: '400 g', deliveryTime: '11 MINS', image: 'data:image/jpeg;base64,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', inStock: true, rating: 4.5, reviews: 920 },
  { id: 'dairy-013', name: 'Epigamia Greek Yogurt - Mango', brand: 'Epigamia', category: 'dairy-breakfast', price: 60, mrp: 75, discount: 20, unit: '90 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRcakKl3yur0M-YmpCoNMD-HjOtsWRWCMJcoRy2B2-Q5mZQB8ZDn9qvHUbbfO88Jgp0oWYjDKxsNpVh5G1Ij-8_8AxkzlLjU4-DRfaOmM1OAH7Pp5p_u6lP', inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 1340 },
  { id: 'dairy-014', name: 'Amul Cream - Fresh', brand: 'Amul', category: 'dairy-breakfast', price: 30, mrp: 38, discount: 21, unit: '100 ml', deliveryTime: '11 MINS', image: 'data:image/jpeg;base64,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', inStock: true, rating: 4.4, reviews: 660 },
  { id: 'dairy-015', name: 'Saffola Oats - Classic', brand: 'Saffola', category: 'dairy-breakfast', price: 130, mrp: 165, discount: 21, unit: '500 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSv-eBBVU9qXwzxEj7eCo0MS8iuEbfTuuKPMsfDBfXnhkpb6OyfJp9HcohuUbIqzTkxjGcl8YnnMFaaigsEPrBguvuqPgp_2j2KX_eWy_AP2RR5Y1S-xxY', inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 2200 },
  { id: 'dairy-016', name: 'Kellogg Corn Flakes - Original', brand: 'Kellogg', category: 'dairy-breakfast', price: 125, mrp: 155, discount: 19, unit: '500 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRbvYx93K6n1xoPvgzz7a0XW1bu63VhYObT6gXCzB-n1PlnpVomz-EGH12R6mo7-8iwlKP7ctXsmUO1mdlOm3L0bpgf4xgRC6sn0ohkLGnqd1JStyfXPXu7', inStock: true, tags: ['Bestseller'], rating: 4.4, reviews: 1800 },
  { id: 'dairy-017', name: 'Amul Lassi - Rose', brand: 'Amul', category: 'dairy-breakfast', price: 30, mrp: 38, discount: 21, unit: '200 ml', deliveryTime: '11 MINS', image: 'data:image/jpeg;base64,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', inStock: true, rating: 4.3, reviews: 780 },

  // ── Munchies (8 new) ──
  { id: 'munch-011', name: "Lay's Classic Salted Chips", brand: "Lay's", category: 'munchies', price: 20, mrp: 20, discount: 0, unit: '52 g', deliveryTime: '11 MINS', image: 'https://m.media-amazon.com/images/I/61FXwBMClcL.jpg', inStock: true, tags: ['Bestseller'], rating: 4.3, reviews: 3100 },
  { id: 'munch-012', name: 'Kurkure Masala Munch', brand: 'Kurkure', category: 'munchies', price: 10, mrp: 10, discount: 0, unit: '22 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLa3POU_jgxRCDbFeSQmIdJIBW4C1ApyBkilpZttkk51KzgsWdZR8EJSS6&s=10', inStock: true, tags: ['Bestseller'], rating: 4.2, reviews: 4100 },
  { id: 'munch-013', name: 'Bingo! Mad Angles', brand: 'Bingo', category: 'munchies', price: 20, mrp: 20, discount: 0, unit: '55 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRw2lnR8h0lUhZlsO9TFAtd2ZcI8cx4K-fwemv9kswYwy3QF8jPXSeh-5Kg&s=10', inStock: true, rating: 4.1, reviews: 1640 },
  { id: 'munch-014', name: 'Parle G Biscuits', brand: 'Parle', category: 'munchies', price: 10, mrp: 10, discount: 0, unit: '200 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSafPc1JXoI14nK3x_HYt_trLlZKaIsgjHWn4WU3YuhQibhuLX_EtfKZHxkUqqJDpF9WQm5o_l59ugSBiWwxdo3-Nf_k-fYIKgupuAcu5Kr8nWf_MgkvmQuVw', inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 5600 },
  { id: 'munch-015', name: 'Too Yumm! Multigrain Chips', brand: 'Too Yumm', category: 'munchies', price: 25, mrp: 30, discount: 17, unit: '65 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsFl69lb8aAmjnz7KI_MQ8lW3XP8nRUPnPY5G4zlE_GFkwZy4BsidmSVY&s=10', inStock: true, rating: 4.0, reviews: 820 },
  { id: 'munch-016', name: 'Pringles Original', brand: 'Pringles', category: 'munchies', price: 115, mrp: 150, discount: 23, unit: '134 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTpzob46-pAUMg4fU-4qtbzu5ao_D7Df0ej4DcNjQi7W_68krCX', inStock: true, rating: 4.6, reviews: 2800 },

  // ── Cold Drinks & Juices (6 new) ──
  { id: 'drinks-001', name: 'Coca Cola - Can', brand: 'Coca Cola', category: 'cold-drinks', price: 45, mrp: 50, discount: 10, unit: '330 ml', deliveryTime: '11 MINS', image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRtsde1NzDSDg9e9bwLI5v2CieMhuA8cTvES1jf1kjS88gglehJZB27Cm3XczRVEepuNBZOK-Jp3VjGln5q_zBPVoV5VQ9vojZ2llbbnPYM_epOHJC4al5L2A', inStock: true, tags: ['Bestseller'], rating: 4.3, reviews: 4100 },
  { id: 'drinks-002', name: 'Tropicana Orange Juice', brand: 'Tropicana', category: 'cold-drinks', price: 90, mrp: 110, discount: 18, unit: '750 mL', deliveryTime: '11 MINS', image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQe2crfoOA9eHV4KyN7G7zJgwHIZkfMzFvJ1I0CPeh4HEmr7oEySen8xVXOVUj6uGpG0yFHOtPee-X3xKqsYNTH7kcvfRxez-pJdUy-Yp2x1fL6FOCvPM-aFg', inStock: true, tags: ['Bestseller'], rating: 4.4, reviews: 2600 },
  { id: 'drinks-003', name: 'Paper Boat Aamras', brand: 'Paper Boat', category: 'cold-drinks', price: 35, mrp: 45, discount: 22, unit: '250 ml', deliveryTime: '11 MINS', image: 'data:image/webp;base64,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', inStock: true, rating: 4.5, reviews: 1780 },
  { id: 'drinks-004', name: 'Red Bull Energy Drink', brand: 'Red Bull', category: 'cold-drinks', price: 125, mrp: 150, discount: 17, unit: '250 ml', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxDd6NXWRktcbWajDDupnthJVize-RaGWkZErOWqqXi1ZUmPgTrEPZ0xE7-vczxgjTvzILVxPA8VEtsWG3Ynn9MYAqQyO8Dm5vxBCrnJqYKw&s=10', inStock: true, rating: 4.4, reviews: 2100 },
  { id: 'drinks-005', name: 'Sprite - Bottle', brand: 'Sprite', category: 'cold-drinks', price: 40, mrp: 45, discount: 11, unit: '750 ml', deliveryTime: '11 MINS', image: 'https://cdn.grofers.com/da/cms-assets/cms/product/rc-upload-1770356946958-138.jpg', inStock: true, tags: ['Bestseller'], rating: 4.2, reviews: 3400 },
  { id: 'drinks-006', name: 'Real Mixed Fruit Juice', brand: 'Real', category: 'cold-drinks', price: 75, mrp: 90, discount: 17, unit: '750 mL', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/339696/pexels-photo-339696.jpeg?w=300', inStock: true, rating: 4.3, reviews: 1560 },

  // ── Instant & Frozen (6 new) ──
  { id: 'instant-007', name: 'McCain Smiles Potato Snacks', brand: 'McCain', category: 'instant-frozen', price: 130, mrp: 165, discount: 21, unit: '415 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTDtpAJAVDkjf1kZAM-B98T-D4RuRR6qPk-wHPVv4YcGg1sePK7YhtB9S4kufrnJsyVSQsa844CtSNBG7LrPfR84KJV2l5MRCsgETFGezLi8SS9aglxx2FZ', inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 2800 },
  { id: 'instant-004', name: 'Haldiram Instant Poha', brand: 'Haldiram', category: 'instant-frozen', price: 45, mrp: 55, discount: 18, unit: '240 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQ27PNK0K8cUqVPcJ-tFhRGoaeblkK9v7_v8lnNNovEyQ2_aNNkAM2Gc6IvEPbRepRcr9ZJfk0BxO0SgRwCjuFoM0KsgpaVBMwc1iVtSvKBrsni4bXHX60_cw', inStock: true, rating: 4.2, reviews: 1100 },
  { id: 'instant-005', name: 'Ching Schezwan Chutney', brand: "Ching's", category: 'instant-frozen', price: 55, mrp: 70, discount: 21, unit: '250 g', deliveryTime: '11 MINS', image: 'data:image/jpeg;base64,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', inStock: true, rating: 4.4, reviews: 1980 },
  { id: 'instant-006', name: 'MTR Instant Poha Mix', brand: 'MTR', category: 'instant-frozen', price: 55, mrp: 70, discount: 21, unit: '500 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQ3nPvdCKtoIK4MZiWjL4XRcbvuVfJbshAlxwqzNzX4x0MARCdE6c5xc_crjV_y_mRciwePrXEDRF-kdoAvbQA3cC7VC1sU', inStock: true, rating: 4.3, reviews: 900 },

  // ── Tea & Coffee (5 new) ──
  { id: 'tea-006', name: 'Tata Tea Gold', brand: 'Tata Tea', category: 'tea-coffee', price: 130, mrp: 165, discount: 21, unit: '250 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 4800 },
  { id: 'tea-007', name: 'Nescafe Classic Instant Coffee', brand: 'Nescafe', category: 'tea-coffee', price: 95, mrp: 120, discount: 21, unit: '50 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSP4neFc_oZfGWmtIdKmAVc8h0CxrkFphVnlUf2dFWuIbrwcrlEMSWB7AwmCFE2aFPpdRPeqT8Puxv1Ype3xJ3t4pUxRfHTVpGXucCREuYFR4o_tpABSrVIDA', inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 3600 },
  { id: 'tea-008', name: 'Bru Roasted & Ground Coffee', brand: 'Bru', category: 'tea-coffee', price: 75, mrp: 95, discount: 21, unit: '100 g', deliveryTime: '11 MINS', image: 'https://m.media-amazon.com/images/I/61Nus06AFqL.jpg', inStock: true, rating: 4.4, reviews: 2100 },
  { id: 'tea-004', name: "Lipton Green Tea - Honey Lemon", brand: 'Lipton', category: 'tea-coffee', price: 175, mrp: 220, discount: 20, unit: '25 bags', deliveryTime: '11 MINS', image: 'data:image/jpeg;base64,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', inStock: true, rating: 4.3, reviews: 1560 },
  { id: 'tea-005', name: 'Blue Tokai Filter Coffee', brand: 'Blue Tokai', category: 'tea-coffee', price: 395, mrp: 450, discount: 12, unit: '250 g', deliveryTime: '11 MINS', image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAFwAXAMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAAABQQGBwMCAf/EADwQAAIBAwIDBQUDCgcAAAAAAAECAwAEERIhBTFBBhMiUWEycZGSoYGxwRQjM0JDUmPR4fAHFSRyc6LS/8QAGAEAAwEBAAAAAAAAAAAAAAAAAAECAwT/xAAhEQACAgEFAQEBAQAAAAAAAAAAAQIRAxITITFBUTJhBP/aAAwDAQACEQMRAD8A3GiiigBP2mv14faxSP3uGfH5pcnlVZftTAVwPy1Dkb90T+NXHihAiQk4GfPFJndM51jH+6ufJ+h1LxiWHjut5iLu6KlgUV4QugYORzGc/gK7Lx9A+kzT81HsDqSOer3e7HrU/vQD+kHzV7Eqn9oPmqLDTL6LE7QqR+mnPXeMD0/erjH2jXUNct4QB4gICM+vtU9DoB7a/NXN5lxjWPmosKl9Ftv2ntTdQRqLzU8iqMxnG599XqqpEQZoyXG7qBv6irXW2L0VP1hRRRWoBRRRQAt42neQxqG0nVscZ6VXJg8RKvgnpgHB+lWniCB+5BJHiPL3Gld5DC2QWYMpwawydhQgv7uCwsLi9uGxFBE0j4B5KMnp6VkvEe0faK6mh4nNeta2xdStpDOY9AJAAIGC2M5OfptWs8d4bFxLht9wwSlGuIHiEhGVQlSBn78ehrEXW8tLyHg/Fe+guFmQSCeZsbMDsOoOkYPLkaMdA1RfuxfabiEnFH4NxeQTM6GW1nI8WBzRupONwTvgb5yKvHtsApG48jt9KoPYfhjX/GY+KNEyWdgJtM2QRNK/hwp/WAUtk+ZA6bX6aSJICyuy5OnB5g+VTOrFFNqzmk8cfE7aGM62Mq6j4sDfoKvlZzwlEfi8BVmP5zfPnmtGrTGOqCiiitQCiiigCJf/ALH/AJB9xpTfaZJlMYy48JB236U04qcRRH+MtL7s/wCoBQbhcEk4A/vNc+XspCi4iVlYKGlY5bbYZHNsD+zivojS8RVvrOKQJ7JkjDAfHrUO+41acJ4hbWly6MtwMNKsmTEc7BlxkKfPPntgUzaJu9V+8kUj2kGCp9/9DWSVGu3JJN+kWR5HYK9swRAdKgY+o2+ylXE3URMQxI21Bup6H1pq91Ik6JINOrOoBdWOmc9BsaTX2nOuN8xMpwurn7sc+dDi1yybT4O/Z1lbiEQXmjKD8wzWkVmvZtx+WxY55Qf9ga0qujF0RIKKKK1JCiiigCBxk6bQNnGlwc+VQVhV7mVX6526fb8al9oM/wCWSaef9DS63vEub2WPumUodLav1xpyD9oP0rDJ+il0Iu2PBJ+OLDbI6xOhVix3AGSG267HOOuK7XIjtbaK3iLd1Airs+psDYDzzkD613hmmUOoQrHqI0aCFjJ5Lk+v2b1GME5kDBWB5Sa9tQ3GfXmds9apQ0y58Cf+iWTGoLojEy94kcjMwJYBtQ2O53HXp8KX3Vxatcy8PgcF7dRrCoT3fl4uWfSmslpLHbz90yQ3DqdBQExq36raT15VSOzXDp7WG8fiEbpcsXJDMehAyeh8Wo5/nUzkpPg0wYVtynJ8lq7KJi9Vf40f2b7itNrOux8ay3qsuNKTDOD1HOtFqsXRnIKKKK1JCiiigCJxSMy2boBnNI4AltJ5MCRheeKsN2cQnFJJDMX2bKEAY28t+lQ4amPXpPFxcJICDqZSNJUYwelQnuQu2mU4HM6RUto5jGxZgcDfZd9vdS6SKbO74B39ldvp6UtgW9H4RZpoBI8gjZXYYLEEn7+XOlfELhGiJiY6yMA4OcelNbokREu2ogjJPXcUgaQSKS0oyd+nx3Ao2f6PfXwc/wCHMS2xMYB3lySfM5P41o1Z/wBjN7gFSD+f3wc+VaBVRVWgctXIUUUVQgooooA43f6E++q/3CmZpHLNnGV7sYO3x+tWOZA8bKSR7qhiygI1MgJOMkgUr0smUXLoWyxa1EgfHhwBoH470r4pGSFJZ/D+5ED9+asrWUH7g29BUW54XbS51gknrtT3ETtsp965aF0HhHkYyOvvpPkhx4/jk/jV7ueA2si4Mkw9xH8qWydlLFm3nuvmX/zT1INDPfZNCtwjMR4n22x0q7Ug4JwmC2nDRvKe63UMwI8vKn9SueS0qVBRRRTGf//Z', inStock: true, tags: ['Bestseller'], rating: 4.8, reviews: 2800 },

  // ── Bakery & Biscuits (5 new) ──
  { id: 'bakery-006', name: 'Britannia Good Day Cashew Cookies', brand: 'Britannia', category: 'bakery-biscuits', price: 30, mrp: 35, discount: 14, unit: '100 g', deliveryTime: '11 MINS', image: 'data:image/jpeg;base64,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', inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 3900 },
  { id: 'bakery-007', name: "Oreo Original Cookies", brand: 'Oreo', category: 'bakery-biscuits', price: 35, mrp: 40, discount: 12, unit: '120 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRW5fpb3tEA2lsn1ZMvEvnrCsoyJV20gWwTEtSfpbxfGA&s', inStock: true, tags: ['Bestseller'], rating: 4.7, reviews: 5200 },
  { id: 'bakery-008', name: 'Monginis Butterscotch Pastry', brand: 'Monginis', category: 'bakery-biscuits', price: 60, mrp: 75, discount: 20, unit: '1 pc', deliveryTime: '11 MINS', image: 'data:image/jpeg;base64,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', inStock: true, rating: 4.3, reviews: 880 },
  { id: 'bakery-005', name: 'Britannia Multigrain Bread', brand: 'Britannia', category: 'bakery-biscuits', price: 48, mrp: 58, discount: 17, unit: '400 g (16 slices)', deliveryTime: '11 MINS', image: 'data:image/jpeg;base64,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', inStock: true, tags: ['Bestseller'], rating: 4.4, reviews: 1780 },

  // ── Sweet Tooth (4 new) ──
  { id: 'sweet-005', name: 'Dairy Milk Silk Chocolate', brand: 'Cadbury', category: 'sweet-tooth', price: 99, mrp: 130, discount: 24, unit: '60 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQXwVVo5ne-iXxOnPS_BFR65MaFrpzqFd1COZ83VhDIYnkgRIeqIgU1aadViZzbjlWkvDmMbtT1t3O5iUAXMrTdFE2cnto0bc0jto7CFtwOlluWpJ4dsOHv1Vs', inStock: true, tags: ['Bestseller'], rating: 4.8, reviews: 6400 },
  { id: 'sweet-006', name: 'KitKat Chocolate Bar', brand: 'Nestle', category: 'sweet-tooth', price: 35, mrp: 40, discount: 12, unit: '36.5 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnT4NNiKSUy_QD6mV1BqUICkoTWTn5j1jDeAfbmChrHo98KPscp6Akal5WG29PJ88GbPBmgwTmGdrZgX-WOv0JwdTKrd--JbGNfkGTmw&s=10', inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 4200 },
  { id: 'sweet-007', name: 'Milkmaid Condensed Milk', brand: 'Nestle', category: 'sweet-tooth', price: 75, mrp: 90, discount: 17, unit: '400 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?w=300', inStock: true, rating: 4.6, reviews: 1400 },
  { id: 'sweet-004', name: 'Munch Chocolate Bar', brand: 'Nestle', category: 'sweet-tooth', price: 10, mrp: 10, discount: 0, unit: '12.7 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcT2D1_sVUtUeo9GRguu9iNadGn5mpjsU6QiYG9iX28Cw3ZmDiBy5DArjSIYVljxXAKn1RricEn-VD3FbzkwACLOax0W_OaZv9cw_QGaD-xOLGER-3j3LLSCDQ', inStock: true, tags: ['Bestseller'], rating: 4.3, reviews: 3800 },

  // ── Atta, Rice & Dal (5 new) ──
  { id: 'atta-011', name: 'Fortune Basmati Rice - Premium', brand: 'Fortune', category: 'atta-rice-dal', price: 145, mrp: 180, discount: 19, unit: '1 kg', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQFiaJ6u7ozQNTDPxkQe2FDSe2d04XKsVyHnmDfQfoOlKGRHkZvOVbfl5XbEdvZYsRnJ9D3pCO6sZxvvshlrBVIEJpC6J4N5Ct9Y7o06pivBytr_NXFqKU8FQ', inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 2800 },
  { id: 'atta-012', name: 'Aashirvaad Multigrain Atta', brand: 'Aashirvaad', category: 'atta-rice-dal', price: 220, mrp: 280, discount: 21, unit: '5 kg', deliveryTime: '11 MINS', image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSaFmHBbkbC97qALzUNhrHulRd5ceNXCOM3ozF3bD1tOT0ihc4TFRmKN_k-g1zNzVcqBUH9OH8tutXdfftQ2K3PZIrhhKGUUw', inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 3600 },
  { id: 'atta-013', name: 'Tata Sampann Masoor Dal', brand: 'Tata Sampann', category: 'atta-rice-dal', price: 85, mrp: 105, discount: 19, unit: '500 g', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?w=300', inStock: true, rating: 4.4, reviews: 960 },
  { id: 'atta-014', name: 'Chana Dal - Tata Sampann', brand: 'Tata Sampann', category: 'atta-rice-dal', price: 95, mrp: 120, discount: 21, unit: '500 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCCJkOxmcTl7Jwfg0YZ5BYm90Z6BEnRbsKQCo3Q5yqPA&s=10', inStock: true, rating: 4.3, reviews: 720 },
  { id: 'atta-015', name: 'Dawat Biryani Basmati Rice', brand: 'Dawat', category: 'atta-rice-dal', price: 190, mrp: 240, discount: 21, unit: '1 kg', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTN4l56WY3zdzmOlJVRoR-Wy89FUipYfm0JOLrs6hHD3dJKXeGMgpIL9pUCDkS3dExQitoLL7r486xtvvIpu_0feCIOzbMvIA', inStock: true, tags: ['Bestseller'], rating: 4.7, reviews: 4100 },
  {
  id: 'atta-016',
  name: 'Fortune Chakki Fresh Atta',
  brand: 'Fortune',
  category: 'atta-rice-dal',
  price: 275,
  mrp: 320,
  discount: 14,
  unit: '5 kg',
  deliveryTime: '11 MINS',
  image: '\images\swadisht\restaurants\Fortune Chakki Fresh Atta.jfif',
  inStock: true,
  tags: ['Bestseller'],
  rating: 4.6,
  reviews: 3850
},
{
  id: 'atta-017',
  name: 'India Gate Classic Basmati Rice',
  brand: 'India Gate',
  category: 'atta-rice-dal',
  price: 215,
  mrp: 260,
  discount: 17,
  unit: '1 kg',
  deliveryTime: '11 MINS',
  image: '\images\swadisht\restaurants\India Gate Classic Basmati Rice.jfif',
  inStock: true,
  rating: 4.7,
  reviews: 2980
},
{
  id: 'atta-018',
  name: 'Moong Dal Premium',
  brand: '24 Mantra',
  category: 'atta-rice-dal',
  price: 145,
  mrp: 170,
  discount: 15,
  unit: '1 kg',
  deliveryTime: '11 MINS',
  image: '\images\swadisht\restaurants\Moong Dal Premium.jfif',
  inStock: true,
  rating: 4.5,
  reviews: 1640
},
{
  id: 'atta-019',
  name: 'Fortune Basmati Rice',
  brand: 'Fortune',
  category: 'atta-rice-dal',
  price: 399,
  mrp: 460,
  discount: 13,
  unit: '5 kg',
  deliveryTime: '11 MINS',
  image: '\images\swadisht\restaurants\Fortune Basmati Rice.jfif',
  inStock: true,
  tags: ['Bestseller'],
  rating: 4.8,
  reviews: 4520
},

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
  { id: 'clean-005', name: "Surf Excel Quick Wash Detergent", brand: 'Surf Excel', category: 'cleaning', price: 95, mrp: 120, discount: 21, unit: '500 g', deliveryTime: '11 MINS', image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQaqnViaxrQv7D89O-tesaGHwFXeTREuFZo6FdaE8w07euh54OeYk3y3k_H8baaXjE_Rxc9z4bBLZzkXROHvEqClLRlUgWEDUWr2xOne9mlizZ5BG2S0jP8Aw', inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 4100 },
  { id: 'clean-006', name: "Vim Dishwash Liquid - Lemon", brand: 'Vim', category: 'cleaning', price: 60, mrp: 75, discount: 20, unit: '500 ml', deliveryTime: '11 MINS', image: 'https://images.pexels.com/photos/4239098/pexels-photo-4239098.jpeg?w=300', inStock: true, tags: ['Bestseller'], rating: 4.5, reviews: 3200 },
  { id: 'clean-003', name: "Harpic Power Plus Toilet Cleaner", brand: 'Harpic', category: 'cleaning', price: 80, mrp: 100, discount: 20, unit: '500 ml', deliveryTime: '11 MINS', image: 'data:image/webp;base64,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', inStock: true, rating: 4.4, reviews: 2400 },
  { id: 'clean-004', name: "Dettol Original Handwash", brand: 'Dettol', category: 'cleaning', price: 75, mrp: 95, discount: 21, unit: '250 ml', deliveryTime: '11 MINS', image: 'https://m.media-amazon.com/images/I/51-+1fKrKFL.jpg', inStock: true, tags: ['Bestseller'], rating: 4.6, reviews: 3900 },

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
