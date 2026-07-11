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
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80',
    itemsCount: 6,
    price: 249,
    ingredients: [
      { id: 'dish-paneer', name: 'Milky Mist Paneer', unit: '200 g', price: 82, mrp: 130, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=120&auto=format&fit=crop&q=80' },
      { id: 'dish-marinade', name: 'Everest Tikhalal Powder Pouch', unit: '100 g', price: 52, mrp: 60, image: 'https://m.media-amazon.com/images/I/71UnlVpvTgL._SL1500_.jpg' },
      { id: 'dish-yogurt', name: 'Milky Mist Greek Yogurt', unit: '100 g', price: 35, mrp: 55, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=120&auto=format&fit=crop&q=80' },
      { id: 'dish-ggpaste', name: 'Catch Ginger Garlic Paste', unit: '100 g', price: 17, mrp: 28, image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=120&auto=format&fit=crop&q=80' },
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
      { id: 'dish-paneer', name: 'Milky Mist Paneer', unit: '200 g', price: 82, mrp: 130, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=120&auto=format&fit=crop&q=80' },
      { id: 'atta-002', name: 'India Gate Basmati Rice', unit: '5 kg', price: 525, mrp: 575, image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=120/app/images/products/sliding_image/483632a.jpg' },
      { id: 'dish-ggpaste', name: 'Catch Ginger Garlic Paste', unit: '100 g', price: 17, mrp: 28, image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=120&auto=format&fit=crop&q=80' },
      { id: 'masala-003', name: 'Everest Garam Masala', unit: '100 g', price: 85, mrp: 95, image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=120/app/images/products/sliding_image/483640a.jpg' },
      { id: 'veg-002', name: 'Onion', unit: '1 kg', price: 35, mrp: 40, image: 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    ]
  },
  butter: {
    name: 'Paneer Butter Masala',
    image: 'https://images.unsplash.com/photo-1708782341807-ed35fc16b4ea?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    itemsCount: 5,
    price: 237,
    ingredients: [
      { id: 'dish-paneer', name: 'Milky Mist Paneer', unit: '200 g', price: 82, mrp: 130, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=120&auto=format&fit=crop&q=80' },
      { id: 'dairy-004', name: 'Amul Butter - Salted', unit: '100 g', price: 58, mrp: 60, image: 'https://images.unsplash.com/photo-1594233301022-8867d9d032d8?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 'dairy-006', name: 'Amul Fresh Cream', unit: '250 ml', price: 52, mrp: 55, image: 'https://www.bbassets.com/media/uploads/p/l/40102603_3-amul-fresh-cream-25-milk-fat-low-fat.jpg' },
      { id: 'veg-001', name: 'Tomato - Hybrid', unit: '500 g', price: 28, mrp: 35, image: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      { id: 'dish-ggpaste', name: 'Catch Ginger Garlic Paste', unit: '100 g', price: 17, mrp: 28, image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=120&auto=format&fit=crop&q=80' },
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
