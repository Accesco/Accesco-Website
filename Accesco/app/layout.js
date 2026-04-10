import Script from 'next/script';
import './globals.css';
import { AuthProvider } from './components/AuthProvider';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: "Accesco Living | India's Intelligent Circular Commerce Ecosystem",
    template: "%s | Accesco Living",
  },
  description: "Accesco Living is India's first intelligent circular commerce ecosystem — delivering fresh groceries via Grokly, food via Swadishtt, and instant fashion via InstaStyle. One app. One cart. Bengaluru, India.",
  icons: {
    icon: '/images/ac-logo.png',
    shortcut: '/images/ac-logo.png',
    apple: '/images/ac-logo.png',
  },
  openGraph: {
    title: "Accesco Living | India's First Intelligence Commerce Ecosystem",
    description: "Groceries, fashion, food, finance & more — all in one intelligent ecosystem. Bengaluru, India.",
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
    card: 'summary',
    title: "Accesco Living | India's Intelligence Commerce Ecosystem",
    description: "Groceries, fashion, food, finance & more — all in one intelligent ecosystem.",
    images: ['/images/ac-logo.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@400;600;700;800&display=swap" 
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
        <link 
    href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;700;900&display=swap" 
    rel="stylesheet" 
  />
  <link 
    href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700;900&display=swap" 
    rel="stylesheet" 
  />
      </head>
      <body>
        <AuthProvider>
        {children}
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
