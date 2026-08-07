import SwadishttLayoutClient from './layout-client';
import WaitlistGate from '../../components/WaitlistGate';

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

import { caveat, nunito, nunitoSans, playfairDisplay, plusJakartaSans } from '@/app/fonts';

export default function SwadishttLayout({ children }) {
  return (
    <WaitlistGate>
      <div className={`${caveat.variable} ${nunito.variable} ${nunitoSans.variable} ${playfairDisplay.variable} ${plusJakartaSans.variable}`}>
        <SwadishttLayoutClient>{children}</SwadishttLayoutClient>
      </div>
    </WaitlistGate>
  );
}