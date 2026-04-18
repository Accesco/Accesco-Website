'use client';

/**
 * Healthy Mode Page
 * @page /services/swadisht/healthy-mode
 * @description Calorie, nutrition & vitamin-aware meal recommendations
 */

import { useState } from 'react';
import Link from 'next/link';
import { SwadishttProvider, useSwadishtt } from '../contexts/SwadishttContext';
import SwadishttHeader from '../components/SwadishttHeader';
import styles from './healthy-mode.module.css';

const HEALTH_GOALS = [
  { 
    id: 'weight-loss', 
    label: 'Weight Loss', 
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    calories: 1500,
    color: '#FF6B6B'
  },
  { 
    id: 'muscle-gain', 
    label: 'Muscle Gain', 
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6.5 6.5l11 11M6.5 17.5l11-11M3 12h3M18 12h3M12 3v3M12 18v3"/>
      </svg>
    ),
    calories: 2800,
    color: '#4ECDC4'
  },
  { 
    id: 'maintenance', 
    label: 'Maintenance', 
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
    calories: 2000,
    color: '#95E1D3'
  },
  { 
    id: 'heart-health', 
    label: 'Heart Health', 
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    calories: 1800,
    color: '#F38181'
  },
  { 
    id: 'diabetes', 
    label: 'Diabetes Friendly', 
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    calories: 1600,
    color: '#AA96DA'
  },
  { 
    id: 'pcos', 
    label: 'PCOS/PCOD', 
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a10 10 0 0 0-9.95 9h11.64L9.74 7.05a1 1 0 0 1 1.41-1.41l5.66 5.65a1 1 0 0 1 0 1.42l-5.66 5.65a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.41L13.69 13H2.05A10 10 0 1 0 12 2z"/>
      </svg>
    ),
    calories: 1700,
    color: '#FCBAD3'
  },
];

const HEALTHY_DISHES = [
  {
    id: 'hd-1',
    name: 'Grilled Chicken Salad',
    restaurant: 'Green Bowl',
    calories: 320,
    protein: 38,
    carbs: 18,
    fats: 10,
    fiber: 6,
    healthScore: 9.2,
    price: 280,
    tags: ['High Protein', 'Low Carb', 'Gluten Free'],
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    goals: ['weight-loss', 'muscle-gain', 'maintenance'],
    vitamins: ['B12', 'D', 'Iron'],
  },
  {
    id: 'hd-2',
    name: 'Quinoa Buddha Bowl',
    restaurant: 'Nourish Kitchen',
    calories: 380,
    protein: 14,
    carbs: 52,
    fats: 12,
    fiber: 9,
    healthScore: 9.5,
    price: 320,
    tags: ['Vegan', 'High Fiber', 'Antioxidants'],
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    goals: ['weight-loss', 'heart-health', 'pcos'],
    vitamins: ['C', 'E', 'Iron', 'Calcium'],
  },
  {
    id: 'hd-3',
    name: 'Dal Palak',
    restaurant: 'Satvik Kitchen',
    calories: 240,
    protein: 12,
    carbs: 32,
    fats: 6,
    fiber: 8,
    healthScore: 8.8,
    price: 160,
    tags: ['Iron Rich', 'Low Fat', 'Diabetic Friendly'],
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    goals: ['diabetes', 'heart-health', 'pcos', 'weight-loss'],
    vitamins: ['A', 'C', 'Iron', 'Folate'],
  },
  {
    id: 'hd-4',
    name: 'Egg White Omelette',
    restaurant: 'Protein Hub',
    calories: 180,
    protein: 24,
    carbs: 4,
    fats: 7,
    fiber: 1,
    healthScore: 8.6,
    price: 140,
    tags: ['High Protein', 'Low Calorie', 'Keto'],
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop',
    goals: ['weight-loss', 'muscle-gain', 'diabetes'],
    vitamins: ['B12', 'D', 'B2'],
  },
  {
    id: 'hd-5',
    name: 'Oats Idli',
    restaurant: 'South Healthy',
    calories: 200,
    protein: 8,
    carbs: 36,
    fats: 3,
    fiber: 5,
    healthScore: 8.4,
    price: 120,
    tags: ['Low GI', 'Heart Healthy', 'Diabetic Friendly'],
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop',
    goals: ['diabetes', 'heart-health', 'weight-loss'],
    vitamins: ['B1', 'Magnesium', 'Zinc'],
  },
  {
    id: 'hd-6',
    name: 'Sprouts Chaat',
    restaurant: 'Fitbowl',
    calories: 160,
    protein: 10,
    carbs: 24,
    fats: 2,
    fiber: 7,
    healthScore: 9.0,
    price: 100,
    tags: ['Protein Rich', 'Low Fat', 'Probiotic'],
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
    goals: ['weight-loss', 'pcos', 'maintenance'],
    vitamins: ['C', 'K', 'Folate'],
  },
];

function GoalSelector({ selectedGoal, onSelect }) {
  return (
    <div className={styles.goalSection}>
      <h2 className={styles.sectionTitle}>What's your health goal?</h2>
      <div className={styles.goalScrollContainer}>
        <div className={styles.goalRow}>
          {HEALTH_GOALS.map((goal) => (
            <button
              key={goal.id}
              className={`${styles.goalCard} ${selectedGoal?.id === goal.id ? styles.goalActive : ''}`}
              onClick={() => onSelect(goal)}
              style={{
                '--goal-color': goal.color,
                borderColor: selectedGoal?.id === goal.id ? goal.color : '#E8E8E8'
              }}
            >
              <div className={styles.goalIconWrapper}>
                {goal.icon}
              </div>
              <span className={styles.goalLabel}>{goal.label}</span>
              <span className={styles.goalCalories}>{goal.calories} cal/day</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CalorieTracker({ goal, consumed }) {
  const remaining = goal.calories - consumed;
  const pct = Math.min((consumed / goal.calories) * 100, 100);
  const color = pct > 90 ? '#E23744' : pct > 70 ? '#FFB800' : '#1C8B3C';

  return (
    <div className={styles.trackerCard}>
      <div className={styles.trackerHeader}>
        <div>
          <h3 className={styles.trackerTitle}>Daily Calorie Tracker</h3>
          <p className={styles.trackerGoal}>Goal: {goal.label} • {goal.calories} cal/day</p>
        </div>
        <div className={styles.trackerNumbers}>
          <span className={styles.consumed}>{consumed}</span>
          <span className={styles.trackerSep}>/</span>
          <span className={styles.total}>{goal.calories}</span>
          <span className={styles.calLabel}>cal</span>
        </div>
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${pct}%`, background: color }}
        />
      </div>

      <div className={styles.trackerStats}>
        <div className={styles.trackerStat}>
          <span className={styles.statValue} style={{ color: '#1C8B3C' }}>{consumed}</span>
          <span className={styles.statLabel}>Consumed</span>
        </div>
        <div className={styles.trackerStat}>
          <span className={styles.statValue} style={{ color: remaining < 0 ? '#E23744' : '#1976D2' }}>
            {remaining < 0 ? `+${Math.abs(remaining)}` : remaining}
          </span>
          <span className={styles.statLabel}>{remaining < 0 ? 'Over' : 'Remaining'}</span>
        </div>
        <div className={styles.trackerStat}>
          <span className={styles.statValue}>{Math.round(pct)}%</span>
          <span className={styles.statLabel}>Complete</span>
        </div>
      </div>
    </div>
  );
}

function DishCard({ dish, onAdd }) {
  const scoreColor = dish.healthScore >= 9 ? '#1C8B3C' : dish.healthScore >= 8 ? '#FFB800' : '#E23744';

  return (
    <div className={styles.dishCard}>
      <div className={styles.dishImageWrap}>
        <img
          src={dish.image}
          alt={dish.name}
          onError={(e) => {
            e.target.src = `https://placehold.co/320x180/1C8B3C/FFFFFF/png?text=${encodeURIComponent(dish.name)}`;
          }}
        />
        <div className={styles.healthScoreBadge} style={{ background: scoreColor }}>
          ⭐ {dish.healthScore}/10
        </div>
        <div className={styles.vegBadge}>
          <span className={dish.isVeg ? styles.vegDot : styles.nonVegDot} />
        </div>
      </div>

      <div className={styles.dishContent}>
        <div className={styles.dishHeader}>
          <div>
            <h3 className={styles.dishName}>{dish.name}</h3>
            <p className={styles.dishRestaurant}>{dish.restaurant}</p>
          </div>
          <span className={styles.dishPrice}>₹{dish.price}</span>
        </div>

        <div className={styles.macroRow}>
          <div className={styles.macro}>
            <span className={styles.macroVal}>{dish.calories}</span>
            <span className={styles.macroLabel}>calories</span>
          </div>
          <div className={styles.macroDivider} />
          <div className={styles.macro}>
            <span className={styles.macroVal}>{dish.protein}g</span>
            <span className={styles.macroLabel}>protein</span>
          </div>
          <div className={styles.macroDivider} />
          <div className={styles.macro}>
            <span className={styles.macroVal}>{dish.carbs}g</span>
            <span className={styles.macroLabel}>carbs</span>
          </div>
          <div className={styles.macroDivider} />
          <div className={styles.macro}>
            <span className={styles.macroVal}>{dish.fats}g</span>
            <span className={styles.macroLabel}>fats</span>
          </div>
        </div>

        <div className={styles.tagRow}>
          {dish.tags.map((t) => (
            <span key={t} className={styles.dishTag}>{t}</span>
          ))}
        </div>

        <div className={styles.vitaminRow}>
          <span className={styles.vitaminLabel}>Vitamins:</span>
          {dish.vitamins.map((v) => (
            <span key={v} className={styles.vitaminBadge}>{v}</span>
          ))}
        </div>

        <button className={styles.addBtn} onClick={() => onAdd(dish)}>
          Add to Order
        </button>
      </div>
    </div>
  );
}

function HealthyModeContent() {
  const { addToCart } = useSwadishtt();
  const [selectedGoal, setSelectedGoal] = useState(HEALTH_GOALS[0]);
  const [consumed, setConsumed] = useState(820);

  const filteredDishes = HEALTHY_DISHES.filter((d) =>
    d.goals.includes(selectedGoal.id)
  );

  const handleAdd = (dish) => {
    addToCart({ id: dish.id, name: dish.name, price: dish.price, image: dish.image });
    setConsumed((c) => c + dish.calories);
  };

  return (
    <div className={styles.pageContent}>
      <SwadishttHeader />

      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Healthy Mode</h1>
        <p className={styles.heroSub}>
          Calorie-aware, nutrition-tracked meals tailored to your health goals
        </p>
      </div>

      <div className={styles.container}>
        <GoalSelector selectedGoal={selectedGoal} onSelect={setSelectedGoal} />
        <CalorieTracker goal={selectedGoal} consumed={consumed} />

        <div className={styles.dishesSection}>
          <h2 className={styles.sectionTitle}>
            Recommended for {selectedGoal.label}
            <span className={styles.dishCount}>{filteredDishes.length} dishes</span>
          </h2>
          <div className={styles.dishGrid}>
            {filteredDishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} onAdd={handleAdd} />
            ))}
          </div>
        </div>

        <div className={styles.tipsSection}>
          <h2 className={styles.sectionTitle}>Nutrition Tips for Better Health</h2>
          <div className={styles.tipsGrid}>
            <div className={styles.tipCard}>
              <h3 className={styles.tipTitle}>Stay Hydrated</h3>
              <p className={styles.tipText}>Drink 8 glasses of water daily to boost metabolism and maintain energy levels throughout the day.</p>
            </div>

            <div className={styles.tipCard}>
              <h3 className={styles.tipTitle}>Meal Timing</h3>
              <p className={styles.tipText}>Eat every 3-4 hours to maintain stable blood sugar levels and prevent overeating.</p>
            </div>

            <div className={styles.tipCard}>
              <h3 className={styles.tipTitle}>Veggie Power</h3>
              <p className={styles.tipText}>Fill half your plate with vegetables at every meal for essential nutrients and fiber.</p>
            </div>

            <div className={styles.tipCard}>
              <h3 className={styles.tipTitle}>Move After Meals</h3>
              <p className={styles.tipText}>A 30-minute walk after meals aids digestion and helps regulate blood sugar significantly.</p>
            </div>

            <div className={styles.tipCard}>
              <h3 className={styles.tipTitle}>Quality Sleep</h3>
              <p className={styles.tipText}>Get 7-8 hours of quality sleep to support metabolism, recovery, and hormone balance.</p>
            </div>

            <div className={styles.tipCard}>
              <h3 className={styles.tipTitle}>Mindful Eating</h3>
              <p className={styles.tipText}>Eat slowly and mindfully to improve digestion and recognize fullness signals better.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HealthyModePage() {
  return (
    <SwadishttProvider>
      <HealthyModeContent />
    </SwadishttProvider>
  );
}
