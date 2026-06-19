export const STATES = [
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    nativeName: 'राजस्थान',
    tagline: 'The Royal Desert Legacy',
    kicker: 'THE FIRE OF THE RAJPUTS',
    color: '#3d1607',
    textColor: '#ffedd5',
    region: 'West India',
    specialties: ['Dal Baati Churma', 'Laal Maas', 'Gatte ki Sabzi', 'Ker Sangri', 'Ghevar'],
    chefNote: 'Royal Rajput kitchen traditions from Jaipur & Jodhpur',
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=1600',
    story: 'Born from a harsh landscape, Rajasthani food is built for royalty. It reflects the ingenuity of cooking with minimal water and maximum soul.',
    traditionalCookingTitle: 'A Tapestry of Traditions',
    traditionalCookingStory: "Rajasthan's cultural identity is a vibrant mosaic formed over centuries by royal patronage and desert resilience. The state's folk arts—from the mesmerizing Ghoomar dance to the intricate leatherwork of Bikaner—are not mere performances but living dialogues between the past and present. Our curation focuses on a 'Heritage Modernist' approach, where traditional block printing meets contemporary silhouettes, and age-old storytelling finds its voice.",
    traditionalImages: [
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
     "https://commons.wikimedia.org/wiki/Special:FilePath/Glimpse%20of%20Indian%20Folk%20Dance%20%28Kalbelia%20Dance%29.jpg"
    ],
    culinaryAlchemistTitle: 'The Culinary Alchemist',
    culinaryAlchemistStory: 'In a land where water is a luxury, the cuisine evolved as a masterful study in preservation and spice. Historically, the warriors of Rajasthan required food that could last for days on expeditions. This birthed masterpieces like Ker Sangri—wild berries and beans dried to perfection—and Ghevar, a honeycomb-textured sweet that marks the monsoon.',
    specialDishImage: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=800',
    dishes: [
      {
        id: 'r1',
        name: 'Artisan Ghevar',
        price: 650,
        calories: 380,
        rating: 4.9,
        isVeg: true,
        image: "/images/swadisht/regional/gehvar.jpg",
        desc: 'A traditional Rajasthani honeycomb sweet prepared with pure desi ghee and topped with rich silver foil, almonds, and saffron-infused rabri.',
        badge: 'BESTSELLER'
      },
      {
        id: 'r2',
        name: 'Dry Ker Sangri',
        price: 420,
        calories: 220,
        rating: 4.8,
        isVeg: true,
        image: "/images/swadisht/regional/ker-sangri.jpg",
        desc: 'The soul of the desert. Hand-picked wild desert berries and beans, sun-dried to preserve their unique tang and stir-fried with traditional spices.',
        badge: 'AUTHENTIC'
      },
      {
        id: 'r3',
        name: 'Jodhpur Kachori',
        price: 280,
        calories: 340,
        rating: 4.7,
        isVeg: true,
        image: "/images/swadisht/regional/jodhpur-kachori.jpg",
        desc: 'A crisp, flaky pastry stuffed with a spicy onion filling and a secret blend of twelve aromatic Jodhpuri spices. Served with spicy mint chutney.',
        badge: 'FRESH BATCH'
      }
    ]
  },
  {
    id: 'kerala',
    name: 'Kerala',
    nativeName: 'കേരളം',
    tagline: "God's Own Kitchen",
    kicker: 'THE SPICE COAST HERITAGE',
    color: '#082516',
    textColor: '#e8f5e9',
    region: 'South India',
    specialties: ['Appam & Stew', 'Fish Curry', 'Puttu & Kadala', 'Payasam', 'Sadya'],
    chefNote: 'Prepared by home chefs from Kochi & Thrissur',
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=1600',
    story: 'Kerala cuisine is defined by its abundant use of coconut, curry leaves, and fresh seafood. Every dish tells the story of a coastal land blessed with spices.',
    traditionalCookingTitle: 'Monsoon, Spices, and Heritage',
    traditionalCookingStory: "Between the Arabian sea and the Western Ghats lies a strip of land enriched by ancient maritime trade routes. Kerala's cultural canvas is home to centuries-old performing art forms like Kathakali.",
    traditionalImages: [
      "/images/swadisht/regional/kathakali.jpg",
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=600'
    ],
    culinaryAlchemistTitle: 'The Spice Symphony',
    culinaryAlchemistStory: 'With black gold (pepper) that changed the history of the world, Kerala cooking is a beautiful playground of cardamoms, cinnamon, and freshly grated coconut.',
    specialDishImage: '/images/swadisht/regional/malabar-parotta.jpg',
    dishes: [
      {
        id: 'k1',
        name: 'Grand Onam Sadya',
        price: 599,
        calories: 1440,
        rating: 4.9,
        isVeg: true,
        image: '/images/swadisht/regional/onam-sadya.jpg',
        desc: 'A magnificent feast served on a fresh banana leaf, including Avial, Thoran, Kalan, and traditional sweet Payasam.',
        badge: 'ROYAL FEAST'
      }
    ]
  },
  {
    id: 'punjab',
    name: 'Punjab',
    nativeName: 'ਪੰਜਾਬ',
    tagline: 'Land of Five Rivers',
    kicker: 'THE REBELS OF THE HARVEST',
    color: '#420b1e',
    textColor: '#fdf2f8',
    region: 'North India',
    specialties: ['Sarson da Saag', 'Makki di Roti', 'Chole Bhature'],
    chefNote: 'Authentic dhaba-style cooking from Amritsar families',
    heroImage: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&q=80&w=1600',
    story: 'Punjabi food is bold, hearty, and generous. From the smoky tandoor to the creamy dal makhani, every bite is a celebration.',
    traditionalCookingTitle: 'Golden Fields & Robust Spirits',
    traditionalCookingStory: "Punjab is a land of vibrant harvests, high-octane bhangra rhythms, and sacred hospitality at community kitchens.",
    traditionalImages: [
      "/images/swadisht/regional/punjab-bhangra.jpg",
     "/images/swadisht/regional/punjabi-jutti.jpg"
    ],
    culinaryAlchemistTitle: 'The Tandoor and Churn',
    culinaryAlchemistStory: 'Punjabi gastronomy revolves around fresh milk, hand-churned white dairy butter, and tandoors.',
    specialDishImage: "/images/swadisht/regional/punjab-tandoor.jpg",
    dishes: [
      {
        id: 'p1',
        name: 'Sarson da Saag & Roti',
        price: 220,
        calories: 340,
        rating: 4.8,
        isVeg: true,
        image: "/images/swadisht/regional/sarson-saag.jpg",
        desc: 'Slow-cooked farm-fresh mustard greens paired with yellow cornmeal Makki di Roti.',
        badge: 'HARVEST LEGACY'
      }
    ]
  },
  {
    id: 'bengal',
    name: 'West Bengal',
    nativeName: 'পশ্চিমবঙ্গ',
    tagline: 'Sweet & Subtle Flavors',
    kicker: 'THE NOBILITY OF THE GANGES',
    color: '#072a44',
    textColor: '#e0f2fe',
    region: 'East India',
    specialties: ['Machher Jhol', 'Mishti Doi', 'Rosogolla'],
    chefNote: 'Traditional Bengali home cooks from Kolkata',
    heroImage: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&q=80&w=1600',
    story: 'Bengali cuisine is a delicate balance of sweet and savory. Fish is the soul of the kitchen.',
    traditionalCookingTitle: 'Gages, Art, and Renaissance',
    traditionalCookingStory: "West Bengal represents a glorious history of art, Nobel laureates, and poetic classicism.",
    traditionalImages: [
      '/images/swadisht/regional/durga-puja.jpg',
      '/images/swadisht/regional/baul-musician.jpg'
    ],
    culinaryAlchemistTitle: 'The Symphony of Five Spices',
    culinaryAlchemistStory: 'Bengali kitchens use Panch Phoron—a custom blend of five aromatic spices toasted in mustard oil.',
    specialDishImage: '/images/swadisht/regional/bengal-rickshaw-art.jpg',
    dishes: [
      {
        id: 'b3',
        name: 'Authentic Mishti Doi',
        price: 120,
        calories: 160,
        rating: 4.9,
        isVeg: true,
        image: "/images/swadisht/regional/mishti-doi.jpg",
        desc: 'Thick, creamy, naturally caramelized sweet curd fermented slowly in traditional terracotta pots.',
        badge: 'POT-BAKED'
      }
    ]
  },
  {
    id: 'tamilnadu',
    name: 'Tamil Nadu',
    nativeName: 'தமிழ்நாடு',
    tagline: 'The Coromandel Spice Trail',
    kicker: 'ANCIENT DRAVIDIAN WISDOM',
    color: '#32160d',
    textColor: '#ffedd5',
    region: 'South India',
    specialties: ['Chettinad Chicken', 'Idli & Sambar', 'Filter Coffee'],
    chefNote: 'Brahmin & Chettinad home cooks from Chennai & Karaikudi',
    heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=1600',
    story: 'From mild, sattvic temple foods to complex, aromatic Chettinad spices, Tamil cuisine is exquisite.',
    traditionalCookingTitle: 'Temples, Silk, and Carnatic Chords',
    traditionalCookingStory: "Tamil Nadu holds a continuous ancient civilization that dates back thousands of years.",
    traditionalImages: [
      '/images/swadisht/regional/bharatanatyam.jpg',
      '/images/swadisht/regional/brihadeeswara-temple.jpg'
    ],
    culinaryAlchemistTitle: 'Decoctions and Grinding Stones',
    culinaryAlchemistStory: 'Tamil culinary alchemy balancing hot, bitter, sour, and sweet is centered on heavy stone pestles.',
    specialDishImage: '/images/swadisht/regional/kolam-art.jpg',
    dishes: [
      {
        id: 't1',
        name: 'Chettinad Pepper Chicken',
        price: 360,
        calories: 520,
        rating: 4.9,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=600',
        desc: 'A fiery masala preparation of chicken cooked with 16 dry-roasted spices.',
        badge: 'CHETTINAD CLASSIC'
      }
    ]
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    nativeName: 'महाराष्ट्र',
    tagline: 'Vibrant West Coast Heritage',
    kicker: 'LION OF THE WESTERN GHATS',
    color: '#0a233c',
    textColor: '#e0f2fe',
    region: 'West India',
    specialties: ['Vada Pav', 'Misal Pav', 'Ukdiche Modak'],
    chefNote: 'Authentic household recipes from Pune and coastal Alibaug',
    heroImage: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&q=80&w=1600',
    story: 'From the blazing chillies of Kolhapur to the coconut-laden seafood of Malvan.',
    traditionalCookingTitle: 'Maratha Forts & Coastal Rhythms',
    traditionalCookingStory: "Maharashtra fuses the Sahyadri mountain fortresses with the cosmopolitan energy of Mumbai.",
    traditionalImages: [
      '/images/swadisht/regional/warli-art.jpg',
      '/images/swadisht/regional/ganesh-chaturthi.jpg'
    ],
    culinaryAlchemistTitle: 'Goda Masala & Coastal Malvan',
    culinaryAlchemistStory: 'The secret of Maharashtrian cooking lies in Goda Masala—a unique spice blend containing dagad phool.',
    specialDishImage: '/images/swadisht/regional/kolhapuri-chappal.jpg',
    dishes: [
      {
        id: 'm2',
        name: 'Steamed Ukdiche Modak',
        price: 190,
        calories: 240,
        rating: 4.9,
        isVeg: true,
        image: "/images/swadisht/regional/ukdiche-modak.jpg",
        desc: 'Delicate sweet dumplings with hand-pleated rice flour shells, stuffed with fresh coconut and jaggery.',
        badge: 'HOLY BLISS'
      }
    ]
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    nativeName: 'ગુજરાત',
    tagline: 'The Salt Desert Harmony',
    kicker: 'HARVESTS OF THE SALTY WIND',
    color: '#0d221c',
    textColor: '#e6fffa',
    region: 'West India',
    specialties: ['Khaman Dhokla', 'Khandvi', 'Undhiyu'],
    chefNote: 'Handmade delicacy recipes from households across Ahmedabad',
   heroImage: "https://commons.wikimedia.org/wiki/Special:FilePath/Statue%20of%20Unity.jpg",
    story: 'Renowned for its predominantly sweet-accented vegetarian cuisine, a sweet-sour play.',
    traditionalCookingTitle: 'White Desert Plains & Royal Havelis',
    traditionalCookingStory: "The Great Rann of Kutch represents a vast field of pure white salt that glows under full moons.",
    traditionalImages: [
  "/images/swadisht/regional/garba-dance.jpg",
  "/images/swadisht/regional/patola-weaving.jpg"
],
    culinaryAlchemistTitle: 'Jaggery, Lemon, and Asafoetida',
    culinaryAlchemistStory: 'Gujarati home cooking utilizes subtle additions of sweet jaggery and lemon to balance heavier flours.',
    specialDishImage: '/images/swadisht/regional/kutchi-embroidery.jpg',
    dishes: [
      {
        id: 'g1',
        name: 'Nylon Khaman Dhokla',
        price: 140,
        calories: 195,
        rating: 4.8,
        isVeg: true,
        image: '/images/swadisht/regional/nylon-khaman-dhokla.jpg',
        desc: 'Light, spongy sweet-sour steamed cakes prepared from pure fermented chickpea batter.',
        badge: 'STEAMED FRESH'
      }
    ]
  },
  {
    id: 'odisha',
    name: 'Odisha',
    nativeName: 'ଓଡ଼ିଶା',
    tagline: 'The Sacred Sun Wheel',
    kicker: 'CRAFTED BY THE SHADOWS OF JAGANNATH',
    color: '#281324',
    textColor: '#fae8ff',
    region: 'East India',
    specialties: ['Chhena Poda', 'Dalma', 'Kanika'],
    chefNote: 'Panda chefs trained in Puri temple systems',
    heroImage: "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1200&q=80",
    story: 'From the wood-burning brick fires, Odia temple cuisine is ancient.',
    traditionalCookingTitle: 'Stone Chariots & Sacred Scrolls',
    traditionalCookingStory: "Odisha boasts architectural marvels, such as the grand Konark Sun Temple.",
    traditionalImages: [
      '/images/swadisht/regional/pipili-applique.jpg',
      '/images/swadisht/regional/odissi-dance.jpg'
    ],
    culinaryAlchemistTitle: 'The Wood Fire Baking',
    culinaryAlchemistStory: 'Odia cooking achieves its smoky sweetness by cooking slowly inside layered clay pots.',
    specialDishImage: '/images/swadisht/regional/pattachitra-art.jpg',
    dishes: [
      {
        id: 'o1',
        name: 'Royal Chhena Poda',
        price: 260,
        calories: 310,
        rating: 4.9,
        isVeg: true,
        image: '/images/swadisht/regional/chhena-poda.jpg',
        desc: 'The original Indian cheese cake. Fresh cottage cheese roasted in sal leaf-lined vessels.',
        badge: 'CELESTIAL SWEET'
      }
    ]
  },
  {
    id: 'goa',
    name: 'Goa',
    nativeName: 'गोवा',
    tagline: 'Coastal Sunset Melodies',
    kicker: 'THE INDO-PORTUGUESE CONFLUENCE',
    color: '#08253a',
    textColor: '#e0f2fe',
    region: 'West India',
    specialties: ['Fish Curry Rice', 'Pork Vindaloo', 'Bebinca'],
    chefNote: 'Authentic beach shack and heritage villa recipes',
    heroImage: "https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg?auto=compress&cs=tinysrgb&w=1200",
    story: 'Goan cuisine is a vibrant, tropical collision of Konkani flavors with Portuguese techniques.',
    traditionalCookingTitle: 'Palm Trees, Shacks, and Azulejos',
    traditionalCookingStory: "Goa is a coastal paradise featuring historic Portuguese-built churches and sandy strands.",
    traditionalImages: [
      'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=600'
    ],
    culinaryAlchemistTitle: 'Vinegar, Toddy, and Coconut Coals',
    culinaryAlchemistStory: 'Goan culinary experts use coconut-palm wine vinegar and freshly tapped toddy.',
    specialDishImage: '/images/swadisht/regional/goan-vinegar.jpg',
    dishes: [
      {
        id: 'go1',
        name: 'Layered Bebinca Cake',
        price: 240,
        calories: 320,
        rating: 4.9,
        isVeg: true,
        image: '/images/swadisht/regional/bebinca-cake.jpg',
        desc: 'Luxurious layered pudding cake made with rich coconut milk and egg yolks.',
        badge: 'SHACK LEGEND'
      }
    ]
  },
  {
    id: 'assam',
    name: 'Assam',
    nativeName: 'অসম',
    tagline: 'The Brahmaputra Trails',
    kicker: 'THE FRAGRANCE OF MUTED LEAVES',
    color: '#071f16',
    textColor: '#e2f0e9',
    region: 'Northeast',
    specialties: ['Masor Tenga', 'Khar', 'Jolpan'],
    chefNote: 'Assamese tribal home cooks from Guwahati & tea hills',
    heroImage: "https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg?auto=compress&cs=tinysrgb&w=1200",
    story: 'Oozing simplicity and natural flavors: fermentation, fresh herbs, river fish, and zero heavy oil.',
    traditionalCookingTitle: 'Orchid Valleys & Golden Silks',
    traditionalCookingStory: "Assam lines the Brahmaputra, harboring sub-tropical forests, rhinos, and tea hills.",
    traditionalImages: [
      '/images/swadisht/regional/bihu-dance.jpg',
      '/images/swadisht/regional/mekhela-chador-weaving.jpg'
    ],
    culinaryAlchemistTitle: 'Khar Filtrates & Bamboo Shoots',
    culinaryAlchemistStory: 'The base of Assamese meals is Khar—a bitter, digestive filtrate from burnt banana stems.',
    specialDishImage: '/images/swadisht/regional/assam-tea-garden.jpg',
    dishes: [
      {
        id: 'a1',
        name: 'River Masor Tenga',
        price: 290,
        calories: 260,
        rating: 4.8,
        isVeg: false,
        image: '/images/swadisht/regional/masor-tenga.jpg',
        desc: 'Refreshing, tangy river fish cooked in locally sourced elephant apple/lemon broths.',
        badge: 'TANGY & LIGHT'
      }
    ]
  }
];