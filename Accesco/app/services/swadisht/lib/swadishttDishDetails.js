/**
 * Swadishtt — dish detail enrichment
 * lib/swadishttDishDetails.js   (NEW FILE — sits next to swadishttData.js)
 * ----------------------------------------------------------------------------
 * Adds the optional fields the dish details modal needs:
 *   calories, protein, carbs, fats, serves, servingSize, origin, preparation,
 *   authenticity, ingredients[], allergens[], isVegan, isGlutenFree, spiceLevel
 *
 * ── HOW TO WIRE IT UP (2 lines changed in swadishttData.js) ──────────────────
 *
 * 1. At the TOP of swadishttData.js, next to the other imports (if there are
 *    none, put it on line 1, above `export const RESTAURANTS`):
 *
 *      import { applyDishDetails } from './swadishttDishDetails';
 *
 * 2. Find this existing block near the BOTTOM of swadishttData.js:
 *
 *      RESTAURANTS.forEach((restaurant) => {
 *        restaurant.menu = restaurant.menu.map((dish) => ({
 *          ...dish,
 *          ...(NUTRITION_BY_DISH_ID[dish.id] || {}),
 *        }));
 *      });
 *
 *    ...and replace those 6 lines with this 1 line:
 *
 *      applyDishDetails(RESTAURANTS, NUTRITION_BY_DISH_ID);
 *
 * Nothing else in swadishttData.js changes. RESTAURANTS, MENU_ITEMS,
 * CATEGORIES and every exported helper stay exactly as they are.
 *
 * PRECEDENCE (lowest → highest):
 *   derived defaults → NUTRITION_BY_DISH_ID → DISH_DETAILS_BY_ID → the dish's
 *   own hand-written fields. Anything typed directly on a dish object wins.
 */

/* ---- 1. Per-category baseline -------------------------------------
 * Indicative values for one standard portion. Override individual dishes
 * in DISH_DETAILS_BY_ID below as the kitchen confirms real numbers.
 */
const CATEGORY_PROFILES = {
  'Main Course':  { calories: 420, protein: 18, carbs: 34, fats: 22, serves: '1–2 people', servingSize: '~300 g' },
  'Starters':     { calories: 320, protein: 16, carbs: 20, fats: 18, serves: '1–2 people', servingSize: '6–8 pieces' },
  'Biryani':      { calories: 680, protein: 26, carbs: 78, fats: 28, serves: '1–2 people', servingSize: '~450 g' },
  'Rice':         { calories: 560, protein: 14, carbs: 82, fats: 18, serves: '1–2 people', servingSize: '~400 g' },
  'Breads':       { calories: 240, protein: 7,  carbs: 38, fats: 8,  serves: '1 person',   servingSize: '1 piece' },
  'Desserts':     { calories: 340, protein: 6,  carbs: 46, fats: 15, serves: '1 person',   servingSize: '~150 g' },
  'Beverages':    { calories: 160, protein: 4,  carbs: 24, fats: 5,  serves: '1 person',   servingSize: '250 ml' },
  'Soups':        { calories: 140, protein: 6,  carbs: 14, fats: 6,  serves: '1 person',   servingSize: '250 ml' },
  'Sides':        { calories: 180, protein: 5,  carbs: 22, fats: 8,  serves: '1 person',   servingSize: '~150 g' },
  'South Indian': { calories: 330, protein: 9,  carbs: 48, fats: 12, serves: '1 person',   servingSize: '1 plate' },
  'Breakfast':    { calories: 300, protein: 9,  carbs: 46, fats: 9,  serves: '1 person',   servingSize: '1 plate' },
  'Chinese':      { calories: 450, protein: 16, carbs: 52, fats: 18, serves: '1–2 people', servingSize: '~350 g' },
  'Japanese':     { calories: 430, protein: 20, carbs: 46, fats: 16, serves: '1 person',   servingSize: '1 bowl' },
  'Thai':         { calories: 400, protein: 15, carbs: 44, fats: 17, serves: '1–2 people', servingSize: '~350 g' },
  'Italian':      { calories: 520, protein: 18, carbs: 58, fats: 24, serves: '1–2 people', servingSize: '~320 g' },
  'Pizza':        { calories: 700, protein: 26, carbs: 72, fats: 32, serves: '2 people',   servingSize: '9-inch · 6 slices' },
  'Burgers':      { calories: 560, protein: 24, carbs: 48, fats: 30, serves: '1 person',   servingSize: '1 burger' },
  'Rolls':        { calories: 380, protein: 16, carbs: 42, fats: 16, serves: '1 person',   servingSize: '1 roll' },
  'Street Food':  { calories: 300, protein: 8,  carbs: 42, fats: 12, serves: '1 person',   servingSize: '1 plate' },
  'Chaat':        { calories: 220, protein: 5,  carbs: 32, fats: 9,  serves: '1 person',   servingSize: '1 plate' },
  'Thali':        { calories: 780, protein: 22, carbs: 98, fats: 30, serves: '1–2 people', servingSize: 'Full platter' },
  'Meals':        { calories: 720, protein: 20, carbs: 92, fats: 28, serves: '1–2 people', servingSize: 'Full platter' },
  'Bakery':       { calories: 300, protein: 7,  carbs: 40, fats: 13, serves: '1 person',   servingSize: '1 piece' },
  default:        { calories: 350, protein: 12, carbs: 40, fats: 15, serves: '1–2 people', servingSize: '1 serving' },
};

/* ---- 2. Ingredient + allergen keyword rules ----------------------- */
const KEYWORD_RULES = [
  { keys: ['paneer', 'chhena', 'cottage cheese'], ingredients: ['Fresh paneer', 'Tomato', 'Onion', 'Cream'] },
  { keys: ['butter chicken', 'murg', 'chicken'], ingredients: ['Chicken', 'Ginger-garlic paste', 'Onion', 'Whole spices'] },
  { keys: ['mutton', 'lamb', 'seekh', 'galouti', 'kakori', 'gosht'], ingredients: ['Mutton', 'Ginger-garlic paste', 'Onion', 'Whole spices'] },
  { keys: ['pork', 'bacon', 'pancetta', 'chashu'], ingredients: ['Pork', 'Vinegar', 'Kashmiri chilli', 'Garlic'] },
  { keys: ['prawn', 'chemeen', 'shrimp'], ingredients: ['Prawns', 'Coconut', 'Curry leaves', 'Turmeric'] },
  { keys: ['crab', 'clam', 'squid'], ingredients: ['Shellfish', 'Pepper', 'Coconut', 'Curry leaves'] },
  { keys: ['fish', 'karimeen', 'meen', 'pomfret', 'anchovy'], ingredients: ['Fish fillet', 'Tamarind', 'Coconut', 'Chilli'] },
  { keys: ['egg', 'anda', 'omelet', 'carbonara'], ingredients: ['Egg', 'Onion', 'Green chilli'] },
  { keys: ['soya', 'chaap', 'tofu'], ingredients: ['Soya', 'Cream', 'Spice marinade'] },
  { keys: ['dal', 'lentil', 'moong', 'chana', 'chole', 'chickpea', 'rajma', 'sambar'], ingredients: ['Lentils / pulses', 'Tomato', 'Onion', 'Cumin'] },
  { keys: ['mushroom'], ingredients: ['Button mushrooms', 'Onion', 'Black pepper'] },
  { keys: ['aloo', 'potato', 'vada', 'fries'], ingredients: ['Potato', 'Green chilli', 'Turmeric', 'Mustard seeds'] },
  { keys: ['palak', 'spinach', 'saag', 'hara bhara'], ingredients: ['Spinach / greens', 'Garlic', 'Green chilli'] },
  { keys: ['gobi', 'cauliflower', 'bhindi', 'okra', 'veg', 'vegetable', 'sabzi'], ingredients: ['Seasonal vegetables', 'Onion', 'Tomato', 'Ginger'] },
  { keys: ['dosa', 'idli', 'uttapam', 'appam', 'pesarattu', 'neer', 'puttu', 'akki'], ingredients: ['Rice batter', 'Urad dal', 'Fenugreek'] },
  { keys: ['biryani', 'pulao', 'rice', 'bath', 'arisi'], ingredients: ['Basmati rice', 'Fried onion', 'Saffron', 'Whole spices'] },
];

const ALLERGEN_RULES = [
  { allergen: 'Dairy',     keys: ['paneer', 'butter', 'makhani', 'malai', 'cream', 'kulfi', 'rabri', 'kheer', 'payasam', 'lassi', 'milk', 'curd', 'dahi', 'raita', 'cheese', 'mozzarella', 'mascarpone', 'ghee', 'khoya', 'yogurt', 'chhena', 'cappuccino', 'latte', 'shake', 'ice cream', 'halwa', 'rasmalai', 'gulab jamun'] },
  { allergen: 'Gluten',    keys: ['naan', 'roti', 'paratha', 'parotta', 'kulcha', 'bhature', 'pav', 'bread', 'bun', 'puri', 'poori', 'samosa', 'spring roll', 'noodle', 'pasta', 'penne', 'spaghetti', 'ramen', 'focaccia', 'bruschetta', 'croissant', 'waffle', 'cake', 'muffin', 'sourdough', 'pastry', 'pizza', 'burger', 'roll', 'baati', 'tukda', 'meetha', 'dabeli', 'bao', 'wrap', 'tiramisu', 'cheesecake', 'malpua'] },
  { allergen: 'Tree nuts', keys: ['cashew', 'kaju', 'badam', 'almond', 'pista', 'pistachio', 'walnut', 'korma', 'shahi', 'kofta', 'peshwari'] },
  { allergen: 'Peanuts',   keys: ['peanut', 'groundnut', 'pad thai', 'puliyogare'] },
  { allergen: 'Soy',       keys: ['soy', 'soya', 'manchurian', 'hakka', 'schezwan', 'kung pao', 'teriyaki', 'miso', 'chaap', 'chilli potato', 'chilli fish', 'dim sum', 'dimsum', 'gyoza'] },
  { allergen: 'Sesame',    keys: ['sesame', 'til', 'honey chilli', 'sushi'] },
  { allergen: 'Mustard',   keys: ['mustard', 'sarson', 'kasundi', 'bihari'] },
  { allergen: 'Egg',       keys: ['egg', 'anda', 'omelet', 'carbonara', 'mayo', 'bebinca', 'cake', 'waffle', 'croissant', 'tiramisu', 'ramen'] },
  { allergen: 'Fish',      keys: ['fish', 'karimeen', 'meen', 'anchovy', 'recheado'] },
  { allergen: 'Shellfish', keys: ['prawn', 'chemeen', 'shrimp', 'crab', 'clam', 'squid', 'balchao'] },
];

const NON_VEG_HINTS = ['chicken', 'murg', 'mutton', 'lamb', 'gosht', 'pork', 'bacon', 'fish', 'meen', 'prawn', 'crab', 'clam', 'squid', 'egg', 'anda', 'keema', 'seekh', 'kakori', 'galouti', 'pepperoni', 'chashu'];

const SPICE_RULES = [
  { level: 'Hot',  keys: ['fiery', 'vindaloo', 'chettinad', 'andhra', 'kolhapuri', 'peri peri', 'chilli', 'chilly', 'chicken 65', 'gongura', 'kara ', 'schezwan', 'kung pao', 'arrabbiata', 'misal', 'ghee roast', 'balchao', 'recheado', 'spicy'] },
  { level: 'Mild', keys: ['kheer', 'payasam', 'kulfi', 'lassi', 'coffee', 'tea', 'latte', 'milk', 'shake', 'halwa', 'jamun', 'rasmalai', 'malai', 'korma', 'shahi', 'appam', 'idli', 'waffle', 'cake', 'pastry', 'cheesecake', 'tiramisu', 'sharbat', 'sherbet', 'soda', 'cooler', 'panna', 'raita', 'kesari', 'panna cotta'] },
];

const MILD_CATEGORIES = ['Desserts', 'Beverages', 'Bakery', 'Breads', 'Soups'];

const PREPARATION_RULES = [
  { keys: ['tandoor', 'tikka', 'kebab', 'grill', 'seekh', 'roast'], text: 'Marinated and finished in a charcoal tandoor' },
  { keys: ['dum', 'biryani', 'handi', 'slow'], text: 'Slow-cooked on dum in a sealed handi' },
  { keys: ['wok', 'hakka', 'manchurian', 'schezwan', 'fried rice', 'noodle', 'stir'], text: 'Wok-tossed to order over high flame' },
  { keys: ['steam', 'idli', 'dim sum', 'dimsum', 'bao', 'puttu', 'sanna'], text: 'Freshly steamed to order' },
  { keys: ['fry', 'fried', 'crispy', 'pakoda', 'vada', 'bhature', 'puri'], text: 'Fried to order in fresh oil' },
  { keys: ['bake', 'baked', 'pizza', 'cake', 'croissant', 'sourdough', 'muffin', 'pastry'], text: 'Baked fresh in-house every morning' },
  { keys: ['dosa', 'uttapam', 'pesarattu', 'akki', 'neer'], text: 'Cooked on a cast-iron tawa from overnight-fermented batter' },
  { keys: ['lassi', 'coffee', 'tea', 'shake', 'juice', 'sharbat', 'sherbet', 'panna', 'soda'], text: 'Blended fresh on order' },
];

/* ---- 3. Hand-written detail for the flagship dishes ---------------- */
const DISH_DETAILS_BY_ID = {
  'dish-001': { serves: '1–2 people', servingSize: '~320 g', origin: 'Punjabi · North Indian', preparation: 'Tandoori chicken finished in a slow-simmered makhani gravy', ingredients: ['Tandoori chicken', 'Tomato purée', 'Butter', 'Fresh cream', 'Kasuri methi', 'Garam masala'], allergens: ['Dairy'], spiceLevel: 'Medium', isGlutenFree: true, isVegan: false },
  'dish-002': { serves: '1–2 people', servingSize: '~300 g', origin: 'Punjabi · North Indian', preparation: 'Charcoal-grilled paneer folded into a simmered onion-tomato masala', ingredients: ['Paneer', 'Capsicum', 'Onion', 'Tomato', 'Cashew paste', 'Cream'], allergens: ['Dairy', 'Tree nuts'], spiceLevel: 'Medium', isGlutenFree: true, isVegan: false },
  'dish-003': { serves: '2 people', servingSize: '~350 g', origin: 'Punjabi · North Indian', preparation: 'Simmered overnight on low heat', ingredients: ['Black urad dal', 'Rajma', 'Butter', 'Cream', 'Tomato', 'Ginger'], allergens: ['Dairy'], spiceLevel: 'Mild', isGlutenFree: true, isVegan: false },
  'dish-004': { serves: '2 people', servingSize: 'Half bird · 4 pieces', origin: 'Punjabi · Tandoor', preparation: 'Overnight yogurt marination, charcoal tandoor', ingredients: ['Chicken on the bone', 'Hung curd', 'Kashmiri chilli', 'Lemon', 'Tandoori masala'], allergens: ['Dairy'], spiceLevel: 'Medium', isGlutenFree: true, isVegan: false },
  'dish-005': { serves: '1 person', servingSize: '1 piece', origin: 'Punjabi · Tandoor', preparation: 'Hand-stretched and slapped into the tandoor', ingredients: ['Refined flour', 'Yogurt', 'Garlic', 'Butter', 'Coriander'], allergens: ['Gluten', 'Dairy'], spiceLevel: 'Mild', isGlutenFree: false, isVegan: false },
  'dish-006': { serves: '1–2 people', servingSize: '~450 g', origin: 'Hyderabadi · Mughlai', preparation: 'Layered and sealed for dum', ingredients: ['Basmati rice', 'Chicken', 'Fried onion', 'Saffron', 'Mint', 'Whole spices'], allergens: ['Dairy'], spiceLevel: 'Hot', isGlutenFree: true, isVegan: false },
  'dish-101': { serves: '1 person', servingSize: '1 large dosa', origin: 'Karnataka · South Indian', preparation: 'Cast-iron tawa, overnight-fermented batter', ingredients: ['Rice batter', 'Urad dal', 'Potato masala', 'Curry leaves', 'Mustard seeds'], allergens: [], spiceLevel: 'Mild', isGlutenFree: true, isVegan: true },
  'dish-102': { serves: '1 person', servingSize: '3 idlis', origin: 'Tamil Nadu · South Indian', preparation: 'Steamed in idli plates', ingredients: ['Rice batter', 'Urad dal', 'Toor dal sambar', 'Coconut chutney'], allergens: [], spiceLevel: 'Mild', isGlutenFree: true, isVegan: true },
  'dish-201': { serves: '1–2 people', servingSize: '~450 g', origin: 'Hyderabadi', preparation: 'Kachchi dum — raw marinated chicken layered under the rice', ingredients: ['Basmati rice', 'Chicken', 'Hung curd', 'Fried onion', 'Saffron', 'Mint'], allergens: ['Dairy'], spiceLevel: 'Hot', isGlutenFree: true, isVegan: false },
  'dish-202': { serves: '1–2 people', servingSize: '~480 g', origin: 'Hyderabadi', preparation: 'Slow dum over charcoal', ingredients: ['Basmati rice', 'Mutton', 'Hung curd', 'Fried onion', 'Whole spices'], allergens: ['Dairy'], spiceLevel: 'Hot', isGlutenFree: true, isVegan: false },
  'dish-203': { serves: '1–2 people', servingSize: '~420 g', origin: 'Hyderabadi', preparation: 'Vegetables layered with rice and sealed for dum', ingredients: ['Basmati rice', 'Seasonal vegetables', 'Fried onion', 'Saffron', 'Mint'], allergens: ['Dairy'], spiceLevel: 'Medium', isGlutenFree: true, isVegan: false },
  'dish-204': { serves: '1–2 people', servingSize: '~220 g', origin: 'Chennai · South Indian', preparation: 'Double-fried, then tossed with curry leaves', ingredients: ['Boneless chicken', 'Curry leaves', 'Green chilli', 'Garlic', 'Rice flour'], allergens: [], spiceLevel: 'Hot', isGlutenFree: true, isVegan: false },
  'dish-205': { serves: '2 people', servingSize: '150 ml', origin: 'North Indian', preparation: 'Whisked fresh and chilled', ingredients: ['Curd', 'Cucumber', 'Onion', 'Roasted cumin'], allergens: ['Dairy'], spiceLevel: 'Mild', isGlutenFree: true, isVegan: false },
  'dish-301': { serves: '1 person', servingSize: '1 large dosa', origin: 'Karnataka · South Indian', preparation: 'Cast-iron tawa, overnight-fermented batter', ingredients: ['Rice batter', 'Urad dal', 'Potato masala', 'Curry leaves'], allergens: [], spiceLevel: 'Mild', isGlutenFree: true, isVegan: true },
  'dish-302': { serves: '1 person', servingSize: '1 large dosa', origin: 'Karnataka · South Indian', preparation: 'Roasted thin on the tawa with pure ghee', ingredients: ['Rice batter', 'Urad dal', 'Ghee'], allergens: ['Dairy'], spiceLevel: 'Mild', isGlutenFree: true, isVegan: false },
  'dish-303': { serves: '1 person', servingSize: '150 ml', origin: 'Karnataka · South Indian', preparation: 'Brewed in a steel filter, served in a dabara set', ingredients: ['Arabica-chicory decoction', 'Milk', 'Sugar'], allergens: ['Dairy'], spiceLevel: 'Mild', isGlutenFree: true, isVegan: false },
  'dish-401': { serves: '2 people', servingSize: '9-inch · 6 slices', origin: 'Neapolitan · Italian', preparation: 'Stone-baked on a 24-hour cold-fermented base', ingredients: ['Pizza dough', 'San Marzano tomato', 'Mozzarella', 'Basil', 'Olive oil'], allergens: ['Gluten', 'Dairy'], spiceLevel: 'Mild', isGlutenFree: false, isVegan: false },
  'dish-402': { serves: '2 people', servingSize: '9-inch · 6 slices', origin: 'American · Italian', preparation: 'Stone-baked', ingredients: ['Pizza dough', 'Pepperoni', 'Mozzarella', 'Tomato sauce', 'Oregano'], allergens: ['Gluten', 'Dairy'], spiceLevel: 'Medium', isGlutenFree: false, isVegan: false },
  'dish-403': { serves: '2 people', servingSize: '9-inch · 6 slices', origin: 'Italian', preparation: 'Stone-baked', ingredients: ['Pizza dough', 'Onion', 'Capsicum', 'Mushroom', 'Tomato', 'Mozzarella'], allergens: ['Gluten', 'Dairy'], spiceLevel: 'Mild', isGlutenFree: false, isVegan: false },
  'dish-405': { serves: '1 person', servingSize: '1 cake · 110 g', origin: 'Continental', preparation: 'Baked to order so the centre stays molten', ingredients: ['Dark chocolate', 'Refined flour', 'Egg', 'Butter', 'Sugar'], allergens: ['Gluten', 'Dairy', 'Egg'], spiceLevel: 'Mild', isGlutenFree: false, isVegan: false },
  'dish-501': { serves: '2 people', servingSize: '1 slice · 130 g', origin: 'Continental', preparation: 'Layered and chilled overnight', ingredients: ['Cocoa sponge', 'Chocolate ganache', 'Fresh cream', 'Butter'], allergens: ['Gluten', 'Dairy', 'Egg'], spiceLevel: 'Mild', isGlutenFree: false, isVegan: false },
  'dish-601': { serves: '1 person', servingSize: '1 burger + fries', origin: 'American', preparation: 'Flame-grilled patty, toasted brioche bun', ingredients: ['Chicken patty', 'Brioche bun', 'Lettuce', 'Cheddar', 'House sauce'], allergens: ['Gluten', 'Dairy', 'Egg'], spiceLevel: 'Mild', isGlutenFree: false, isVegan: false },
  'dish-602': { serves: '1 person', servingSize: '1 burger', origin: 'American', preparation: 'Griddled veg patty, toasted bun', ingredients: ['Vegetable patty', 'Burger bun', 'Cheddar', 'Lettuce', 'Mayo'], allergens: ['Gluten', 'Dairy', 'Egg'], spiceLevel: 'Mild', isGlutenFree: false, isVegan: false },
  'dish-701': { serves: '1 person', servingSize: '1 piece', origin: 'Punjabi · Tandoor', preparation: 'Hand-stretched and slapped into the tandoor', ingredients: ['Refined flour', 'Yogurt', 'Butter'], allergens: ['Gluten', 'Dairy'], spiceLevel: 'Mild', isGlutenFree: false, isVegan: false },
  'dish-702': { serves: '1–2 people', servingSize: '6 pieces', origin: 'Punjabi · Tandoor', preparation: 'Overnight yogurt marination, charcoal tandoor', ingredients: ['Boneless chicken', 'Hung curd', 'Ginger-garlic', 'Tandoori masala'], allergens: ['Dairy'], spiceLevel: 'Medium', isGlutenFree: true, isVegan: false },
  'dish-703': { serves: '1–2 people', servingSize: '~300 g', origin: 'Punjabi · North Indian', preparation: 'Simmered in a butter-tomato gravy', ingredients: ['Paneer', 'Tomato', 'Butter', 'Cashew paste', 'Cream'], allergens: ['Dairy', 'Tree nuts'], spiceLevel: 'Mild', isGlutenFree: true, isVegan: false },
  'dish-801': { serves: '1–2 people', servingSize: '~320 g', origin: 'Indo-Chinese', preparation: 'Wok-tossed over high flame', ingredients: ['Wheat noodles', 'Cabbage', 'Carrot', 'Capsicum', 'Soy sauce'], allergens: ['Gluten', 'Soy'], spiceLevel: 'Medium', isGlutenFree: false, isVegan: true },
  'dish-802': { serves: '1–2 people', servingSize: '~300 g', origin: 'Indo-Chinese', preparation: 'Battered, fried, then tossed in the wok', ingredients: ['Chicken', 'Garlic', 'Soy sauce', 'Capsicum', 'Spring onion'], allergens: ['Gluten', 'Soy'], spiceLevel: 'Hot', isGlutenFree: false, isVegan: false },
  'dish-901': { serves: '1 person', servingSize: '180 ml', origin: 'Italian · Cafe', preparation: 'Double shot pulled fresh, steamed milk foam', ingredients: ['Espresso', 'Milk'], allergens: ['Dairy'], spiceLevel: 'Mild', isGlutenFree: true, isVegan: false },
  'dish-1001': { serves: '1–2 people', servingSize: '~300 g', origin: 'Andhra', preparation: 'Slow-cooked with a freshly roasted spice paste', ingredients: ['Chicken', 'Guntur chilli', 'Curry leaves', 'Onion', 'Coconut'], allergens: [], spiceLevel: 'Hot', isGlutenFree: true, isVegan: false },
  'dish-1002': { serves: '1–2 people', servingSize: '~320 g', origin: 'Andhra', preparation: 'Slow-cooked with sorrel leaves', ingredients: ['Mutton', 'Gongura leaves', 'Guntur chilli', 'Onion'], allergens: [], spiceLevel: 'Hot', isGlutenFree: true, isVegan: false },
  'dish-1003': { isVeg: true, serves: '1 person', servingSize: 'Full thali', origin: 'Andhra', preparation: 'Assembled fresh at service', ingredients: ['Steamed rice', 'Sambar', 'Rasam', 'Vegetable curries', 'Curd', 'Papad'], allergens: ['Dairy'], spiceLevel: 'Hot', isGlutenFree: true, isVegan: false },
  'dish-1101': { serves: '1 person', servingSize: '2 pav + bhaji', origin: 'Mumbai · Street Food', preparation: 'Mashed on a flat tawa, pav toasted in butter', ingredients: ['Mixed vegetables', 'Pav bread', 'Butter', 'Pav bhaji masala', 'Onion'], allergens: ['Gluten', 'Dairy'], spiceLevel: 'Medium', isGlutenFree: false, isVegan: false },
  'dish-1102': { serves: '1 person', servingSize: '1 piece', origin: 'Mumbai · Street Food', preparation: 'Batata vada fried to order, pressed into pav', ingredients: ['Potato', 'Gram flour', 'Pav bread', 'Garlic chutney'], allergens: ['Gluten'], spiceLevel: 'Medium', isGlutenFree: false, isVegan: true },
  'dish-1201': { serves: '2 people', servingSize: '~300 g', origin: 'Punjab', preparation: 'Greens slow-cooked and hand-churned', ingredients: ['Mustard greens', 'Spinach', 'Maize flour', 'White butter', 'Ginger'], allergens: ['Dairy'], spiceLevel: 'Mild', isGlutenFree: true, isVegan: false },
  'dish-1301': { serves: '1–2 people', servingSize: '~300 g', origin: 'Kerala · Coastal', preparation: 'Simmered in a clay pot with coconut milk', ingredients: ['Fish', 'Coconut milk', 'Raw mango', 'Curry leaves', 'Kokum'], allergens: ['Fish'], spiceLevel: 'Hot', isGlutenFree: true, isVegan: false },
  'dish-1901': { serves: '1 person', servingSize: '1 bowl · 450 ml', origin: 'Japanese', preparation: 'Broth simmered for 12 hours', ingredients: ['Ramen noodles', 'Tonkotsu broth', 'Chashu pork', 'Soft-boiled egg', 'Nori'], allergens: ['Gluten', 'Egg', 'Soy'], spiceLevel: 'Mild', isGlutenFree: false, isVegan: false },
  'dish-1902': { serves: '1–2 people', servingSize: '~320 g', origin: 'Thai', preparation: 'Wok-tossed to order', ingredients: ['Rice noodles', 'Tamarind', 'Tofu', 'Bean sprouts', 'Crushed peanuts'], allergens: ['Peanuts', 'Soy'], spiceLevel: 'Medium', isGlutenFree: true, isVegan: true },
};

/* ---- 4. Derivation ------------------------------------------------ */
function pickText(dish) {
  return `${dish.name || ''} ${dish.description || ''} ${dish.category || ''}`.toLowerCase();
}

function deriveAllergens(text) {
  return ALLERGEN_RULES.filter((r) => r.keys.some((k) => text.includes(k))).map((r) => r.allergen);
}

function deriveIngredients(text, isVeg) {
  const found = [];
  KEYWORD_RULES.forEach((rule) => {
    if (!rule.keys.some((k) => text.includes(k))) return;
    rule.ingredients.forEach((i) => { if (!found.includes(i)) found.push(i); });
  });
  if (found.length < 3) {
    const pantry = isVeg
      ? ['Onion', 'Tomato', 'Ginger-garlic paste', 'Fresh coriander', 'House spice blend']
      : ['Onion', 'Ginger-garlic paste', 'Yogurt marinade', 'House spice blend'];
    pantry.forEach((i) => { if (found.length < 5 && !found.includes(i)) found.push(i); });
  }
  return found.slice(0, 6);
}

function deriveSpiceLevel(text, category) {
  const hit = SPICE_RULES.find((r) => r.keys.some((k) => text.includes(k)));
  if (hit) return hit.level;
  if (MILD_CATEGORIES.includes(category)) return 'Mild';
  return 'Medium';
}

function derivePreparation(text) {
  const hit = PREPARATION_RULES.find((r) => r.keys.some((k) => text.includes(k)));
  return hit ? hit.text : 'Cooked fresh to order in small batches';
}

function deriveOrigin(dish, restaurant) {
  const cuisines = Array.isArray(restaurant?.cuisines) ? restaurant.cuisines : [];
  if (dish.category === 'Biryani') return cuisines.includes('Hyderabadi') ? 'Hyderabadi' : (cuisines[0] || 'Indian');
  return cuisines.slice(0, 2).join(' · ') || 'Indian';
}

function deriveDishDetails(dish, restaurant) {
  const text = pickText(dish);
  const profile = CATEGORY_PROFILES[dish.category] || CATEGORY_PROFILES.default;
  const isVeg = typeof dish.isVeg === 'boolean' ? dish.isVeg : !NON_VEG_HINTS.some((k) => text.includes(k));
  const allergens = deriveAllergens(text);
  const origin = deriveOrigin(dish, restaurant);
  const preparation = derivePreparation(text);

  return {
    isVeg,
    calories: profile.calories,
    protein: profile.protein,
    carbs: profile.carbs,
    fats: profile.fats,
    serves: profile.serves,
    servingSize: profile.servingSize,
    origin,
    preparation,
    authenticity: `${origin} recipe. ${preparation}.`,
    ingredients: deriveIngredients(text, isVeg),
    allergens,
    isVegan: isVeg && !['Dairy', 'Egg', 'Fish', 'Shellfish'].some((a) => allergens.includes(a)),
    isGlutenFree: !allergens.includes('Gluten'),
    spiceLevel: deriveSpiceLevel(text, dish.category),
  };
}

/* ---- 5. Public API -------------------------------------------------
 * Mutates each restaurant's `menu` in place, exactly like the loop it
 * replaces. Safe to call more than once (it is idempotent).
 */
export function applyDishDetails(restaurants = [], nutritionById = {}) {
  restaurants.forEach((restaurant) => {
    if (!Array.isArray(restaurant?.menu)) return;
    restaurant.menu = restaurant.menu.map((dish) => ({
      ...deriveDishDetails(dish, restaurant),
      ...(nutritionById[dish.id] || {}),
      ...(DISH_DETAILS_BY_ID[dish.id] || {}),
      ...dish,
    }));
  });
  return restaurants;
}

/** Enrich a single dish without touching the RESTAURANTS array. */
export function withDishDetails(dish, restaurant) {
  return {
    ...deriveDishDetails(dish, restaurant),
    ...(DISH_DETAILS_BY_ID[dish.id] || {}),
    ...dish,
  };
}

export default applyDishDetails;