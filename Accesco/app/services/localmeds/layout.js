import LocalMedsLayoutClient from './layout-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'LocalMeds | Pharmacy Delivery by Accesco Living',
  description:
    'Order medicines, healthcare essentials, consultations and lab services with LocalMeds by Accesco Living.',
  openGraph: {
    title: 'LocalMeds | Pharmacy Delivery by Accesco Living',
    description:
      'Medicine delivery, healthcare access, consultations and lab services delivered quickly with LocalMeds.',
  },
};

export default function LocalMedsLayout({ children }) {
  return <LocalMedsLayoutClient>{children}</LocalMedsLayoutClient>;
}