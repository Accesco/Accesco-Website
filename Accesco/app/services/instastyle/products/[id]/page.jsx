"use client";

import { Fragment, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getProductById,
  getProductCategoryIds,
  getProductVariants,
} from "@/lib/mockData";
import { useCart } from "@/contexts/CartContext";
import ProductGallery from "@/components/instastyle/ProductGallery";
import SizeSelector from "@/components/instastyle/SizeSelector";
import ColorSelector from "@/components/instastyle/ColorSelector";
import QuantitySelector from "@/components/instastyle/QuantitySelector";
import styles from "./product.module.css";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, openCart, toggleWishlist, isWishlisted, inventory } =
    useCart();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const productData = getProductById(params.id);
    if (productData) {
      setProduct(productData);
      // Set default color
      if (productData.colors && productData.colors.length > 0) {
        setSelectedColor(productData.colors[0].name);
      }
    } else {
      // 1. Fallback to localStorage check first
      if (typeof window !== "undefined") {
        try {
          const saved = localStorage.getItem("instastyle_custom_products");
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              const localProd = parsed.find((p) => p.id === params.id);
              if (localProd) {
                setProduct(localProd);
                if (localProd.colors && localProd.colors.length > 0) {
                  setSelectedColor(localProd.colors[0].name);
                }
                return;
              }
            }
          }
        } catch (error) {
          console.error("Error reading product from localStorage:", error);
        }
      }

      // 2. Fetch from Firebase Firestore backend database
      const fetchProductFromFirestore = async () => {
        try {
          const { db } = await import("@/lib/firebase");
          const { doc, getDoc, collection, getDocs, query, where } =
            await import("firebase/firestore");

          // Try direct lookup by document ID
          const docRef = doc(db, "instastyle_products", params.id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setProduct(data);
            if (data.colors && data.colors.length > 0) {
              setSelectedColor(data.colors[0].name);
            }
          } else {
            // Fallback: query by id field
            const q = query(
              collection(db, "instastyle_products"),
              where("id", "==", params.id),
            );
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              const data = querySnapshot.docs[0].data();
              setProduct(data);
              if (data.colors && data.colors.length > 0) {
                setSelectedColor(data.colors[0].name);
              }
            }
          }
        } catch (err) {
          console.error("Error fetching product from Firestore:", err);
        }
      };
      fetchProductFromFirestore();
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
  const productVariants = getProductVariants(product);
  const productCategoryIds = getProductCategoryIds(product);

  // Use context inventory if available, otherwise fallback to static mock inventory
  const currentInventory =
    inventory[product.id] && inventory[product.id][selectedSize] !== undefined
      ? inventory[product.id][selectedSize]
      : product.inventory[selectedSize] !== undefined
        ? product.inventory[selectedSize]
        : 10;

  const maxQuantity = selectedSize ? currentInventory : 10;
  const wishlisted = isWishlisted(product.id);
  const isInStock = selectedSize ? currentInventory > 0 : product.inStock;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
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
          {productCategoryIds.map((categoryId, index) => (
            <Fragment key={`${categoryId}-${index}`}>
              <Link
                href={`/services/instastyle/catalog?category=${categoryId}`}
              >
                {categoryId.charAt(0).toUpperCase() + categoryId.slice(1)}
              </Link>
              {index < productCategoryIds.length - 1 && <span>/</span>}
            </Fragment>
          ))}
          <span>/</span>
          <span>{product.name}</span>
        </nav>
      </div>

      {/* Product Content */}
      <div className={styles.container}>
        <div className={styles.productGrid}>
          {/* Left: Gallery */}
          <div className={styles.gallerySection}>
            <ProductGallery
              images={product.images}
              productName={product.name}
            />
          </div>

          {/* Right: Product Info */}
          <div className={styles.infoSection}>
            {/* Brand & Name */}
            <div className={styles.header}>
              <p className={styles.brand}>{product.brand}</p>
              <h1 className={styles.productName}>{product.name}</h1>
              <p
                style={{
                  fontSize: "12px",
                  color: "#9CA3AF",
                  fontFamily: "monospace",
                  marginTop: "4px",
                  letterSpacing: "0.05em",
                }}
              >
                SKU: {product.sku}
              </p>

              {/* Rating */}
              <div className={styles.rating}>
                <span
                  className={styles.stars}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    color: "#1a1108",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  {product.rating}
                </span>
                <span className={styles.reviews}>
                  ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className={styles.priceSection}>
              <div className={styles.priceRow}>
                <span className={styles.price}>
                  ₹{displayPrice.toLocaleString()}
                </span>
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

            {/* Color Selector */}
            <ColorSelector
              colors={product.colors}
              selectedColor={selectedColor}
              onColorChange={setSelectedColor}
              variants={productVariants}
            />

            {/* Size Selector */}
            <SizeSelector
              sizes={product.sizes}
              inventory={product.inventory}
              selectedSize={selectedSize}
              onSizeChange={setSelectedSize}
              variants={productVariants}
              selectedColor={selectedColor}
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
                disabled={!isInStock}
              >
                {isInStock ? "Add to Cart" : "Out of Stock"}
              </button>
              <button
                className={styles.wishlistBtn}
                onClick={() => toggleWishlist(product)}
                aria-label={
                  wishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                {wishlisted ? (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="none"
                    style={{ color: "#e11d48" }}
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                ) : (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Product Features */}
            <div className={styles.features}>
              {product.features?.map((feature, index) => (
                <div key={index} className={styles.feature}>
                  <span className={styles.featureIcon}>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
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
              className={`${styles.tab} ${activeTab === "description" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={`${styles.tab} ${activeTab === "material" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("material")}
            >
              Material & Care
            </button>
            <button
              className={`${styles.tab} ${activeTab === "size" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("size")}
            >
              Size & Fit
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === "description" && (
              <div className={styles.tabPanel}>
                <p>{product.description}</p>
              </div>
            )}

            {activeTab === "material" && (
              <div className={styles.tabPanel}>
                <h3>Material</h3>
                <p>{product.material}</p>
                <h3>Care Instructions</h3>
                <p>{product.careInstructions}</p>
              </div>
            )}

            {activeTab === "size" && (
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
          <span style={{ display: "flex", alignItems: "center" }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          <span>Added to cart!</span>
        </div>
      )}
    </div>
  );
}
