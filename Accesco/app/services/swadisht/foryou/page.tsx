'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './foryou.module.css';
import SwadishttHeader from '../components/SwadishttHeader';
import { useSwadishtt } from '../contexts/SwadishttContext';

const MASTER_MENU = [
  { id: '1', name: 'Butter Chicken', restaurant: 'Punjabi Tadka', price: 350, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&h=400&fit=crop', cuisine: 'North Indian', tags: ['Bestseller', 'Spicy', 'Gravy'], mood: ['Comfort', 'Rich'], isVeg: false },
  { id: '2', name: 'Palak Paneer', restaurant: 'South Spice', price: 120, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop', cuisine: 'North Indian', tags: ['Healthy', 'Classic'], mood: ['Light', 'Comfort'], isVeg: true },
  { id: '3', name: 'Mutton Biryani', restaurant: 'Dum Pukht', price: 420, image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=600&h=400&fit=crop', cuisine: 'Mughlai', tags: ['Bestseller', 'Aromatic', 'Rice'], mood: ['Festive', 'Rich'], isVeg: false },
  { id: '4', name: 'Dal Makhani', restaurant: 'Tandoor House', price: 280, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop', cuisine: 'North Indian', tags: ['Classic', 'Gravy'], mood: ['Rich', 'Comfort'], isVeg: true },
  { id: '5', name: 'Chicken Tikka Masala', restaurant: 'Amritsari Dhaba', price: 180, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop', cuisine: 'North Indian', tags: ['Classic', 'Spicy'], mood: ['Hearty', 'Comfort'], isVeg: false },
  { id: '6', name: 'Paneer Butter Masala', restaurant: 'Pizza Studio', price: 299, image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&h=400&fit=crop', cuisine: 'North Indian', tags: ['Classic', 'Rich', 'Bestseller'], mood: ['Comfort', 'Party'], isVeg: true },
  { id: '7', name: 'Fish Curry', restaurant: 'Wok Master', price: 220, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&h=400&fit=crop', cuisine: 'Coastal', tags: ['Spicy', 'Gravy'], mood: ['Quick Bite', 'Comfort'], isVeg: false },
  { id: '8', name: 'Chole Bhature', restaurant: 'Punjabi Tadka', price: 240, image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&h=400&fit=crop', cuisine: 'North Indian', tags: ['Fried', 'Classic', 'Heavy'], mood: ['Rich', 'Comfort'], isVeg: true },
  { id: '9', name: 'Tandoori Chicken', restaurant: 'Kashmiri Wazwan', price: 480, image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&h=400&fit=crop', cuisine: 'North Indian', tags: ['Spicy', 'Tandoor', 'Premium'], mood: ['Festive', 'Rich'], isVeg: false },
  { id: '10', name: 'Malai Kofta', restaurant: 'South Spice', price: 290, image: 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?w=600&h=400&fit=crop', cuisine: 'North Indian', tags: ['Rich', 'Gravy'], mood: ['Comfort', 'Festive'], isVeg: true },
  { id: '11', name: 'Pasta Alfredo', restaurant: 'Italian Bistro', price: 320, image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=600&h=400&fit=crop', cuisine: 'Italian', tags: ['Cheesy', 'Pasta', 'Mild'], mood: ['Comfort', 'Rich'], isVeg: true },
  { id: '12', name: 'Fish Amritsari', restaurant: 'Amritsari Dhaba', price: 380, image: 'https://images.unsplash.com/photo-1599487405270-87a32d6abda9?w=600&h=400&fit=crop', cuisine: 'Punjabi', tags: ['Starter', 'Fried', 'Spicy'], mood: ['Snack', 'Party'], isVeg: false },
];

export default function ForYouPage() {
  const { addToCart } = useSwadishtt();
  const [recommendedDishes, setRecommendedDishes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('swadisht_user_preferences');
      if (!storedData) {
        setIsLoading(false);
        return;
      }

      const likedDishes = JSON.parse(storedData);
      
      if (!Array.isArray(likedDishes) || likedDishes.length === 0) {
        setIsLoading(false);
        return;
      }

      // Create frequency map
      const frequencyMap: Record<string, number> = {};
      
      likedDishes.forEach(dish => {
        // Find full details from MASTER_MENU if storage only has minimal data
        const fullDish = MASTER_MENU.find(m => m.id === dish.id || m.id === dish.dishid) || dish;

        if (fullDish.cuisine) {
          frequencyMap[fullDish.cuisine] = (frequencyMap[fullDish.cuisine] || 0) + 2;
        }
        if (Array.isArray(fullDish.tags)) {
          fullDish.tags.forEach((tag: string) => {
            frequencyMap[tag] = (frequencyMap[tag] || 0) + 1;
          });
        }
        if (Array.isArray(fullDish.mood)) {
          fullDish.mood.forEach((m: string) => {
            frequencyMap[m] = (frequencyMap[m] || 0) + 1.5;
          });
        }
      });

      const likedIds = new Set(likedDishes.map(d => d.id || d.dishid));

      // Calculate match score
      const scoredDishes = MASTER_MENU
        .filter(dish => !likedIds.has(dish.id))
        .map(dish => {
          let score = 0;
          if (frequencyMap[dish.cuisine]) score += frequencyMap[dish.cuisine];
          dish.tags.forEach(tag => {
            if (frequencyMap[tag]) score += frequencyMap[tag];
          });
          dish.mood.forEach(m => {
            if (frequencyMap[m]) score += frequencyMap[m];
          });
          return { ...dish, matchScore: score, matchPercentage: 0 };
        });

      scoredDishes.sort((a, b) => b.matchScore - a.matchScore);
      const topMatches = scoredDishes.filter(d => d.matchScore > 0);
      
      if (topMatches.length > 0) {
        const maxScore = topMatches[0].matchScore;
        topMatches.forEach(dish => {
          dish.matchPercentage = Math.round((dish.matchScore / maxScore) * 100);
          // Floor it to at least 50% for psychological effect if it has ANY match
          if (dish.matchPercentage < 50) dish.matchPercentage = Math.floor(50 + Math.random() * 20);
        });
      }

      setRecommendedDishes(topMatches.slice(0, 8));
    } catch (e) {
      console.error('Failed to generate recommendations', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      <SwadishttHeader />
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Recommended For You</h1>
          <p className={styles.subtitle}>Curated based on your unique taste profile</p>
        </header>

        {isLoading ? (
          <div className={styles.emptyState}>
            <h2>Analyzing your taste profile...</h2>
          </div>
        ) : recommendedDishes.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>No matches found yet</h2>
            <p>Swipe on more dishes to get personalized recommendations.</p>
            <Link href="/services/swadisht" style={{ display: 'inline-block', backgroundColor: '#dc2626', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
              Customize Taste Profile
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {recommendedDishes.map((dish) => (
              <div key={dish.id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    className={styles.image}
                  />
                  <div className={styles.matchBadge}>
                    {dish.matchPercentage}% Match
                  </div>
                </div>
                
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.dishName}>{dish.name}</h3>
                    <div className={`${styles.vegIndicator} ${dish.isVeg ? styles.veg : styles.nonVeg}`}>
                      <span />
                    </div>
                  </div>
                  <p className={styles.restaurantName}>{dish.restaurant}</p>
                  <div className={styles.price}>₹{dish.price}</div>
                  
                  <div className={styles.tags}>
                    <span className={styles.tag}>{dish.cuisine}</span>
                    {dish.mood.slice(0, 2).map((m: string) => (
                      <span key={m} className={styles.tag}>{m}</span>
                    ))}
                  </div>

                  <div className={styles.actionArea}>
                    <button 
                      className={styles.addToCartBtn}
                      onClick={() => addToCart({ ...dish, price: dish.price })}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
