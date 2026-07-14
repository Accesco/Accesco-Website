import LocalMedsLayoutClient from './layout-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'LocalMeds | Pharmacy Delivery',
  description:
    'Order medicines, healthcare essentials, consultations and lab services with LocalMeds by Accesco Living.',
  alternates: {
    canonical: 'https://accescoliving.com/services/localmeds',
  },
  openGraph: {
    title: 'LocalMeds | Pharmacy Delivery by Accesco Living',
    description:
      'Medicine delivery, healthcare access, consultations and lab services delivered quickly with LocalMeds.',
    url: 'https://accescoliving.com/services/localmeds',
  },
};

export default function LocalMedsLayout({ children }) {
  return <LocalMedsLayoutClient>{children}</LocalMedsLayoutClient>;
}