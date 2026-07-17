export const metadata = {
  title: "Grokly | Fresh Groceries Delivered Direct from Karnataka Farms",
  description:
    "Order fresh groceries with Grokly by Accesco Living. Farm-direct sourcing via FarmChain, live QR traceability, and 20-30% lower prices. Serving Bengaluru.",

  openGraph: {
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
