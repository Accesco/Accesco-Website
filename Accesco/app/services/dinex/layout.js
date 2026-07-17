import DineXLayoutClient from './layout-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'DineX | Restaurant Reservations by Accesco Living',
  description:
    'Reserve tables and discover premium dining experiences with DineX by Accesco Living.',
  openGraph: {
    title: 'DineX | Restaurant Reservations by Accesco Living',
    description:
      'Premium restaurant reservations, curated dining experiences and exclusive table bookings with DineX.',
  },
};

export default function DineXLayout({ children }) {
  return <DineXLayoutClient>{children}</DineXLayoutClient>;
}