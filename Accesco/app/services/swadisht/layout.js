import SwadishttLayoutClient from './layout-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Swadishtt | Food Delivery',
  description:
    'Order food with Swadishtt by Accesco Living. Discover restaurants, regional cuisines, thali experiences, catering and curated meal discovery.',
  alternates: {
    canonical: 'https://accescoliving.com/services/swadisht',
  },
  openGraph: {
    title: 'Swadishtt | Food Delivery by Accesco Living',
    description:
      'Order food with Swadishtt by Accesco Living. Discover restaurants, regional cuisines, thali experiences, catering and curated meal discovery.',
    url: 'https://accescoliving.com/services/swadisht',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Swadishtt | Food Delivery by Accesco Living',
    description:
      'Order food with Swadishtt by Accesco Living. Discover restaurants, regional cuisines, thali experiences, catering and curated meal discovery.',
  },
};

export default function SwadishttLayout({ children }) {
  return <SwadishttLayoutClient>{children}</SwadishttLayoutClient>;
}