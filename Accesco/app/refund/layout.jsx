export const metadata = {
  title: "Cancellation & Refund Policy",
  description: "Read the Accesco Living Cancellation and Refund Policy to understand rules on cancellations, refunds, returns and timelines across our service verticals.",
  alternates: {
    canonical: 'https://accescoliving.com/refund',
  },
};

import "../terms/style.css";

export default function RefundLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
}
