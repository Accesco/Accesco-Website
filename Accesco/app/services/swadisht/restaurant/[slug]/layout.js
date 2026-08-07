import { RESTAURANTS } from '../../lib/swadishttData';

export async function generateMetadata({ params }) {
  const slug = params.slug;
  const restaurant = RESTAURANTS.find(r => r.id === slug);
  
  if (!restaurant) {
    return {
      title: "Restaurant | Swadisht",
      description: "Explore menu cards, chef specials and customer reviews for top cloud kitchens and restaurants.",
    };
  }

  const desc = `${restaurant.name} in ${restaurant.area}. ${restaurant.cuisine.join(', ')}. ${restaurant.tags?.join(', ')}`;

  return {
    title: `${restaurant.name} | Swadisht by Accesco`,
    description: desc,
    alternates: {
      canonical: `https://accescoliving.com/services/swadisht/restaurant/${slug}`,
    },
    openGraph: {
      title: `${restaurant.name} | Swadisht by Accesco`,
      description: desc,
      url: `https://accescoliving.com/services/swadisht/restaurant/${slug}`,
      type: 'restaurant',
      images: [
        {
          url: restaurant.image,
          alt: restaurant.name,
        }
      ]
    }
  };
}

export default function Layout({ children }) {
  return <>{children}</>;
}
