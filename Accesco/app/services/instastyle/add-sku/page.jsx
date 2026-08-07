"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Sparkles,
  Check,
  Image as ImageIcon,
  Sliders,
  Tag,
  RefreshCw,
  FileText,
  ChevronRight,
  HelpCircle,
  AlertCircle,
  ShoppingBag,
  Eye,
  Info,
  CheckCircle2,
} from "lucide-react";
import styles from "./add-sku.module.css";
import { categories, subcategories, brands } from "@/lib/mockData";

const IMAGE_PRESETS = [
  {
    id: "img_men_tshirt",
    name: "Classic White T-Shirt",
    category: "men",
    url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop",
  },
  {
    id: "img_men_polo",
    name: "Navy Polo Shirt",
    category: "men",
    url: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&h=800&fit=crop",
  },
  {
    id: "img_men_formal",
    name: "Blue Formal Shirt",
    category: "men",
    url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop",
  },
  {
    id: "img_men_denim",
    name: "Slim Fit Denim Jeans",
    category: "men",
    url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop",
  },
  {
    id: "img_women_dress",
    name: "Floral Summer Dress",
    category: "women",
    url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop",
  },
  {
    id: "img_women_skirt",
    name: "Elegant Maxi Skirt",
    category: "women",
    url: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=800&fit=crop",
  },
  {
    id: "img_women_jeans",
    name: "High-Waist Skinny Jeans",
    category: "women",
    url: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop",
  },
  {
    id: "img_women_slip",
    name: "Silk Slip Dress",
    category: "women",
    url: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80",
  },
  {
    id: "img_outer_moto",
    name: "Vintage Leather Moto Jacket",
    category: "outerwear",
    url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
  },
  {
    id: "img_outer_blazer",
    name: "Oversized Wool Blazer",
    category: "outerwear",
    url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
  },
  {
    id: "img_outer_denim",
    name: "Distressed Denim Jacket",
    category: "outerwear",
    url: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&q=80",
  },
  {
    id: "img_acc_bag",
    name: "Leather Crossbody Bag",
    category: "accessories",
    url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
  },
  {
    id: "img_acc_sunglasses",
    name: "Classic Aviator Sunglasses",
    category: "accessories",
    url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=800&fit=crop",
  },
];

const CONDITION_OPTIONS = [
  "Brand New",
  "Like New",
  "Excellent",
  "Good",
  "Fair",
];
const SIZE_OPTIONS = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "26",
  "28",
  "30",
  "32",
  "34",
  "36",
  "One Size",
];

export default function AddSKUPage() {
  const router = useRouter();

  // Basic states
  const [listingType, setListingType] = useState("retail"); // 'retail' or 'thrift'
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("Urban Basics");
  const [selectedCategories, setSelectedCategories] = useState(["men"]);
  const [subcategory, setSubcategory] = useState("T-Shirts");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState(""); // for thrift
  const [discountedPrice, setDiscountedPrice] = useState(""); // for retail
  const [condition, setCondition] = useState("Excellent"); // for thrift
  const [description, setDescription] = useState("");
  const [material, setMaterial] = useState("100% Organic Cotton");
  const [careInstructions, setCareInstructions] = useState(
    "Machine wash cold, air dry",
  );
  const [featuresText, setFeaturesText] = useState(
    "Breathable fabric\nReinforced seams",
  );

  // Attributes
  const [selectedSizes, setSelectedSizes] = useState(["M", "L"]);
  const [colors, setColors] = useState([
    { name: "Classic Black", hex: "#000000" },
    { name: "Off White", hex: "#FDFBF7" },
  ]);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#E0356A");

  // Image handling
  const [selectedImagePreset, setSelectedImagePreset] = useState(
    IMAGE_PRESETS[0].url,
  );
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [activeImageTab, setActiveImageTab] = useState("presets"); // 'presets' | 'custom' | 'upload'
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [uploadStatus, setUploadStatus] = useState("idle"); // 'idle' | 'uploading' | 'done' | 'error'
  const fileInputRef = useRef(null);

  // Wizard/Status
  const [currentStep, setCurrentStep] = useState(1); // 1: edit, 2: success
  const [skuId, setSkuId] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Help tooltip states
  const [showThriftHelp, setShowThriftHelp] = useState(false);
  const primaryCategory = selectedCategories[0] || "";

  // Dynamically update subcategory when category changes
  useEffect(() => {
    const list = subcategories[primaryCategory];
    if (list && list.length > 0) {
      setSubcategory(list[0]);
    } else {
      setSubcategory("");
    }
  }, [primaryCategory]);

  const handleToggleCategory = (nextCategory) => {
    setSelectedCategories((prev) => {
      if (prev.includes(nextCategory)) {
        return prev.filter((categoryId) => categoryId !== nextCategory);
      }

      return [...prev, nextCategory];
    });
  };

  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    setColors([...colors, { name: newColorName.trim(), hex: newColorHex }]);
    setNewColorName("");
  };

  const handleRemoveColor = (index) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleToggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!name.trim()) tempErrors.name = "Product name is required";
    if (!price || isNaN(price) || parseFloat(price) <= 0) {
      tempErrors.price = "Valid selling price is required";
    }
    if (listingType === "thrift") {
      if (
        !originalPrice ||
        isNaN(originalPrice) ||
        parseFloat(originalPrice) <= 0
      ) {
        tempErrors.originalPrice = "Valid original retail price is required";
      }
    }
    if (selectedSizes.length === 0) {
      tempErrors.sizes = "At least one size must be selected";
    }
    if (selectedCategories.length === 0) {
      tempErrors.category = "At least one category must be selected";
    }
    if (colors.length === 0) {
      tempErrors.colors = "At least one color option is required";
    }
    if (
      activeImageTab === "custom" &&
      customImageUrl &&
      !customImageUrl.startsWith("http")
    ) {
      tempErrors.imageUrl = "Image URL must be valid link (starts with http)";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // ── Handle file upload to Firebase Storage via API route
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadStatus("uploading");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/instastyle/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setUploadedImageUrl(data.url);
        setUploadStatus("done");
      } else {
        setUploadStatus("error");
        console.error("Upload failed:", data.error);
      }
    } catch (err) {
      setUploadStatus("error");
      console.error("Upload error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    const generatedId = `custom_prod_${Date.now()}`;
    setSkuId(generatedId);

    let finalImageUrl;
    if (activeImageTab === "presets") finalImageUrl = selectedImagePreset;
    else if (activeImageTab === "upload")
      finalImageUrl = uploadedImageUrl || IMAGE_PRESETS[0].url;
    else finalImageUrl = customImageUrl || IMAGE_PRESETS[0].url;

    const finalFeatures = featuresText
      .split("\n")
      .filter((f) => f.trim().length > 0);

    const finalProduct = {
      id: generatedId,
      name: name.trim(),
      brand: brand.trim(),
      category: primaryCategory,
      categories: selectedCategories,
      subcategory: subcategory,
      price: parseFloat(price),
      discountedPrice:
        listingType === "retail" && discountedPrice
          ? parseFloat(discountedPrice)
          : null,
      discountPercentage:
        listingType === "retail" && discountedPrice
          ? Math.round(
              ((parseFloat(price) - parseFloat(discountedPrice)) /
                parseFloat(price)) *
                100,
            )
          : 0,
      sizes: selectedSizes,
      colors: colors.map((c) => ({
        name: c.name,
        hex: c.hex,
        images: [finalImageUrl],
      })),
      images: [
        { url: finalImageUrl, alt: name.trim(), isPrimary: true, order: 1 },
      ],
      description:
        description.trim() ||
        `Premium quality ${subcategory} listed by user. Perfect for creating curated fashion styles.`,
      material: material.trim(),
      careInstructions: careInstructions.trim(),
      features:
        finalFeatures.length > 0
          ? finalFeatures
          : ["Premium material", "Comfortable fit"],
      inStock: true,
      inventory: selectedSizes.reduce((acc, curr) => {
        acc[curr] = listingType === "thrift" ? 1 : 12;
        return acc;
      }, {}),
      rating: 5.0,
      reviewCount: 0,
      tags:
        listingType === "thrift"
          ? ["thrift", "vintage", primaryCategory, subcategory.toLowerCase()]
          : ["new-in", primaryCategory, subcategory.toLowerCase()],
      isFeatured: false,
      isThrift: listingType === "thrift",
      condition: listingType === "thrift" ? condition : null,
      originalPrice:
        listingType === "thrift" ? parseFloat(originalPrice) : null,
      slug: name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-"),
      timestamp: Date.now(),
    };

    // 1. Optimistic local save
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("instastyle_custom_products");
        const list = saved ? JSON.parse(saved) : [];
        list.push(finalProduct);
        localStorage.setItem(
          "instastyle_custom_products",
          JSON.stringify(list),
        );
      } catch (err) {
        console.error("localStorage save failed:", err);
      }
    }

    // 2. Persist via server-side API route (writes to Firestore)
    try {
      const res = await fetch("/api/instastyle/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalProduct),
      });
      const data = await res.json();
      if (data.success) {
        console.log("SKU saved to Firestore via API. DocID:", data.docId);
      } else {
        console.error("API save failed:", data.error);
      }
    } catch (err) {
      console.error("API call failed, product saved locally only:", err);
    }

    setIsSubmitting(false);
    setCurrentStep(2);
  };

  const getSubcategoryList = () => {
    return subcategories[primaryCategory] || [];
  };

  return (
    <div className={styles.page}>
      {/* Navigation Breadcrumb */}
      <div className={styles.container}>
        <nav className={styles.breadcrumb}>
          <Link href="/services/instastyle">InstaStyle</Link>
          <ChevronRight size={10} className={styles.crumbDivider} />
          <Link href="/services/instastyle/profile">Profile</Link>
          <ChevronRight size={10} className={styles.crumbDivider} />
          <span className={styles.activeCrumb}>Seller Portal</span>
        </nav>
      </div>

      <div className={styles.container}>
        {currentStep === 1 ? (
          <div className={styles.grid}>
            {/* LEFT SIDE: The Listing Form */}
            <motion.div
              className={styles.formPanel}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.header}>
                <div className={styles.chip}>InstaStyle Editorial Partner</div>
                <h1>Create New Listing</h1>
                <p>
                  Register standard brand merchandise or list authenticated
                  pre-loved garments on the circular thrift marketplace.
                </p>
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                {/* Type Selection */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Listing Category Type</label>
                  <div className={styles.typeTabs}>
                    <button
                      type="button"
                      className={`${styles.typeTab} ${listingType === "retail" ? styles.activeType : ""}`}
                      onClick={() => setListingType("retail")}
                    >
                      <Tag size={20} className={styles.tabIconLucide} />
                      <div>
                        <strong>Standard Retail SKU</strong>
                        <span>Brand-new seasonal collection</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      className={`${styles.typeTab} ${listingType === "thrift" ? styles.activeType : ""}`}
                      onClick={() => setListingType("thrift")}
                    >
                      <RefreshCw size={20} className={styles.tabIconLucide} />
                      <div>
                        <strong>Pre-loved Thrift Item</strong>
                        <span>Circular resale marketplace listing</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Section: Product Identification */}
                <div className={styles.sectionTitle}>
                  <span>1</span>
                  <Sliders size={16} />
                  Product Specifications
                </div>

                <div className={styles.row}>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="name">
                      Product Name *
                    </label>
                    <input
                      id="name"
                      className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                      placeholder="e.g. Vintage Wool Overcoat"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && (
                      <span className={styles.errorText}>
                        <AlertCircle
                          size={12}
                          style={{
                            display: "inline",
                            marginRight: 4,
                            verticalAlign: "middle",
                          }}
                        />
                        {errors.name}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="brand">
                      Brand / Designer *
                    </label>
                    <select
                      id="brand"
                      className={styles.select}
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    >
                      {listingType === "thrift" ? (
                        <>
                          <option value="Gucci">Gucci</option>
                          <option value="Saint Laurent">Saint Laurent</option>
                          <option value="Balenciaga">Balenciaga</option>
                          <option value="Levi's Vintage">Levi's Vintage</option>
                          <option value="Reformation">Reformation</option>
                          <option value="Acne Studios">Acne Studios</option>
                          <option value="Zara">Zara</option>
                          <option value="H&M Premium">H&M Premium</option>
                        </>
                      ) : (
                        brands.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="category">
                      Division Category *
                    </label>
                    <div
                      className={styles.categoryOptions}
                      role="group"
                      aria-label="Division categories"
                    >
                      {categories.map((c) => {
                        const active = selectedCategories.includes(c.id);
                        return (
                          <button
                            key={c.id}
                            type="button"
                            className={`${styles.categoryChip} ${active ? styles.categoryChipActive : ""}`}
                            onClick={() => handleToggleCategory(c.id)}
                          >
                            {c.name}
                          </button>
                        );
                      })}
                    </div>
                    <p className={styles.categoryHint}>
                      Choose one or more categories. The first selected category
                      drives the segment list.
                    </p>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="subcategory">
                      Fashion Segment *
                    </label>
                    <select
                      id="subcategory"
                      className={styles.select}
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                    >
                      {getSubcategoryList().map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Section: Price Details */}
                <div className={styles.sectionTitle}>
                  <span>2</span>
                  <Tag size={16} />
                  Pricing & Valuation
                </div>

                <div className={styles.row}>
                  {listingType === "retail" ? (
                    <>
                      <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="price">
                          Retail Price (₹) *
                        </label>
                        <input
                          id="price"
                          type="number"
                          className={`${styles.input} ${errors.price ? styles.inputError : ""}`}
                          placeholder="e.g. 2999"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                        {errors.price && (
                          <span className={styles.errorText}>
                            <AlertCircle
                              size={12}
                              style={{
                                display: "inline",
                                marginRight: 4,
                                verticalAlign: "middle",
                              }}
                            />
                            {errors.price}
                          </span>
                        )}
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="discPrice">
                          Marked Down Price (₹)
                          <span className={styles.optional}>Optional</span>
                        </label>
                        <input
                          id="discPrice"
                          type="number"
                          className={styles.input}
                          placeholder="e.g. 2499"
                          value={discountedPrice}
                          onChange={(e) => setDiscountedPrice(e.target.value)}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="price">
                          Selling Price (₹) *
                        </label>
                        <input
                          id="price"
                          type="number"
                          className={`${styles.input} ${errors.price ? styles.inputError : ""}`}
                          placeholder="e.g. 4500"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                        {errors.price && (
                          <span className={styles.errorText}>
                            <AlertCircle
                              size={12}
                              style={{
                                display: "inline",
                                marginRight: 4,
                                verticalAlign: "middle",
                              }}
                            />
                            {errors.price}
                          </span>
                        )}
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="origPrice">
                          Original Retail Value (₹) *
                        </label>
                        <input
                          id="origPrice"
                          type="number"
                          className={`${styles.input} ${errors.originalPrice ? styles.inputError : ""}`}
                          placeholder="e.g. 12000"
                          value={originalPrice}
                          onChange={(e) => setOriginalPrice(e.target.value)}
                        />
                        {errors.originalPrice && (
                          <span className={styles.errorText}>
                            <AlertCircle
                              size={12}
                              style={{
                                display: "inline",
                                marginRight: 4,
                                verticalAlign: "middle",
                              }}
                            />
                            {errors.originalPrice}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {listingType === "thrift" && (
                  <div className={styles.formGroup}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <label
                        className={styles.label}
                        htmlFor="condition"
                        style={{ marginBottom: 0 }}
                      >
                        Item Condition *
                      </label>
                      <button
                        type="button"
                        className={styles.helpTrigger}
                        onClick={() => setShowThriftHelp(!showThriftHelp)}
                      >
                        <HelpCircle size={14} /> Guide
                      </button>
                    </div>

                    <AnimatePresence>
                      {showThriftHelp && (
                        <motion.div
                          className={styles.helpBox}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <p>
                            <strong>Brand New:</strong> Unused with original
                            luxury tags.
                          </p>
                          <p>
                            <strong>Like New:</strong> Mint condition, worn
                            once/twice, no flaws.
                          </p>
                          <p>
                            <strong>Excellent:</strong> Minor wear, pristine
                            look, dry cleaned.
                          </p>
                          <p>
                            <strong>Good:</strong> Light signs of wear, fully
                            functional.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <select
                      id="condition"
                      className={styles.select}
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                    >
                      {CONDITION_OPTIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Section: Sizes & Colors */}
                <div className={styles.sectionTitle}>
                  <span>3</span>
                  <Plus size={16} />
                  Sizing & Colors
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Available Sizes *</label>
                  <div className={styles.sizesGrid}>
                    {SIZE_OPTIONS.map((size) => {
                      const isSelected = selectedSizes.includes(size);
                      return (
                        <motion.button
                          key={size}
                          type="button"
                          className={`${styles.sizeChip} ${isSelected ? styles.activeSize : ""}`}
                          onClick={() => handleToggleSize(size)}
                          whileTap={{ scale: 0.95 }}
                        >
                          {size}
                        </motion.button>
                      );
                    })}
                  </div>
                  {errors.sizes && (
                    <span className={styles.errorText}>
                      <AlertCircle
                        size={12}
                        style={{
                          display: "inline",
                          marginRight: 4,
                          verticalAlign: "middle",
                        }}
                      />
                      {errors.sizes}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Color Swatches *</label>
                  <div className={styles.activeColorsList}>
                    <AnimatePresence>
                      {colors.map((c, i) => (
                        <motion.div
                          key={i}
                          className={styles.activeColorCard}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                        >
                          <span
                            className={styles.colorIndicator}
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className={styles.colorLabel}>{c.name}</span>
                          <button
                            type="button"
                            className={styles.colorRemoveBtn}
                            onClick={() => handleRemoveColor(i)}
                          >
                            <Trash2 size={12} />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  {errors.colors && (
                    <span className={styles.errorText}>
                      <AlertCircle
                        size={12}
                        style={{
                          display: "inline",
                          marginRight: 4,
                          verticalAlign: "middle",
                        }}
                      />
                      {errors.colors}
                    </span>
                  )}

                  <div className={styles.addColorRow}>
                    <input
                      className={styles.colorInputText}
                      placeholder="e.g. Sage Green"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                    />
                    <div className={styles.colorPickerWrapper}>
                      <input
                        type="color"
                        className={styles.colorInputPicker}
                        value={newColorHex}
                        onChange={(e) => setNewColorHex(e.target.value)}
                      />
                      <span
                        className={styles.pickerOverlayIndicator}
                        style={{ backgroundColor: newColorHex }}
                      />
                    </div>
                    <button
                      type="button"
                      className={styles.addColorBtn}
                      onClick={handleAddColor}
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Section: Images */}
                <div className={styles.sectionTitle}>
                  <span>4</span>
                  <ImageIcon size={16} />
                  Visual Catalog
                </div>

                <div className={styles.formGroup}>
                  <div className={styles.imageSelectorTabs}>
                    <button
                      type="button"
                      className={`${styles.imageTabBtn} ${activeImageTab === "presets" ? styles.activeImageTab : ""}`}
                      onClick={() => setActiveImageTab("presets")}
                    >
                      Presets Gallery
                    </button>
                    <button
                      type="button"
                      className={`${styles.imageTabBtn} ${activeImageTab === "upload" ? styles.activeImageTab : ""}`}
                      onClick={() => setActiveImageTab("upload")}
                    >
                      Upload Photo
                    </button>
                    <button
                      type="button"
                      className={`${styles.imageTabBtn} ${activeImageTab === "custom" ? styles.activeImageTab : ""}`}
                      onClick={() => setActiveImageTab("custom")}
                    >
                      External URL
                    </button>
                  </div>

                  {activeImageTab === "presets" ? (
                    <div className={styles.imagePresetsGrid}>
                      {IMAGE_PRESETS.map((preset) => {
                        const isSelected = selectedImagePreset === preset.url;
                        return (
                          <div
                            key={preset.id}
                            className={`${styles.presetCard} ${isSelected ? styles.activePreset : ""}`}
                            onClick={() => setSelectedImagePreset(preset.url)}
                          >
                            <div className={styles.presetImageWrapper}>
                              <Image
                                src={preset.url}
                                alt={preset.name}
                                fill
                                sizes="(max-width: 768px) 33vw, 200px"
                                className={styles.presetImg}
                              />
                              {isSelected && (
                                <div className={styles.presetCheckBadge}>
                                  <Check size={10} strokeWidth={3} />
                                </div>
                              )}
                            </div>
                            <span className={styles.presetName}>
                              {preset.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : activeImageTab === "upload" ? (
                    <div className={styles.uploadZone}>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleFileUpload}
                      />
                      {uploadStatus === "done" && uploadedImageUrl ? (
                        <div className={styles.uploadPreviewWrap}>
                          <Image
                            src={uploadedImageUrl}
                            alt="Uploaded product"
                            width={800}
                            height={200}
                            className={styles.uploadPreviewImg}
                          />
                          <button
                            type="button"
                            className={styles.reuploadBtn}
                            onClick={() => {
                              setUploadedImageUrl("");
                              setUploadStatus("idle");
                              fileInputRef.current?.click();
                            }}
                          >
                            <RefreshCw size={12} /> Change Photo
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className={styles.uploadTriggerBtn}
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadStatus === "uploading"}
                        >
                          {uploadStatus === "uploading" ? (
                            <>
                              <RefreshCw
                                size={18}
                                className={styles.spinIcon}
                              />{" "}
                              Uploading to storage&hellip;
                            </>
                          ) : uploadStatus === "error" ? (
                            <>
                              <AlertCircle size={18} /> Upload failed &mdash;
                              tap to retry
                            </>
                          ) : (
                            <>
                              <ImageIcon size={18} /> Click to select product
                              photo
                              <br />
                              <span style={{ fontSize: "11px", opacity: 0.6 }}>
                                JPG · PNG · WEBP up to 8 MB
                              </span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className={styles.customUrlInputRow}>
                      <input
                        className={styles.input}
                        placeholder="Paste Unsplash or external product image link..."
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                      />
                      {errors.imageUrl && (
                        <span className={styles.errorText}>
                          <AlertCircle
                            size={12}
                            style={{
                              display: "inline",
                              marginRight: 4,
                              verticalAlign: "middle",
                            }}
                          />
                          {errors.imageUrl}
                        </span>
                      )}
                      <p className={styles.urlHint}>
                        Supply a direct image link. Unsplash URLs render
                        instantly in our design framework.
                      </p>
                    </div>
                  )}
                </div>

                {/* Section: Details, Material & Features */}
                <div className={styles.sectionTitle}>
                  <span>5</span>
                  <FileText size={16} />
                  Storytelling & Craft
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="description">
                    Creative Description
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    className={styles.storyTextarea}
                    placeholder="Tell customers about the weave, fit, history, and how to style it..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <p className={styles.sectionHint}>
                    ✦ Compelling descriptions increase buyer engagement by 3×
                  </p>
                </div>

                <div className={styles.row}>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="material">
                      Material Composition
                    </label>
                    <input
                      id="material"
                      className={styles.input}
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="care">
                      Garment Care
                    </label>
                    <input
                      id="care"
                      className={styles.input}
                      value={careInstructions}
                      onChange={(e) => setCareInstructions(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="features">
                    Key Product Highlights{" "}
                    <span className={styles.optional}>(one per line)</span>
                  </label>
                  <textarea
                    id="features"
                    rows={3}
                    className={styles.featuresTextarea}
                    placeholder={`e.g. Crafted in Italy\nEco-conscious linen blend\nAuthenticated by our curators`}
                    value={featuresText}
                    onChange={(e) => setFeaturesText(e.target.value)}
                  />
                  <p className={styles.sectionHint}>
                    ✦ Each line becomes a bullet on the product detail page
                  </p>
                </div>

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw
                        size={15}
                        className={styles.spinIcon}
                        style={{ marginRight: 8 }}
                      />{" "}
                      Saving SKU&hellip;
                    </>
                  ) : (
                    "Publish to InstaStyle Catalog"
                  )}
                </button>
              </form>
            </motion.div>

            {/* RIGHT SIDE: Realtime SKU Live Preview Card */}
            <div className={styles.previewPanel}>
              <div className={styles.previewSticky}>
                <div className={styles.previewTitle}>
                  <Eye
                    size={12}
                    style={{ marginRight: 6, verticalAlign: "middle" }}
                  />
                  Realtime Editorial Card
                </div>
                <div className={styles.previewCardOuter}>
                  <div className={styles.productCard}>
                    <div className={styles.imageWrapper}>
                      {listingType === "thrift" ? (
                        <>
                          <span className={styles.badge}>
                            <Sparkles
                              size={8}
                              style={{ marginRight: 4, display: "inline" }}
                            />
                            Authenticated
                          </span>
                          <span className={styles.condition}>{condition}</span>
                        </>
                      ) : (
                        discountedPrice && (
                          <span className={styles.badge}>On Sale</span>
                        )
                      )}
                      <img
                        src={
                          activeImageTab === "presets"
                            ? selectedImagePreset
                            : activeImageTab === "upload"
                              ? uploadedImageUrl ||
                                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop"
                              : customImageUrl ||
                                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop"
                        }
                        alt={name || "Preview Product"}
                        className={styles.image}
                      />
                    </div>
                    <div className={styles.info}>
                      <p className={styles.brandName}>{brand}</p>
                      <h3 className={styles.nameLabel}>
                        {name || "Editorial Knit Knitwear"}
                      </h3>

                      <div className={styles.previewSizesRow}>
                        <span>Sizes: {selectedSizes.join(", ") || "None"}</span>
                      </div>

                      <div className={styles.colorsPreviewRow}>
                        {colors.map((c, idx) => (
                          <span
                            key={idx}
                            className={styles.colorIndicator}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        ))}
                      </div>

                      <div className={styles.priceRow}>
                        {listingType === "retail" ? (
                          <>
                            <p className={styles.priceVal}>
                              ₹
                              {(
                                discountedPrice ||
                                price ||
                                1999
                              ).toLocaleString()}
                            </p>
                            {discountedPrice && price && (
                              <p className={styles.origVal}>
                                ₹{parseFloat(price).toLocaleString()}
                              </p>
                            )}
                          </>
                        ) : (
                          <>
                            <p className={styles.priceVal}>
                              ₹{(price || 4500).toLocaleString()}
                            </p>
                            <p className={styles.origVal}>
                              ₹{(originalPrice || 12000).toLocaleString()}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.specsWidget}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 12,
                    }}
                  >
                    <Info size={12} style={{ color: "#bbb" }} />
                    <h3>Listing Specifications</h3>
                  </div>
                  <ul>
                    <li>
                      Type:{" "}
                      <strong>
                        {listingType === "retail"
                          ? "Retail Catalog"
                          : "Pre-loved Thrift"}
                      </strong>
                    </li>
                    <li>
                      Categories:{" "}
                      <strong>{selectedCategories.join(", ") || "None"}</strong>
                    </li>
                    <li>
                      Subcategory: <strong>{subcategory}</strong>
                    </li>
                    <li>
                      Material: <strong>{material}</strong>
                    </li>
                    <li>
                      Care: <strong>{careInstructions}</strong>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Success Wizard Screen */
          <motion.div
            className={styles.successPanel}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.successCard}>
              <div className={styles.successIcon}>
                <CheckCircle2 size={32} />
              </div>
              <h2>SKU Created Successfully!</h2>
              <p className={styles.successDesc}>
                Your collection piece has been cataloged. Listing reference ID
                is <strong>{skuId}</strong>. It is now actively synced into the
                fashion ecosystem.
              </p>

              <div className={styles.successActions}>
                {listingType === "thrift" ? (
                  <Link
                    href="/services/instastyle/thrift"
                    className={styles.successBtnPrimary}
                  >
                    View in Thrift Marketplace
                  </Link>
                ) : (
                  <Link
                    href="/services/instastyle/catalog"
                    className={styles.successBtnPrimary}
                  >
                    View in Shop Catalog
                  </Link>
                )}

                <Link
                  href={`/services/instastyle/products/${skuId}`}
                  className={styles.successBtnSecondary}
                >
                  Open Product Detail
                </Link>

                <button
                  onClick={() => {
                    setName("");
                    setPrice("");
                    setOriginalPrice("");
                    setDiscountedPrice("");
                    setDescription("");
                    setCurrentStep(1);
                  }}
                  className={styles.successBtnText}
                >
                  Create another listing
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
