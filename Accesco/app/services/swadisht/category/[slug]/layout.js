const CATEGORY_MAP = {
  biryani: {
    title: 'Biryani Feast',
    desc: 'Fragrant, slow-cooked rice dishes layered with premium meat, saffron, and traditional spices.',
  },
  burgers: {
    title: 'Gourmet Craft Burgers',
    desc: 'Juicy layered patties, melted cheese slices, crunchy lettuce, and artisanal fast-food favorites.',
  },
  pizza: {
    title: 'Artisanal Wood-Fired Pizza',
    desc: 'Neapolitan-style hand-stretched pizzas topped with fresh mozzarella, basil, and choice toppings.',
  },
  'south-indian': {
    title: 'South Indian Heritage',
    desc: 'Crispy ghee dosas, fluffy steamed idlis, filter coffee, and comforting breakfast classics.',
  },
  'north-indian': {
    title: 'North Indian Clay Oven',
    desc: 'Rich buttery gravies, slow-cooked dal makhani, tender paneer, and clay-oven tandoori breads.',
  },
  beverages: {
    title: 'Cold Brews & Beverages',
    desc: 'Premium roasted coffees, thick milkshakes, and refreshing cold drinks to complement your meal.',
  },
  desserts: {
    title: 'Desserts & Sweets',
    desc: 'Decadent chocolate cakes, traditional Indian sweets, rich ice creams, and delightful indulgences.',
  },
  'healthy-bowl': {
    title: 'Wholesome Healthy Bowls',
    desc: 'Nutrient-rich grain bowls, fresh artisanal salads, and high-protein power meals.',
  },
  sushi: {
    title: 'Premium Sushi & Pan-Asian',
    desc: 'Freshly rolled sushi, authentic dim sum, and flavorful wok-tossed Asian delicacies.',
  },
  'street-food': {
    title: 'Indian Street Chaat',
    desc: 'Tangy golgappas, crispy aloo tikki, pav bhaji, and authentic roadside flavor explosions.',
  }
};

export async function generateMetadata({ params }) {
  const slug = params.slug;
  const category = CATEGORY_MAP[slug];
  
  if (!category) {
    return {
      title: "Cuisine Category | Swadisht",
      description: "Explore and order from various cuisine categories, meals and chef specialties on Swadisht.",
    };
  }

  return {
    title: `${category.title} | Swadisht by Accesco`,
    description: category.desc,
    alternates: {
      canonical: `https://accescoliving.com/services/swadisht/category/${slug}`,
    },
    openGraph: {
      title: `${category.title} | Swadisht by Accesco`,
      description: category.desc,
      url: `https://accescoliving.com/services/swadisht/category/${slug}`,
      type: 'website',
    }
  };
}

export default function Layout({ children }) {
  return <>{children}</>;
}
