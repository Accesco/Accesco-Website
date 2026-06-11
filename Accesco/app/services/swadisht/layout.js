import SwadishttLayoutClient from './layout-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Swadishtt | Food Delivery by Accesco Living',
  description:
    'Order food with Swadishtt by Accesco Living. Discover restaurants, regional cuisines, thali experiences, catering and curated meal discovery.',
  openGraph: {
    title: 'Swadishtt | Food Delivery by Accesco Living',
    description:
      'Discover restaurants, regional cuisines, thali experiences, catering and curated meal discovery with Swadishtt.',
  },
};

export default function SwadishttLayout({ children }) {
  return <SwadishttLayoutClient>{children}</SwadishttLayoutClient>;
}