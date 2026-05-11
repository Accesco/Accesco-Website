/**
 * Thali Engine Page
 * @page /services/swadisht/thali-engine
 * @description Festival thalis with cultural authenticity - "Not search. A memory."
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSwadishtt } from '../contexts/SwadishttContext';
import SwadishttHeader from '../components/SwadishttHeader';
import { THALI_RECIPES, getThalisByCategory } from '../lib/thaliData';
import styles from './thali-engine.module.css';

// Hero Section
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
          <div className={styles.heroFeature}>
            <span className={styles.featureText}>FarmChain Traced</span>
          </div>
          <div className={styles.heroFeature}>
            <span className={styles.featureText}>Traditional Proportions</span>
          </div>
          <div className={styles.heroFeature}>
            <span className={styles.featureText}>Optional Cooking</span>
          </div>
          <div className={styles.heroFeature}>
            <span className={styles.featureText}>Cultural Stories</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Category Filter
function CategoryFilter({ activeCategory, onCategoryChange }) {
  const categories = [
    { id: 'all', name: 'All Thalis', icon: '' },
    { id: 'traditional', name: 'Traditional', icon: '' },
    { id: 'festival', name: 'Festival', icon: '' }
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

// Thali Card Component
function ThaliCard({ thali }) {
  const [showStory, setShowStory] = useState(false);
  
  return (
    <div className={styles.thaliCard}>
      <div className={styles.cardImage}>
        <img 
          src={thali.image} 
          alt={thali.name}
          onError={(e) => {
            e.target.src = `https://placehold.co/400x300/E23744/FFFFFF/png?text=${encodeURIComponent(thali.name)}`;
          }}
        />
        {thali.isBestseller && (
          <div className={styles.bestsellerBadge}>⭐ Bestseller</div>
        )}
        {thali.festival && (
          <div className={styles.festivalBadge}>{thali.festival}</div>
        )}
      </div>
      
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <h3 className={styles.thaliName}>{thali.name}</h3>
          <div className={styles.ratingBadge}>
            ★ {thali.rating}
          </div>
        </div>
        
        <p className={styles.description}>{thali.description}</p>
        
        <div className={styles.cardMeta}>
          <span className={styles.metaItem}>
            {thali.prepTime}
          </span>
          <span className={styles.metaDivider}>•</span>
          <span className={styles.metaItem}>
            Serves {thali.serves}
          </span>
          <span className={styles.metaDivider}>•</span>
          <span className={styles.metaItem}>
            {thali.components.length} dishes
          </span>
        </div>
        
        <div className={styles.components}>
          <h4 className={styles.componentsTitle}>Includes:</h4>
          <div className={styles.componentsList}>
            {thali.components.slice(0, 4).map((comp, idx) => (
              <span key={idx} className={styles.componentTag}>
                {comp.name}
              </span>
            ))}
            {thali.components.length > 4 && (
              <span className={styles.componentTag}>
                +{thali.components.length - 4} more
              </span>
            )}
          </div>
        </div>
        
        <div className={styles.nutrition}>
          <span className={styles.nutritionItem}>
            {thali.nutritionInfo.calories} cal
          </span>
          <span className={styles.nutritionItem}>
            Protein: {thali.nutritionInfo.protein}g
          </span>
          <span className={styles.nutritionItem}>
            Carbs: {thali.nutritionInfo.carbs}g
          </span>
          <span className={styles.nutritionItem}>
            Fats: {thali.nutritionInfo.fats}g
          </span>
        </div>
        
        <button 
          className={styles.storyBtn}
          onClick={() => setShowStory(!showStory)}
        >
          {showStory ? 'Hide' : 'Read'} Cultural Story
        </button>
        
        {showStory && (
          <div className={styles.culturalStory}>
            <h4 className={styles.storyTitle}>{thali.culturalStory.title}</h4>
            <p className={styles.storyContent}>{thali.culturalStory.content}</p>
            <div className={styles.traditions}>
              <h5>Traditions:</h5>
              <ul>
                {thali.culturalStory.traditions.map((tradition, idx) => (
                  <li key={idx}>{tradition}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        <div className={styles.cookingOptions}>
          <h4 className={styles.optionsTitle}>Choose Your Option:</h4>
          {thali.cookingOptions.map((option, idx) => (
            <div key={idx} className={styles.cookingOption}>
              <div className={styles.optionInfo}>
                <span className={styles.optionName}>{option.name}</span>
                <span className={styles.optionDesc}>{option.description}</span>
                <span className={styles.optionDelivery}>Delivery: {option.deliveryTime}</span>
              </div>
              <div className={styles.optionPrice}>
                <span className={styles.price}>₹{option.price}</span>
                <button className={styles.addBtn}>Add</button>
              </div>
            </div>
          ))}
        </div>
        
        <Link 
          href={`/services/swadisht/thali/${thali.id}`}
          className={styles.viewDetailsBtn}
        >
          View Full Details & Customize
        </Link>
      </div>
    </div>
  );
}

// Main Page Component
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
          <CategoryFilter 
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
          
          <div className={styles.thaliGrid}>
            {thalis.map(thali => (
              <ThaliCard key={thali.id} thali={thali} />
            ))}
          </div>
          
          {thalis.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🍛</div>
              <h3 className={styles.emptyTitle}>No thalis found</h3>
              <p className={styles.emptyText}>Try selecting a different category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// Edited Jabez: SwadishttProvider now lives in the layout for shared state.
export default function ThaliEnginePage() {
  return <ThaliEngineContent />;
}
