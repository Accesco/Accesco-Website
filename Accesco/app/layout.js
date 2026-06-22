import Script from 'next/script';
import './globals.css';
import { AuthProvider } from './components/AuthProvider';
import CookieConsent from './components/CookieConsent';
import JsonLd from '@/components/JsonLd';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';
export const metadata = {
  metadataBase: new URL('https://www.accescoliving.com'),

  alternates: {
    canonical: '/',
  },

  title: {
    default: "Accesco Living | India's Intelligent Circular Commerce Ecosystem",
    template: "%s | Accesco Living",
  },

  description:
    "India’s intelligent commerce ecosystem for groceries, food, fashion, and finance — all in one unified platform.",

  icons: {
    icon: '/images/ac-logo.png',
    shortcut: '/images/ac-logo.png',
    apple: '/images/ac-logo.png',
  },

  openGraph: {
    title: "Accesco Living | India's First Intelligence Commerce Ecosystem",
    description:
      "Groceries, fashion, food, finance & more — all in one intelligent ecosystem. Bengaluru, India.",
    images: [
      {
        url: '/images/ac-logo.png',
        width: 800,
        height: 800,
        alt: 'Accesco Living Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
    siteName: 'Accesco Living',
  },

  twitter: {
    card: 'summary_large_image',
    images: ['/images/ac-logo.png'],
    title: "Accesco Living | India's Intelligence Commerce Ecosystem",
    description:
      "Groceries, fashion, food, finance & more — all in one intelligent ecosystem.",
  },
};

export default function RootLayout({ children }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Accesco Living",
    "legalName": "Accesco Living Private Limited",
    "url": "https://www.accescoliving.com",
    "logo": "https://www.accescoliving.com/images/ac-logo.png",
    "description":
      "India's first intelligent circular commerce ecosystem delivering groceries, food, fashion, and financial intelligence under one unified platform.",
    "foundingDate": "2025",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bengaluru",
      "addressRegion": "Karnataka",
      "addressCountry": "IN",
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "telephone": "+91-99727-06940",
      "url": "https://www.accescoliving.com/contact",
      "areaServed": "IN",
      "availableLanguage": ["en", "hi"],
    },
    "sameAs": [
      "https://twitter.com/accescoliving",
      "https://www.instagram.com/accescostore?utm_source=qr",
      "https://www.linkedin.com/company/accesco-living/",
      "https://facebook.com/accescoliving",
      "https://youtube.com/@accescoliving",
      "https://threads.net/@accescoliving",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Accesco Living",
    "url": "https://www.accescoliving.com",
  };

  return (
    <html lang="en">
      <head>
        {/* Structured Data for SEO */}
        <JsonLd data={[organizationSchema, websiteSchema]} />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@300..800&family=DM+Sans:wght@400;500;700&family=Inter:wght@400..700&display=swap"
          rel="stylesheet"
        />

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />

        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css"
        />
      </head>

      <body>
        <AuthProvider>
          <BreadcrumbJsonLd />
          {children}
          <CookieConsent />
        </AuthProvider>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-SH32KGLK5F"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SH32KGLK5F');
          `}
        </Script>

        <Script
          src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}