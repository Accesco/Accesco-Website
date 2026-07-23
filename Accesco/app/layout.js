import Script from 'next/script';
import localFont from 'next/font/local';
import { spaceGrotesk } from '@/app/fonts';
import './globals.css';
import { AuthProvider } from './components/AuthProvider';
import AuthGate from './components/AuthGate';
import CookieConsent from './components/CookieConsent';
import ReferralCapture from './components/ReferralCapture';
import JsonLd from '@/components/JsonLd';
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd';

// Self-hosted from Google Fonts (public/fonts/) — see app/fonts.js for why.
const sora = localFont({
  src: '../public/fonts/sora-variable.woff2',
  weight: '300 800',
  display: 'swap',
  variable: '--font-sora',
  adjustFontFallback: false,
});

const dmSans = localFont({
  src: '../public/fonts/dm-sans-variable.woff2',
  weight: '400 700',
  display: 'swap',
  variable: '--font-dm-sans',
  adjustFontFallback: false,
});

const inter = localFont({
  src: '../public/fonts/inter-variable.woff2',
  weight: '400 700',
  display: 'swap',
  variable: '--font-inter',
  adjustFontFallback: false,
});

export const metadata = {
  metadataBase: new URL('https://accescoliving.com'),

  alternates: {
    canonical: '/',
  },

  title: {
    default: 'Accesco Living – Grocery, Food & Fashion Delivery',
    template: "%s | Accesco Living",
  },

  description:
    "Groceries, food, and fashion delivered fast from one intelligent app. Join Accesco Living's waitlist for early access and launch perks.",

  icons: {
    icon: '/images/ac-logo.png',
    shortcut: '/images/ac-logo.png',
    apple: '/images/ac-logo.png',
  },

  openGraph: {
    title: "Accesco Living | India's First Intelligence Commerce Ecosystem",
    description:
      "Groceries, fashion, food, finance & more — all in one intelligent ecosystem. Bengaluru, India.",
    url: 'https://accescoliving.com/',
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
    "url": "https://accescoliving.com",
    "logo": "https://accescoliving.com/images/ac-logo.png",
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
      "url": "https://accescoliving.com/contact",
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
    "url": "https://accescoliving.com",
  };



  return (
    <html lang="en" className={`${sora.variable} ${dmSans.variable} ${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        {/* Structured Data for SEO */}
        <JsonLd data={[organizationSchema, websiteSchema]} />
      </head>

      <body>
        <AuthProvider>
  <BreadcrumbJsonLd />
  <ReferralCapture />

  {children}
  <CookieConsent />

</AuthProvider>

        {/* RemixIcon loaded lazily — only needed for a few social icons */}
        <Script id="load-remixicon" strategy="lazyOnload">
          {`
            (function () {
              var link = document.createElement('link');
              link.rel = 'stylesheet';
              link.href = 'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css';
              document.head.appendChild(link);
            })();
          `}
        </Script>

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

