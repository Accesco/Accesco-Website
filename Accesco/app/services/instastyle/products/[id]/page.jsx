'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProductById } from '@/lib/mockData';
import { useCart } from '@/contexts/CartContext';
import ProductGallery from '@/components/instastyle/ProductGallery';
import SizeSelector from '@/components/instastyle/SizeSelector';
import ColorSelector from '@/components/instastyle/ColorSelector';
import QuantitySelector from '@/components/instastyle/QuantitySelector';
import styles from './product.module.css';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, openCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const productData = getProductById(params.id);
    if (productData) {
      setProduct(productData);
      // Set default color
      if (productData.colors && productData.colors.length > 0) {
        setSelectedColor(productData.colors[0].name);
      }
    }
  }, [params.id]);

  if (!product) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading product...</p>
      </div>
    );
  }

  const displayPrice = product.discountedPrice || product.price;
  const hasDiscount = product.discountedPrice && product.discountPercentage > 0;
  const maxQuantity = selectedSize ? (product.inventory[selectedSize] || 0) : 10;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    const success = addToCart(product, selectedSize, selectedColor, quantity);
    
    if (success) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      
      // Open cart drawer after a short delay
      setTimeout(() => openCart(), 500);
    }
  };

  return (
    <div className={styles.productPage}>
      {/* Breadcrumb */}
      <div className={styles.container}>
        <nav className={styles.breadcrumb}>
          <Link href="/services/instastyle">Home</Link>
          <span>/</span>
          <Link href="/services/instastyle/catalog">Shop</Link>
          <span>/</span>
          <Link href={`/services/instastyle/catalog?category=${product.category}`}>
            {product.category}
          </Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>
      </div>

      {/* Product Content */}
      <div className={styles.container}>
        <div className={styles.productGrid}>
          {/* Left: Gallery */}
          <div className={styles.gallerySection}>
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Right: Product Info */}
          <div className={styles.infoSection}>
            {/* Brand & Name */}
            <div className={styles.header}>
              <p className={styles.brand}>{product.brand}</p>
              <h1 className={styles.productName}>{product.name}</h1>
              
              {/* Rating */}
              <div className={styles.rating}>
                <span className={styles.stars}>⭐ {product.rating}</span>
                <span className={styles.reviews}>({product.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className={styles.priceSection}>
              <div className={styles.priceRow}>
                <span className={styles.price}>₹{displayPrice.toLocaleString()}</span>
                {hasDiscount && (
                  <>
                    <span className={styles.originalPrice}>
                      ₹{product.price.toLocaleString()}
                    </span>
                    <span className={styles.discount}>
                      {product.discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className={styles.taxInfo}>Inclusive of all taxes</p>
            </div>

            {/* Delivery Badge */}
            <div className={styles.deliveryBadge}>
              <span className={styles.deliveryIcon}>⚡</span>
              <span>Delivered in 15-20 minutes</span>
            </div>

            {/* Color Selector */}
            <ColorSelector
              colors={product.colors}
              selectedColor={selectedColor}
              onColorChange={setSelectedColor}
            />

            {/* Size Selector */}
            <SizeSelector
              sizes={product.sizes}
              inventory={product.inventory}
              selectedSize={selectedSize}
              onSizeChange={setSelectedSize}
            />

            {/* Quantity Selector */}
            <QuantitySelector
              quantity={quantity}
              onQuantityChange={setQuantity}
              max={maxQuantity}
            />

            {/* Action Buttons */}
            <div className={styles.actions}>
              <button
                className={styles.addToCartBtn}
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button className={styles.wishlistBtn} aria-label="Add to wishlist">
                🤍
              </button>
            </div>

            {/* Product Features */}
            <div className={styles.features}>
              {product.features.map((feature, index) => (
                <div key={index} className={styles.feature}>
                  <span className={styles.featureIcon}>✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className={styles.detailsSection}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'description' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'material' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('material')}
            >
              Material & Care
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'size' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('size')}
            >
              Size & Fit
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'description' && (
              <div className={styles.tabPanel}>
                <p>{product.description}</p>
              </div>
            )}

            {activeTab === 'material' && (
              <div className={styles.tabPanel}>
                <h3>Material</h3>
                <p>{product.material}</p>
                <h3>Care Instructions</h3>
                <p>{product.careInstructions}</p>
              </div>
            )}

            {activeTab === 'size' && (
              <div className={styles.tabPanel}>
                <h3>Size & Fit</h3>
                <p>Model is wearing size M and is 6'0" tall</p>
                <p>Fits true to size, take your normal size</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className={styles.toast}>
          <span>✓</span>
          <span>Added to cart!</span>
        </div>
      )}
    </div>
  );
}
