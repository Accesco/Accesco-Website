import { dmSerifDisplay, baloo2 } from '@/app/fonts';

export const metadata = {
  title: "Instant Catering Services | Swadisht",
  description: "Order bulk party food, custom platters and thalis with same-day instant catering from Swadisht.",
  alternates: {
    canonical: 'https://accescoliving.com/services/swadisht/instant-catering',
  },
};

export default function Layout({ children }) {
  return <div className={`${dmSerifDisplay.variable} ${baloo2.variable}`}>{children}</div>;
}
