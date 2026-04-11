import { CartProvider } from '@/contexts/CartContext';
import CartDrawer from '@/components/instastyle/CartDrawer';
import CartBadge from '@/components/instastyle/CartBadge';
import InstaStyleHeader from '@/components/instastyle/InstaStyleHeader';
import InstaStyleFooter from '@/components/instastyle/InstaStyleFooter';
import './instastyle-shell.css';

export const metadata = {
  title: "InstaStyle | Fashion Delivered in 15-20 Minutes",
  description: "Shop InstaStyle for instant fashion delivery in 15-20 minutes. Try before you buy at your doorstep, virtual try-on, thrift marketplace and a Reverse Fashion Loop.",
};

export default function Layout({ children }) {
  return (
    <CartProvider>
      <div style={{ minHeight: '100vh', background: '#0d0a08' }}>
        <InstaStyleHeader />

        <main style={{ minHeight: '60vh', background: '#0d0a08' }}>
          {children}
        </main>
        <InstaStyleFooter />
        <CartDrawer />
        <CartBadge />
      </div>
    </CartProvider>
  );
}
