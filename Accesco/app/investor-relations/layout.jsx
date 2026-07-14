export const metadata = {
  title: "Investor Relations | Accesco Living",
  description: "Investor relations, funding updates, and company information for Accesco Living Private Limited — India's intelligent circular commerce ecosystem.",
  alternates: {
    canonical: 'https://accescoliving.com/investor-relations',
  },
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}