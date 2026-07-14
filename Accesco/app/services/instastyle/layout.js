import InstaStyleLayoutClient from './layout-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'InstaStyle | Fashion Delivery',
  description:
    'Shop trending fashion, apparel, accessories and lifestyle products with InstaStyle by Accesco Living.',
  alternates: {
    canonical: 'https://accescoliving.com/services/instastyle',
  },
  openGraph: {
    title: 'InstaStyle | Fashion Delivery by Accesco Living',
    description:
      'Shop trending fashion, apparel, accessories and lifestyle products with InstaStyle by Accesco Living.',
    url: 'https://accescoliving.com/services/instastyle',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InstaStyle | Fashion Delivery by Accesco Living',
    description:
      'Shop trending fashion, apparel, accessories and lifestyle products with InstaStyle by Accesco Living.',
  },
};

export default function InstaStyleLayout({ children }) {
  return <InstaStyleLayoutClient>{children}</InstaStyleLayoutClient>;
}