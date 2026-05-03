export const metadata = {
  title: "Company Investor Relations",
  description: "Investor Relations website for a modern listed company",
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}