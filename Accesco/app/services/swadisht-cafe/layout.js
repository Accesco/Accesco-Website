import SwadishttCafeLayoutClient from './layout-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Swadishtt Cafe | Cafe Experiences',
  description:
    'Explore artisan coffee, beverages, baked goods and curated cafe experiences with Swadishtt Cafe.',
  alternates: {
    canonical: 'https://accescoliving.com/services/swadisht-cafe',
  },
  openGraph: {
    title: 'Swadishtt Cafe | Cafe Experiences by Accesco Living',
    description:
      'Cafe experiences featuring artisan coffee, baked goods, beverages and curated cafe dining.',
    url: 'https://accescoliving.com/services/swadisht-cafe',
  },
};

export default function SwadishttCafeLayout({ children }) {
  return <SwadishttCafeLayoutClient>{children}</SwadishttCafeLayoutClient>;
}