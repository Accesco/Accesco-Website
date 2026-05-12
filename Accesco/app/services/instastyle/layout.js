import { CartProvider } from '@/contexts/CartContext';
import InstaStyleHeader from '@/components/instastyle/InstaStyleHeader';
import InstaStyleFooter from '@/components/instastyle/InstaStyleFooter';
import CartDrawer from '@/components/instastyle/CartDrawer';
import './instastyle-shell.css';

export const metadata = {
  title: "InstaStyle | The Editorial Curation",
  description: "A meticulously curated boutique experience. Discover artisanal labels, premium craftsmanship, and a circular fashion ecosystem designed for the modern connoisseur.",
};

export default function Layout({ children }) {
  return (
    <div className="instastyle-root">
      <CartProvider>
        <InstaStyleHeader />
        <CartDrawer />
        <div className="instastyle-content-wrapper">
          {children}
        </div>
        <InstaStyleFooter />
      </CartProvider>
    </div>
  );
}
