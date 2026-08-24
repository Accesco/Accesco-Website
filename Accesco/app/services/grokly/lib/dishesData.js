/**
 * Dish (recipe) data for Grokly's "cook a dish" feature.
 *
 * These ingredients are added to the same cart as regular products, but their
 * IDs (e.g. 'dish-paneer', 'atta-002') are NOT part of the main products list in
 * groklyData. The cart/checkout/drawer therefore need `dishIngredients` to
 * resolve these items — otherwise they silently disappear at checkout.
 */

export const dishes = {
  tikka: {
    name: 'Paneer Tikka Masala',
    image: 'https://www.aline-made.com/wp-content/uploads/2023/05/Paneer-Tikka-Masala-5.jpg',
    itemsCount: 6,
    price: 249,
    ingredients: [
      { id: 'dish-paneer', name: 'Milky Mist Paneer', unit: '200 g', price: 82, mrp: 130, image: 'https://static.wixstatic.com/media/60b717_d4c273fa6e4a4e9f8dab4fbad8674bb8~mv2.png/v1/fill/w_743,h_741,al_c,q_90,enc_avif,quality_auto/60b717_d4c273fa6e4a4e9f8dab4fbad8674bb8~mv2.png' },
      { id: 'dish-marinade', name: 'Everest Tikhalal Powder Pouch', unit: '100 g', price: 52, mrp: 60, image: 'https://m.media-amazon.com/images/I/71UnlVpvTgL._SL1500_.jpg' },
      { id: 'dish-yogurt', name: 'Milky Mist Greek Yogurt', unit: '100 g', price: 35, mrp: 55, image: 'https://m.media-amazon.com/images/I/613AStmWOKL._SX569_.jpg' },
      { id: 'dish-ggpaste', name: 'Catch Ginger Garlic Paste', unit: '100 g', price: 17, mrp: 28, image: 'https://m.media-amazon.com/images/I/81B-Ah3Y09L._SL1500_.jpg' },
      { id: 'veg-001', name: 'Tomato - Hybrid', unit: '500 g', price: 28, mrp: 35, image: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 'veg-002', name: 'Onion', unit: '1 kg', price: 35, mrp: 40, image: 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    ]
  },
  biryani: {
    name: 'Paneer Biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    itemsCount: 5,
    price: 744,
    ingredients: [
      { id: 'dish-paneer', name: 'Milky Mist Paneer', unit: '200 g', price: 82, mrp: 130, image: 'https://static.wixstatic.com/media/60b717_d4c273fa6e4a4e9f8dab4fbad8674bb8~mv2.png/v1/fill/w_743,h_741,al_c,q_90,enc_avif,quality_auto/60b717_d4c273fa6e4a4e9f8dab4fbad8674bb8~mv2.png' },
      { id: 'atta-002', name: 'India Gate Basmati Rice', unit: '5 kg', price: 525, mrp: 575, image: 'https://images.pexels.com/photos/7851798/pexels-photo-7851798.jpeg' },
      { id: 'dish-ggpaste', name: 'Catch Ginger Garlic Paste', unit: '100 g', price: 17, mrp: 28, image: 'https://m.media-amazon.com/images/I/81B-Ah3Y09L._SL1500_.jpg' },
      { id: 'masala-003', name: 'Everest Garam Masala', unit: '100 g', price: 85, mrp: 95, image: 'https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg' },
      { id: 'veg-002', name: 'Onion', unit: '1 kg', price: 35, mrp: 40, image: 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    ]
  },
  butter_paneer: {
    name: 'Paneer Butter Masala',
    image: 'https://images.unsplash.com/photo-1708782341807-ed35fc16b4ea?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    itemsCount: 5,
    price: 237,
    ingredients: [
      { id: 'dish-paneer', name: 'Milky Mist Paneer', unit: '200 g', price: 82, mrp: 130, image: 'https://static.wixstatic.com/media/60b717_d4c273fa6e4a4e9f8dab4fbad8674bb8~mv2.png/v1/fill/w_743,h_741,al_c,q_90,enc_avif,quality_auto/60b717_d4c273fa6e4a4e9f8dab4fbad8674bb8~mv2.png' },
      { id: 'dairy-004', name: 'Amul Butter - Salted', unit: '100 g', price: 58, mrp: 60, image: 'https://tse2.mm.bing.net/th/id/OIP.bXXKSrXYWCaM-rpWciwp0QHaFm?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
      { id: 'dairy-006', name: 'Amul Fresh Cream', unit: '250 ml', price: 52, mrp: 55, image: 'https://www.bbassets.com/media/uploads/p/l/40102603_3-amul-fresh-cream-25-milk-fat-low-fat.jpg' },
      { id: 'veg-001', name: 'Tomato - Hybrid', unit: '500 g', price: 28, mrp: 35, image: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 'dish-ggpaste', name: 'Catch Ginger Garlic Paste', unit: '100 g', price: 17, mrp: 28, image: 'https://m.media-amazon.com/images/I/81B-Ah3Y09L._SL1500_.jpg' },
    ]
  },
  chicken_biryani: {
    name: 'Chicken Biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    itemsCount: 6,
    price: 844,
    ingredients: [
      { id: 'dish-chicken', name: 'Fresh Chicken Curry Cut', unit: '500 g', price: 180, mrp: 200, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=120&auto=format&fit=crop&q=80' },
      { id: 'atta-002', name: 'India Gate Basmati Rice', unit: '5 kg', price: 525, mrp: 575, image: 'https://images.pexels.com/photos/7851798/pexels-photo-7851798.jpeg' },
      { id: 'dish-ggpaste', name: 'Catch Ginger Garlic Paste', unit: '100 g', price: 17, mrp: 28, image: 'https://m.media-amazon.com/images/I/81B-Ah3Y09L._SL1500_.jpg' },
      { id: 'masala-003', name: 'Everest Garam Masala', unit: '100 g', price: 85, mrp: 95, image: 'https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg' },
      { id: 'veg-002', name: 'Onion', unit: '1 kg', price: 35, mrp: 40, image: 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 'dish-marinade', name: 'Everest Tikhalal Powder Pouch', unit: '100 g', price: 52, mrp: 60, image: 'https://m.media-amazon.com/images/I/71UnlVpvTgL._SL1500_.jpg' }
    ]
  },
  butter_chicken: {
    name: 'Butter Chicken',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80',
    itemsCount: 5,
    price: 335,
    ingredients: [
      { id: 'dish-chicken', name: 'Fresh Chicken Curry Cut', unit: '500 g', price: 180, mrp: 200, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=120&auto=format&fit=crop&q=80' },
      { id: 'dairy-004', name: 'Amul Butter - Salted', unit: '100 g', price: 58, mrp: 60, image: 'https://tse2.mm.bing.net/th/id/OIP.bXXKSrXYWCaM-rpWciwp0QHaFm?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
      { id: 'dairy-006', name: 'Amul Fresh Cream', unit: '250 ml', price: 52, mrp: 55, image: 'https://www.bbassets.com/media/uploads/p/l/40102603_3-amul-fresh-cream-25-milk-fat-low-fat.jpg' },
      { id: 'veg-001', name: 'Tomato - Hybrid', unit: '500 g', price: 28, mrp: 35, image: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 'dish-ggpaste', name: 'Catch Ginger Garlic Paste', unit: '100 g', price: 17, mrp: 28, image: 'https://m.media-amazon.com/images/I/81B-Ah3Y09L._SL1500_.jpg' },
    ]
  },
  chicken_curry: {
    name: 'Chicken Curry',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80',
    itemsCount: 5,
    price: 260,
    ingredients: [
      { id: 'dish-chicken', name: 'Fresh Chicken Curry Cut', unit: '500 g', price: 180, mrp: 200, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=120&auto=format&fit=crop&q=80' },
      { id: 'veg-002', name: 'Onion', unit: '1 kg', price: 35, mrp: 40, image: 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 'veg-001', name: 'Tomato - Hybrid', unit: '500 g', price: 28, mrp: 35, image: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 'masala-003', name: 'Everest Garam Masala', unit: '100 g', price: 85, mrp: 95, image: 'https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg' },
      { id: 'dish-ggpaste', name: 'Catch Ginger Garlic Paste', unit: '100 g', price: 17, mrp: 28, image: 'https://m.media-amazon.com/images/I/81B-Ah3Y09L._SL1500_.jpg' },
    ]
  },
  veg_pulav: {
    name: 'Veg Pulav',
    image: 'https://tse1.mm.bing.net/th/id/OIP.6xVYFrI3n4mlqTIfzPrT4AHaFx?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    itemsCount: 5,
    price: 645,
    ingredients: [
      { id: 'atta-002', name: 'India Gate Basmati Rice', unit: '5 kg', price: 525, mrp: 575, image: 'https://images.pexels.com/photos/7851798/pexels-photo-7851798.jpeg' },
      { id: 'veg-carrot', name: 'Carrot - Ooty', unit: '500 g', price: 40, mrp: 50, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=120&auto=format&fit=crop&q=80' },
      { id: 'veg-beans', name: 'French Beans', unit: '250 g', price: 25, mrp: 30, image: 'https://tse2.mm.bing.net/th/id/OIP.CdR-7_jnuwg9vYwad39ARwHaEd?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
      { id: 'veg-002', name: 'Onion', unit: '1 kg', price: 35, mrp: 40, image: 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 'dish-ggpaste', name: 'Catch Ginger Garlic Paste', unit: '100 g', price: 17, mrp: 28, image: 'https://m.media-amazon.com/images/I/81B-Ah3Y09L._SL1500_.jpg' },
    ]
  },
  veg_fried_rice: {
    name: 'Veg Fried Rice',
    image: 'https://i2.wp.com/vegecravings.com/wp-content/uploads/2016/03/veg-fried-rice-step-by-step-recipe.jpg?w=2418&quality=65&strip=all&ssl=1',
    itemsCount: 5,
    price: 660,
    ingredients: [
      { id: 'atta-002', name: 'India Gate Basmati Rice', unit: '5 kg', price: 525, mrp: 575, image: 'https://images.pexels.com/photos/7851798/pexels-photo-7851798.jpeg' },
      { id: 'veg-carrot', name: 'Carrot - Ooty', unit: '500 g', price: 40, mrp: 50, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=120&auto=format&fit=crop&q=80' },
      { id: 'veg-beans', name: 'French Beans', unit: '250 g', price: 25, mrp: 30, image: 'https://tse2.mm.bing.net/th/id/OIP.CdR-7_jnuwg9vYwad39ARwHaEd?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
      { id: 'dish-soy', name: 'Chings Dark Soy Sauce', unit: '210 g', price: 55, mrp: 60, image: 'https://th.bing.com/th/id/R.821962830694e9b117ff21679d9138ab?rik=j%2bHzabP%2f0LAvpw&riu=http%3a%2f%2fsimplywholefoods.co.nz%2fcdn%2fshop%2ffiles%2fdarksoysauce_b923f28b-341d-41fc-951f-234b2e6cfc63_1200x1200.webp%3fv%3d1747886811&ehk=%2fL%2bnAyMmCcMHhfq1EbdaQeb1QEyi4bYAhLwOSZdRlqI%3d&risl=&pid=ImgRaw&r=0' },
      { id: 'veg-spring-onion', name: 'Spring Onion', unit: '1 bunch', price: 15, mrp: 20, image: 'https://tse3.mm.bing.net/th/id/OIP.WZimWKpya88mAWcr8r4F4wHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
    ]
  },
  dal_tadka: {
    name: 'Dal Tadka',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
    itemsCount: 4,
    price: 240,
    ingredients: [
      { id: 'dish-dal', name: 'Tata Sampann Toor Dal', unit: '1 kg', price: 160, mrp: 180, image: 'https://tse4.mm.bing.net/th/id/OIP.Q70zoaWhzVpKHDDOwTuM4AHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
      { id: 'veg-001', name: 'Tomato - Hybrid', unit: '500 g', price: 28, mrp: 35, image: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 'dish-ggpaste', name: 'Catch Ginger Garlic Paste', unit: '100 g', price: 17, mrp: 28, image: 'https://m.media-amazon.com/images/I/81B-Ah3Y09L._SL1500_.jpg' },
      { id: 'veg-002', name: 'Onion', unit: '1 kg', price: 35, mrp: 40, image: 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    ]
  },
  chole_masala: {
    name: 'Chole Masala',
    image: 'https://pickyeaterblog.com/wp-content/uploads/2023/03/punjabi-chole-recipe.jpg',
    itemsCount: 4,
    price: 200,
    ingredients: [
      { id: 'dish-chole', name: 'Kabuli Chana', unit: '500 g', price: 80, mrp: 100, image: 'https://5.imimg.com/data5/SELLER/Default/2023/5/310319036/HK/BE/HS/5358436/30kg-mahadev-kabuli-chana-1000x1000.jpeg' },
      { id: 'masala-chole', name: 'Everest Chole Masala', unit: '100 g', price: 65, mrp: 75, image: 'https://tse4.mm.bing.net/th/id/OIP.phALFcqNL3Vlz-uerzOtxwHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
      { id: 'veg-002', name: 'Onion', unit: '1 kg', price: 35, mrp: 40, image: 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 'veg-001', name: 'Tomato - Hybrid', unit: '500 g', price: 28, mrp: 35, image: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    ]
  },
  aloo_gobi: {
    name: 'Aloo Gobi',
    image: 'https://www.emilyrecipes.net/wp-content/uploads/2025/12/eqf2rvye2aov8rslxy8s.webp',
    itemsCount: 4,
    price: 132,
    ingredients: [
      { id: 'veg-aloo', name: 'Potato', unit: '1 kg', price: 40, mrp: 50, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=120&auto=format&fit=crop&q=80' },
      { id: 'veg-gobi', name: 'Cauliflower', unit: '1 pc', price: 40, mrp: 50, image: 'https://cdn.pixabay.com/photo/2024/06/20/09/51/cauliflower-8841682_1280.jpg' },
      { id: 'veg-002', name: 'Onion', unit: '1 kg', price: 35, mrp: 40, image: 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 'dish-ggpaste', name: 'Catch Ginger Garlic Paste', unit: '100 g', price: 17, mrp: 28, image: 'https://m.media-amazon.com/images/I/81B-Ah3Y09L._SL1500_.jpg' },
    ]
  },
  palak_paneer: {
    name: 'Palak Paneer',
    image: 'https://wallpapercave.com/wp/wp12054311.jpg',
    itemsCount: 5,
    price: 184,
    ingredients: [
      { id: 'dish-paneer', name: 'Milky Mist Paneer', unit: '200 g', price: 82, mrp: 130, image: 'https://static.wixstatic.com/media/60b717_d4c273fa6e4a4e9f8dab4fbad8674bb8~mv2.png/v1/fill/w_743,h_741,al_c,q_90,enc_avif,quality_auto/60b717_d4c273fa6e4a4e9f8dab4fbad8674bb8~mv2.png' },
      { id: 'veg-palak', name: 'Spinach (Palak)', unit: '250 g', price: 20, mrp: 25, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=120&auto=format&fit=crop&q=80' },
      { id: 'veg-002', name: 'Onion', unit: '1 kg', price: 35, mrp: 40, image: 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 'dish-ggpaste', name: 'Catch Ginger Garlic Paste', unit: '100 g', price: 17, mrp: 28, image: 'https://m.media-amazon.com/images/I/81B-Ah3Y09L._SL1500_.jpg' },
      { id: 'dairy-006', name: 'Amul Fresh Cream', unit: '250 ml', price: 52, mrp: 55, image: 'https://www.bbassets.com/media/uploads/p/l/40102603_3-amul-fresh-cream-25-milk-fat-low-fat.jpg' },
    ]
  },
  fish_curry: {
    name: 'Fish Curry',
    image: 'https://amazingfoodanddrink.com/wp-content/uploads/2025/03/Best-Fish-Curry-Recipe-with-Coconut-or-Spicy-Variations-5.jpg',
    itemsCount: 5,
    price: 380,
    ingredients: [
      { id: 'dish-fish', name: 'Fresh Rohu Fish', unit: '500 g', price: 220, mrp: 250, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=120&auto=format&fit=crop&q=80' },
      { id: 'veg-002', name: 'Onion', unit: '1 kg', price: 35, mrp: 40, image: 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 'veg-001', name: 'Tomato - Hybrid', unit: '500 g', price: 28, mrp: 35, image: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 'dish-ggpaste', name: 'Catch Ginger Garlic Paste', unit: '100 g', price: 17, mrp: 28, image: 'https://m.media-amazon.com/images/I/81B-Ah3Y09L._SL1500_.jpg' },
      { id: 'dish-tamarind', name: 'Tamarind (Imli)', unit: '200 g', price: 80, mrp: 90, image: 'https://healthyindianrecipes.com/wp-content/uploads/2025/05/tamarind-chutney-dish-110925.jpg' },
    ]
  }
};

// Flat, de-duplicated list of every dish ingredient — used to resolve cart items
// whose IDs aren't in the main products list.
export const dishIngredients = Object.values(dishes)
  .flatMap((dish) => dish.ingredients)
  .reduce((acc, item) => {
    if (!acc.some((p) => p.id === item.id)) acc.push(item);
    return acc;
  }, []);
