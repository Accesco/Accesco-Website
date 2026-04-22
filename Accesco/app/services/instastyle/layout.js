import { CartProvider } from '@/contexts/CartContext';
import InstaStyleHeader from '@/components/instastyle/InstaStyleHeader';
import InstaStyleFooter from '@/components/instastyle/InstaStyleFooter';
import './instastyle-shell.css';

export const metadata = {
  title: "InstaStyle | Fashion Delivered in 15-20 Minutes",
  description: "Shop InstaStyle for instant fashion delivery in 15-20 minutes. Try before you buy at your doorstep, virtual try-on, thrift marketplace and a Reverse Fashion Loop.",
};

export default function Layout({ children }) {
  return (
    <div className="instastyle-root">
      <CartProvider>
        <InstaStyleHeader />
        <div className="instastyle-content-wrapper">
          {children}
        </div>
        <InstaStyleFooter />
      </CartProvider>
    </div>
  );
}
