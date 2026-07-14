export const metadata = {
  title: "Grokly | Farm-Fresh Groceries in Bengaluru",
  description:
    "Order fresh groceries with Grokly by Accesco Living. Farm-direct sourcing via FarmChain, live QR traceability, and 20-30% lower prices. Serving Bengaluru.",

  alternates: {
    canonical: 'https://accescoliving.com/services/grokly',
  },

  openGraph: {
    title: "Grokly | Fresh Groceries Delivered Direct from Karnataka Farms",
    description:
      "Order fresh groceries with Grokly by Accesco Living. Farm-direct sourcing via FarmChain, live QR traceability, and 20-30% lower prices. Serving Bengaluru.",
    url: 'https://accescoliving.com/services/grokly',
  },

  twitter: {
    card: 'summary_large_image',
    title: "Grokly | Fresh Groceries Delivered Direct from Karnataka Farms",
    description:
      "Order fresh groceries with Grokly by Accesco Living. Farm-direct sourcing via FarmChain, live QR traceability, and 20-30% lower prices. Serving Bengaluru.",
  },
};

import GroklyLayoutClient from './layout-client';

export default function Layout({ children }) {
  return (
    <GroklyLayoutClient>
      {children}
    </GroklyLayoutClient>
  );
}
