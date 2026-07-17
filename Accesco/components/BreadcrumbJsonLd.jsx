'use client';

import { usePathname } from 'next/navigation';


const BASE_URL = 'https://www.accescoliving.com';

const nameMap = {
  services: 'Services',
  grokly: 'Grokly',
  swadisht: 'Swadishtt',
  instastyle: 'InstaStyle',
  dinex: 'DineX',
  localmeds: 'LocalMeds',
  'swadisht-cafe': 'Swadishtt Cafe',
};

export default function BreadcrumbJsonLd() {
  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  const itemListElement = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: BASE_URL,
    },
    ...segments.map((segment, index) => {
      const path = '/' + segments.slice(0, index + 1).join('/');

      return {
        '@type': 'ListItem',
        position: index + 2,
        name:
          nameMap[segment] ||
          segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
        item: `${BASE_URL}${path}`,
      };
    }),
  ];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };

  return (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
  />
);
}