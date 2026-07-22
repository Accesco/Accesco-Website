import dynamic from 'next/dynamic';
const InstaStyleClient = dynamic(() => import('./InstaStyleClient'));
import { categories, products } from '@/lib/mockData';

export default function InstaStylePage() {
  const featuredIds = [
    'prod_027', // Premium Hoodie
    'prod_039', // Sleek Wool Overcoat
    'prod_038', // Handcrafted Chelsea Boots
    'prod_037', // Minimalist Leather Backpack
    'prod_029', // Chunky Platform Sneakers
    'prod_023', // Structured Tote Bag
    'prod_016', // Urban Aviator Sunglasses
    'prod_045', // Minimalist Leather Cardholder
  ];
  
  const featuredProducts = featuredIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 4);
    
  const brandSet = Array.from(new Set(products.map(p => p.brand))).slice(0, 8);
  
  const categoryImages = {
    men: 'https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg?w=800&h=1000&fit=crop',
    women: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?w=800&h=1000&fit=crop',
    kids: 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?w=800&h=1000&fit=crop',
    accessories: 'https://images.pexels.com/photos/915915/pexels-photo-915915.jpeg?w=800&h=1000&fit=crop'
  };

  const categoryCards = categories.map(cat => {
    const catProducts = products.filter(p => p.category === cat.id);
    return {
      id: cat.id,
      name: cat.name,
      image: categoryImages[cat.id] || (catProducts[0]?.images?.[0]?.url || ''),
      count: catProducts.length,
    };
  });

  return (
    <InstaStyleClient 
      featuredProducts={featuredProducts} 
      brandSet={brandSet} 
      categoryCards={categoryCards} 
    />
  );
}