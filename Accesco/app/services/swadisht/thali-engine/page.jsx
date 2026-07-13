/**
 * Thali Engine Page
 * @page /services/swadisht/thali-engine
 * @description Festival thalis with cultural authenticity - "Not search. A memory."
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import SwadishttHeader from '../components/SwadishttHeader';
import { useSwadishtt } from '../contexts/SwadishttContext';
import { THALI_RECIPES, getThalisByCategory } from '../lib/thaliData';
import styles from './thali-engine.module.css';

// 1. Hero Section
function ThaliHero() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>The Thali Engine</h1>
        <p className={styles.heroTagline}>"Not search. A memory."</p>
        <p className={styles.heroDescription}>
          Recreate authentic festive meals—Sunday lunch, Eid, Onam, Navratri—with every dish, 
          ingredient, and proportion sourced, delivered, and optionally cooked. Not just food, but a memory.
        </p>
        
        <div className={styles.heroFeatures}>
          <div className={styles.heroFeature}><span className={styles.featureText}>FarmChain Traced</span></div>
          <div className={styles.heroFeature}><span className={styles.featureText}>Traditional Proportions</span></div>
          <div className={styles.heroFeature}><span className={styles.featureText}>Optional Cooking</span></div>
          <div className={styles.heroFeature}><span className={styles.featureText}>Cultural Stories</span></div>
        </div>
      </div>
    </div>
  );
}

// 2. Category Filter
function CategoryFilter({ activeCategory, onCategoryChange }) {
  const categories = [
    { id: 'all', name: 'All Thalis' },
    { id: 'traditional', name: 'Traditional' },
    { id: 'festival', name: 'Festival' }
  ];
  
  return (
    <div className={styles.categoryFilter}>
      {categories.map(cat => (
        <button
          key={cat.id}
          className={`${styles.categoryBtn} ${activeCategory === cat.id ? styles.active : ''}`}
          onClick={() => onCategoryChange(cat.id)}
        >
          <span className={styles.categoryName}>{cat.name}</span>
        </button>
      ))}
    </div>
  );
}

// 3. Main Thali Card Component (With Standardized Buy Options)
function ThaliCard({ thali }) {
  const { addToCart } = useSwadishtt();
  const [showStory, setShowStory] = useState(false);

  // Logic to ensure every thali has exactly 3 options like Sunday Thali
  const basePrice = thali.cookingOptions[0]?.price || 599;
  
  const standardizedOptions = [
    {
      name: 'Ready to Eat',
      description: 'Fully prepared, just heat and serve',
      deliveryTime: thali.cookingOptions[0]?.deliveryTime || '45-60 mins',
      price: basePrice
    },
    {
      name: 'Semi-Prepared',
      description: 'Pre-cut ingredients with recipe, cook at home',
      deliveryTime: '2-3 hours',
      price: basePrice - 100 
    },
    {
      name: 'Raw Ingredients Kit',
      description: 'Fresh ingredients with detailed recipe',
      deliveryTime: '4-5 hours',
      price: basePrice - 150
    }
  ];

  return (
    <div className={styles.thaliCard}>
      <div className={styles.cardImage}>
        <img 
          src={thali.image} 
          alt={thali.name}
          onError={(e) => {
            e.target.src = `https://placehold.co/400x300/520B24/FFFFFF/png?text=${encodeURIComponent(thali.name)}`;
          }}
        />
        {thali.isBestseller && <div className={styles.bestsellerBadge}>Bestseller</div>}
      </div>
      
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <div>
            <h3 className={styles.thaliName}>{thali.name}</h3>
            <span className={styles.skuText}>SKU: {thali.sku}</span>
          </div>
          <div className={styles.ratingBadge}>{thali.rating}</div>
        </div>
        
        <p className={styles.description}>{thali.description}</p>
        
        <div className={styles.cardMeta}>
          <span>{thali.prepTime}</span>
          <span>•</span>
          <span>Serves {thali.serves}</span>
          <span>•</span>
          <span>{thali.components.length} dishes</span>
        </div>

        <div className={styles.nutrition}>
          <div className={styles.nutritionItem}>
            <span className={styles.nutritionLabel}>Calories</span>
            <span className={styles.nutritionValue}>{thali.nutritionInfo.calories}</span>
          </div>
          <div className={styles.nutritionItem}>
            <span className={styles.nutritionLabel}>Protein</span>
            <span className={styles.nutritionValue}>{thali.nutritionInfo.protein}g</span>
          </div>
          <div className={styles.nutritionItem}>
            <span className={styles.nutritionLabel}>Carbs</span>
            <span className={styles.nutritionValue}>{thali.nutritionInfo.carbs}g</span>
          </div>
          <div className={styles.nutritionItem}>
            <span className={styles.nutritionLabel}>Fats</span>
            <span className={styles.nutritionValue}>{thali.nutritionInfo.fats}g</span>
          </div>
        </div>

        <div className={styles.components}>
          <h4 className={styles.componentsTitle}>Includes:</h4>
          <div className={styles.componentsList}>
            {thali.components.map((comp, idx) => (
              <span key={idx} className={styles.componentTag}>{comp.name}</span>
            ))}
          </div>
        </div>
        
        <button className={styles.storyBtn} onClick={() => setShowStory(!showStory)}>
          {showStory ? 'Hide' : 'Read'} Cultural Story
        </button>
        
        {showStory && (
          <div className={styles.culturalStory}>
            <h4 className={styles.storyTitle}>{thali.culturalStory.title}</h4>
            <p className={styles.storyContent}>{thali.culturalStory.content}</p>
          </div>
        )}
        
        <div className={styles.cookingOptions}>
          <h4 className={styles.optionsTitle}>Choose Your Option:</h4>
          {standardizedOptions.map((option, idx) => {
            const optionSku = `${thali.sku}-${option.name.toUpperCase().replace(/\s+/g, '-')}`;
            return (
              <div key={idx} className={styles.cookingOption}>
                <div className={styles.optionInfo}>
                  <span className={styles.optionName}>{option.name}</span>
                  <span className={styles.optionDesc}>{option.description}</span>
                  <span className={styles.optionDelivery}>
                    Delivery: <strong>{option.deliveryTime}</strong>
                  </span>
                </div>
                <div className={styles.optionPrice}>
                  <span className={styles.price}>₹{option.price}</span>
                  <button
                    className={styles.addBtn}
                    onClick={() => {
                      addToCart({
                        id: `${thali.id}-${idx}`,
                        name: `${thali.name} (${option.name})`,
                        price: option.price,
                        image: thali.image,
                        sku: optionSku,
                        restaurant: 'Swadishtt Festivals',
                        quantity: 1
                      });
                    }}
                  >
                    ADD
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        <Link href={`/services/swadisht/`} className={styles.viewDetailsBtn}>
          View Full Details & Customize
        </Link>
      </div>
    </div>
  );
}

// 4. Main Page Content Controller
function ThaliEngineContent() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [thalis, setThalis] = useState(THALI_RECIPES);
  
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    if (category === 'all') {
      setThalis(THALI_RECIPES);
    } else {
      setThalis(getThalisByCategory(category));
    }
  };
  
  return (
    <div className={styles.page}>
      <SwadishttHeader />
      <div className={styles.pageContent}>
        <ThaliHero />
        <div className={styles.container}>
          <CategoryFilter activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
          <div className={styles.thaliGrid}>
            {thalis.map(thali => (
              <ThaliCard key={thali.id} thali={thali} />
            ))}
          </div>
          {thalis.length === 0 && (
            <div className={styles.emptyState}>
              <h3 className={styles.emptyTitle}>No thalis found</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ThaliEnginePage() {
  return <ThaliEngineContent />;
}