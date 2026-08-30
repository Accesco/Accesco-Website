import { RESTAURANTS } from '../../lib/swadishttData';

export async function generateMetadata({ params }) {
  // `await` works whether params is a promise (Next 15) or a plain object (Next 14).
  const { slug } = await params;

  // Match on slug first, then fall back to id — ids are Numbers in the data,
  // so they must be stringified before comparing to a route param.
  const restaurant = RESTAURANTS.find(
    (r) => r.slug === slug || String(r.id) === slug
  );

  if (!restaurant) {
    return {
      title: 'Restaurant | Swadisht',
      description:
        'Explore menu cards, chef specials and customer reviews for top cloud kitchens and restaurants.',
    };
  }

  const area = restaurant.location?.area;
  const city = restaurant.location?.city;
  const place = [area, city].filter(Boolean).join(', ');
  const cuisines = (restaurant.cuisines || []).join(', ');

  const desc = [
    place ? `${restaurant.name} in ${place}.` : `${restaurant.name}.`,
    cuisines,
    restaurant.deliveryTime ? `Delivered in ${restaurant.deliveryTime}.` : null,
    restaurant.priceForTwo ? `₹${restaurant.priceForTwo} for two.` : null,
  ]
    .filter(Boolean)
    .join(' ');

  const url = `https://accescoliving.com/services/swadisht/restaurant/${restaurant.slug || slug}`;
  const image = restaurant.coverImage || restaurant.logoImage;

  return {
    title: `${restaurant.name} | Swadisht by Accesco`,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: `${restaurant.name} | Swadisht by Accesco`,
      description: desc,
      url,
      type: 'website', // 'restaurant' is not a valid Open Graph type in Next's metadata API
      images: image ? [{ url: image, alt: restaurant.name }] : undefined,
    },
  };
}

/**
 * Optional: pre-render every restaurant at build time instead of on demand.
 * Uncomment if you want these pages static.
 *
 * export function generateStaticParams() {
 *   return RESTAURANTS.filter((r) => r.slug).map((r) => ({ slug: r.slug }));
 * }
 */

export default function Layout({ children }) {
  return <>{children}</>;
}