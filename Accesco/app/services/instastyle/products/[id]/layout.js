import { getProductById } from "@/lib/mockData";

export async function generateMetadata({ params }) {
  const id = params.id;
  const product = getProductById(id);

  if (!product) {
    return {
      title: `Product Details | InstaStyle - ACCESCO Living`,
      description: 'View product details, select size and color, and add to cart for 15-20 minute delivery.',
    };
  }

  const title = `${product.name} | InstaStyle - ACCESCO Living`;
  const desc = `Buy ${product.name} for ${product.price}. ${product.description.slice(0, 100)}...`;

  return {
    title: title,
    description: desc,
    alternates: {
      canonical: `https://accescoliving.com/services/instastyle/products/${id}`,
    },
    openGraph: {
      title: title,
      description: desc,
      url: `https://accescoliving.com/services/instastyle/products/${id}`,
      type: 'product',
      images: [
        {
          url: product.image,
          alt: product.name,
        }
      ]
    }
  };
}

export default function ProductLayout({ children }) {
  return children;
}
