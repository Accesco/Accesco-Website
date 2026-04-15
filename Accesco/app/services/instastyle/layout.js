import { CartProvider } from '@/contexts/CartContext';
import CartDrawer from '@/components/instastyle/CartDrawer';
import CartBadge from '@/components/instastyle/CartBadge';
import InstaStyleHeader from '@/components/instastyle/InstaStyleHeader';
import InstaStyleFooter from '@/components/instastyle/InstaStyleFooter';
import SmoothScroll from '@/components/instastyle/SmoothScroll';
import CustomCursor from '@/components/instastyle/CustomCursor';
import './instastyle-shell.css';

export const metadata = {
  title: "InstaStyle | Fashion Delivered in 15-20 Minutes",
  description: "Shop InstaStyle for instant fashion delivery in 15-20 minutes. Try before you buy at your doorstep, virtual try-on, thrift marketplace and a Reverse Fashion Loop.",
};

export default function Layout({ children }) {
  return (
    <CartProvider>
      <SmoothScroll>
        <div style={{ background: '#FFFFFF', minHeight: '100vh', width: '100%' }}>
          <CustomCursor />
          <InstaStyleHeader />

          <main>
            {children}
          </main>
          <InstaStyleFooter />
          <CartDrawer />
          <CartBadge />
        </div>
      </SmoothScroll>
    </CartProvider>
  );
}
