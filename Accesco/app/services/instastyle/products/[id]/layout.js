export async function generateMetadata({ params }) {
  // In production, fetch product data here
  return {
    title: `Product Details | InstaStyle - ACCESCO Living`,
    description: 'View product details, select size and color, and add to cart for 15-20 minute delivery.',
  };
}

export default function ProductLayout({ children }) {
  return children;
}
