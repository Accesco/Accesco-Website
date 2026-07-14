export const metadata = {
  title: "Privacy Policy",
  description: "Read the Accesco Living Privacy Policy to understand how we collect, use, and protect your personal information across all our service verticals.",
  alternates: {
    canonical: 'https://accescoliving.com/privacy',
  },
};

import "../terms/style.css";

export default function PrivacyLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
}
