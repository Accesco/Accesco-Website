import SwadishttCafeLayoutClient from './layout-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Swadishtt Cafe | Cafe Experiences by Accesco Living',
  description:
    'Explore artisan coffee, beverages, baked goods and curated cafe experiences with Swadishtt Cafe.',
  openGraph: {
    title: 'Swadishtt Cafe | Cafe Experiences by Accesco Living',
    description:
      'Cafe experiences featuring artisan coffee, baked goods, beverages and curated cafe dining.',
  },
};

export default function SwadishttCafeLayout({ children }) {
  return <SwadishttCafeLayoutClient>{children}</SwadishttCafeLayoutClient>;
}