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
    traditionalCookingStory: "Rajasthan's cultural identity is a vibrant mosaic formed over centuries by royal patronage and desert resilience. The state's folk arts—from the mesmerizing Ghoomar dance to the intricate leatherwork of Bikaner—are not mere performances but living dialogues between the past and present.",
    traditionalImages: [
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80'
    ],
    culinaryAlchemistTitle: 'The Culinary Alchemist',
    culinaryAlchemistStory: 'In a land where water is a luxury, the cuisine evolved as a masterful study in preservation and spice. This birthed masterpieces like Ker Sangri and Ghevar, a honeycomb-textured sweet that marks the monsoon.',
    specialDishImage: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=800',
    dishes: [
      {
        id: 'r1',
        sku: 'SWD-RJD-GHVR-01',
        name: 'Artisan Ghevar',
        price: 650,
        calories: 380,
        rating: 4.9,
        isVeg: true,
        image: '/images/swadisht/regional/gehvar.jpg',
        desc: 'A traditional Rajasthani honeycomb sweet prepared with pure desi ghee and topped with rich silver foil, almonds, and saffron-infused rabri.',
        badge: 'BESTSELLER'
      },
      {
        id: 'r2',
        sku: 'SWD-RJD-KSNG-02',
        name: 'Dry Ker Sangri',
        price: 420,
        calories: 220,
        rating: 4.8,
        isVeg: true,
        image: '/images/swadisht/regional/ker-sangri.jpg',
        desc: 'The soul of the desert. Hand-picked wild desert berries and beans, sun-dried to preserve their unique tang and stir-fried with traditional spices.',
        badge: 'AUTHENTIC'
      },
      {
        id: 'r3',
        sku: 'SWD-RJD-JKCH-03',
        name: 'Jodhpur Kachori',
        price: 280,
        calories: 340,
        rating: 4.7,
        isVeg: true,
        image: '/images/swadisht/regional/jodhpur-kachori.jpg',
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
      '/images/swadisht/regional/kathakali.jpg',
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=600'
    ],
    culinaryAlchemistTitle: 'The Spice Symphony',
    culinaryAlchemistStory: 'With black gold (pepper) that changed the history of the world, Kerala cooking is a beautiful playground of cardamoms, cinnamon, and freshly grated coconut.',
    specialDishImage: '/images/swadisht/regional/malabar-parotta.jpg',
    dishes: [
      {
        id: 'k1',
        sku: 'SWD-KRL-ONSD-01',
        name: 'Grand Onam Sadya',
        price: 599,
        calories: 1440,
        rating: 4.9,
        isVeg: true,
        image: '/images/swadisht/regional/onam-sadya.jpg',
        desc: 'A magnificent feast served on a fresh banana leaf, including Avial, Thoran, Kalan, and traditional sweet Payasam.',
        badge: 'ROYAL FEAST'
      },
      {
        id: 'k2',
        sku: 'SWD-KRL-APMS-02',
        name: 'Appam with Vegetable Stew',
        price: 180,
        calories: 320,
        rating: 4.8,
        isVeg: true,
        image: '/images/swadisht/regional/appam-stew.jpg',
        desc: 'Lace-edged rice hoppers paired with a fragrant, coconut-milk based vegetable stew infused with whole spices.',
        badge: 'COASTAL CLASSIC'
      },
      {
        id: 'k3',
        sku: 'SWD-KRL-PTTU-03',
        name: 'Puttu & Kadala Curry',
        price: 140,
        calories: 380,
        rating: 4.7,
        isVeg: true,
        image: '/images/swadisht/regional/puttu.jpg',
        desc: 'Steamed cylindrical rice cakes layered with coconut, served with a hearty black chickpea curry cooked in Kerala masala.',
        badge: 'BREAKFAST STAPLE'
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
    traditionalCookingStory: 'Punjab is a land of vibrant harvests, high-octane bhangra rhythms, and sacred hospitality at community kitchens.',
    traditionalImages: [
      '/images/swadisht/regional/punjab-bhangra.jpg',
      '/images/swadisht/regional/punjabi-jutti.jpg'
    ],
    culinaryAlchemistTitle: 'The Tandoor and Churn',
    culinaryAlchemistStory: 'Punjabi gastronomy revolves around fresh milk, hand-churned white dairy butter, and tandoors.',
    specialDishImage: '/images/swadisht/regional/punjab-tandoor.jpg',
    dishes: [
      {
        id: 'p1',
        sku: 'SWD-PNJ-SRSG-01',
        name: 'Sarson da Saag & Roti',
        price: 220,
        calories: 340,
        rating: 4.8,
        isVeg: true,
        image: '/images/swadisht/regional/sarson-saag.jpg',
        desc: 'Slow-cooked farm-fresh mustard greens paired with yellow cornmeal Makki di Roti.',
        badge: 'HARVEST LEGACY'
      },
      {
        id: 'p2',
        sku: 'SWD-PNJ-CHBH-02',
        name: 'Amritsari Chole Bhature',
        price: 180,
        calories: 540,
        rating: 4.9,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&h=400&fit=crop&auto=format&q=60',
        desc: 'Spiced tangy chickpeas cooked overnight with whole spices, served with deep-fried fluffy bhature.',
        badge: 'DHABA SPECIAL'
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
    traditionalCookingTitle: 'Ganges, Art, and Renaissance',
    traditionalCookingStory: 'West Bengal represents a glorious history of art, Nobel laureates, and poetic classicism.',
    traditionalImages: [
      '/images/swadisht/regional/durga-puja.jpg',
      '/images/swadisht/regional/baul-musician.jpg'
    ],
    culinaryAlchemistTitle: 'The Symphony of Five Spices',
    culinaryAlchemistStory: 'Bengali kitchens use Panch Phoron—a custom blend of five aromatic spices toasted in mustard oil.',
    specialDishImage: '/images/swadisht/regional/bengal-rickshaw-art.jpg',
    dishes: [
      {
        id: 'b1',
        sku: 'SWD-BNG-MSHD-01',
        name: 'Authentic Mishti Doi',
        price: 120,
        calories: 160,
        rating: 4.9,
        isVeg: true,
        image: '/images/swadisht/regional/mishti-doi.jpg',
        desc: 'Thick, creamy, naturally caramelized sweet curd fermented slowly in traditional terracotta pots.',
        badge: 'POT-BAKED'
      },
      {
        id: 'b2',
        sku: 'SWD-BNG-MCJH-02',
        name: 'Machher Jhol',
        price: 280,
        calories: 310,
        rating: 4.8,
        isVeg: false,
        image: '/images/swadisht/regional/machher-jhol.jpg',
        desc: 'Light, aromatic fish curry prepared with rohu or hilsa in a mustard-turmeric broth—quintessentially Bengali.',
        badge: 'SOUL FOOD'
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
    traditionalCookingStory: 'Tamil Nadu holds a continuous ancient civilization that dates back thousands of years.',
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
        sku: 'SWD-TND-CHPK-01',
        name: 'Chettinad Pepper Chicken',
        price: 360,
        calories: 520,
        rating: 4.9,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=600',
        desc: 'A fiery masala preparation of chicken cooked with 16 dry-roasted spices.',
        badge: 'CHETTINAD CLASSIC'
      },
      {
        id: 't2',
        sku: 'SWD-TND-IDLM-02',
        name: 'Idli with Sambar',
        price: 90,
        calories: 230,
        rating: 4.7,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=600',
        desc: 'Pillowy steamed rice cakes served with tangy vegetable sambar and fresh coconut chutney.',
        badge: 'TEMPLE KITCHEN'
      },
      {
        id: 't3',
        sku: 'SWD-TND-FLCF-03',
        name: 'South Indian Filter Coffee',
        price: 60,
        calories: 80,
        rating: 4.9,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600',
        desc: 'Decoction-brewed strong coffee blended with boiled milk and frothed to perfection in a traditional dabarah.',
        badge: 'FILTER FRESH'
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
    traditionalCookingStory: 'Maharashtra fuses the Sahyadri mountain fortresses with the cosmopolitan energy of Mumbai.',
    traditionalImages: [
      '/images/swadisht/regional/warli-art.jpg',
      '/images/swadisht/regional/ganesh-chaturthi.jpg'
    ],
    culinaryAlchemistTitle: 'Goda Masala & Coastal Malvan',
    culinaryAlchemistStory: 'The secret of Maharashtrian cooking lies in Goda Masala—a unique spice blend containing dagad phool.',
    specialDishImage: '/images/swadisht/regional/kolhapuri-chappal.jpg',
    dishes: [
      {
        id: 'm1',
        sku: 'SWD-MHR-UKMD-01',
        name: 'Steamed Ukdiche Modak',
        price: 190,
        calories: 240,
        rating: 4.9,
        isVeg: true,
        image: '/images/swadisht/regional/ukdiche-modak.jpg',
        desc: 'Delicate sweet dumplings with hand-pleated rice flour shells, stuffed with fresh coconut and jaggery.',
        badge: 'HOLY BLISS'
      },
      {
        id: 'm2',
        sku: 'SWD-MHR-MSPV-02',
        name: 'Usal Misal Pav',
        price: 130,
        calories: 410,
        rating: 4.8,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=600',
        desc: 'Spicy sprouted moth bean curry in fiery kat gravy, topped with sev, onion, and coriander. Served with fresh pav.',
        badge: 'STREET ICON'
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
    heroImage: 'https://images.unsplash.com/photo-1573555698522-8c1b04426b51?auto=format&fit=crop&q=80&w=1600',
    story: 'Renowned for its predominantly sweet-accented vegetarian cuisine, a sweet-sour play.',
    traditionalCookingTitle: 'White Desert Plains & Royal Havelis',
    traditionalCookingStory: 'The Great Rann of Kutch represents a vast field of pure white salt that glows under full moons.',
    traditionalImages: [
      '/images/swadisht/regional/garba-dance.jpg',
      '/images/swadisht/regional/patola-weaving.jpg'
    ],
    culinaryAlchemistTitle: 'Jaggery, Lemon, and Asafoetida',
    culinaryAlchemistStory: 'Gujarati home cooking utilizes subtle additions of sweet jaggery and lemon to balance heavier flours.',
    specialDishImage: '/images/swadisht/regional/kutchi-embroidery.jpg',
    dishes: [
      {
        id: 'g1',
        sku: 'SWD-GJR-NKDK-01',
        name: 'Nylon Khaman Dhokla',
        price: 140,
        calories: 195,
        rating: 4.8,
        isVeg: true,
        image: '/images/swadisht/regional/nylon-khaman-dhokla.jpg',
        desc: 'Light, spongy sweet-sour steamed cakes prepared from pure fermented chickpea batter.',
        badge: 'STEAMED FRESH'
      },
      {
        id: 'g2',
        sku: 'SWD-GJR-UNDH-02',
        name: 'Winter Undhiyu',
        price: 320,
        calories: 450,
        rating: 4.9,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=600',
        desc: 'A slow-cooked Surat specialty: seasonal vegetables, muthia dumplings, and coconut cooked in an earthen matlu pot.',
        badge: 'SEASONAL HARVEST'
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
    heroImage: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1200&q=80',
    story: 'From the wood-burning brick fires, Odia temple cuisine is ancient.',
    traditionalCookingTitle: 'Stone Chariots & Sacred Scrolls',
    traditionalCookingStory: 'Odisha boasts architectural marvels, such as the grand Konark Sun Temple.',
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
        sku: 'SWD-ODS-CHPD-01',
        name: 'Royal Chhena Poda',
        price: 260,
        calories: 310,
        rating: 4.9,
        isVeg: true,
        image: '/images/swadisht/regional/chhena-poda.jpg',
        desc: 'The original Indian cheese cake. Fresh cottage cheese roasted in sal leaf-lined vessels.',
        badge: 'CELESTIAL SWEET'
      },
      {
        id: 'o2',
        sku: 'SWD-ODS-DALM-02',
        name: 'Dalma',
        price: 160,
        calories: 280,
        rating: 4.7,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600',
        desc: 'Lentils slow-cooked with raw papaya, raw banana, and yam, tempered in ghee with ginger and dried red chilli.',
        badge: 'TEMPLE PRASAD'
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
    heroImage: 'https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg?auto=compress&cs=tinysrgb&w=1200',
    story: 'Goan cuisine is a vibrant, tropical collision of Konkani flavors with Portuguese techniques.',
    traditionalCookingTitle: 'Palm Trees, Shacks, and Azulejos',
    traditionalCookingStory: 'Goa is a coastal paradise featuring historic Portuguese-built churches and sandy strands.',
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
        sku: 'SWD-GOA-BBCA-01',
        name: 'Layered Bebinca Cake',
        price: 240,
        calories: 320,
        rating: 4.9,
        isVeg: true,
        image: '/images/swadisht/regional/bebinca-cake.jpg',
        desc: 'Luxurious layered pudding cake made with rich coconut milk and egg yolks.',
        badge: 'SHACK LEGEND'
      },
      {
        id: 'go2',
        sku: 'SWD-GOA-FSHC-02',
        name: 'Goan Fish Curry with Rice',
        price: 340,
        calories: 490,
        rating: 4.8,
        isVeg: false,
        image: '/images/swadisht/regional/fish-curry.jpg',
        desc: 'King fish simmered in a vibrant red coconut-Kashmiri chilli gravy with raw mango and kokum.',
        badge: 'COASTAL ORIGINAL'
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
    heroImage: 'https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg?auto=compress&cs=tinysrgb&w=1200',
    story: 'Oozing simplicity and natural flavors: fermentation, fresh herbs, river fish, and zero heavy oil.',
    traditionalCookingTitle: 'Orchid Valleys & Golden Silks',
    traditionalCookingStory: 'Assam lines the Brahmaputra, harboring sub-tropical forests, rhinos, and tea hills.',
    traditionalImages: [
      '/images/swadisht/regional/bihu-dance.jpg',
      '/images/swadisht/regional/mekhela-chador-weaving.jpg'
    ],
    culinaryAlchemistTitle: 'Khar Filtrates & Bamboo Shoots',
    culinaryAlchemistStory: 'The base of Assamese meals is Khar—a bitter, digestive filtrate from burnt banana stems.',
    specialDishImage: '/images/swadisht/regional/assam-tea-garden.jpg',
    dishes: [
      {
        id: 'as1',
        sku: 'SWD-ASM-MSTR-01',
        name: 'River Masor Tenga',
        price: 290,
        calories: 260,
        rating: 4.8,
        isVeg: false,
        image: '/images/swadisht/regional/masor-tenga.jpg',
        desc: 'Refreshing, tangy river fish cooked in locally sourced elephant apple/lemon broths.',
        badge: 'TANGY & LIGHT'
      },
      {
        id: 'as2',
        sku: 'SWD-ASM-PTHA-02',
        name: 'Pitha (Rice Cake)',
        price: 120,
        calories: 200,
        rating: 4.6,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=600',
        desc: 'Traditional steamed rice cakes stuffed with coconut and sesame, served during Bihu festival.',
        badge: 'FESTIVAL SPECIAL'
      }
    ]
  },
  {
    id: 'andhra-pradesh',
    name: 'Andhra Pradesh',
    nativeName: 'ఆంధ్రప్రదేశ్',
    tagline: 'The Fire of the Godavari Plains',
    kicker: 'HEATCRAFT FROM THE KRISHNA DELTA',
    color: '#2d0b0b',
    textColor: '#fff5f5',
    region: 'South India',
    specialties: ['Pesarattu', 'Gongura Mutton', 'Pulihora', 'Avakaya Biryani'],
    chefNote: 'Kamma & Kapu household recipes from Vijayawada and Guntur',
    heroImage: 'https://images.unsplash.com/photo-1596797882870-8c33dc2f2bc1?auto=format&fit=crop&q=80&w=1600',
    story: 'Andhra Pradesh holds the record for India\'s hottest cuisine—vibrant, pungent, and unapologetically bold with Guntur chilli at its core.',
    traditionalCookingTitle: 'Kuchipudi, Silk, and Chilli Fields',
    traditionalCookingStory: 'The fertile deltas of Krishna and Godavari nourish both the land and an extraordinary culinary tradition rooted in temple prasadam and fiery village cooking.',
    traditionalImages: [
      'https://images.unsplash.com/photo-1583437230439-ded4b4d9a7c5?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=600'
    ],
    culinaryAlchemistTitle: 'Guntur Sannam & Tamarind Alchemy',
    culinaryAlchemistStory: 'The fiery Guntur Sannam chilli elevates everything it touches. Combined with tamarind, raw mango pickles (Avakaya), and fenugreek, Andhra cooking is a combustion of flavors.',
    specialDishImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=800',
    dishes: [
      {
        id: 'ap1',
        sku: 'SWD-APR-PSTR-01',
        name: 'Pesarattu with Upma',
        price: 140,
        calories: 310,
        rating: 4.7,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&q=80&w=600',
        desc: 'Crispy whole green moong crepes served with ginger chutney and stuffed with semolina upma—a beloved Andhra breakfast.',
        badge: 'MORNING STAPLE'
      },
      {
        id: 'ap2',
        sku: 'SWD-APR-GNMT-02',
        name: 'Gongura Mutton Curry',
        price: 420,
        calories: 580,
        rating: 4.9,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1574484284002-952d92a03a52?auto=format&fit=crop&q=80&w=600',
        desc: 'Tender mutton pieces cooked in a tangy sorrel leaf (gongura) masala—the signature bold flavour of Andhra Pradesh.',
        badge: 'ANDHRA PRIDE'
      },
      {
        id: 'ap3',
        sku: 'SWD-APR-PLHR-03',
        name: 'Pulihora (Tamarind Rice)',
        price: 110,
        calories: 340,
        rating: 4.6,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&q=80&w=600',
        desc: 'Tangy tamarind-infused rice tempered with mustard seeds, curry leaves, peanuts, and dried red chillies.',
        badge: 'TEMPLE OFFERING'
      }
    ]
  },
  {
    id: 'telangana',
    name: 'Telangana',
    nativeName: 'తెలంగాణ',
    tagline: 'The Nizami Culinary Crown',
    kicker: 'BIRYANI CAPITAL OF THE WORLD',
    color: '#1a0a2e',
    textColor: '#f3e8ff',
    region: 'South India',
    specialties: ['Hyderabadi Biryani', 'Mirchi Ka Salan', 'Qubani Ka Meetha', 'Haleem'],
    chefNote: 'Nizami-trained chefs and Hyderabadi home kitchens',
    heroImage: 'https://images.unsplash.com/photo-1587899897387-091e0f9b8e3d?auto=format&fit=crop&q=80&w=1600',
    story: 'The Nizam\'s court defined Hyderabadi gastronomy over centuries—a royal amalgamation of Mughal and Telugu culinary traditions.',
    traditionalCookingTitle: 'Charminar, Pearls, and Dum Cooking',
    traditionalCookingStory: 'Hyderabad, the city of pearls, infuses every dish with layers of culture and artisanship. The slow dum technique sealed in clay-pot cooking remains the gold standard.',
    traditionalImages: [
      'https://images.unsplash.com/photo-1587899897387-091e0f9b8e3d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=600'
    ],
    culinaryAlchemistTitle: 'Dum, Saffron, and Rosewater',
    culinaryAlchemistStory: 'The Hyderabadi kitchen uses genuine Kashmiri saffron, kewra water, and ittar-scented dough seals on dum pots—a cooking art form.',
    specialDishImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800',
    dishes: [
      {
        id: 'tg1',
        sku: 'SWD-TLG-HYDBY-01',
        name: 'Hyderabadi Dum Biryani',
        price: 450,
        calories: 680,
        rating: 5.0,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=600',
        desc: 'Slow-cooked dum biryani with marinated mutton, saffron-infused basmati, caramelized onions, and sealed with dough—the original recipe.',
        badge: 'NIZAM SPECIAL'
      },
      {
        id: 'tg2',
        sku: 'SWD-TLG-HLIM-02',
        name: 'Hyderabadi Haleem',
        price: 320,
        calories: 520,
        rating: 4.9,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1574484284002-952d92a03a52?auto=format&fit=crop&q=80&w=600',
        desc: 'Slow-cooked 8-hour preparation of wheat, lentils, and mutton pounded to a silky, spiced porridge.',
        badge: 'GI TAGGED'
      }
    ]
  },
  {
    id: 'karnataka',
    name: 'Karnataka',
    nativeName: 'ಕರ್ನಾಟಕ',
    tagline: 'Silk, Sandalwood & Spice',
    kicker: 'FROM COORG PEAKS TO COASTAL SHORES',
    color: '#1a1a0a',
    textColor: '#fffde7',
    region: 'South India',
    specialties: ['Bisi Bele Bath', 'Ragi Mudde', 'Mysore Pak', 'Coorg Pandi Curry'],
    chefNote: 'Brahmin, Kodava, and Malnad household kitchens',
    heroImage: 'https://images.unsplash.com/photo-1591787704830-f8a2fbe23eb4?auto=format&fit=crop&q=80&w=1600',
    story: 'Karnataka\'s cuisine spans from the mild, coconut-heavy coastal Udupi to the robust, fiery Coorgi pork preparations and the refined Mysore court sweets.',
    traditionalCookingTitle: 'Hampi Ruins and Mysore Palace',
    traditionalCookingStory: 'Karnataka is home to one of India\'s greatest empires—the Vijayanagara. The royal kitchens produced Mysore Pak, now an iconic sweet across the subcontinent.',
    traditionalImages: [
      'https://images.unsplash.com/photo-1591787704830-f8a2fbe23eb4?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=600'
    ],
    culinaryAlchemistTitle: 'Ghee, Jaggery, and Stone Grinding',
    culinaryAlchemistStory: 'Karnataka cooking turns simple lentil preparations into profound dishes through patient tempering, wet masalas ground on stone, and liberal use of pure ghee.',
    specialDishImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=800',
    dishes: [
      {
        id: 'ka1',
        sku: 'SWD-KRN-BSBB-01',
        name: 'Bisi Bele Bath',
        price: 180,
        calories: 420,
        rating: 4.8,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600',
        desc: 'Karnataka\'s soul food: a one-pot preparation of rice, toor dal, mixed vegetables, and a proprietary 14-spice powder, topped with ghee.',
        badge: 'COMFORT CLASSIC'
      },
      {
        id: 'ka2',
        sku: 'SWD-KRN-MYSP-02',
        name: 'Mysore Pak',
        price: 160,
        calories: 290,
        rating: 4.9,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=600',
        desc: 'The royal sweet of Mysore—chickpea flour cooked in a river of ghee until it reaches a crumbly, melt-in-mouth texture.',
        badge: 'PALACE RECIPE'
      },
      {
        id: 'ka3',
        sku: 'SWD-KRN-RGMD-03',
        name: 'Ragi Mudde with Saaru',
        price: 120,
        calories: 310,
        rating: 4.6,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=600',
        desc: 'Dense, nutrient-rich finger millet balls served with a thin, peppery tomato rasam—a rural Karnataka staple.',
        badge: 'NUTRITIONAL POWERHOUSE'
      }
    ]
  },
  {
    id: 'madhya-pradesh',
    name: 'Madhya Pradesh',
    nativeName: 'मध्य प्रदेश',
    tagline: 'The Heart of India\'s Flavors',
    kicker: 'WILDERNESS AND HERITAGE ON THE PLATE',
    color: '#1c1207',
    textColor: '#fef3c7',
    region: 'Central India',
    specialties: ['Dal Bafla', 'Bhutte Ki Kees', 'Poha Jalebi', 'Shikampuri Kebab'],
    chefNote: 'Traditional Malwa and Bundelkhandi home kitchens',
    heroImage: 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?auto=format&fit=crop&q=80&w=1600',
    story: 'Madhya Pradesh\'s cuisine mirrors its diverse geography—from the forested tribal belt to the royal courts of Gwalior and Bhopal.',
    traditionalCookingTitle: 'Khajuraho, Bandhavgarh, and Ancient Courts',
    traditionalCookingStory: 'The Malwa plateau and Bundelkhand contributed rich court cuisines while tribal communities preserved centuries of forest-foraging wisdom.',
    traditionalImages: [
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=600'
    ],
    culinaryAlchemistTitle: 'Bafla Ovens and Malwa Spice',
    culinaryAlchemistStory: 'Dal Bafla—the MP answer to Rajasthan\'s Dal Baati—features wheat dough balls boiled then baked, dipped in ghee, served with spiced dal and a fiery churma.',
    specialDishImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=800',
    dishes: [
      {
        id: 'mp1',
        sku: 'SWD-MPR-DLBF-01',
        name: 'Dal Bafla',
        price: 260,
        calories: 490,
        rating: 4.8,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600',
        desc: 'Wheat dough balls boiled and baked, served with five-lentil spiced dal and churma sweetened with jaggery.',
        badge: 'CENTRAL INDIA PRIDE'
      },
      {
        id: 'mp2',
        sku: 'SWD-MPR-BHKS-02',
        name: 'Bhutte Ki Kees',
        price: 130,
        calories: 260,
        rating: 4.7,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600',
        desc: 'Freshly grated corn cooked in milk with ghee, green chilli, and spices—Indore\'s beloved street snack.',
        badge: 'INDORE STREET'
      }
    ]
  },
  {
    id: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    nativeName: 'उत्तर प्रदेश',
    tagline: 'The Mughals\' Grand Kitchen',
    kicker: 'AWADHI REFINEMENT ON EVERY PLATE',
    color: '#0d1f0a',
    textColor: '#f0fff4',
    region: 'North India',
    specialties: ['Tunday Kebab', 'Lucknowi Biryani', 'Malaiyo', 'Mathura Peda'],
    chefNote: 'Nawabi Awadhi chefs from Lucknow and old Varanasi kitchens',
    heroImage: 'https://images.unsplash.com/photo-1585059895524-72359e06133a?auto=format&fit=crop&q=80&w=1600',
    story: 'The Nawabs of Avadh redefined Indian cooking with dum pukht—slow-sealed pot cooking that produces an unmatched depth of flavor.',
    traditionalCookingTitle: 'Imambara, Chikankari, and Kite Festivals',
    traditionalCookingStory: 'From the labyrinthine lanes of Lucknow to the ghats of Varanasi, UP is the keeper of India\'s most refined cultural and culinary heritage.',
    traditionalImages: [
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1585059895524-72359e06133a?auto=format&fit=crop&q=80&w=600'
    ],
    culinaryAlchemistTitle: 'Dum Pukht Mastery',
    culinaryAlchemistStory: 'Awadhi cuisine is built on patience. Dum cooking in sealed handi vessels infuses meat with slow-rising steam from its own juices—no shortcuts, no compromise.',
    specialDishImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=800',
    dishes: [
      {
        id: 'up1',
        sku: 'SWD-UPR-TNKY-01',
        name: 'Tunday Kebab',
        price: 290,
        calories: 360,
        rating: 4.9,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1574484284002-952d92a03a52?auto=format&fit=crop&q=80&w=600',
        desc: 'Legendary galawati kebabs from Lucknow—minced mutton with 160 spices, so soft they melt without chewing.',
        badge: 'NAWABI LEGEND'
      },
      {
        id: 'up2',
        sku: 'SWD-UPR-MLIY-02',
        name: 'Malaiyo',
        price: 140,
        calories: 190,
        rating: 4.8,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1622374594836-b85dbc6c5eb7?auto=format&fit=crop&q=80&w=600',
        desc: 'Winter-only Varanasi specialty: airy, saffron-kissed milk foam seasoned with cardamom and topped with crushed pistachio.',
        badge: 'WINTER EXCLUSIVE'
      }
    ]
  },
  {
    id: 'bihar',
    name: 'Bihar',
    nativeName: 'बिहार',
    tagline: 'The Magadha Grain Empire',
    kicker: 'SIMPLICITY IS THE GREATEST SOPHISTICATION',
    color: '#1a0f02',
    textColor: '#fffbeb',
    region: 'East India',
    specialties: ['Litti Chokha', 'Sattu Paratha', 'Khaja', 'Thekua'],
    chefNote: 'Bhojpuri village cooks from Patna and Gaya regions',
    heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1600',
    story: 'Bihar\'s food is built on the genius of simplicity—roasted grains, mustard oil, and fire. Litti Chokha is India\'s most underrated masterpiece.',
    traditionalCookingTitle: 'Nalanda, Buddha, and the Ganga Ghats',
    traditionalCookingStory: 'From the ancient university at Nalanda to the grand Mahabodhi temple, Bihar carries India\'s spiritual and intellectual foundation.',
    traditionalImages: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=600'
    ],
    culinaryAlchemistTitle: 'The Fireside Pit Cook',
    culinaryAlchemistStory: 'Litti, the whole wheat flour dough stuffed with roasted sattu and spices, is cooked directly on cow-dung cakes or charcoal. Nothing but fire and grain.',
    specialDishImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=800',
    dishes: [
      {
        id: 'bh1',
        sku: 'SWD-BHR-LTCK-01',
        name: 'Litti Chokha',
        price: 180,
        calories: 490,
        rating: 4.9,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=600',
        desc: 'Charcoal-roasted wheat balls stuffed with spiced roasted gram flour, served with smoky mashed brinjal and tomato chokha.',
        badge: 'VILLAGE CLASSIC'
      },
      {
        id: 'bh2',
        sku: 'SWD-BHR-STTP-02',
        name: 'Sattu Paratha',
        price: 100,
        calories: 360,
        rating: 4.7,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=600',
        desc: 'Whole wheat flatbread stuffed with spiced roasted chickpea flour, served with raw mango pickle and ghee.',
        badge: 'HIGH PROTEIN'
      }
    ]
  },
  {
    id: 'jharkhand',
    name: 'Jharkhand',
    nativeName: 'झारखंड',
    tagline: 'Forest, Tribe, and Flame',
    kicker: 'THE LIVING TRIBAL PANTRY',
    color: '#0a1f0a',
    textColor: '#f0fdf4',
    region: 'East India',
    specialties: ['Rugra', 'Dhuska', 'Chilka Roti', 'Handia'],
    chefNote: 'Santali, Ho, and Munda tribal home cooks from Ranchi',
    heroImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1600',
    story: 'Jharkhand\'s tribal communities cook with forest produce—mushrooms, bamboo shoots, and wild tubers—in the most elemental way.',
    traditionalCookingTitle: 'Sal Forests, Waterfalls, and Sacred Groves',
    traditionalCookingStory: 'The Santali, Ho, and Mundari peoples of Jharkhand carry traditions of brewing rice beer (Handia) and cooking seasonal forest produce over fireside clay pots.',
    traditionalImages: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=600'
    ],
    culinaryAlchemistTitle: 'Clay Pots and Forest Forage',
    culinaryAlchemistStory: 'Tribal cooking in Jharkhand requires no modern equipment—only clay, fire, and the forest. Dhuska, a fried rice-lentil cake, is the definitive comfort food.',
    specialDishImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800',
    dishes: [
      {
        id: 'jh1',
        sku: 'SWD-JHK-DHSK-01',
        name: 'Dhuska',
        price: 120,
        calories: 350,
        rating: 4.6,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&q=80&w=600',
        desc: 'Deep-fried soaked rice and chana dal cakes—crispy outside, soft inside—served with ghugni and green chutney.',
        badge: 'TRIBAL STAPLE'
      },
      {
        id: 'jh2',
        sku: 'SWD-JHK-RUGR-02',
        name: 'Rugra Mushroom Curry',
        price: 200,
        calories: 240,
        rating: 4.7,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600',
        desc: 'Wild forest mushrooms foraged from sal forests, cooked in a simple turmeric and mustard oil gravy.',
        badge: 'FOREST HARVEST'
      }
    ]
  },
  {
    id: 'chhattisgarh',
    name: 'Chhattisgarh',
    nativeName: 'छत्तीसगढ़',
    tagline: 'The Rice Bowl of India',
    kicker: 'ANCIENT TRIBAL GRAIN TRADITIONS',
    color: '#0d1a10',
    textColor: '#f0fdf4',
    region: 'Central India',
    specialties: ['Chila', 'Bafauri', 'Muthia', 'Farra'],
    chefNote: 'Chhattisgarhi tribal cooks from Raipur and Bastar regions',
    heroImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=1600',
    story: 'Chhattisgarh produces one third of India\'s rice varieties. Its tribal cuisine celebrates fermentation, steaming, and unprocessed forest ingredients.',
    traditionalCookingTitle: 'Chitrakote Falls, Bastar Tribe, and Iron Craft',
    traditionalCookingStory: 'Bastar\'s tribal communities have some of India\'s most intricate oral food traditions, including 36 varieties of cooking rice in bamboo stems.',
    traditionalImages: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600'
    ],
    culinaryAlchemistTitle: 'Bamboo Steam and Rice Ferment',
    culinaryAlchemistStory: 'Chila—the Chhattisgarhi crepe—is made from rice batter fermented overnight and cooked on clay griddles. Bafauri are steamed chana dal dumplings.',
    specialDishImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
    dishes: [
      {
        id: 'cg1',
        sku: 'SWD-CGR-CHIL-01',
        name: 'Chhattisgarhi Chila',
        price: 100,
        calories: 230,
        rating: 4.5,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&q=80&w=600',
        desc: 'Thin rice batter crepes flavored with ginger, green chilli, and cumin—a light, nutritious tribal breakfast.',
        badge: 'BASTAR ORIGINAL'
      },
      {
        id: 'cg2',
        sku: 'SWD-CGR-BFRI-02',
        name: 'Bafauri',
        price: 120,
        calories: 270,
        rating: 4.6,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=600',
        desc: 'Steamed Bengal gram fritters with a hint of asafoetida—light on oil but rich in flavor, eaten with chutney.',
        badge: 'STEAMED FRESH'
      }
    ]
  },
  {
    id: 'himachal-pradesh',
    name: 'Himachal Pradesh',
    nativeName: 'हिमाचल प्रदेश',
    tagline: 'Mountain Hearth and High Pastures',
    kicker: 'WHERE THE HIMALAYAS COOK',
    color: '#0a1a2e',
    textColor: '#e0f2fe',
    region: 'North India',
    specialties: ['Chha Gosht', 'Siddu', 'Babru', 'Aktori'],
    chefNote: 'Pahari home kitchens from Kullu, Manali, and Shimla',
    heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1600',
    story: 'High-altitude cooking with slow-braised meats, buckwheat breads, and preserved root vegetables that sustain mountain communities through harsh winters.',
    traditionalCookingTitle: 'Deodar Forests, Apple Orchards, and Shawl Looms',
    traditionalCookingStory: 'Himachal Pradesh is a land of Gaddi shepherds, Tibetan Buddhist monasteries, and apple-fragrant valleys where every preparation reflects the mountain season.',
    traditionalImages: [
      'https://images.unsplash.com/photo-1596797882870-8c33dc2f2bc1?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=600'
    ],
    culinaryAlchemistTitle: 'Slow Braise and Buckwheat',
    culinaryAlchemistStory: 'Chha Gosht—a slow-braised mutton preparation using raw papaya as tenderizer—is cooked over wood fire in the mountain style. Siddu is a yeast-fermented bread unique to Himachal.',
    specialDishImage: 'https://images.unsplash.com/photo-1574484284002-952d92a03a52?auto=format&fit=crop&q=80&w=800',
    dishes: [
      {
        id: 'hp1',
        sku: 'SWD-HMP-CHGS-01',
        name: 'Chha Gosht',
        price: 380,
        calories: 520,
        rating: 4.8,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1574484284002-952d92a03a52?auto=format&fit=crop&q=80&w=600',
        desc: 'Mountain-style slow-braised mutton in a yogurt and raw papaya marinade with whole dry spices—a Pahari specialty.',
        badge: 'MOUNTAIN BRAISE'
      },
      {
        id: 'hp2',
        sku: 'SWD-HMP-SIDD-02',
        name: 'Siddu with Ghee',
        price: 140,
        calories: 320,
        rating: 4.7,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=600',
        desc: 'Yeast-leavened steamed wheat bread stuffed with poppy seeds and walnuts, served warm with pure cow ghee.',
        badge: 'SNOW SEASON'
      }
    ]
  },
  {
    id: 'uttarakhand',
    name: 'Uttarakhand',
    nativeName: 'उत्तराखंड',
    tagline: 'Devbhoomi — Land of the Gods',
    kicker: 'HIMALAYAN ROOTS ON THE PLATE',
    color: '#0a1a0a',
    textColor: '#f0fdf4',
    region: 'North India',
    specialties: ['Kafuli', 'Phaanu', 'Bal Mithai', 'Singori'],
    chefNote: 'Garhwali and Kumaoni household recipes from Nainital and Dehradun',
    heroImage: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&q=80&w=1600',
    story: 'Uttarakhand\'s Garhwali and Kumaoni traditions produce some of India\'s most health-forward mountain cuisines—leafy greens, lentils, and ancient grains.',
    traditionalCookingTitle: 'Kedarnath, Valley of Flowers, and Yoga',
    traditionalCookingStory: 'From the sacred char dham temples to the yoga capital of Rishikesh, Uttarakhand\'s identity is deeply spiritual—and its cooking reflects sattvic purity.',
    traditionalImages: [
      'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=600'
    ],
    culinaryAlchemistTitle: 'Leafy Greens and Ancient Lentils',
    culinaryAlchemistStory: 'Kafuli is a slow-cooked preparation of spinach and fenugreek leaves with black lentils—deeply nourishing, intensely flavored with ghee tempering.',
    specialDishImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800',
    dishes: [
      {
        id: 'uk1',
        sku: 'SWD-UTR-KFLI-01',
        name: 'Kafuli',
        price: 160,
        calories: 230,
        rating: 4.7,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600',
        desc: 'Slow-cooked spinach and fenugreek curry with black lentils, tempered in pure ghee—a Garhwali mountain staple.',
        badge: 'MOUNTAIN GREENS'
      },
      {
        id: 'uk2',
        sku: 'SWD-UTR-BLMT-02',
        name: 'Bal Mithai',
        price: 180,
        calories: 280,
        rating: 4.8,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=600',
        desc: 'Kumaon\'s iconic dark chocolate-like milk fudge coated with white sugar balls—the sweet ambassador of Almora.',
        badge: 'KUMAON SWEET'
      }
    ]
  },
  {
    id: 'haryana',
    name: 'Haryana',
    nativeName: 'हरियाणा',
    tagline: 'The Desi Ghee Frontier',
    kicker: 'WHERE THE MILK FLOWS AND MUSTARD GROWS',
    color: '#1a1002',
    textColor: '#fffbeb',
    region: 'North India',
    specialties: ['Bajra Khichdi', 'Kadhi Pakoda', 'Churma', 'Kachri Ki Sabzi'],
    chefNote: 'Jat household kitchens from Panipat, Karnal, and Hisar',
    heroImage: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&q=80&w=1600',
    story: 'Haryanvi food celebrates the agrarian spirit with heavy, protein-rich preparations built for hard-working farming communities.',
    traditionalCookingTitle: 'Kurukshetra, Sufiana Music, and Wrestle Akhadas',
    traditionalCookingStory: 'The land of the Mahabharata, Haryana\'s traditions blend the ancient with robust agrarian culture—from wrestling akhadas to folk songs celebrating the harvest.',
    traditionalImages: [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&q=80&w=600'
    ],
    culinaryAlchemistTitle: 'Bajra, Buttermilk, and Ghee',
    culinaryAlchemistStory: 'Bajra (pearl millet) is the backbone of Haryanvi cuisine—ground, boiled, and shaped into khichdi or rotis, liberally anointed with home-churned desi ghee.',
    specialDishImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800',
    dishes: [
      {
        id: 'hr1',
        sku: 'SWD-HRY-BJKH-01',
        name: 'Bajra Khichdi',
        price: 140,
        calories: 390,
        rating: 4.6,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600',
        desc: 'Pearl millet slow-cooked with green moong dal, tempered with ghee and cumin—rustic, warming, and deeply satisfying.',
        badge: 'FARM KITCHEN'
      },
      {
        id: 'hr2',
        sku: 'SWD-HRY-CDRM-02',
        name: 'Churma Ladoo',
        price: 120,
        calories: 310,
        rating: 4.7,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=600',
        desc: 'Coarsely ground wheat ladoos sweetened with jaggery and enriched with ghee—a traditional Haryanvi celebratory sweet.',
        badge: 'HARVEST SWEET'
      }
    ]
  },
  {
    id: 'jammu-kashmir',
    name: 'Jammu & Kashmir',
    nativeName: 'जम्मू और कश्मीर',
    tagline: 'The Wazwan Banquet Tradition',
    kicker: 'HEAVEN ON EARTH, HEAVEN ON THE TABLE',
    color: '#0a0a1a',
    textColor: '#f0f0ff',
    region: 'North India',
    specialties: ['Rogan Josh', 'Yakhni', 'Modur Pulao', 'Gushtaba', 'Sheermal'],
    chefNote: 'Waza (master chef) families from Srinagar\'s old city',
    heroImage: 'https://images.unsplash.com/photo-1607427293702-036c6d2f6a8e?auto=format&fit=crop&q=80&w=1600',
    story: 'Wazwan is a multi-course ceremonial feast central to Kashmiri Muslim weddings—up to 36 courses cooked exclusively by master Wazas.',
    traditionalCookingTitle: 'Dal Lake, Chinar Trees, and Pashmina',
    traditionalCookingStory: 'Kashmir\'s identity is woven into its Wazwan feasts, Sufi shrines, and the intricate art of sozni embroidery. The cuisine reflects the Persian, Central Asian, and Mughal influences layered over centuries.',
    traditionalImages: [
      'https://images.unsplash.com/photo-1607427293702-036c6d2f6a8e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&q=80&w=600'
    ],
    culinaryAlchemistTitle: 'Maval Flower, Hing, and Dry Ginger',
    culinaryAlchemistStory: 'Kashmiri cuisine is notable for its absence of onion and garlic in Pandit recipes. The Wazwan repertoire uses a distinct set of whole spices—ratanjot, mace, and Kashmiri red chilli.',
    specialDishImage: 'https://images.unsplash.com/photo-1574484284002-952d92a03a52?auto=format&fit=crop&q=80&w=800',
    dishes: [
      {
        id: 'jk1',
        sku: 'SWD-JKM-RGJH-01',
        name: 'Rogan Josh',
        price: 420,
        calories: 540,
        rating: 5.0,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1574484284002-952d92a03a52?auto=format&fit=crop&q=80&w=600',
        desc: 'Intensely aromatic Kashmiri mutton curry in deep red gravy, colored with ratanjot and Kashmiri chilli—no onion, no garlic.',
        badge: 'WAZWAN PINNACLE'
      },
      {
        id: 'jk2',
        sku: 'SWD-JKM-MDPL-02',
        name: 'Modur Pulao',
        price: 280,
        calories: 380,
        rating: 4.8,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&q=80&w=600',
        desc: 'Kashmiri sweet rice with whole spices, saffron, raisins, and nuts—a fragrant, festive preparation from Pandit cuisine.',
        badge: 'PANDIT FESTIVAL'
      }
    ]
  },
  {
    id: 'sikkim',
    name: 'Sikkim',
    nativeName: 'सिक्किम',
    tagline: 'Himalayan Monastery Kitchen',
    kicker: 'ORGANIC, ANCIENT, AND UNDISCOVERED',
    color: '#0f1a10',
    textColor: '#f0fdf4',
    region: 'Northeast',
    specialties: ['Gundruk', 'Sel Roti', 'Phagshapa', 'Momos'],
    chefNote: 'Nepali and Lepcha home cooks from Gangtok valleys',
    heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1600',
    story: 'Sikkim—India\'s first fully organic state—produces food that is pure, minimal, and deeply tied to Buddhist and Nepalese traditions.',
    traditionalCookingTitle: 'Rhododendron Forests and Buddhist Gompas',
    traditionalCookingStory: 'Perched in the Eastern Himalayas, Sikkim blends Nepali, Tibetan, and Lepcha food cultures into an extraordinarily clean cuisine with zero food waste.',
    traditionalImages: [
      'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&q=80&w=600'
    ],
    culinaryAlchemistTitle: 'Fermentation and Mountain Wildcraft',
    culinaryAlchemistStory: 'Gundruk—fermented and sun-dried leafy greens—is Sikkim\'s answer to preservation. It imparts a sharp, tangy flavor unique to the mountain palette.',
    specialDishImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800',
    dishes: [
      {
        id: 'sk1',
        sku: 'SWD-SKM-GNDK-01',
        name: 'Gundruk Soup',
        price: 140,
        calories: 180,
        rating: 4.6,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600',
        desc: 'Tangy fermented dried leafy greens simmered into a warming, probiotic-rich mountain soup with tomato and garlic.',
        badge: 'ORGANIC CERTIFIED'
      },
      {
        id: 'sk2',
        sku: 'SWD-SKM-SLRT-02',
        name: 'Sel Roti',
        price: 100,
        calories: 260,
        rating: 4.7,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&q=80&w=600',
        desc: 'Crispy ring-shaped Nepali rice flour doughnuts fried to golden perfection—served during Tihar and Dashain festivals.',
        badge: 'FESTIVAL BREAD'
      }
    ]
  },
  {
    id: 'meghalaya',
    name: 'Meghalaya',
    nativeName: 'मेघालय',
    tagline: 'Abode of Clouds, Abundance of Smoke',
    kicker: 'THE MATRILINEAL KITCHEN',
    color: '#0a1520',
    textColor: '#e0f2fe',
    region: 'Northeast',
    specialties: ['Jadoh', 'Nakham Bitchi', 'Dohneiiong', 'Tungtap'],
    chefNote: 'Khasi and Jaintia home cooks from Shillong and Cherrapunji',
    heroImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1600',
    story: 'Meghalaya\'s matrilineal Khasi society places women at the center of home and cuisine. Smoking, fermentation, and pork dominate the culinary tradition.',
    traditionalCookingTitle: 'Living Root Bridges and Cloud Forests',
    traditionalCookingStory: 'The Khasi and Garo peoples have cultivated one of India\'s most unique food cultures—centered on smoked pork, fermented fish, and rice cooked in bamboo.',
    traditionalImages: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=600'
    ],
    culinaryAlchemistTitle: 'Smoked Fat and Fermented Fish',
    culinaryAlchemistStory: 'Nakham Bitchi is dried smoked fish chutney—pungent and powerful, used as a condiment with nearly every Khasi meal. Jadoh is the red rice and pork staple.',
    specialDishImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800',
    dishes: [
      {
        id: 'mg1',
        sku: 'SWD-MGH-JADH-01',
        name: 'Jadoh',
        price: 240,
        calories: 460,
        rating: 4.7,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&q=80&w=600',
        desc: 'Khasi red rice cooked with pork, turmeric, and ginger—a one-pot ceremonial dish essential to every Khasi community gathering.',
        badge: 'KHASI CEREMONY'
      },
      {
        id: 'mg2',
        sku: 'SWD-MGH-DNNG-02',
        name: 'Dohneiiong',
        price: 310,
        calories: 520,
        rating: 4.8,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1574484284002-952d92a03a52?auto=format&fit=crop&q=80&w=600',
        desc: 'Pork slow-cooked with black sesame paste in a rich, deep gravy—the flagship dish of Meghalaya\'s Khasi cuisine.',
        badge: 'BLACK SESAME PRIDE'
      }
    ]
  },
  {
    id: 'manipur',
    name: 'Manipur',
    nativeName: 'মণিপুর',
    tagline: 'The Jewel of the East',
    kicker: 'FERMENTED WISDOM FROM THE VALLEY',
    color: '#1a0a20',
    textColor: '#fae8ff',
    region: 'Northeast',
    specialties: ['Eromba', 'Chamthong', 'Singju', 'Ngari'],
    chefNote: 'Meitei home cooks from Imphal valley',
    heroImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1600',
    story: 'Manipuri cuisine is fiercely seasonal, relying on fermented fish (Ngari), water plants from Loktak lake, and an exceptional range of chilli preparations.',
    traditionalCookingTitle: 'Ras Leela, Polo, and Loktak Lake',
    traditionalCookingStory: 'The Meitei people of Manipur are masters of the performing arts—Ras Leela dance and classical Manipuri music. Their cuisine is equally sophisticated, built on layered fermentation techniques.',
    traditionalImages: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&q=80&w=600'
    ],
    culinaryAlchemistTitle: 'Ngari and Bamboo Fermentation',
    culinaryAlchemistStory: 'Ngari—fermented dry fish—is the soul ingredient of Manipuri cooking. Added to chutneys, curries, and stews, it delivers an umami depth unlike any other ingredient.',
    specialDishImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800',
    dishes: [
      {
        id: 'mn1',
        sku: 'SWD-MNP-ERMB-01',
        name: 'Eromba',
        price: 180,
        calories: 220,
        rating: 4.7,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600',
        desc: 'A pungent chutney of boiled vegetables mashed with fermented fish (Ngari) and Bhut Jolokia chilli—the quintessential Meitei condiment.',
        badge: 'VALLEY STAPLE'
      },
      {
        id: 'mn2',
        sku: 'SWD-MNP-SNGU-02',
        name: 'Singju Salad',
        price: 120,
        calories: 140,
        rating: 4.6,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600',
        desc: 'Fresh shredded lotus stem, water cress, and raw papaya tossed with toasted sesame, Ngari, and dry chilli.',
        badge: 'WATER GARDEN FRESH'
      }
    ]
  },
  {
    id: 'nagaland',
    name: 'Nagaland',
    nativeName: 'नागालैंड',
    tagline: 'The Hornbill Kitchen',
    kicker: 'RAW, SMOKED, AND UNCOMPROMISING',
    color: '#1a0808',
    textColor: '#fff5f5',
    region: 'Northeast',
    specialties: ['Smoked Pork with Bamboo Shoot', 'Galho', 'Zutho', 'Anishi'],
    chefNote: 'Angami and Ao Naga tribal cooks from Kohima and Mokokchung',
    heroImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1600',
    story: 'Naga cuisine is one of India\'s most primal—centered on smoking, minimal spice, fermented soy, and the ghost chilli that grows in these misty hills.',
    traditionalCookingTitle: 'Hornbill Festival and Warrior Traditions',
    traditionalCookingStory: 'Nagaland\'s 16 major tribes each carry distinct food traditions. The Hornbill Festival brings them together—showcasing smoked meats, tribal rice beers, and fermented preparations.',
    traditionalImages: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&q=80&w=600'
    ],
    culinaryAlchemistTitle: 'Smoke, Ferment, and Bamboo',
    culinaryAlchemistStory: 'Naga cooking achieves extraordinary depth through smoking meats over wood fires for days. Bamboo shoots—fresh or fermented—appear in almost every preparation.',
    specialDishImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800',
    dishes: [
      {
        id: 'ng1',
        sku: 'SWD-NGL-SMPK-01',
        name: 'Smoked Pork with Bamboo Shoot',
        price: 340,
        calories: 560,
        rating: 4.8,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1574484284002-952d92a03a52?auto=format&fit=crop&q=80&w=600',
        desc: 'Wood-smoked pork belly cooked with fermented bamboo shoots and ghost chilli—Nagaland\'s definitive dish.',
        badge: 'HORNBILL FEAST'
      },
      {
        id: 'ng2',
        sku: 'SWD-NGL-GALH-02',
        name: 'Galho',
        price: 200,
        calories: 380,
        rating: 4.6,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600',
        desc: 'A hearty one-pot rice and meat porridge cooked with seasonal greens—Nagaland\'s comfort meal for cold mountain nights.',
        badge: 'TRIBAL COMFORT'
      }
    ]
  },
  {
    id: 'mizoram',
    name: 'Mizoram',
    nativeName: 'मिज़ोरम',
    tagline: 'The Blue Mountain Cuisine',
    kicker: 'AUSTERE AND PURE FROM THE HILLS',
    color: '#0a1530',
    textColor: '#e0f2fe',
    region: 'Northeast',
    specialties: ['Bai', 'Misa Mach Poora', 'Koat Pitha', 'Vawksa Rep'],
    chefNote: 'Mizo home cooks from Aizawl\'s hill settlements',
    heroImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1600',
    story: 'Mizo cuisine is characterized by its simplicity—boiled vegetables, minimal spice, smoked pork, and a clean freshness that comes from the misty blue hills.',
    traditionalCookingTitle: 'Bamboo Houses and Cheraw Dance',
    traditionalCookingStory: 'Mizoram\'s Mizo people are known for their hospitality, bamboo architecture, and the graceful bamboo stick dance Cheraw. Their cuisine reflects this gentle, community-centered spirit.',
    traditionalImages: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=600'
    ],
    culinaryAlchemistTitle: 'Boiled Purity and Smoked Depth',
    culinaryAlchemistStory: 'Bai is the Mizo national dish—a simple boil of pork, greens, and bamboo shoots with minimal seasoning. Its beauty lies in restraint and the quality of its ingredients.',
    specialDishImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800',
    dishes: [
      {
        id: 'mz1',
        sku: 'SWD-MZR-BAI-01',
        name: 'Bai',
        price: 220,
        calories: 340,
        rating: 4.6,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600',
        desc: 'Pork and mixed greens boiled with bamboo shoots and mustard leaves—Mizoram\'s clean, wholesome national dish.',
        badge: 'MIZO HERITAGE'
      },
      {
        id: 'mz2',
        sku: 'SWD-MZR-MMPR-02',
        name: 'Misa Mach Poora',
        price: 260,
        calories: 290,
        rating: 4.7,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1574484284002-952d92a03a52?auto=format&fit=crop&q=80&w=600',
        desc: 'Roasted or grilled river prawns marinated in mustard paste with chilli—a bold, simple preparation from Mizo streams.',
        badge: 'RIVER FRESH'
      }
    ]
  },
  {
    id: 'tripura',
    name: 'Tripura',
    nativeName: 'ত্রিপুরা',
    tagline: 'The Fourteen Tribes Kitchen',
    kicker: 'BENGALI MEETS TRIBAL NORTHEAST',
    color: '#1a1020',
    textColor: '#fae8ff',
    region: 'Northeast',
    specialties: ['Mui Borok', 'Chakhwi', 'Berma', 'Wahan Mosdeng'],
    chefNote: 'Tripuri and Bengali home cooks from Agartala',
    heroImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1600',
    story: 'Tripura\'s 19 tribal communities each contribute distinct flavors—fermented bamboo, dried fish (Berma), and a fiery chilli paste define the indigenous tradition.',
    traditionalCookingTitle: 'Palaces, Bamboo Crafts, and Fourteen Tribes',
    traditionalCookingStory: 'The Kingdom of Tripura hosted a sophisticated royal court whose cuisine blended with tribal traditions. The Ujjayanta Palace in Agartala stands as testament to this cultural layering.',
    traditionalImages: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&q=80&w=600'
    ],
    culinaryAlchemistTitle: 'Berma and Bamboo Shoot',
    culinaryAlchemistStory: 'Berma—sun-dried fermented fish—is Tripura\'s master ingredient, used as a protein booster and flavor amplifier across tribal preparations.',
    specialDishImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800',
    dishes: [
      {
        id: 'tr1',
        sku: 'SWD-TRP-MUIB-01',
        name: 'Mui Borok',
        price: 200,
        calories: 320,
        rating: 4.6,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600',
        desc: 'Traditional Tripuri pork and vegetable stew flavored with Berma (fermented fish)—an everyday tribal preparation.',
        badge: 'TRIPURI TRADITION'
      },
      {
        id: 'tr2',
        sku: 'SWD-TRP-CHKW-02',
        name: 'Chakhwi',
        price: 180,
        calories: 270,
        rating: 4.5,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1574484284002-952d92a03a52?auto=format&fit=crop&q=80&w=600',
        desc: 'Slow-cooked pork or goat with herbs and minimal spices—a rustic ceremonial dish from the tribal heartland of Tripura.',
        badge: 'TRIBAL CEREMONY'
      }
    ]
  },
  {
    id: 'arunachal-pradesh',
    name: 'Arunachal Pradesh',
    nativeName: 'अरुणाचल प्रदेश',
    tagline: 'Land of the Dawn-Lit Mountains',
    kicker: 'WHERE THE SUN FIRST RISES IN INDIA',
    color: '#0a1a2e',
    textColor: '#e0f2fe',
    region: 'Northeast',
    specialties: ['Thukpa', 'Apong', 'Bamboo Shoot Curry', 'Pika Pila'],
    chefNote: 'Nyishi and Adi tribal home cooks from Itanagar',
    heroImage: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&q=80&w=1600',
    story: 'Arunachal Pradesh shares Tibetan Buddhist food traditions with 26 major tribes—each with distinct ingredients and techniques found nowhere else in India.',
    traditionalCookingTitle: 'Tawang Monastery, Ziro Valley, and Tribal Art',
    traditionalCookingStory: 'From the Tibetan-influenced Monpa people to the rice-farming Apatani tribe, Arunachal\'s diverse landscape produces equally diverse flavors.',
    traditionalImages: [
      'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&q=80&w=600'
    ],
    culinaryAlchemistTitle: 'Bamboo Cooking and Millet Brew',
    culinaryAlchemistStory: 'Cooking inside bamboo stems is a uniquely Arunachali technique—meat, rice, or vegetables are sealed inside green bamboo, then roasted over open fire for a clean, smoky flavor.',
    specialDishImage: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&q=80&w=800',
    dishes: [
      {
        id: 'ar1',
        sku: 'SWD-ARN-THKP-01',
        name: 'Tibetan Thukpa',
        price: 200,
        calories: 380,
        rating: 4.7,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600',
        desc: 'Hearty noodle soup with vegetables and yak meat in a clear, warming broth—the Monpa staple from the Tawang highlands.',
        badge: 'HIGH ALTITUDE WARMTH'
      },
      {
        id: 'ar2',
        sku: 'SWD-ARN-BMSH-02',
        name: 'Bamboo Shoot Pork Curry',
        price: 280,
        calories: 430,
        rating: 4.8,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1574484284002-952d92a03a52?auto=format&fit=crop&q=80&w=600',
        desc: 'Pork slow-cooked with fermented bamboo shoots and minimal spices—Arunachal\'s most beloved everyday preparation.',
        badge: 'BAMBOO FOREST FRESH'
      }
    ]
  },
  {
    id: 'delhi',
    name: 'Delhi',
    nativeName: 'दिल्ली',
    tagline: 'The Street Food Capital of India',
    kicker: 'SEVEN CITIES, ONE LEGENDARY APPETITE',
    color: '#1a0a00',
    textColor: '#fff7ed',
    region: 'North India',
    specialties: ['Chole Bhature', 'Dahi Bhalla', 'Nihari', 'Paranthe Wali Gali', 'Butter Chicken'],
    chefNote: 'Old Delhi puranawale and Mughal-lineage cooks from Karim\'s',
    heroImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=1600',
    story: 'Delhi is where every Indian cuisine comes to be tested and perfected. From the lanes of Chandni Chowk to the tandoors of Lajpat Nagar, Delhi\'s food is the nation\'s food.',
    traditionalCookingTitle: 'Red Fort, Chandni Chowk, and the Mughals',
    traditionalCookingStory: 'Delhi\'s seven historical cities have each added layers to its food culture. The Mughal courts birthed Butter Chicken, the Sikh langar democratized food, and the Partition brought Punjab\'s best to its streets.',
    traditionalImages: [
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=600'
    ],
    culinaryAlchemistTitle: 'Tandoor, Tawa, and the Chandni Chowk Lanes',
    culinaryAlchemistStory: 'Delhi\'s culinary mastery comes from the confluence of cultures. Paranthe Wali Gali in Chandni Chowk serves over 40 varieties of stuffed flatbreads. Karim\'s serves Mughal-era recipes unchanged for 100 years.',
    specialDishImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=800',
    dishes: [
      {
        id: 'dl1',
        sku: 'SWD-DLH-CHBH-01',
        name: 'Delhi Chole Bhature',
        price: 160,
        calories: 620,
        rating: 4.9,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=600',
        desc: 'The definitive Delhi breakfast—overnight soaked chickpeas in black tea-spiced gravy with crispy deep-fried bhatura.',
        badge: 'CHANDNI CHOWK ICON'
      },
      {
        id: 'dl2',
        sku: 'SWD-DLH-BTCK-02',
        name: 'Butter Chicken',
        price: 320,
        calories: 540,
        rating: 5.0,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=600',
        desc: 'The dish that conquered the world—Moti Mahal original. Tandoori chicken in a silky tomato-cream gravy with butter.',
        badge: 'WORLD FAMOUS'
      },
      {
        id: 'dl3',
        sku: 'SWD-DLH-DHLB-03',
        name: 'Dahi Bhalla',
        price: 120,
        calories: 300,
        rating: 4.8,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&q=80&w=600',
        desc: 'Soft lentil dumplings soaked in chilled sweetened curd, topped with chutneys, chaat masala, and crushed sev.',
        badge: 'CHAAT CLASSIC'
      }
    ]
  },
  {
    id: 'puducherry',
    name: 'Puducherry',
    nativeName: 'புதுச்சேரி',
    tagline: 'La Ville Blanche of Indian Flavors',
    kicker: 'FRENCH COLONIAL MEETS TAMIL SOUL',
    color: '#0a1030',
    textColor: '#e0e8ff',
    region: 'South India',
    specialties: ['Kadala Curry', 'Kothu Parotta', 'Pain Français', 'Payasam', 'Bouillabaisse Indienne'],
    chefNote: 'Pondichérien home cooks from the French Quarter and Tamil neighborhoods',
    heroImage: 'https://images.unsplash.com/photo-1583437230439-ded4b4d9a7c5?auto=format&fit=crop&q=80&w=1600',
    story: 'Puducherry is India\'s most unique culinary collision—three centuries of French occupation fused with Tamil, Telugu, and Malayalam coastal traditions.',
    traditionalCookingTitle: 'Promenade Beach, Ashrams, and Bonjour Tamil Nadu',
    traditionalCookingStory: 'The White Town of Puducherry preserves mustard-yellow colonial villas and Jesuit churches alongside Tamil Nadu\'s temple traditions. Cafes serve café au lait next to filter coffee.',
    traditionalImages: [
      'https://images.unsplash.com/photo-1583437230439-ded4b4d9a7c5?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=600'
    ],
    culinaryAlchemistTitle: 'Baguette and Banana Leaf',
    culinaryAlchemistStory: 'Bakeries in Puducherry produce crusty French baguettes delivered by bicycle—eaten alongside idli and sambhar from the same street cart, a living symbol of cultural harmony.',
    specialDishImage: 'https://images.unsplash.com/photo-1583437230439-ded4b4d9a7c5?auto=format&fit=crop&q=80&w=800',
    dishes: [
      {
        id: 'py1',
        sku: 'SWD-PDC-KTKP-01',
        name: 'Kothu Parotta',
        price: 160,
        calories: 480,
        rating: 4.8,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&q=80&w=600',
        desc: 'Shredded layered parotta tossed on a hot griddle with egg, onion, tomato, and spiced masala—street food theater.',
        badge: 'STREET SPECTACLE'
      },
      {
        id: 'py2',
        sku: 'SWD-PDC-FRKF-02',
        name: 'French-Style Filter Kaapi',
        price: 80,
        calories: 90,
        rating: 4.9,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600',
        desc: 'South Indian decoction brewed through a French press, served with warm milk and a light dusting of cacao—a Puducherry signature.',
        badge: 'COLONIAL FUSION'
      }
    ]
  },
  {
    id: 'ladakh',
    name: 'Ladakh',
    nativeName: 'ལ་དྭགས།',
    tagline: 'The Last Frontier of Flavor',
    kicker: 'WHERE THE MOUNTAINS MEET THE PLATE',
    color: '#0a1a2e',
    textColor: '#e0f2fe',
    region: 'North India',
    specialties: ['Thukpa', 'Skyu', 'Butter Tea', 'Tsampa', 'Momos'],
    chefNote: 'Ladakhi and Tibetan home cooks from Leh and Nubra Valley',
    heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1600',
    story: 'At 11,000 feet above sea level, Ladakhi cuisine is built for survival and celebration—warming barley-based dishes, yak butter tea, and hearty noodle soups forged in extreme altitude.',
    traditionalCookingTitle: 'Monasteries, Polo Grounds, and Desert Peaks',
    traditionalCookingStory: 'Ladakh sits at the confluence of Tibetan Buddhism, Central Asian trade routes, and Indian traditions. The Hemis Monastery festival and Losar New Year are living showcases of this heritage.',
    traditionalImages: [
      'https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&q=80&w=600'
    ],
    culinaryAlchemistTitle: 'Yak Butter and Barley',
    culinaryAlchemistStory: 'Ladakhi cooking centers on tsampa—roasted barley flour—and yak butter, two ingredients that provide maximum caloric density in the world\'s harshest inhabited terrain.',
    specialDishImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800',
    dishes: [
      {
        id: 'ld1',
        sku: 'SWD-LDK-SKYU-01',
        name: 'Skyu',
        price: 220,
        calories: 420,
        rating: 4.7,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600',
        desc: 'Ladakh\'s ancient pasta—hand-rolled wheat dough pieces slow-cooked with root vegetables and mutton in a warming, thick broth.',
        badge: 'HIGH ALTITUDE'
      },
      {
        id: 'ld2',
        sku: 'SWD-LDK-BTEA-02',
        name: 'Butter Tea (Po Cha)',
        price: 80,
        calories: 120,
        rating: 4.8,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600',
        desc: 'Traditional Tibetan-style salted tea churned with yak butter—rich, warming, and indispensable in cold mountain mornings.',
        badge: 'MONASTIC RITUAL'
      }
    ]
  },
  {
    id: 'chandigarh',
    name: 'Chandigarh',
    nativeName: 'ਚੰਡੀਗੜ੍ਹ',
    tagline: 'The City Beautiful at the Table',
    kicker: 'LE CORBUSIER\'S FINEST KITCHEN',
    color: '#1a0a2e',
    textColor: '#f3e8ff',
    region: 'North India',
    specialties: ['Amritsari Fish', 'Paneer Bhurji', 'Chur Chur Naan', 'Shahi Paneer'],
    chefNote: 'Punjab-Haryana fusion home cooks from Sector 17 and Elante',
    heroImage: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&q=80&w=1600',
    story: 'India\'s only union territory planned as a model city brings together the finest Punjabi and Haryanvi culinary traditions in a cosmopolitan setting.',
    traditionalCookingTitle: 'Rock Garden, Sukhna Lake, and Sector Chowks',
    traditionalCookingStory: 'Chandigarh\'s food scene is a curated mix of dhabas, fine-dining, and heritage Punjabi kitchens. The city\'s planned boulevards house some of North India\'s best street food.',
    traditionalImages: [
      'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&q=80&w=600'
    ],
    culinaryAlchemistTitle: 'Tandoor, Butter, and the Punjab Touch',
    culinaryAlchemistStory: 'Chandigarh kitchens execute Punjabi classics with an urban precision—fresh dairy, clay-oven breads, and a liberal hand with desi ghee.',
    specialDishImage: 'https://images.unsplash.com/photo-1574484284002-952d92a03a52?auto=format&fit=crop&q=80&w=800',
    dishes: [
      {
        id: 'ch1',
        sku: 'SWD-CHD-AMFS-01',
        name: 'Amritsari Fish Tikka',
        price: 340,
        calories: 410,
        rating: 4.8,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1574484284002-952d92a03a52?auto=format&fit=crop&q=80&w=600',
        desc: 'Fresh river fish marinated in ajwain-laced batter and fried to a crisp golden coat—Chandigarh\'s most beloved street starter.',
        badge: 'CITY ICON'
      },
      {
        id: 'ch2',
        sku: 'SWD-CHD-CCNN-02',
        name: 'Chur Chur Naan',
        price: 160,
        calories: 390,
        rating: 4.9,
        isVeg: true,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=600',
        desc: 'Crispy, crushed tandoor bread stuffed with spiced potato and paneer, served with dollops of white butter and pickle.',
        badge: 'SECTOR 22 SPECIAL'
      }
    ]
  },
  {
    id: 'lakshadweep',
    name: 'Lakshadweep',
    nativeName: 'ലക്ഷദ്വീപ്',
    tagline: 'Coral Island Seafood Traditions',
    kicker: 'THE OCEAN ON YOUR PLATE',
    color: '#022b3a',
    textColor: '#e0f7fa',
    region: 'South India',
    specialties: ['Tuna Curry', 'Octopus Masala', 'Coconut Rice', 'Kallumakkaya'],
    chefNote: 'Island home cooks from Kavaratti and Agatti',
    heroImage: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=1600',
    story: 'Lakshadweep\'s 36 coral islands host a cuisine shaped entirely by the ocean—fresh tuna, coconut, and Malabar spices converge in a culinary tradition found nowhere else.',
    traditionalCookingTitle: 'Lagoons, Coral Reefs, and Island Culture',
    traditionalCookingStory: 'The Lakshadweep islanders practice an ancient seafaring culture with deep Malabar and Arab influences. Every meal is a celebration of the sea\'s abundance.',
    traditionalImages: [
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1583437230439-ded4b4d9a7c5?auto=format&fit=crop&q=80&w=600'
    ],
    culinaryAlchemistTitle: 'Tuna, Coconut, and Malabar Spice',
    culinaryAlchemistStory: 'The staple protein of Lakshadweep is fresh skipjack tuna—dried, smoked, and curried with fresh coconut milk and curry leaves in preparations unique to the islands.',
    specialDishImage: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=800',
    dishes: [
      {
        id: 'lk1',
        sku: 'SWD-LKD-TNCY-01',
        name: 'Island Tuna Curry',
        price: 380,
        calories: 410,
        rating: 4.8,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1574484284002-952d92a03a52?auto=format&fit=crop&q=80&w=600',
        desc: 'Fresh skipjack tuna simmered in thick coconut milk with curry leaves, green chilli, and raw mango—the island\'s quintessential catch.',
        badge: 'REEF FRESH'
      },
      {
        id: 'lk2',
        sku: 'SWD-LKD-CCRC-02',
        name: 'Coconut Rice with Kallumakkaya',
        price: 280,
        calories: 460,
        rating: 4.7,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&q=80&w=600',
        desc: 'Fragrant coconut milk rice served with spicy Malabar mussels (kallumakkaya) roasted in chettinad masala—a rare island delicacy.',
        badge: 'ISLAND EXCLUSIVE'
      }
    ]
  },
  {
    id: 'daman-diu-dadra',
    name: 'D&NH and Daman & Diu',
    nativeName: 'દમણ & દીવ',
    tagline: 'Coastal Portuguese-Gujarati Fusion',
    kicker: 'WHERE GUJARAT MEETS THE SEA',
    color: '#1a2010',
    textColor: '#f0fdf4',
    region: 'West India',
    specialties: ['Sev Khamni', 'Prawn Masala', 'Chicken Cafreal', 'Bebinca'],
    chefNote: 'Coastal home cooks from Daman town and Silvassa',
    heroImage: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=1600',
    story: 'These union territories carry a distinct colonial identity—Portuguese-era recipes fused with Gujarati and Konkani techniques, producing a unique coastal hybrid cuisine.',
    traditionalCookingTitle: 'Fort Moti Daman, Sea Breeze, and Tribal Warli Art',
    traditionalCookingStory: 'The Daman coast blends Portuguese fort architecture with Gujarat\'s warmth, while Dadra\'s tribal Warli artists paint the cultural story of this quiet union territory.',
    traditionalImages: [
      'https://images.unsplash.com/photo-1583437230439-ded4b4d9a7c5?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=600'
    ],
    culinaryAlchemistTitle: 'Cashew Feni and Seafood Coals',
    culinaryAlchemistStory: 'Daman\'s seafood preparations use local cashew feni vinegar—a distilled liquor from cashew apples—to marinate and tenderize freshly caught prawns and pomfret.',
    specialDishImage: 'https://images.unsplash.com/photo-1583437230439-ded4b4d9a7c5?auto=format&fit=crop&q=80&w=800',
    dishes: [
      {
        id: 'dm1',
        sku: 'SWD-DMN-PRMS-01',
        name: 'Daman Prawn Masala',
        price: 360,
        calories: 440,
        rating: 4.7,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1574484284002-952d92a03a52?auto=format&fit=crop&q=80&w=600',
        desc: 'Tiger prawns cooked in a fiery coconut-tomato masala with feni vinegar and kokum—a coastal specialty unique to Daman.',
        badge: 'COASTAL HERITAGE'
      },
      {
        id: 'dm2',
        sku: 'SWD-DMN-CHCF-02',
        name: 'Chicken Cafreal',
        price: 320,
        calories: 490,
        rating: 4.8,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=600',
        desc: 'Portuguese-inspired chicken marinated in coriander-green chilli paste and grilled over coals—a colonial legacy on a plate.',
        badge: 'COLONIAL LEGACY'
      }
    ]
  },
  {
    id: 'andaman-nicobar',
    name: 'Andaman & Nicobar',
    nativeName: 'अंडमान और निकोबार',
    tagline: 'Islands of the Indian Ocean',
    kicker: 'THE FORGOTTEN SEAFOOD PARADISE',
    color: '#012a1a',
    textColor: '#e6fffa',
    region: 'South India',
    specialties: ['Coconut Prawn Curry', 'Fish Tikka', 'Ambarella Chutney', 'Sea Lobster'],
    chefNote: 'Bengali settler and indigenous Andamanese home cooks from Port Blair',
    heroImage: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=1600',
    story: 'The Andaman & Nicobar Islands host a unique blend of Bengali, Tamil, and indigenous Andamanese food traditions shaped by the rich biodiversity of the Indian Ocean.',
    traditionalCookingTitle: 'Cellular Jail, Coral Reefs, and Sunrise Beaches',
    traditionalCookingStory: 'Once a penal colony, now a biodiversity hotspot—the Andamans carry the cultural imprints of its settler communities who transformed these islands into a living tapestry of cuisines.',
    traditionalImages: [
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1583437230439-ded4b4d9a7c5?auto=format&fit=crop&q=80&w=600'
    ],
    culinaryAlchemistTitle: 'Ocean-Fresh and Coconut-Rich',
    culinaryAlchemistStory: 'Andamanese cooking privileges freshness above all—lobsters, crab, and reef fish caught in the morning reach the plate by afternoon. Coconut milk and South Indian tempering define the flavor profile.',
    specialDishImage: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=800',
    dishes: [
      {
        id: 'an1',
        sku: 'SWD-AND-CNPC-01',
        name: 'Coconut Prawn Curry',
        price: 420,
        calories: 470,
        rating: 4.9,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1574484284002-952d92a03a52?auto=format&fit=crop&q=80&w=600',
        desc: 'Island-fresh tiger prawns cooked in a thick, aromatic coconut milk curry with curry leaves and Andaman spice blend.',
        badge: 'ISLAND CATCH'
      },
      {
        id: 'an2',
        sku: 'SWD-AND-SLBR-02',
        name: 'Grilled Sea Lobster',
        price: 890,
        calories: 380,
        rating: 5.0,
        isVeg: false,
        image: 'https://images.unsplash.com/photo-1574484284002-952d92a03a52?auto=format&fit=crop&q=80&w=600',
        desc: 'Fresh Andaman lobster grilled over coconut charcoal, basted with garlic butter and lemon—pure, unrivalled ocean luxury.',
        badge: 'REEF LUXURY'
      }
    ]
  }
];