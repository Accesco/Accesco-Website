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
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "FAQPage",
        "mainEntity": [{
          "@type": "Question",
          "name": "What is Accesco Living?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Accesco Living is a circular ecosystem platform that connects consumers directly with manufacturers and farm chains, offering groceries, food, and fashion at affordable prices through quick commerce."
          }
        },{
          "@type": "Question",
          "name": "How does Accesco Living offer cheaper prices?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "By sourcing directly from manufacturers and farms, we eliminate middlemen passing the cost savings straight to you."
          }
        },{
          "@type": "Question",
          "name": "What products can I buy on Accesco Living?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We offer a curated range across three categories Grocery, Food, and Fashion  all personalised to your preferences and needs."
          }
        },{
          "@type": "Question",
          "name": "What makes Accesco Living different from other quick commerce apps?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Unlike regular delivery apps, Accesco Living integrates curation, personalisation, and sustainability into one circular ecosystem  from farm to doorstep to waste pickup."
          }
        },{
          "@type": "Question",
          "name": "How does the waste return program work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Simply hand back your waste materials to our delivery partner. We collect it directly from your door and credit your account with redeemable points."
          }
        },{
          "@type": "Question",
          "name": "What can I do with my redeemable points?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Your points can be used for discounts on future orders  making sustainability rewarding for you and the planet."
          }
        },{
          "@type": "Question",
          "name": "What is the Personalised Budget feature?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Accesco Living creates a custom monthly budget plan based on your income and spending capacity, ensuring you never overspend on essentials like groceries, food, and fashion."
          }
        },{
          "@type": "Question",
          "name": "Will Accesco Living suggest products I can actually afford?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Every product recommendation is budget-aligned meaning you only see items that fit your personalised spending plan, removing decision fatigue and financial stress."
          }
        },{
          "@type": "Question",
          "name": "Is my financial data safe with Accesco Living?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. Your income and budget data is encrypted and used solely to enhance your personalised shopping experience never shared with third parties."
          }
        },{
          "@type": "Question",
          "name": "Can I update my budget preferences over time?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Your budget plan is dynamic  you can update your income or spending limits anytime, and recommendations will adjust in real time."
          }
        }]
      }
    ]
  }
  return (
    <html lang="en">
      <head>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Updated Font Links with Variable Axes (wght 400..900) */}
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
