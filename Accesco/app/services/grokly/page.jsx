/**
 * Grokly Main Page - Modular Version
 * 11-Minute Grocery Delivery Service
 * @version 2.3.1
 */

'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGrokly } from './contexts/GroklyContext';
import GroklyHeader from './components/GroklyHeader';
import MobileHeader from './components/MobileHeader';
import CategoryNav from './components/CategoryNav';
import ProductCard from './components/ProductCard';
import ProductSkeleton from './components/ProductSkeleton';
import FilterPanel from './components/FilterPanel';
import dynamic from 'next/dynamic';
const CartDrawer = dynamic(() => import('./components/CartDrawer'));
const LocationModal = dynamic(() => import('./components/LocationModal'));
import FloatingCartBar from './components/FloatingCartBar';
import BottomNav from './components/BottomNav';
import { categories, getProductsByCategory, searchProducts } from './lib/groklyData';
import { useProducts } from './hooks/useProducts';
import './styles/variables.css';
import './styles/GroklyFooter.css';
import GroklyFooter from './components/GroklyFooter';
import JsonLd from '../../../components/JsonLd';
import { dishes } from './lib/dishesData';
import GroceryStories from './components/GroceryStories';

const getIngredientImage = (item) => {
  if (!item.image || item.image.includes("grofers.com")) {
    const categoryImages = {
      "vegetables-fruits":
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=150&h=150&fit=crop",
      "dairy-breakfast":
        "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=150&h=150&fit=crop",
      "masala-oil":
        "https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg",
      "atta-rice-dal":
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=150&h=150&fit=crop",
      default:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&h=150&fit=crop",
    };
    const category = item.id.startsWith("veg-")
      ? "vegetables-fruits"
      : item.id.startsWith("dairy-") ||
        item.id.includes("paneer") ||
        item.id.includes("yogurt")
        ? "dairy-breakfast"
        : item.id.startsWith("masala-") ||
          item.id.includes("ggpaste") ||
          item.id.includes("marinade")
          ? "masala-oil"
          : item.id.startsWith("atta-") || item.id.includes("rice")
            ? "atta-rice-dal"
            : "default";
    return categoryImages[category] || categoryImages["default"];
  }
  return item.image;
};

function GroklyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("");
  const [selectedDishKey, setSelectedDishKey] = useState("tikka");
  const [currentSlide, setCurrentSlide] = useState(0);
  const { getProductQuantity, addToCart, incrementQuantity, decrementQuantity, openCart } = useGrokly();
  const { products, isLoading: productsLoading } = useProducts('grokly');

  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let filtered = getProductsByCategory(activeCategory, products);

    if (searchQuery.trim()) {
      filtered = searchProducts(searchQuery, filtered);
    }

    switch (activeFilter) {
      case "bestseller":
        filtered = filtered.filter(
          (p) => p.tags && p.tags.includes("Bestseller"),
        );
        break;
      case "discount":
        filtered = filtered.filter((p) => p.disc > 0);
        break;
      case "under-50":
        filtered = filtered.filter((p) => p.price < 50);
        break;
      case "under-100":
        filtered = filtered.filter((p) => p.price < 100);
        break;
      case "premium":
        filtered = filtered.filter((p) => p.tags && p.tags.includes("Premium"));
        break;
      case "low-stock":
        filtered = filtered.filter((p) => p.stock && p.stock < 10);
        break;
      default:
        break;
    }

    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "rating":
            return b.rating - a.rating;
          case "discount":
            return b.disc - a.disc;
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [activeCategory, searchQuery, activeFilter, sortBy, products]);

  const productsByCategory = useMemo(() => {
    if (activeCategory !== "all" || searchQuery.trim()) {
      return null;
    }

    const grouped = {};

    categories.forEach((category) => {
      if (category.id === "all") return;

      const categoryProducts = products.filter(
        (p) => p.category === category.id,
      );
      if (categoryProducts.length > 0) {
        grouped[category.id] = {
          category,
          products: categoryProducts.slice(0, 12),
        };
      }
    });

    return grouped;
  }, [activeCategory, searchQuery]);

  const handleCategorySelect = (categoryId) => {
    if (categoryId === "all") {
      setActiveCategory("all");
      setSearchQuery("");
      router.push("/services/grokly");
    } else {
      router.push(`/services/grokly/category/${categoryId}`);
    }
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      router.push(`/services/grokly?search=${encodeURIComponent(query)}`, {
        scroll: false,
      });
    } else {
      router.push("/services/grokly", { scroll: false });
    }
  };

  const handleSearchClear = () => {
    setSearchQuery("");
    router.push("/services/grokly", { scroll: false });
  };

  const handleAddAll = () => {
    const activeDish = dishes[selectedDishKey];
    activeDish.ingredients.forEach((item) => {
      if (getProductQuantity(item.id) === 0) {
        addToCart(item.id, 1);
      }
    });
    openCart();
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Grocery Delivery",
    name: "Grokly by Accesco Living",
    description:
      "Farm-direct fresh groceries delivered in minutes, sourced directly from Karnataka farms via FarmChain with QR traceability.",
    url: "https://accescoliving.com/services/grokly",
    provider: {
      "@type": "Organization",
      name: "Accesco Living",
      url: "https://accescoliving.com",
    },
    areaServed: {
      "@type": "City",
      name: "Bengaluru",
    },
  };
  const productListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Fresh Groceries on Grokly",
    itemListElement: products.slice(0, 50).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: p.name,
        offers: {
          "@type": "Offer",
          price: String(p.price),
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };

  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={productListSchema} />
      <h1
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        Grokly — Farm-Fresh Groceries Delivered in Minutes
      </h1>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "var(--grokly-bg)",
        }}
      >
        {/* Desktop Header */}
        <GroklyHeader
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearchClear={handleSearchClear}
        />

        <MobileHeader />

        {activeCategory !== "all" && (
          <CategoryNav
            categories={categories}
            activeCategory={activeCategory}
            onCategorySelect={handleCategorySelect}
          />
        )}

        {activeCategory === "all" && !searchQuery && (
          <div
            style={{
              maxWidth: "var(--grokly-max-width)",
              margin: "0 auto",
              width: "100%",
              padding: "16px 20px 0", // Reduced bottom padding to 0
            }}
          >
            <div
              style={{
                position: "relative",
                height: "clamp(280px, 40vw, 450px)",
                borderRadius: "16px",
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: "0 8px 30px rgba(42, 33, 26, 0.12)",
              }}
            >
              {/* Slide 0: General Info */}
              <div
                onClick={() => {
                  const mainContent = document.querySelector("main");
                  if (mainContent) {
                    mainContent.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: currentSlide === 0 ? 1 : 0,
                  pointerEvents: currentSlide === 0 ? "auto" : "none",
                  transition: "opacity 0.8s ease-in-out",
                }}
              >
                <Image
                  src="/images/IMG_4614.PNG"
                  alt="Grokly - 11 Minute Grocery Delivery"
                  fill
                  sizes="100vw"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center top",
                  }}
                  priority
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to right, rgba(18,39,29,0.78) 0%, rgba(18,39,29,0.40) 55%, transparent 85%)",
                    display: "flex",
                    alignItems: "center",
                    padding: "clamp(32px, 5vw, 64px)",
                  }}
                >
                  <div style={{ maxWidth: "560px" }}>
                    <h2
                      style={{
                        fontFamily: "var(--grokly-font-display)",
                        fontSize: "clamp(28px, 5vw, 52px)",
                        fontWeight: 900,
                        color: "#fff",
                        margin: "0 0 12px",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.1,
                      }}
                    >
                      Groceries in{" "}
                      <span style={{ color: "#C98A2C" }}>11 minutes flat.</span>
                    </h2>
                    <p
                      style={{
                        fontFamily: "var(--grokly-font-primary)",
                        fontSize: "clamp(15px, 2vw, 20px)",
                        color: "rgba(255,255,255,0.9)",
                        margin: "0 0 24px",
                        lineHeight: 1.6,
                      }}
                    >
                      Farm-fresh essentials sourced directly from Karnataka
                      farms. No middlemen. Full traceability.
                    </p>
                    <div
                      style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const mainContent = document.querySelector("main");
                          if (mainContent) {
                            mainContent.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }
                        }}
                        style={{
                          padding: "14px 32px",
                          borderRadius: "9999px",
                          background: "#C98A2C",
                          color: "#1B140F",
                          fontFamily: "var(--grokly-font-display)",
                          fontWeight: 800,
                          fontSize: "16px",
                          border: "none",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "#B0781F";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "#C98A2C";
                        }}
                      >
                        Shop Now
                      </button>
                      <span
                        style={{
                          padding: "14px 24px",
                          borderRadius: "9999px",
                          background: "rgba(255,255,255,0.15)",
                          backdropFilter: "blur(8px)",
                          border: "1px solid rgba(255,255,255,0.25)",
                          color: "#fff",
                          fontSize: "15px",
                          fontFamily: "var(--grokly-font-primary)",
                          fontWeight: 600,
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        Free delivery on ₹199+
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slide 1: Grokly Fresh Groceries Curated Just For You */}
              <div
                onClick={() => {
                  const mainContent = document.querySelector("main");
                  if (mainContent) {
                    mainContent.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: currentSlide === 1 ? 1 : 0,
                  pointerEvents: currentSlide === 1 ? "auto" : "none",
                  transition: "opacity 0.8s ease-in-out",
                }}
              >
                <Image
                  src="/images/banners/hero-grokly1.jpg.png"
                  alt="Grokly Fresh Groceries Curated Just For You Banner"
                  fill
                  sizes="100vw"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
              </div>

              {/* Slide Indicators */}
              <div
                style={{
                  position: "absolute",
                  bottom: "20px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: "8px",
                  zIndex: 10,
                }}
              >
                {[0, 1].map((index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide(index);
                    }}
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background:
                        currentSlide === index
                          ? "#C98A2C"
                          : "rgba(255, 255, 255, 0.4)",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}
                  />
                ))}
              </div>

              {/* Left Arrow Navigation */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide((prev) => (prev === 0 ? 1 : prev - 1));
                }}
                style={{
                  position: "absolute",
                  left: "20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "rgba(18, 39, 29, 0.45)",
                  backdropFilter: "blur(4px)",
                  color: "#fff",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                  fontSize: "18px",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(18, 39, 29, 0.65)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(18, 39, 29, 0.45)")
                }
              >
                <i
                  className="ri-arrow-left-s-line"
                  style={{ display: "block", margin: "auto" }}
                ></i>
              </button>

              {/* Right Arrow Navigation */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide((prev) => (prev === 1 ? 0 : prev + 1));
                }}
                style={{
                  position: "absolute",
                  right: "20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "rgba(18, 39, 29, 0.45)",
                  backdropFilter: "blur(4px)",
                  color: "#fff",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                  fontSize: "18px",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(18, 39, 29, 0.65)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(18, 39, 29, 0.45)")
                }
              >
                <i
                  className="ri-arrow-right-s-line"
                  style={{ display: "block", margin: "auto" }}
                ></i>
              </button>
            </div>
          </div>
        )}

        {activeCategory === "all" && !searchQuery && (
          <div
            style={{
              maxWidth: "var(--grokly-max-width)",
              margin: "0 auto",
              width: "100%",
              padding: "0 20px 0", // Reduced top padding to 0
            }}
          >
            <div
              className="dish-inner-container"
              style={{
                background:
                  "linear-gradient(135deg, #F7F5EF 0%, #ffffff 100%)",
                border: "1px solid #E8E2D3",
                borderRadius: "20px",
                overflow: "hidden",
                position: "relative",
                padding: "clamp(24px, 4vw, 48px)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-60px",
                    right: "-60px",
                    width: "280px",
                    height: "280px",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(27,58,43,0.06) 0%, transparent 70%)",
                  }}
                />
              </div>

              <div
                className="dish-desktop-view"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "32px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      color: "#1B3A2B",
                      textTransform: "uppercase",
                      letterSpacing: "1.5px",
                      marginBottom: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <i className="ri-restaurant-2-fill"></i> Recipes & Bundles
                  </div>
                  <h2
                    style={{
                      fontFamily: "var(--grokly-font-display)",
                      fontSize: "2rem",
                      fontWeight: 900,
                      color: "#2A211A",
                      margin: "0 0 12px",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.1,
                    }}
                  >
                    Choose a Dish,
                    <br />
                    <span style={{ color: "#1B3A2B" }}>
                      Get All Ingredients
                    </span>
                  </h2>
                  <p
                    style={{
                      fontFamily: "var(--grokly-font-primary)",
                      fontSize: "0.95rem",
                      color: "#5C5347",
                      lineHeight: 1.5,
                      margin: "0 0 24px",
                    }}
                  >
                    Select a recipe below. We will bundle the fresh
                    ingredients so you can cook it at home. Customize items
                    before adding.
                  </p>

                  <div style={{ display: "flex", gap: "12px" }}>
                    {Object.entries(dishes).map(([key, dish]) => {
                      const isActive = selectedDishKey === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setSelectedDishKey(key)}
                          style={{
                            background: "#ffffff",
                            border: isActive
                              ? "2px solid #1B3A2B"
                              : "1px solid #E8E2D3",
                            boxShadow: isActive
                              ? "0 4px 12px rgba(27, 58, 43, 0.08)"
                              : "none",
                            borderRadius: "12px",
                            padding: "10px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            cursor: "pointer",
                            textAlign: "left",
                            transition:
                              "background-color var(--grokly-transition-fast), border-color var(--grokly-transition-fast)",
                            flex: "1",
                            minWidth: 0,
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive)
                              e.currentTarget.style.background = "#F7F5EF";
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive)
                              e.currentTarget.style.background = "#ffffff";
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element -- dish.image comes from dishesData.js's heterogeneous external hosts, not compatible with next/image's static remotePatterns allowlist */}
                          <img
                            src={dish.image}
                            alt={dish.name}
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "8px",
                              objectFit: "cover",
                              flexShrink: 0,
                            }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4
                              style={{
                                margin: "0 0 2px",
                                fontSize: "13px",
                                color: "#2A211A",
                                fontWeight: 800,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {dish.name}
                            </h4>
                            <p
                              style={{
                                margin: 0,
                                fontSize: "11px",
                                color: "#9C9284",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {dish.ingredients.length} items
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #F1EEE6",
                    borderRadius: "20px",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: "440px",
                    boxShadow: "0 4px 20px rgba(42,33,26,0.04)",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                        borderBottom: "1px solid #F1EEE6",
                        paddingBottom: "12px",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          color: "#2A211A",
                          fontSize: "18px",
                          fontWeight: 800,
                        }}
                      >
                        Ingredients for {dishes[selectedDishKey].name}
                      </h3>
                      <span
                        style={{
                          fontSize: "13px",
                          color: "#1B3A2B",
                          fontWeight: 700,
                        }}
                      >
                        {dishes[selectedDishKey].ingredients.length} Fresh
                        items
                      </span>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(220px, 1fr))",
                        gap: "12px",
                      }}
                    >
                      {dishes[selectedDishKey].ingredients.map((ing) => {
                        const qty = getProductQuantity(ing.id);
                        return (
                          <div
                            key={ing.id}
                            style={{
                              background: "#fff",
                              borderRadius: "12px",
                              padding: "12px",
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              border: "1px solid #F1EEE6",
                            }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element -- getIngredientImage() can return dishesData.js's heterogeneous external hosts, not compatible with next/image's static remotePatterns allowlist */}
                            <img
                              src={getIngredientImage(ing)}
                              alt={ing.name}
                              onError={(e) => {
                                e.target.src =
                                  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&h=150&fit=crop";
                              }}
                              style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "8px",
                                objectFit: "cover",
                                background: "#F7F5EF",
                              }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <h5
                                style={{
                                  margin: "0 0 2px",
                                  fontSize: "12px",
                                  color: "#2A211A",
                                  fontWeight: 700,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {ing.name}
                              </h5>
                              <p
                                style={{
                                  margin: "0 0 4px",
                                  fontSize: "10px",
                                  color: "#9C9284",
                                }}
                              >
                                {ing.unit}
                              </p>
                              <div
                                style={{
                                  fontSize: "11px",
                                  fontWeight: 700,
                                  color: "#2A211A",
                                }}
                              >
                                ₹{ing.price}{" "}
                                <span
                                  style={{
                                    fontSize: "9px",
                                    textDecoration: "line-through",
                                    color: "#9C9284",
                                    fontWeight: "normal",
                                  }}
                                >
                                  ₹{ing.mrp}
                                </span>
                              </div>
                            </div>
                            <div style={{ flexShrink: 0 }}>
                              {qty > 0 ? (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    background: "#1B3A2B",
                                    color: "#fff",
                                    borderRadius: "6px",
                                    padding: "4px 6px",
                                  }}
                                >
                                  <button
                                    onClick={() => decrementQuantity(ing.id)}
                                    style={{
                                      background: "none",
                                      border: "none",
                                      color: "#fff",
                                      fontWeight: "bold",
                                      cursor: "pointer",
                                      fontSize: "12px",
                                      padding: "0 2px",
                                    }}
                                  >
                                    -
                                  </button>
                                  <span
                                    style={{
                                      fontSize: "11px",
                                      fontWeight: "bold",
                                      minWidth: "10px",
                                      textAlign: "center",
                                    }}
                                  >
                                    {qty}
                                  </span>
                                  <button
                                    onClick={() => incrementQuantity(ing.id)}
                                    style={{
                                      background: "none",
                                      border: "none",
                                      color: "#fff",
                                      fontWeight: "bold",
                                      cursor: "pointer",
                                      fontSize: "12px",
                                      padding: "0 2px",
                                    }}
                                  >
                                    +
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => addToCart(ing.id, 1)}
                                  style={{
                                    background: "#fff",
                                    border: "1px solid #1B3A2B",
                                    color: "#1B3A2B",
                                    borderRadius: "6px",
                                    padding: "5px 10px",
                                    fontSize: "10px",
                                    fontWeight: 800,
                                    cursor: "pointer",
                                    transition:
                                      "background-color var(--grokly-transition-fast), color var(--grokly-transition-fast)",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background =
                                      "#1B3A2B";
                                    e.currentTarget.style.color = "#fff";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "#fff";
                                    e.currentTarget.style.color = "#1B3A2B";
                                  }}
                                >
                                  ADD
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: "24px",
                      paddingTop: "20px",
                      borderTop: "1px solid #F1EEE6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#9C9284",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                        }}
                      >
                        Bundle Total
                      </div>
                      <div
                        style={{
                          fontSize: "24px",
                          fontWeight: 900,
                          color: "#1B3A2B",
                        }}
                      >
                        ₹{dishes[selectedDishKey].price}
                      </div>
                    </div>
                    <button
                      onClick={handleAddAll}
                      style={{
                        background: "#1B3A2B",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "9999px",
                        padding: "14px 32px",
                        fontSize: "14px",
                        fontWeight: 800,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        boxShadow: "0 4px 12px rgba(27,58,43,0.18)",
                        transition:
                          "background-color var(--grokly-transition-fast)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#12271D";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#1B3A2B";
                      }}
                    >
                      <i className="ri-shopping-basket-line"></i> Add All
                      Ingredients
                    </button>
                  </div>
                </div>
              </div>

              <div
                className="dish-mobile-view"
                style={{
                  display: "none",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div style={{ marginBottom: "16px", textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 800,
                      color: "#1B3A2B",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      marginBottom: "8px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <i className="ri-restaurant-2-fill"></i> Cook at Home
                  </div>
                  <h3
                    style={{
                      margin: "0 0 4px",
                      fontSize: "1.25rem",
                      fontWeight: 900,
                      color: "#2A211A",
                    }}
                  >
                    Cook with Fresh Ingredients
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.8rem",
                      color: "#5C5347",
                    }}
                  >
                    Choose a dish to get all ingredients in one tap.
                  </p>
                </div>

                <div
                  style={{
                    background: "#fff",
                    borderRadius: "24px",
                    padding: "16px",
                    border: "1px solid #E8E2D3",
                    boxShadow: "0 8px 30px rgba(42, 33, 26, 0.06)",
                  }}
                >
                  <div
                    style={{
                      background: "#F7F5EF",
                      padding: "10px",
                      borderRadius: "12px",
                      marginBottom: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      border: "1px solid #E8E2D3",
                      fontSize: "12px",
                      color: "#9C9284",
                    }}
                  >
                    <i className="ri-search-line"></i> Try searching "Paneer
                    Chilli"
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 800,
                        color: "#9C9284",
                        marginBottom: "8px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Popular Dishes
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        overflowX: "auto",
                        paddingBottom: "4px",
                      }}
                      className="hide-scrollbar"
                    >
                      {Object.entries(dishes).map(([key, dish]) => {
                        const isActive = selectedDishKey === key;
                        return (
                          <button
                            key={key}
                            onClick={() => setSelectedDishKey(key)}
                            style={{
                              flex: "0 0 auto",
                              background: isActive ? "#F7F5EF" : "#F1EEE6",
                              border: isActive
                                ? "1px solid #1B3A2B"
                                : "1px solid #E8E2D3",
                              borderRadius: "12px",
                              padding: "8px 12px",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              cursor: "pointer",
                            }}
                          >
                            <i
                              className="ri-restaurant-line"
                              style={{
                                color: isActive ? "#1B3A2B" : "#9C9284",
                                fontSize: "14px",
                              }}
                            ></i>
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: 700,
                                color: isActive ? "#1B3A2B" : "#5C5347",
                              }}
                            >
                              {dish.name.replace("Paneer ", "")}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#ffffff",
                      borderRadius: "16px",
                      padding: "12px",
                      border: "1px solid #F1EEE6",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px",
                        borderBottom: "1px solid #F1EEE6",
                        paddingBottom: "8px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 800,
                          color: "#2A211A",
                        }}
                      >
                        {dishes[selectedDishKey].name}
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          color: "#1B3A2B",
                          fontWeight: 700,
                        }}
                      >
                        {dishes[selectedDishKey].ingredients.length} items
                        &middot; ₹{dishes[selectedDishKey].price}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      {dishes[selectedDishKey].ingredients.map((item) => {
                        const qty = getProductQuantity(item.id);
                        return (
                          <div
                            key={item.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "8px 0",
                              borderBottom: "1px solid #F7F5EF",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                              }}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element -- getIngredientImage() can return dishesData.js's heterogeneous external hosts, not compatible with next/image's static remotePatterns allowlist */}
                              <img
                                src={getIngredientImage(item)}
                                alt={item.name}
                                onError={(e) => {
                                  e.target.src =
                                    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&h=150&fit=crop";
                                }}
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "6px",
                                  objectFit: "cover",
                                }}
                              />
                              <div>
                                <div
                                  style={{
                                    fontSize: "11px",
                                    fontWeight: 700,
                                    color: "#2A211A",
                                  }}
                                >
                                  {item.name}
                                </div>
                                <div
                                  style={{
                                    fontSize: "9px",
                                    color: "#9C9284",
                                  }}
                                >
                                  {item.unit}
                                </div>
                                <div
                                  style={{
                                    fontSize: "10px",
                                    fontWeight: 700,
                                    color: "#2A211A",
                                  }}
                                >
                                  ₹{item.price}{" "}
                                  <span
                                    style={{
                                      fontSize: "8px",
                                      textDecoration: "line-through",
                                      color: "#9C9284",
                                      fontWeight: "normal",
                                    }}
                                  >
                                    ₹{item.mrp}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {qty > 0 ? (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  background: "#1B3A2B",
                                  color: "#fff",
                                  borderRadius: "6px",
                                  padding: "4px 6px",
                                }}
                              >
                                <button
                                  onClick={() => decrementQuantity(item.id)}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    color: "#fff",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    fontSize: "12px",
                                    padding: "0 2px",
                                  }}
                                >
                                  -
                                </button>
                                <span
                                  style={{
                                    fontSize: "11px",
                                    fontWeight: "bold",
                                    minWidth: "10px",
                                    textAlign: "center",
                                  }}
                                >
                                  {qty}
                                </span>
                                <button
                                  onClick={() => incrementQuantity(item.id)}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    color: "#fff",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    fontSize: "12px",
                                    padding: "0 2px",
                                  }}
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToCart(item.id, 1)}
                                style={{
                                  background: "#fff",
                                  border: "1px solid #1B3A2B",
                                  color: "#1B3A2B",
                                  borderRadius: "6px",
                                  padding: "5px 10px",
                                  fontSize: "10px",
                                  fontWeight: 800,
                                  cursor: "pointer",
                                }}
                              >
                                ADD
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={handleAddAll}
                    style={{
                      width: "100%",
                      background: "#1B3A2B",
                      color: "#fff",
                      border: "none",
                      borderRadius: "12px",
                      padding: "12px",
                      marginTop: "16px",
                      fontSize: "13px",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <i className="ri-shopping-basket-line"></i> Add All
                    Ingredients
                  </button>
                </div>
              </div>

              <style
                dangerouslySetInnerHTML={{
                  __html: `
          .dish-desktop-view {
            display: grid !important;
          }
          .dish-mobile-view {
            display: none !important;
          }
          @media (max-width: 768px) {
            .dish-inner-container {
              padding: 28px 20px !important;
            }
            .dish-desktop-view {
              display: none !important;
            }
            .dish-mobile-view {
              display: block !important;
            }
          }
          .grokly-category-layout {
            display: grid;
            grid-template-columns: 240px 1fr;
            gap: 24px;
            align-items: start;
            margin-top: 16px;
          }
          .grokly-category-sidebar {
            position: sticky;
            top: 80px;
            background: #fff;
            border: 1px solid #F1EEE6;
            border-radius: 12px;
            padding: 8px;
            display: flex;
            flex-direction: column;
            gap: 4px;
            max-height: calc(100vh - 100px);
            overflow-y: auto;
          }
          .grokly-sidebar-item {
            transition: background-color var(--grokly-transition-fast);
          }
          @media (max-width: 768px) {
            .grokly-category-layout {
              grid-template-columns: 1fr !important;
              gap: 12px !important;
            }
            .grokly-category-sidebar {
              display: none !important;
            }
          }
        `,
                }}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main
          style={{
            flex: 1,
            maxWidth: "var(--grokly-max-width)",
            margin: "0 auto",
            width: "100%",
            padding: "8px 20px",
          }}
        >
          {/* Category Grid Section */}
          {activeCategory === "all" && !searchQuery && (
            <div style={{ margin: "0 0 32px" }}>
              <h3
                style={{
                  fontFamily: "var(--grokly-font-display)",
                  fontSize: "22px",
                  fontWeight: 900,
                  color: "var(--grokly-text-primary)",
                  margin: "0 0 16px",
                }}
              >
                Browse by Categories
              </h3>

              <div className="grokly-category-grid">
                {categories
                  .filter((c) => c.id !== "all")
                  .map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className="grokly-cat-card"
                    >
                      <div className="grokly-cat-img-wrapper">
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          width={56}
                          height={56}
                          className="grokly-cat-img"
                          draggable={false}
                          onContextMenu={(e) => e.preventDefault()}
                        />
                      </div>
                      <span className="grokly-cat-title">
                        {cat.name}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {activeCategory === "all" && !searchQuery && (
            <GroceryStories />
          )}
          {/* Curated Product Sections */}
          {activeCategory === "all" && !searchQuery && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "36px",
                margin: "16px 0 40px",
              }}
            >
              {/* Shelf 1: Quick Breakfast Corner */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--grokly-font-display)",
                      fontSize: "18px",
                      fontWeight: 800,
                      color: "var(--grokly-text-primary)",
                      margin: 0,
                    }}
                  >
                    Quick Breakfast Corner
                  </h3>
                  <button
                    onClick={() => handleCategorySelect("dairy-breakfast")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#0c831f",
                      fontWeight: 700,
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    See All
                  </button>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    overflowX: "auto",
                    paddingBottom: "8px",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    alignItems: "stretch",
                  }}
                  className="hide-scrollbar"
                >
                  {products
                    .filter((p) =>
                      [
                        "dairy-001",
                        "dairy-002",
                        "dairy-003",
                        "dairy-004",
                        "dairy-007",
                        "dairy-008",
                        "fruit-001",
                        "fruit-002",
                        "tea-002",
                        "tea-001",
                      ].includes(p.id),
                    )
                    .map((product) => (
                      <div
                        key={product.id}
                        style={{
                          flex: "0 0 180px",
                          width: "180px",
                          display: "flex",
                        }}
                      >
                        <ProductCard product={product} />
                      </div>
                    ))}
                </div>
              </div>

              {/* Shelf 2: Snack Attack & Cold Drinks */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--grokly-font-display)",
                      fontSize: "18px",
                      fontWeight: 800,
                      color: "var(--grokly-text-primary)",
                      margin: 0,
                    }}
                  >
                    Snack Attack & Cold Drinks
                  </h3>
                  <button
                    onClick={() => handleCategorySelect("munchies")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#0c831f",
                      fontWeight: 700,
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    See All
                  </button>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    overflowX: "auto",
                    paddingBottom: "8px",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    alignItems: "stretch",
                  }}
                  className="hide-scrollbar"
                >
                
  {products
  .filter((p) =>
    [
      "munch-001",
      "munch-002",
      "munch-003",
      "munch-005",
      "munch-006",
      "munch-011",
      "munch-012",
      "munch-013",
      "munch-014",
      "munch-016",
      "drink-001",
      "drink-003",
      "drink-004",
      "drink-005",
      "drinks-001",
      "drinks-002",
      "drinks-003",
      "drinks-004",
      "drinks-005",
      "drinks-006",
].includes(p.id),
                    )
                    .map((product) => (
                      <div
                        key={product.id}
                        style={{
                          flex: "0 0 180px",
                          width: "180px",
                          display: "flex",
                        }}
                      >
                        <ProductCard product={product} />
                      </div>
                    ))}
                </div>
              </div>

              {/* Shelf 3: Daily Cooking Essentials */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--grokly-font-display)",
                      fontSize: "18px",
                      fontWeight: 800,
                      color: "var(--grokly-text-primary)",
                      margin: 0,
                    }}
                  >
                    Daily Cooking Essentials
                  </h3>
                  <button
                    onClick={() => handleCategorySelect("atta-rice-dal")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#0c831f",
                      fontWeight: 700,
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    See All
                  </button>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    overflowX: "auto",
                    paddingBottom: "8px",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    alignItems: "stretch",
                  }}
                  className="hide-scrollbar"
                >
                  {products
                    .filter((p) =>
                      [
                        "veg-001",
                        "veg-002",
                        "veg-003",
                        "atta-001",
                        "atta-002",
                        "atta-003",
                        "atta-011",
                        "atta-012",
                        "atta-013",
                        "atta-014",
                        "atta-015",
                        "atta-016",
                        "atta-017",
                        "atta-018",
                        "atta-019",
                        "masala-001",
                        "masala-003",
                      ].includes(p.id),
                    )
                    .map((product) => (
                      <div
                        key={product.id}
                        style={{
                          flex: "0 0 180px",
                          width: "180px",
                          display: "flex",
                        }}
                      >
                        <ProductCard product={product} />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Filter Panel - Only show when searching */}
          {searchQuery && (
            <FilterPanel
              onFilterChange={setActiveFilter}
              onSortChange={setSortBy}
              activeFilters={{ [activeFilter]: true }}
            />
          )}

          {searchQuery && (
            <div
              style={{
                padding: "8px 0",
                fontFamily: "var(--grokly-font-display)",
                fontSize: "18px",
                fontWeight: 800,
                color: "var(--grokly-text-primary)",
              }}
            >
              {filteredProducts.length} results for "{searchQuery}"
            </div>
          )}

          {activeCategory !== "all" && !searchQuery && (
            <h2
              style={{
                fontFamily: "var(--grokly-font-display)",
                fontSize: "20px",
                fontWeight: 800,
                color: "var(--grokly-text-primary)",
                margin: "0 0 16px",
              }}
            >
              {categories.find((c) => c.id === activeCategory)?.name}
            </h2>
          )}

          {searchQuery ? (
            <>
              {isLoading ? (
                <div
                  style={{
                    display: "grid",
                    gap: "12px",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
                  }}
                >
                  <ProductSkeleton count={12} />
                </div>
              ) : filteredProducts.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gap: "12px",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
                  }}
                >
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div style={{ fontSize: "56px", opacity: 0.1 }}>SEARCH</div>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: 800,
                      color: "var(--grokly-text-primary)",
                      margin: 0,
                    }}
                  >
                    No products found
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "var(--grokly-text-muted)",
                      margin: 0,
                    }}
                  >
                    Try searching with different keywords
                  </p>
                </div>
              )}
            </>
          ) : (
            activeCategory !== "all" && (
              <div className="grokly-category-layout">
                <aside className="grokly-category-sidebar">
                  {categories
                    .filter((c) => c.id !== "all")
                    .map((cat) => {
                      const isActive = activeCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => handleCategorySelect(cat.id)}
                          className={`grokly-sidebar-item ${isActive ? "active" : ""}`}
                        >
                          <Image src={cat.image} alt={cat.name} width={30} height={30} />
                          <span>{cat.name}</span>
                        </button>
                      );
                    })}
                </aside>

                <div style={{ flex: 1 }}>
                  <div className="grokly-category-header">
                    <div>
                      <h2 className="grokly-category-title">
                        {categories.find((c) => c.id === activeCategory)?.name}
                      </h2>
                      <p className="grokly-category-count">
                        Showing {filteredProducts.length}{" "}
                        {filteredProducts.length === 1 ? "item" : "items"}
                      </p>
                    </div>
                  </div>

                  <FilterPanel
                    onFilterChange={setActiveFilter}
                    onSortChange={setSortBy}
                    activeFilters={{ [activeFilter]: true }}
                  />
                  {isLoading ? (
                    <div
                      style={{
                        display: "grid",
                        gap: "12px",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(200px, 1fr))",
                      }}
                    >
                      <ProductSkeleton count={12} />
                    </div>
                  ) : filteredProducts.length > 0 ? (
                    <div
                      style={{
                        display: "grid",
                        gap: "12px",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(200px, 1fr))",
                      }}
                    >
                      {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "60px 20px" }}>
                      <h3>No products found</h3>
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </main>
<GroklyFooter />
        <CartDrawer />
        <LocationModal />
        <FloatingCartBar />
        <BottomNav />
      </div>
    </>
  );
}

export default function GroklyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GroklyPageContent />
    </Suspense>
  );
}
