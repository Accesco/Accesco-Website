'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { GA_MEASUREMENT_ID, pageview } from '@/lib/gtag';

function GoogleAnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return;
    const url = pathname + (window.location.search || '');
    pageview(url);
  }, [pathname]);

  return null;
}

export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return <GoogleAnalyticsTracker />;
}
