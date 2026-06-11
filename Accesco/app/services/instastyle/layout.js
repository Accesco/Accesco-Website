import InstaStyleLayoutClient from './layout-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'InstaStyle | Fashion Delivery by Accesco Living',
  description:
    'Shop trending fashion, apparel, accessories and lifestyle products with InstaStyle by Accesco Living.',
  openGraph: {
    title: 'InstaStyle | Fashion Delivery by Accesco Living',
    description:
      'Discover fashion, apparel, accessories and lifestyle products with InstaStyle.',
  },
};

export default function InstaStyleLayout({ children }) {
  return <InstaStyleLayoutClient>{children}</InstaStyleLayoutClient>;
}