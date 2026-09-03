"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/instastyle/ProductCard";
import {
  products,
  categories,
  sortProducts,
  getProductCategoryIds,
} from "@/lib/mockData";
import {
  LayoutGrid,
  UserRound,
  PersonStanding,
  Baby,
  ShoppingBag,
} from "lucide-react";
import styles from "./catalog.module.css";
import Select from "@/components/instastyle/Select";
const categoryIcons = {
  all: <LayoutGrid size={18} strokeWidth={1.8} />,
  men: <UserRound size={18} strokeWidth={1.8} />,
  women: <PersonStanding size={18} strokeWidth={1.8} />,
  kids: <Baby size={18} strokeWidth={1.8} />,
  accessories: <ShoppingBag size={18} strokeWidth={1.8} />,
};
const heroContent = {
  all: {
    kicker: "The Studio",
    title: "Fashion, Refined",
    description:
      "A refined selection where quality, craftsmanship, and style come together.",
    tag: "Crafted for Every Occasion Designed for Everyone",
    image: "/images/instastyle/hero-all.jpg",
  },

  men: {
    kicker: "The Curation",
    title: "Shop the Edit",
    description:
      "A meticulously curated selection of premium pieces, balanced by timeless design and superior craftsmanship.",
    tag: "Curated with Care. Chosen for you.",
    image: "/images/instastyle/hero-men.jpg",
  },

  women: {
    kicker: "The Collection",
    title: "Everyday Luxe",
    description:
      "From everyday essentials to statement pieces, discover styles crafted with refined details and timeless elegance.",
    tag: "Thoughtfully Chosen Just for you.",
    image: "/images/instastyle/hero-women.jpg",
  },

  kids: {
    kicker: "For Little Ones",
    title: "Grow in Style",
    description:
      "Premium essentials thoughtfully chosen for comfort, confidence, and every new adventure.",
    tag: "Made for Little Moments",
    image: "/images/instastyle/hero-kids.jpg",
  },

  accessories: {
    kicker: "The Details",
    title: "Pure Elegance",
    description:
      "A exceptional accessories crafted to add character, refinement, and lasting style.",
    tag: "Carefully Chosen with Care",
    image: "/images/instastyle/hero-accessories.jpg",
  },
};
// ✅ Inner component that uses useSearchParams
function CatalogContent() {
  const searchParams = useSearchParams();

  const [allProducts, setAllProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [filters, setFilters] = useState({
    category: [],
    size: [],
    priceRange: [0, 10000],
  });
  const [showFilters, setShowFilters] = useState(false);

  // ✅ AFTER selectedCategory exists
  const currentHero =
    heroContent[selectedCategory] || heroContent.all;

  useEffect(() => {
    const category = searchParams.get("category");
    setSelectedCategory(
      category && categories.some((item) => item.id === category)
        ? category
        : "all",
    );
  }, [searchParams]);

  useEffect(() => {
    const loadProducts = async () => {
      // Fetch from Firebase Firestore for custom/added products
      try {
        const { db } = await import("@/lib/firebase");
        const { collection, getDocs, query } =
          await import("firebase/firestore");
        const q = query(collection(db, "instastyle_products"));
        const snapshot = await getDocs(q);
        const fbProducts = [];
        snapshot.forEach((doc) => {
          fbProducts.push(doc.data());
        });

        if (fbProducts.length > 0) {
          setAllProducts(() => {
            const merged = [...products];
            localProducts.forEach((lp) => {
              if (!merged.some((p) => p.id === lp.id)) {
                merged.push(lp);
              }
            });
            fbProducts.forEach((fp) => {
              if (!merged.some((p) => p.id === fp.id)) {
                merged.push(fp);
              }
            });
            return merged;
          });
        }
      } catch (err) {
        console.error("Failed to load products from Firestore:", err);
      }
    };
    loadProducts();
  }, []);

  const displayedProducts = useMemo(() => {
    let filtered =
      selectedCategory === "all"
        ? allProducts
        : allProducts.filter((p) =>
            getProductCategoryIds(p).includes(selectedCategory),
          );

    if (filters.size.length > 0) {
      filtered = filtered.filter((p) =>
        filters.size.some((size) => p.sizes.includes(size)),
      );
    }

    const [min, max] = filters.priceRange;
    filtered = filtered.filter((p) => {
      const price = p.discountedPrice || p.price;
      return price >= min && price <= max;
    });

    return sortProducts(filtered, sortBy);
}, [allProducts, selectedCategory, filters, sortBy]);

  const activeFilterCount =
    filters.size.length + (filters.priceRange[1] < 10000 ? 1 : 0);

  const handleSizeFilter = (size) => {
    setFilters((prev) => ({
      ...prev,
      size: prev.size.includes(size)
        ? prev.size.filter((s) => s !== size)
        : [...prev.size, size],
    }));
  };

  const clearFilters = () => {
    setFilters({ category: [], size: [], priceRange: [0, 10000] });
  };

  const clearPriceCap = () => {
    setFilters((prev) => ({ ...prev, priceRange: [0, 10000] }));
  };

  return (
    <div className={styles.catalogPage}>
      {/* Header */}
     <div
  className={styles.catalogHeader}
  style={{
    backgroundImage: `
     
      url("${currentHero.image}")
    `,
  }}
>
  <div className={styles.container}>
    <p className={styles.kicker}>{currentHero.kicker}</p>

    <h1>{currentHero.title}</h1>

    <p className={styles.description}>
      {currentHero.description}
    </p>

    <div className={styles.headerInfo}>
      <span className={styles.heroTag}>
        {currentHero.tag}
      </span>

      <span className={styles.countInfo}>
        {displayedProducts.length} items found
      </span>
    </div>
  </div>
</div>
      

      {/* Catalog Navigation */}
<div className={styles.categoryTabs}>
  <div className={styles.catalogNav}>
    <div className={styles.catalogNavCategories}>
      <button
        className={`${styles.catalogNavItem} ${
          selectedCategory === "all" ? styles.active : ""
        }`}
        onClick={() => setSelectedCategory("all")}
      >
        <span className={styles.navIcon}>⌘</span>
        <span>Everything</span>
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`${styles.catalogNavItem} ${
            selectedCategory === cat.id ? styles.active : ""
          }`}
          onClick={() => setSelectedCategory(cat.id)}
        >
          <span className={styles.navIcon}>
  {categoryIcons[cat.id]}
</span>
          <span>{cat.name}</span>
        </button>
      ))}
    </div>

    <div className={styles.catalogNavActions}>
      <button
        type="button"
        className={styles.refineNavButton}
        onClick={() => setShowFilters(!showFilters)}
      >
        <span>☷</span>
        Refine
      </button>

      <div className={styles.navSort}>
        <Select
          value={sortBy}
          options={[
            { value: "newest", label: "Newest" },
            { value: "price-low-high", label: "Price: Low to High" },
            { value: "price-high-low", label: "Price: High to Low" },
            { value: "rating", label: "Top Rated" },
          ]}
          onChange={setSortBy}
          placeholder="Sort by"
        />
      </div>
    </div>
  </div>
</div>  
      <div className={styles.container}>
        <div className={styles.catalogContent}>
          {/* Filters Sidebar */}
          <aside
            className={`${styles.filtersSidebar} ${showFilters ? styles.show : ""}`}
          >
            <div className={styles.filtersHeader}>
              <h3>Refine</h3>
              <button className={styles.clearBtn} onClick={clearFilters}>
                Clear All
              </button>
            </div>

            <div className={styles.filterSection}>
              <h4>Size</h4>
              <div className={styles.sizeOptions}>
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    className={`${styles.sizeBtn} ${filters.size.includes(size) ? styles.active : ""}`}
                    onClick={() => handleSizeFilter(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterSection}>
              <h4>Price Range</h4>
              <div className={styles.priceRange}>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      priceRange: [0, parseInt(e.target.value)],
                    }))
                  }
                />
                <div className={styles.priceLabels}>
                  <span>₹0</span>
                  <span>₹{filters.priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className={styles.productsSection}>
            <div className={styles.toolbar}>
              <button
                className={styles.filterToggle}
                onClick={() => setShowFilters(!showFilters)}
              >
                <span>🔍</span> Refine
              </button>
              <div className={styles.resultsCount}>
                {displayedProducts.length} Products
                {activeFilterCount > 0
                  ? ` • ${activeFilterCount} active filters`
                  : ""}
              </div>
          
            </div>

            {activeFilterCount > 0 && (
              <div className={styles.activeFilters}>
                {filters.size.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={styles.filterChip}
                    onClick={() => handleSizeFilter(size)}
                  >
                    Size {size} ×
                  </button>
                ))}
                {filters.priceRange[1] < 10000 && (
                  <button
                    type="button"
                    className={styles.filterChip}
                    onClick={clearPriceCap}
                  >
                    Up to ₹{filters.priceRange[1].toLocaleString()} ×
                  </button>
                )}
                <button
                  type="button"
                  className={styles.clearInlineBtn}
                  onClick={clearFilters}
                >
                  Reset all
                </button>
              </div>
            )}

            {displayedProducts.length > 0 ? (
              <div className={styles.productsGrid}>
                {displayedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className={styles.noProducts}>
                <p>No products found matching your filters.</p>
                <button onClick={clearFilters}>Clear Filters</button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// ✅ Default export wraps the inner component in Suspense
export default function CatalogPage() {
  return (
    <Suspense fallback={<div>Loading catalog…</div>}>
      <CatalogContent />
    </Suspense>
  );
}
