'use client'

import React, { useState, useEffect, useMemo } from 'react';
import './calculator.css';
import AccescoHeader from '@/components/AccescoHeader';

// --------------------------------------------------------------------------
// STATE SEED DATA & CONFIG
// --------------------------------------------------------------------------
const DEFAULT_BUDGET = {
  total: 18000,
  grocery: 8000,
  food: 6000,
  fashion: 4000
};

// Seed Orders for initial persistent database state
const SEED_ORDERS = [
  {
    id: 'grokly-1',
    service: 'Grokly',
    category: 'grocery',
    date: '2026-07-14',
    amount: 642,
    items: [
      { name: 'Organic Tomatoes (500g)', price: 120 },
      { name: 'Fresh Ladyfinger (250g)', price: 80 },
      { name: 'Full Cream Milk (1L)', price: 68 },
      { name: 'Whole Wheat Atta (5kg)', price: 320 },
      { name: 'Fresh Sandwich Bread', price: 54 }
    ],
    icons: ['tomato', 'vegetable', 'milk']
  },
  {
    id: 'swadishtt-1',
    service: 'Swadishtt',
    category: 'food',
    date: '2026-07-13',
    amount: 438,
    items: [
      { name: 'Paneer Butter Masala', price: 240 },
      { name: 'Butter Tandoori Roti x3', price: 90 },
      { name: 'Crispy Veg Spring Rolls', price: 108 }
    ],
    icons: ['bowl', 'sandwich', 'springrolls']
  },
  {
    id: 'instastyle-1',
    service: 'InstaStyle',
    category: 'fashion',
    date: '2026-07-10',
    amount: 4039,
    items: [
      { name: 'Slim Fit Cotton Shirt', price: 1599 },
      { name: 'Classic Indigo Denim Jeans', price: 1990 },
      { name: 'Genuine Brown Leather Belt', price: 450 }
    ],
    icons: ['shirt', 'jeans', 'belt']
  },
  {
    id: 'order-apr-1',
    service: 'Grokly',
    category: 'grocery',
    date: '2026-04-03',
    amount: 1200,
    items: [
      { name: 'Fresh Vegetables', price: 400 },
      { name: 'Organic Milk 2L', price: 140 },
      { name: 'Whole Wheat Atta 5kg', price: 320 },
      { name: 'Paneer pack of 2', price: 340 }
    ],
    icons: ['vegetable', 'milk', 'paneer']
  },
  {
    id: 'order-apr-2',
    service: 'Swadishtt',
    category: 'food',
    date: '2026-04-08',
    amount: 1500,
    items: [
      { name: 'Family Butter Chicken Meal', price: 850 },
      { name: 'Garlic Naan x4', price: 250 },
      { name: 'Crispy Veg Spring Rolls', price: 400 }
    ],
    icons: ['bowl', 'springrolls']
  },
  {
    id: 'order-apr-3',
    service: 'InstaStyle',
    category: 'fashion',
    date: '2026-04-12',
    amount: 2400,
    items: [
      { name: 'Classic Indigo Denim Jeans', price: 1950 },
      { name: 'Brown Leather Belt', price: 450 }
    ],
    icons: ['jeans', 'belt']
  },
  {
    id: 'order-apr-4',
    service: 'Grokly',
    category: 'grocery',
    date: '2026-04-18',
    amount: 1900,
    items: [
      { name: 'Basmati Rice 5kg', price: 650 },
      { name: 'Refined Sunflower Oil 5L', price: 750 },
      { name: 'Tofu blocks', price: 500 }
    ],
    icons: ['tofu']
  },
  {
    id: 'order-apr-5',
    service: 'Swadishtt',
    category: 'food',
    date: '2026-04-24',
    amount: 2100,
    items: [
      { name: 'Gourmet Cheese Pizza', price: 600 },
      { name: 'Spaghetti Carbonara', price: 500 },
      { name: 'Fresh Sandwich Platters', price: 1000 }
    ],
    icons: ['bowl', 'sandwich']
  },
  {
    id: 'order-apr-6',
    service: 'Grokly',
    category: 'grocery',
    date: '2026-04-28',
    amount: 1700,
    items: [
      { name: 'Fresh Vegetables Assorted', price: 700 },
      { name: 'Sourdough Toast Bread', price: 480 },
      { name: 'Milk and Cream', price: 520 }
    ],
    icons: ['vegetable', 'bread', 'milk']
  },
  {
    id: 'order-may-1',
    service: 'Grokly',
    category: 'grocery',
    date: '2026-05-02',
    amount: 1500,
    items: [
      { name: 'Milk and Dairy', price: 650 },
      { name: 'Fresh Vegetables', price: 850 }
    ],
    icons: ['milk', 'vegetable']
  },
  {
    id: 'order-may-2',
    service: 'Swadishtt',
    category: 'food',
    date: '2026-05-09',
    amount: 1450,
    items: [
      { name: 'Paneer Butter Masala', price: 450 },
      { name: 'Tandoori Roti x5', price: 150 },
      { name: 'Butter Chicken Deluxe', price: 850 }
    ],
    icons: ['bowl']
  },
  {
    id: 'order-may-3',
    service: 'Grokly',
    category: 'grocery',
    date: '2026-05-15',
    amount: 2700,
    items: [
      { name: 'Whole Wheat Flour 10kg', price: 580 },
      { name: 'Greek Yogurt Pack of 4', price: 480 },
      { name: 'Fresh Organic Veggies', price: 860 },
      { name: 'Tofu & Paneer Platter', price: 780 }
    ],
    icons: ['vegetable', 'tofu', 'paneer']
  },
  {
    id: 'order-may-4',
    service: 'InstaStyle',
    category: 'fashion',
    date: '2026-05-22',
    amount: 3100,
    items: [
      { name: 'Slim Fit Cotton Shirt', price: 1590 },
      { name: 'Slim Denim Jeans', price: 1510 }
    ],
    icons: ['shirt', 'jeans']
  },
  {
    id: 'order-may-5',
    service: 'Swadishtt',
    category: 'food',
    date: '2026-05-27',
    amount: 2700,
    items: [
      { name: 'Premium Veg Biryani Box', price: 700 },
      { name: 'Starters & Appetizers', price: 1000 },
      { name: 'Desserts & Shakes', price: 1000 }
    ],
    icons: ['bowl']
  },
  {
    id: 'order-may-6',
    service: 'Grokly',
    category: 'grocery',
    date: '2026-05-29',
    amount: 1000,
    items: [
      { name: 'Fresh Sandwich Bread', price: 240 },
      { name: 'Premium Salted Butter', price: 360 },
      { name: 'Fresh Paneer', price: 400 }
    ],
    icons: ['bread', 'paneer']
  },
  {
    id: 'order-jun-1',
    service: 'Grokly',
    category: 'grocery',
    date: '2026-06-04',
    amount: 1700,
    items: [
      { name: 'Organic Tomatoes & Greens', price: 650 },
      { name: 'Tofu pack', price: 450 },
      { name: 'Milk 3L', price: 600 }
    ],
    icons: ['vegetable', 'tofu', 'milk']
  },
  {
    id: 'order-jun-2',
    service: 'Swadishtt',
    category: 'food',
    date: '2026-06-11',
    amount: 2100,
    items: [
      { name: 'Gourmet Italian Pizza', price: 1100 },
      { name: 'Tiramisu Dessert', price: 1000 }
    ],
    icons: ['bowl']
  },
  {
    id: 'order-jun-3',
    service: 'Grokly',
    category: 'grocery',
    date: '2026-06-16',
    amount: 2350,
    items: [
      { name: 'Assorted Cereals', price: 550 },
      { name: 'Exotic Fruits Box', price: 1200 },
      { name: 'Whole Wheat Bread x2', price: 600 }
    ],
    icons: ['bread']
  },
  {
    id: 'order-jun-4',
    service: 'InstaStyle',
    category: 'fashion',
    date: '2026-06-23',
    amount: 2800,
    items: [
      { name: 'Linen Summer Dress', price: 2350 },
      { name: 'Chic Sunglasses', price: 450 }
    ],
    icons: ['shirt']
  },
  {
    id: 'order-jun-5',
    service: 'Swadishtt',
    category: 'food',
    date: '2026-06-27',
    amount: 1800,
    items: [
      { name: 'Spiced Paneer Tikka', price: 800 },
      { name: 'Garlic Butter Naan x5', price: 1000 }
    ],
    icons: ['bowl']
  },
  {
    id: 'order-jun-6',
    service: 'Grokly',
    category: 'grocery',
    date: '2026-06-29',
    amount: 1550,
    items: [
      { name: 'Full Cream Milk pack', price: 300 },
      { name: 'Vegetables organic', price: 700 },
      { name: 'Paneer blocks', price: 550 }
    ],
    icons: ['milk', 'vegetable', 'paneer']
  }
];

// Helper to calculate month labels dynamically
const formatMonthLabel = (mStr) => {
  if (!mStr) return '';
  const parts = mStr.split('-');
  if (parts.length === 2) {
    const year = parts[0];
    const month = parseInt(parts[1], 10);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[month - 1]} ${year}`;
  }
  return mStr;
};

// Helper to format order dates elegantly
const formatOrderDate = (dateStr) => {
  if (!dateStr) return '';
  const todayStr = '2026-07-14';
  const yesterdayStr = '2026-07-13';

  if (dateStr === todayStr) return 'Today';
  if (dateStr === yesterdayStr) return 'Yesterday';

  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parts[0];
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${day} ${months[month - 1]}, ${year}`;
  }
  return dateStr;
};

// Helper to extract icons for items dynamically based on keywords
const getIconsForItems = (items) => {
  const icons = [];
  if (!items) return ['bowl'];
  items.forEach(it => {
    const name = (it.name || '').toLowerCase();
    if (name.includes('tomato') || name.includes('vegetable') || name.includes('veggie') || name.includes('greens') || name.includes('ladyfinger')) {
      if (!icons.includes('vegetable')) icons.push('vegetable');
    } else if (name.includes('milk') || name.includes('yogurt') || name.includes('cream')) {
      if (!icons.includes('milk')) icons.push('milk');
    } else if (name.includes('paneer')) {
      if (!icons.includes('paneer')) icons.push('paneer');
    } else if (name.includes('tofu')) {
      if (!icons.includes('tofu')) icons.push('tofu');
    } else if (name.includes('bread') || name.includes('toast') || name.includes('roti') || name.includes('naan')) {
      if (!icons.includes('bread')) icons.push('bread');
    } else if (name.includes('shirt') || name.includes('dress') || name.includes('t-shirt') || name.includes('top')) {
      if (!icons.includes('shirt')) icons.push('shirt');
    } else if (name.includes('jeans') || name.includes('denim') || name.includes('pant')) {
      if (!icons.includes('jeans')) icons.push('jeans');
    } else if (name.includes('belt') || name.includes('sunglasses')) {
      if (!icons.includes('belt')) icons.push('belt');
    } else if (name.includes('pizza') || name.includes('spaghetti') || name.includes('biryani') || name.includes('chicken') || name.includes('tikka') || name.includes('curry') || name.includes('masala')) {
      if (!icons.includes('bowl')) icons.push('bowl');
    } else if (name.includes('sandwich') || name.includes('burger')) {
      if (!icons.includes('sandwich')) icons.push('sandwich');
    } else if (name.includes('roll') || name.includes('springroll')) {
      if (!icons.includes('springrolls')) icons.push('springrolls');
    }
  });
  if (icons.length === 0) {
    icons.push('bowl');
  }
  return icons.slice(0, 3);
};

// Helper SVGs for illustrated order items
const renderItemIcon = (iconName) => {
  switch (iconName) {
    case 'tomato':
      return (
        <svg viewBox="0 0 24 24" className="thumbnail-vector-svg">
          <circle cx="12" cy="13" r="8" fill="#EF4444" />
          <path d="M12 5c-1-2-3-1-3-1s2 3 3 2c1 1 3-2 3-2s-2 1-3 1z" fill="#10B981" />
        </svg>
      );
    case 'vegetable':
      return (
        <svg viewBox="0 0 24 24" className="thumbnail-vector-svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 1.63-.52 3.14-1.1 4.39z" fill="#10B981" />
        </svg>
      );
    case 'milk':
      return (
        <svg viewBox="0 0 24 24" className="thumbnail-vector-svg">
          <path d="M9 2h6v3H9V2zm0 5h6c1.1 0 2 .9 2 2v11c0 1.1-.9 2-2 2H9c-1.1 0-2-.9-2-2V9c0-1.1.9-2 2-2zm3 4c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="#3B82F6" />
        </svg>
      );
    case 'bowl':
      return (
        <svg viewBox="0 0 24 24" className="thumbnail-vector-svg">
          <path d="M2 12c0 4.42 3.58 8 8 8h4c4.42 0 8-3.58 8-8v-2H2v2zm18-6H4v2h16V6z" fill="#F59E0B" />
        </svg>
      );
    case 'sandwich':
      return (
        <svg viewBox="0 0 24 24" className="thumbnail-vector-svg">
          <path d="M2 19h20L12 4 2 19zm3.12-2l6.88-10.32L18.88 17H5.12z" fill="#D97706" />
        </svg>
      );
    case 'springrolls':
      return (
        <svg viewBox="0 0 24 24" className="thumbnail-vector-svg">
          <rect x="3" y="6" width="18" height="12" rx="2" fill="#10B981" />
          <line x1="8" y1="6" x2="16" y2="18" stroke="#FFFFFF" strokeWidth="2" />
        </svg>
      );
    case 'shirt':
      return (
        <svg viewBox="0 0 24 24" className="thumbnail-vector-svg">
          <path d="M20.37 5.95l-4.22-1.92a2.1 2.1 0 0 0-1.78 0l-4.22 1.92L6 4.09V19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V4.09l2.37 1.86zM12 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" fill="#3B82F6" />
        </svg>
      );
    case 'jeans':
      return (
        <svg viewBox="0 0 24 24" className="thumbnail-vector-svg">
          <path d="M4 2h16v4l-2 14H6L4 6V2zm4 4h8v2H8V6zm4 4h6l-1 8H7l-1-8h6z" fill="#1D4ED8" />
        </svg>
      );
    case 'belt':
      return (
        <svg viewBox="0 0 24 24" className="thumbnail-vector-svg">
          <circle cx="12" cy="12" r="10" fill="none" stroke="#8B5CF6" strokeWidth="3" />
          <path d="M8 12h8" stroke="#8B5CF6" strokeWidth="3" />
        </svg>
      );
    case 'paneer':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <rect x="4" y="4" width="16" height="16" rx="3" fill="#FBBF24" />
          <circle cx="8" cy="8" r="1.5" fill="#FFFFFF" />
          <circle cx="14" cy="14" r="1.5" fill="#FFFFFF" />
        </svg>
      );
    case 'tofu':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <rect x="4" y="4" width="16" height="16" rx="2" fill="#E5E7EB" />
          <line x1="8" y1="4" x2="8" y2="20" stroke="#9CA3AF" />
          <line x1="14" y1="4" x2="14" y2="20" stroke="#9CA3AF" />
          <line x1="4" y1="10" x2="20" y2="10" stroke="#9CA3AF" />
        </svg>
      );
    case 'bread':
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M19.41 8.59l-4-4A2 2 0 0 0 14 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9.41a2 2 0 0 0-.59-1.41zM14 6v4h-4V6h4zM4 18V6h4v12H4zm12 0H10v-6h6v6z" fill="#D97706" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className="thumbnail-vector-svg">
          <rect width="18" height="18" x="3" y="3" rx="2" fill="currentColor" />
        </svg>
      );
  }
};

// --------------------------------------------------------------------------
// HELPER UTILITIES
// --------------------------------------------------------------------------
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const calculatePercentage = (part, total) => {
  if (!total) return 0;
  return Math.round((part / total) * 100);
};

const calculateTotalSpend = (categories) => {
  if (!categories) return 0;
  return Object.values(categories).reduce((sum, val) => sum + val, 0);
};

const getHighestCategory = (categories) => {
  if (!categories) return 'None';
  let maxVal = -1;
  let maxCat = 'Grocery';
  Object.entries(categories).forEach(([key, val]) => {
    if (val > maxVal) {
      maxVal = val;
      maxCat = key;
    }
  });
  return maxCat.charAt(0).toUpperCase() + maxCat.slice(1);
};


// --------------------------------------------------------------------------
// COMPONENT: XPENSE METER PAGE
// --------------------------------------------------------------------------
export default function XpenseMeterPage() {
  const [selectedMonth, setSelectedMonth] = useState('2026-05');
  const [budgetSettings, setBudgetSettings] = useState(DEFAULT_BUDGET);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Stateful orders
  const [orders, setOrders] = useState([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Dynamic notification system
  const [notifications, setNotifications] = useState([
    { id: 'notif-1', text: 'Your food budget is close to limit. You are at 69% for May.', time: '5 mins ago' },
    { id: 'notif-2', text: 'Grokly order of ₹642 was successfully completed.', time: '2 hours ago' },
    { id: 'notif-3', text: 'You saved ₹120 on delivery fees via Plus subscription!', time: 'Yesterday' }
  ]);

  const addNotification = (text) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      text,
      time: 'Just now'
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 5));
    setIsNotificationsOpen(true); // Auto reveal popover tray
  };

  // Load configuration and seed orders safely
  useEffect(() => {
    const savedBudgets = localStorage.getItem('xpense_meter_budgets');
    if (savedBudgets) {
      try {
        const parsed = JSON.parse(savedBudgets);
        if (parsed.total && parsed.grocery && parsed.food && parsed.fashion) {
          setBudgetSettings(parsed);
        }
      } catch (err) {
        console.error('Error loading budgets:', err);
      }
    }

    const savedOrders = localStorage.getItem('xpense_meter_orders_data');
    if (savedOrders) {
      try {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOrders(parsed);
          return;
        }
      } catch (err) {
        console.error('Error loading orders:', err);
      }
    }
    setOrders(SEED_ORDERS);
    localStorage.setItem('xpense_meter_orders_data', JSON.stringify(SEED_ORDERS));
  }, []);

  const saveOrdersToLocalStorage = (newOrders) => {
    setOrders(newOrders);
    localStorage.setItem('xpense_meter_orders_data', JSON.stringify(newOrders));
  };

  // Determine which months have orders to populate the dropdown
  const availableMonths = useMemo(() => {
    const months = new Set(['2026-04', '2026-05', '2026-06', '2026-07']);
    orders.forEach(o => {
      if (o.date && o.date.length >= 7) {
        months.add(o.date.substring(0, 7));
      }
    });
    return Array.from(months).sort().reverse();
  }, [orders]);

  // Compute active month data dynamically from orders list
  const monthDetails = useMemo(() => {
    const monthOrders = orders.filter(o => o.date && o.date.startsWith(selectedMonth));

    const categories = { grocery: 0, food: 0, fashion: 0 };
    monthOrders.forEach(o => {
      const cat = o.category.toLowerCase();
      if (cat in categories) {
        categories[cat] += o.amount;
      }
    });

    const weekly = [0, 0, 0, 0, 0];
    monthOrders.forEach(o => {
      const parts = o.date.split('-');
      if (parts.length === 3) {
        const day = parseInt(parts[2], 10);
        let weekIdx = 0;
        if (day >= 1 && day <= 7) weekIdx = 0;
        else if (day >= 8 && day <= 14) weekIdx = 1;
        else if (day >= 15 && day <= 21) weekIdx = 2;
        else if (day >= 22 && day <= 28) weekIdx = 3;
        else weekIdx = 4;
        weekly[weekIdx] += o.amount;
      }
    });

    const itemMap = {};
    monthOrders.forEach(o => {
      (o.items || []).forEach(it => {
        const name = it.name;
        itemMap[name] = (itemMap[name] || 0) + it.price;
      });
    });
    const sortedItems = Object.entries(itemMap)
      .map(([name, amount]) => {
        const icons = getIconsForItems([{ name }]);
        return { name, amount, icon: icons[0] };
      })
      .sort((a, b) => b.amount - a.amount);
    
    const topItems = sortedItems.slice(0, 5);

    const totalMonthSpend = Object.values(categories).reduce((sum, val) => sum + val, 0);
    const maxCat = getHighestCategory(categories).toLowerCase();
    const maxCatSpend = categories[maxCat] || 0;
    const maxCatPct = calculatePercentage(maxCatSpend, totalMonthSpend);
    const budgetLimit = budgetSettings[maxCat] || 1;
    const budgetPct = calculatePercentage(maxCatSpend, budgetLimit);

    let insightsQuote = '';
    if (monthOrders.length === 0) {
      insightsQuote = 'You have no orders logged for this month yet. Use the "Add Order" button to log some spending.';
    } else {
      insightsQuote = `You made ${monthOrders.length} orders. Your highest category is ${maxCat === 'grocery' ? 'Grocery' : maxCat.charAt(0).toUpperCase() + maxCat.slice(1)} (₹${maxCatSpend}), which takes up ${maxCatPct}% of your spend. `;
      if (budgetPct > 95) {
        insightsQuote += `Warning: You have utilized ${budgetPct}% of your ${maxCat} budget limit. Consider trimming down unneeded deliveries.`;
      } else if (budgetPct > 75) {
        insightsQuote += `Your ${maxCat} spending is approaching your target limit (${budgetPct}% used).`;
      } else {
        insightsQuote += `Your ${maxCat} budget is well-controlled at ${budgetPct}% utilization. Good job maintaining your limits!`;
      }
    }

    return {
      label: formatMonthLabel(selectedMonth),
      categories,
      weekly,
      topItems,
      orderCount: monthOrders.length,
      insights: insightsQuote,
      ordersList: monthOrders.sort((a, b) => b.date.localeCompare(a.date))
    };
  }, [orders, selectedMonth, budgetSettings]);

  const totalSpend = useMemo(() => {
    return calculateTotalSpend(monthDetails.categories);
  }, [monthDetails]);

  const amountLeft = useMemo(() => {
    const left = budgetSettings.total - totalSpend;
    return left > 0 ? left : 0;
  }, [budgetSettings.total, totalSpend]);

  const budgetUsedPercent = useMemo(() => {
    return calculatePercentage(totalSpend, budgetSettings.total);
  }, [totalSpend, budgetSettings.total]);

  // Absolute 3 most recent orders across all months
  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 3);
  }, [orders]);

  // Handle outside click closures and Esc key controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsBudgetModalOpen(false);
        setIsSummaryModalOpen(false);
        setIsNotificationsOpen(false);
        setIsOrderModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleScrollToDashboard = (e) => {
    e.preventDefault();
    const element = document.getElementById('dashboard-view');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSaveBudget = (updatedBudgets) => {
    setBudgetSettings(updatedBudgets);
    localStorage.setItem('xpense_meter_budgets', JSON.stringify(updatedBudgets));
    setIsBudgetModalOpen(false);
    addNotification(`Monthly budget settings updated successfully.`);
  };

  const handleToggleOrderExpand = (orderId) => {
    setExpandedOrderId(prev => prev === orderId ? null : orderId);
  };

  const handleDeleteOrder = (orderId) => {
    const updated = orders.filter(o => o.id !== orderId);
    saveOrdersToLocalStorage(updated);
    addNotification(`Order deleted successfully.`);
  };

  const handleSaveOrder = (orderData) => {
    let updated;
    const isEdit = orders.some(o => o.id === orderData.id);
    if (isEdit) {
      updated = orders.map(o => o.id === orderData.id ? orderData : o);
      addNotification(`Order from ${orderData.service} was updated.`);
    } else {
      updated = [orderData, ...orders];
      addNotification(`Logged a new ${orderData.category} order for ${formatCurrency(orderData.amount)}.`);
    }
    saveOrdersToLocalStorage(updated);
    setIsOrderModalOpen(false);
    
    // Automatically switch to the month of the order so the user sees it instantly!
    const orderMonth = orderData.date.substring(0, 7);
    setSelectedMonth(orderMonth);
  };

  return (
    <>
      <AccescoHeader />

      <main className="calculator-page" id="main-content">
        
        {/* ------------------------------------------------------------------
           SECTION 1 — XPENSE METER INTRODUCTION
           ------------------------------------------------------------------ */}
        <section className="card-container" aria-label="Xpense Meter Introduction">
          <div className="intro-grid">
            {/* S1 Left: Heading and Actions */}
            <div className="intro-left">
              <div>
                <span className="badge-new">NEW</span>
              </div>
              <div className="intro-title-wrapper">
                <h1 className="intro-heading">XPENSE METER</h1>
                <p className="intro-subheading-1">See it. Understand it.</p>
                <p className="intro-subheading-2">Spend it better.</p>
              </div>
              <p className="intro-desc">
                Track all your Grocery, Food & Fashion spending from one intelligent dashboard.
              </p>
              <div className="intro-buttons-row">
                <button 
                  type="button" 
                  onClick={handleScrollToDashboard} 
                  className="btn-accent"
                  aria-label="View My Spend Dashboard"
                >
                  View My Spend
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setEditingOrder(null);
                    setIsOrderModalOpen(true);
                  }} 
                  className="btn-secondary"
                  style={{ borderColor: 'var(--accent-color)', color: 'var(--accent-color)' }}
                  aria-label="Log New Order"
                >
                  + Log Order
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsBudgetModalOpen(true)} 
                  className="btn-secondary"
                  aria-label="Set Monthly Budgets"
                >
                  Set Budget
                </button>
              </div>
              <div className="privacy-notice">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>100% Private. Only you can see your spending.</span>
              </div>
            </div>

            {/* S1 Right: Floating interactive chart presentation */}
            <div className="intro-right-chart-panel">
              {/* Dynamic Connector Arrows for desktop layout */}
              <svg className="svg-connector-arrow" viewBox="0 0 350 350" aria-hidden="true">
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="8" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" />
                  </marker>
                </defs>
                {/* Grocery Curve */}
                <path d="M 68 85 Q 110 130 132 142" markerEnd="url(#arrowhead)" />
                {/* Food Curve */}
                <path d="M 270 48 Q 230 65 212 95" markerEnd="url(#arrowhead)" />
                {/* Fashion Curve */}
                <path d="M 268 285 Q 230 260 215 220" markerEnd="url(#arrowhead)" />
              </svg>

              {/* Master Circular Spend Progress Chart */}
              <div className="circular-chart-container">
                <svg viewBox="0 0 100 100" className="chart-svg-donut" aria-label={`Chart showing ${budgetUsedPercent}% of budget used`}>
                  <circle cx="50" cy="50" r="40" className="chart-track-circle" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    className="chart-value-circle" 
                    style={{
                      strokeDashoffset: 251.3 - (251.3 * Math.min(budgetUsedPercent, 100)) / 100
                    }}
                  />
                </svg>
                <div className="chart-center-content">
                  <span className="chart-center-label">This Month Spend</span>
                  <span className="chart-center-amount">{formatCurrency(totalSpend)}</span>
                  <span className="chart-center-subtext">of {formatCurrency(budgetSettings.total)} budget</span>
                  <span className="chart-center-badge">{budgetUsedPercent}% Used</span>
                </div>
              </div>

              {/* Float Category Items Around the Chart */}
              <div className="floating-category-tag pos-grocery">
                <div className="float-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                </div>
                <div className="float-info">
                  <span className="float-name">Grocery</span>
                  <span className="float-amount">{formatCurrency(monthDetails.categories.grocery)}</span>
                  <span className="float-pct">{calculatePercentage(monthDetails.categories.grocery, totalSpend)}%</span>
                </div>
              </div>

              <div className="floating-category-tag pos-food">
                <div className="float-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <div className="float-info">
                  <span className="float-name">Food</span>
                  <span className="float-amount">{formatCurrency(monthDetails.categories.food)}</span>
                  <span className="float-pct">{calculatePercentage(monthDetails.categories.food, totalSpend)}%</span>
                </div>
              </div>

              <div className="floating-category-tag pos-fashion">
                <div className="float-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.37 5.95l-4.22-1.92a2.1 2.1 0 0 0-1.78 0l-4.22 1.92L6 4.09V19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V4.09l2.37 1.86zM12 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"></path>
                  </svg>
                </div>
                <div className="float-info">
                  <span className="float-name">Fashion</span>
                  <span className="float-amount">{formatCurrency(monthDetails.categories.fashion)}</span>
                  <span className="float-pct">{calculatePercentage(monthDetails.categories.fashion, totalSpend)}%</span>
                </div>
              </div>

              {/* Decorative mini status tracker */}
              <div className="mini-status-card">
                <div className="status-dot-active green" aria-hidden="true">✓</div>
                <div className="status-info">
                  <span className="status-title">On track</span>
                  <span className="status-subtitle">You're doing great! Keep it up.</span>
                </div>
                {/* Dynamic mini sparkline SVG */}
                <svg viewBox="0 0 60 24" className="sparkline-svg" aria-hidden="true">
                  <path d="M 0 18 Q 15 2 30 14 T 60 4" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------
           SECTION 2 — USER SPENDING OVERVIEW
           ------------------------------------------------------------------ */}
        <section className="greeting-row" aria-label="Greeting and Promotion">
          {/* User welcome greeting node */}
          <div className="greeting-card">
            <div className="greeting-avatar" aria-hidden="true">☀️</div>
            <div className="greeting-text">
              <h2>Good Evening, User! 👋</h2>
              <p>Here’s what’s happening with your orders and spending.</p>
            </div>
          </div>

          {/* Plus delivery coupon node */}
          <div className="plus-banner-card">
            <div className="plus-banner-left">
              <span className="plus-logo">Plus<span>+</span></span>
              <span className="plus-subtitle">Free delivery on all orders</span>
            </div>
            {/* Scooter vector illustration */}
            <svg viewBox="0 0 24 24" className="plus-banner-illustration" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="6" cy="18" r="2"></circle>
              <circle cx="18" cy="18" r="2"></circle>
              <path d="M12 18V8l4-4h4v4h-4V8h-4v10M6 16h12M12 11h4"></path>
            </svg>
          </div>
        </section>

        {/* Master Xpense Meter Overview Widget */}
        <section className="card-container" aria-label="Spending Summary">
          <div className="overview-main-container">
            {/* Left side data analytics */}
            <div className="overview-left-data">
              <div className="overview-header-row">
                <div className="overview-title-block">
                  <h2 className="overview-title">Xpense Meter</h2>
                  <span className="badge-new">NEW</span>
                </div>
                <button 
                  type="button" 
                  onClick={handleScrollToDashboard} 
                  className="view-details-action"
                  aria-label="View Detailed Spending Analytics"
                >
                  View details
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>

              {/* Total spend and targets indicators */}
              <div className="overview-total-spend-block">
                <span className="overview-total-label">You've spent</span>
                <p className="overview-total-val">{formatCurrency(totalSpend)}</p>
                <span className="overview-total-label" style={{ textTransform: 'none', display: 'inline', fontSize: '12px' }}>this month</span>
              </div>

              {/* Budget Progress Bar */}
              <div className="overview-progress-bar-group">
                <div className="overview-progress-text-row">
                  <span>{budgetUsedPercent}% of your monthly budget used</span>
                  <button 
                    type="button" 
                    onClick={() => setIsBudgetModalOpen(true)} 
                    className="edit-budget-inline-btn"
                  >
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                    Edit budget
                  </button>
                </div>
                <div className="progress-bar-outer" aria-hidden="true">
                  <div className="progress-bar-inner" style={{ width: `${Math.min(budgetUsedPercent, 100)}%` }}></div>
                </div>
                <div className="overview-progress-text-row" style={{ marginTop: '2px', fontSize: '11px' }}>
                  <span>{formatCurrency(amountLeft)} remaining of {formatCurrency(budgetSettings.total)}</span>
                </div>
              </div>

              {/* Live insight quote */}
              <div className="overview-insight-text">
                <strong>Insight:</strong> {monthDetails.insights}
              </div>
            </div>

            {/* Right side category items with progress bars */}
            <div className="overview-categories-row">
              {/* Grocery Category Card */}
              <div className="category-detail-box">
                <div className="category-box-header">
                  <div className="category-box-title-row">
                    <span className="category-box-name">Grocery</span>
                    {renderItemIcon('milk')}
                  </div>
                  <p className="category-box-amount">{formatCurrency(monthDetails.categories.grocery)}</p>
                </div>
                <div>
                  <div className="progress-bar-outer" style={{ height: '4px', marginBottom: '4px' }} aria-hidden="true">
                    <div 
                      className="progress-bar-inner" 
                      style={{ 
                        width: `${Math.min(calculatePercentage(monthDetails.categories.grocery, budgetSettings.grocery), 100)}%`,
                        backgroundColor: '#10B981'
                      }}
                    ></div>
                  </div>
                  <div className="category-box-title-row">
                    <span className="category-box-pct">{calculatePercentage(monthDetails.categories.grocery, totalSpend)}% of spend</span>
                    <span className="category-box-pct" style={{ fontWeight: '700' }}>
                      {calculatePercentage(monthDetails.categories.grocery, budgetSettings.grocery)}% of budget
                    </span>
                  </div>
                </div>
              </div>

              {/* Food Category Card */}
              <div className="category-detail-box">
                <div className="category-box-header">
                  <div className="category-box-title-row">
                    <span className="category-box-name">Food</span>
                    {renderItemIcon('bowl')}
                  </div>
                  <p className="category-box-amount">{formatCurrency(monthDetails.categories.food)}</p>
                </div>
                <div>
                  <div className="progress-bar-outer" style={{ height: '4px', marginBottom: '4px' }} aria-hidden="true">
                    <div 
                      className="progress-bar-inner" 
                      style={{ 
                        width: `${Math.min(calculatePercentage(monthDetails.categories.food, budgetSettings.food), 100)}%`,
                        backgroundColor: 'var(--accent-color)'
                      }}
                    ></div>
                  </div>
                  <div className="category-box-title-row">
                    <span className="category-box-pct">{calculatePercentage(monthDetails.categories.food, totalSpend)}% of spend</span>
                    <span className="category-box-pct" style={{ fontWeight: '700' }}>
                      {calculatePercentage(monthDetails.categories.food, budgetSettings.food)}% of budget
                    </span>
                  </div>
                </div>
              </div>

              {/* Fashion Category Card */}
              <div className="category-detail-box">
                <div className="category-box-header">
                  <div className="category-box-title-row">
                    <span className="category-box-name">Fashion</span>
                    {renderItemIcon('shirt')}
                  </div>
                  <p className="category-box-amount">{formatCurrency(monthDetails.categories.fashion)}</p>
                </div>
                <div>
                  <div className="progress-bar-outer" style={{ height: '4px', marginBottom: '4px' }} aria-hidden="true">
                    <div 
                      className="progress-bar-inner" 
                      style={{ 
                        width: `${Math.min(calculatePercentage(monthDetails.categories.fashion, budgetSettings.fashion), 100)}%`,
                        backgroundColor: '#6366F1'
                      }}
                    ></div>
                  </div>
                  <div className="category-box-title-row">
                    <span className="category-box-pct">{calculatePercentage(monthDetails.categories.fashion, totalSpend)}% of spend</span>
                    <span className="category-box-pct" style={{ fontWeight: '700' }}>
                      {calculatePercentage(monthDetails.categories.fashion, budgetSettings.fashion)}% of budget
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Orders Section */}
        <section className="recent-orders-section" aria-label="Recent Orders">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="recent-orders-title">Your recent orders</h2>
            <button 
              type="button" 
              onClick={() => {
                setEditingOrder(null);
                setIsOrderModalOpen(true);
              }}
              className="btn-mini-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}
            >
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              + Add Order
            </button>
          </div>
          <div className="orders-grid-row">
            {recentOrders.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '30px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-card)', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
                No orders logged yet. Click "+ Add Order" to start tracking!
              </div>
            ) : (
              recentOrders.map((order) => {
                const isExpanded = expandedOrderId === order.id;
                return (
                  <div key={order.id} style={{ display: 'flex', flexDirection: 'column' }}>
                    <button 
                      type="button" 
                      onClick={() => handleToggleOrderExpand(order.id)}
                      className="order-card-button"
                      aria-expanded={isExpanded}
                      aria-label={`Order from ${order.service} for ${formatCurrency(order.amount)}. Click to toggle details.`}
                    >
                      <div className="order-card-header">
                        <span className="order-card-date">{formatOrderDate(order.date)}</span>
                        <span className="delivered-badge">Delivered</span>
                      </div>
                      <div className="order-card-service-row">
                        <span className="order-card-service-name">{order.service}</span>
                        <span className="order-card-amount">{formatCurrency(order.amount)}</span>
                      </div>
                      <div className="order-card-header" style={{ marginTop: '4px' }}>
                        <div className="order-item-thumbnails-wrapper">
                          {(order.icons || []).map((ic, idx) => (
                            <div key={idx} className="thumbnail-pic-holder" aria-hidden="true">
                              {renderItemIcon(ic)}
                            </div>
                          ))}
                        </div>
                        <span className="order-total-count">{(order.items || []).length} Items</span>
                      </div>
                    </button>

                    {/* Expandable Order Detail Breakdowns */}
                    {isExpanded && (
                      <div className="order-expandable-panel" id={`order-details-${order.id}`}>
                        <h4 className="expanded-title">Order Items Breakdown</h4>
                        {(order.items || []).map((it, idx) => (
                          <div key={idx} className="expanded-item-row">
                            <span className="expanded-item-name">{it.name}</span>
                            <span className="expanded-item-price">{formatCurrency(it.price)}</span>
                          </div>
                        ))}
                        <div className="expanded-item-row" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '6px', marginTop: '4px', fontWeight: '700' }}>
                          <span style={{ color: 'var(--text-primary)' }}>Total Spent</span>
                          <span style={{ color: 'var(--accent-color)' }}>{formatCurrency(order.amount)}</span>
                        </div>

                        {/* Action Buttons inside Expanded panel */}
                        {confirmDeleteId === order.id ? (
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '12px', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', color: '#DC2626', fontWeight: '600' }}>Are you sure?</span>
                            <button 
                              type="button" 
                              onClick={() => {
                                handleDeleteOrder(order.id);
                                setConfirmDeleteId(null);
                              }}
                              className="btn-mini-accent"
                              style={{ backgroundColor: '#DC2626', padding: '4px 8px', fontSize: '11px' }}
                            >
                              Yes, Delete
                            </button>
                            <button 
                              type="button" 
                              onClick={() => setConfirmDeleteId(null)}
                              className="btn-mini-outline"
                              style={{ padding: '4px 8px', fontSize: '11px' }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '12px' }}>
                            <button 
                              type="button" 
                              onClick={() => {
                                setEditingOrder(order);
                                setIsOrderModalOpen(true);
                              }}
                              className="btn-mini-outline"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', fontSize: '11px' }}
                            >
                              Edit
                            </button>
                            <button 
                              type="button" 
                              onClick={() => setConfirmDeleteId(order.id)}
                              className="btn-mini-accent"
                              style={{ backgroundColor: '#DC2626', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', fontSize: '11px' }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* ------------------------------------------------------------------
           SECTION 3 — DETAILED XPENSE METER DASHBOARD
           ------------------------------------------------------------------ */}
        <section className="card-container" id="dashboard-view" aria-label="Detailed Analytics Dashboard">
          
          {/* Dashboard Header toolbar node */}
          <div className="dashboard-heading-area">
            <div className="dashboard-title-wrapper">
              <h2 className="dashboard-main-heading">Xpense Meter</h2>
            </div>
            
            <div className="dashboard-header-right-tools">
              {/* Dynamic Month Selector */}
              <div className="month-selector-wrapper">
                <select 
                  className="month-dropdown-trigger" 
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  aria-label="Select Spending Month"
                >
                  {availableMonths.map((m) => (
                    <option key={m} value={m}>
                      {formatMonthLabel(m)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Alarm Notification Action Bell */}
              <div style={{ position: 'relative' }}>
                <button 
                  type="button" 
                  onClick={() => setIsNotificationsOpen(prev => !prev)}
                  className="action-icon-btn notification-bell-btn" 
                  aria-label="Toggle notifications"
                  aria-expanded={isNotificationsOpen}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  <span className="bell-badge-dot" style={{ backgroundColor: 'var(--accent-color)' }}></span>
                </button>

                {/* Notification Dropdown Panel */}
                {isNotificationsOpen && (
                  <div className="notifications-popover-wrapper">
                    <div className="notif-popover-header">Recent Alerts</div>
                    <div className="notif-popover-list">
                      {notifications.length === 0 ? (
                        <div style={{ padding: '16px', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
                          No alerts yet.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div key={notif.id} className="notif-item-row">
                            <span className="notif-item-text">{notif.text}</span>
                            <span className="notif-item-time">{notif.time}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Card */}
              <div className="dashboard-profile-node">
                <img 
                  src="data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3CclipPath id='circleView'%3E%3Ccircle cx='50' cy='50' r='50'/%3E%3C/clipPath%3E%3C/defs%3E%3Ccircle cx='50' cy='50' r='50' fill='%23b5b5b5'/%3E%3Cg clip-path='url(%23circleView)'%3E%3Ccircle cx='50' cy='41' r='16' fill='%23e0e0e0'/%3E%3Ccircle cx='50' cy='94' r='32' fill='%23e0e0e0'/%3E%3C/g%3E%3C/svg%3E" 
                  alt="User profile" 
                  className="profile-circle-pic"
                />
                <span className="profile-text-name">User</span>
              </div>
            </div>
          </div>

          {/* Three Summary Indicators score cards */}
          <div className="summary-cards-row" style={{ marginTop: '20px' }}>
            {/* Score 1 */}
            <div className="summary-score-card">
              <span className="summary-score-label">Total Doorstep Spend</span>
              <div className="summary-score-val-row">
                <span className="summary-score-value">{formatCurrency(totalSpend)}</span>
                <span className="summary-score-badge">{budgetUsedPercent}%</span>
              </div>
              <span className="summary-score-subtext">of {formatCurrency(budgetSettings.total)} budget</span>
            </div>

            {/* Score 2 */}
            <div className="summary-score-card">
              <span className="summary-score-label">Budget Used</span>
              <div className="summary-score-val-row">
                <span className="summary-score-value">{budgetUsedPercent}%</span>
                <span className="summary-score-badge on-track">On track</span>
              </div>
              <div className="progress-bar-outer" style={{ height: '5px', marginTop: '6px' }} aria-hidden="true">
                <div className="progress-bar-inner" style={{ width: `${Math.min(budgetUsedPercent, 100)}%`, backgroundColor: 'var(--accent-color)' }}></div>
              </div>
            </div>

            {/* Score 3 */}
            <div className="summary-score-card">
              <span className="summary-score-label">Amount Left</span>
              <div className="summary-score-val-row">
                <span className="summary-score-value">{formatCurrency(amountLeft)}</span>
              </div>
              <span className="summary-score-subtext">until your monthly budget</span>
            </div>
          </div>

          {/* Detailed Dashboard Bento Grid Grid of Cards */}
          <div className="dashboard-grid-layout" style={{ marginTop: '20px' }}>
            
            {/* Card 1: Spend by Category donut chart */}
            <div className="dash-bento-card">
              <h3 className="dash-bento-card-title">Spend by Category</h3>
              <div className="dash-donut-content-area">
                {/* Dynamically generated SVG donut */}
                <SpendDonutChart 
                  grocery={monthDetails.categories.grocery} 
                  food={monthDetails.categories.food} 
                  fashion={monthDetails.categories.fashion} 
                />

                {/* Donut Legend */}
                <ul className="donut-legend-list">
                  <li className="legend-item-node">
                    <div className="legend-item-header">
                      <span className="legend-color-dot grocery"></span>
                      <span>Grocery</span>
                    </div>
                    <span className="legend-item-val">
                      {formatCurrency(monthDetails.categories.grocery)} ({calculatePercentage(monthDetails.categories.grocery, totalSpend)}%)
                    </span>
                  </li>
                  <li className="legend-item-node">
                    <div className="legend-item-header">
                      <span className="legend-color-dot food"></span>
                      <span>Food</span>
                    </div>
                    <span className="legend-item-val">
                      {formatCurrency(monthDetails.categories.food)} ({calculatePercentage(monthDetails.categories.food, totalSpend)}%)
                    </span>
                  </li>
                  <li className="legend-item-node">
                    <div className="legend-item-header">
                      <span className="legend-color-dot fashion"></span>
                      <span>Fashion</span>
                    </div>
                    <span className="legend-item-val">
                      {formatCurrency(monthDetails.categories.fashion)} ({calculatePercentage(monthDetails.categories.fashion, totalSpend)}%)
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 2: Budget Targets Progress rows */}
            <div className="dash-bento-card">
              <h3 className="dash-bento-card-title">Budget on Category</h3>
              <div className="budget-targets-rows-wrapper">
                {/* Grocery item */}
                <div className="budget-target-item">
                  <div className="target-item-top">
                    <span className="target-item-name">Grokly (Grocery)</span>
                    <span className="target-item-spent-total">
                      <span>{formatCurrency(monthDetails.categories.grocery)}</span>/{formatCurrency(budgetSettings.grocery)}
                    </span>
                  </div>
                  <div className="progress-bar-outer" style={{ height: '6px' }} aria-hidden="true">
                    <div 
                      className="progress-bar-inner" 
                      style={{ 
                        width: `${Math.min(calculatePercentage(monthDetails.categories.grocery, budgetSettings.grocery), 100)}%`,
                        backgroundColor: '#10B981'
                      }}
                    ></div>
                  </div>
                  <div className="target-item-bottom">
                    <span>{calculatePercentage(monthDetails.categories.grocery, budgetSettings.grocery)}% used</span>
                    <span>{formatCurrency(Math.max(budgetSettings.grocery - monthDetails.categories.grocery, 0))} left</span>
                  </div>
                </div>

                {/* Food item */}
                <div className="budget-target-item">
                  <div className="target-item-top">
                    <span className="target-item-name">Swadishtt (Food)</span>
                    <span className="target-item-spent-total">
                      <span>{formatCurrency(monthDetails.categories.food)}</span>/{formatCurrency(budgetSettings.food)}
                    </span>
                  </div>
                  <div className="progress-bar-outer" style={{ height: '6px' }} aria-hidden="true">
                    <div 
                      className="progress-bar-inner" 
                      style={{ 
                        width: `${Math.min(calculatePercentage(monthDetails.categories.food, budgetSettings.food), 100)}%`,
                        backgroundColor: 'var(--accent-color)'
                      }}
                    ></div>
                  </div>
                  <div className="target-item-bottom">
                    <span>{calculatePercentage(monthDetails.categories.food, budgetSettings.food)}% used</span>
                    <span>{formatCurrency(Math.max(budgetSettings.food - monthDetails.categories.food, 0))} left</span>
                  </div>
                </div>

                {/* Fashion item */}
                <div className="budget-target-item">
                  <div className="target-item-top">
                    <span className="target-item-name">InstaStyle (Fashion)</span>
                    <span className="target-item-spent-total">
                      <span>{formatCurrency(monthDetails.categories.fashion)}</span>/{formatCurrency(budgetSettings.fashion)}
                    </span>
                  </div>
                  <div className="progress-bar-outer" style={{ height: '6px' }} aria-hidden="true">
                    <div 
                      className="progress-bar-inner" 
                      style={{ 
                        width: `${Math.min(calculatePercentage(monthDetails.categories.fashion, budgetSettings.fashion), 100)}%`,
                        backgroundColor: '#6366F1'
                      }}
                    ></div>
                  </div>
                  <div className="target-item-bottom">
                    <span>{calculatePercentage(monthDetails.categories.fashion, budgetSettings.fashion)}% used</span>
                    <span>{formatCurrency(Math.max(budgetSettings.fashion - monthDetails.categories.fashion, 0))} left</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Top Ordered Items list with custom icons */}
            <div className="dash-bento-card">
              <h3 className="dash-bento-card-title">Top Ordered Items</h3>
              <div className="top-items-compact-list">
                {monthDetails.topItems.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 10px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    No items ordered in {monthDetails.label} yet.
                  </div>
                ) : (
                  monthDetails.topItems.map((item, idx) => (
                    <div key={idx} className="top-item-row-node">
                      <div className="top-item-meta-left">
                        <div className="top-item-icon-circle" aria-hidden="true">
                          {renderItemIcon(item.icon)}
                        </div>
                        <span className="top-item-name-text">{item.name}</span>
                      </div>
                      <span className="top-item-spend-amount">{formatCurrency(item.amount)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Card 4: Week by week spend column bar chart */}
            <div className="dash-bento-card">
              <h3 className="dash-bento-card-title">Week by Week Spend</h3>
              <div className="weekly-chart-layout-node">
                {/* Y-axis metrics */}
                <div className="barchart-y-axis-labels" aria-hidden="true">
                  <span>₹3K</span>
                  <span>₹2K</span>
                  <span>₹1K</span>
                  <span>0</span>
                </div>

                {/* Chart body area */}
                <div className="weekly-barchart-container">
                  <div className="barchart-stage">
                    {/* Dashed guidelines behind bars */}
                    <div className="barchart-gridline-y line-3k" aria-hidden="true"></div>
                    <div className="barchart-gridline-y line-2k" aria-hidden="true"></div>
                    <div className="barchart-gridline-y line-1k" aria-hidden="true"></div>

                    {/* Proportional bars */}
                    {monthDetails.weekly.map((amt, idx) => {
                      // Proportional height scaled to ₹3000 max target
                      const pctHeight = (amt / 3000) * 100;
                      return (
                        <div key={idx} className="barchart-column-wrapper">
                          <div 
                            className="barchart-visual-pill-bar" 
                            style={{ height: `${pctHeight}%` }}
                            data-tooltip={formatCurrency(amt)}
                            role="img"
                            aria-label={`Week ${idx + 1} spend: ${formatCurrency(amt)}`}
                          ></div>
                          <span className="barchart-col-label-x">W{idx + 1}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 5: Monthly summary details promotion */}
            <div className="dash-bento-card summary-promo-card">
              <div className="summary-promo-top">
                <span className="summary-promo-month">{monthDetails.label} Summary</span>
                <span className="overview-total-label">Total Spend</span>
                <p className="summary-promo-total-spent">{formatCurrency(totalSpend)}</p>
                <span className="overview-total-label" style={{ textTransform: 'none', fontSize: '12px' }}>of {formatCurrency(budgetSettings.total)}</span>
              </div>
              <div className="summary-promo-bar-wrapper">
                <div className="progress-bar-outer" style={{ height: '6px' }} aria-hidden="true">
                  <div 
                    className="progress-bar-inner" 
                    style={{ 
                      width: `${Math.min(budgetUsedPercent, 100)}%`,
                      backgroundColor: 'var(--accent-color)'
                    }}
                  ></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span>{budgetUsedPercent}% used</span>
                  <span>{formatCurrency(amountLeft)} remaining</span>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsSummaryModalOpen(true)} 
                className="btn-black-gradient"
                aria-label="View Full Summary Modal"
              >
                View Full Summary
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="9" x2="15" y2="9"></line>
                  <line x1="9" y1="13" x2="15" y2="13"></line>
                  <line x1="9" y1="17" x2="15" y2="17"></line>
                </svg>
              </button>
            </div>

          </div>

          {/* Row of three micro bento indicator cards (row 2) */}
          <div className="dash-bottom-row-indicators" style={{ marginTop: '20px' }}>
            {/* Indicator 1 */}
            <div className="indicator-mini-node">
              <span className="indicator-mini-title">Order (This Month)</span>
              <p className="indicator-mini-metric">{monthDetails.orderCount}</p>
              <span className="indicator-mini-desc">Avg 3.5 orders / week</span>
            </div>

            {/* Indicator 2 */}
            <div className="indicator-mini-node">
              <span className="indicator-mini-title">Insights</span>
              <span className="indicator-mini-desc" style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-primary)' }}>
                {monthDetails.insights}
              </span>
            </div>

            {/* Indicator 3 */}
            <div className="indicator-mini-node">
              <span className="indicator-mini-title">Quick Actions</span>
              <div className="quick-actions-btns-box">
                <button 
                  type="button" 
                  onClick={() => setIsBudgetModalOpen(true)} 
                  className="btn-mini-accent"
                >
                  Edit budget
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsSummaryModalOpen(true)} 
                  className="btn-mini-outline"
                >
                  View Monthly Summary
                </button>
              </div>
            </div>
          </div>
          
        </section>

      </main>

      {/* ------------------------------------------------------------------
         BUDGET MODAL COMPONENT OVERLAY
         ------------------------------------------------------------------ */}
      {isBudgetModalOpen && (
        <div 
          className="modal-overlay" 
          onClick={() => setIsBudgetModalOpen(false)} 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="budget-modal-title"
        >
          <div className="modal-content-panel" onClick={(e) => e.stopPropagation()}>
            
            <div className="modal-header-section">
              <h3 className="modal-title" id="budget-modal-title">Configure My Budgets</h3>
              <button 
                type="button" 
                onClick={() => setIsBudgetModalOpen(false)} 
                className="modal-close-icon-btn" 
                aria-label="Close modal"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <BudgetFormContent 
              currentSettings={budgetSettings} 
              onSave={handleSaveBudget} 
              onCancel={() => setIsBudgetModalOpen(false)} 
            />

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------
         MONTHLY SUMMARY MODAL COMPONENT OVERLAY
         ------------------------------------------------------------------ */}
      {isSummaryModalOpen && (
        <div 
          className="modal-overlay" 
          onClick={() => setIsSummaryModalOpen(false)} 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="summary-modal-title"
        >
          <div className="modal-content-panel" style={{ maxWidth: '560px' }} onClick={(e) => e.stopPropagation()}>
            
            <div className="modal-header-section">
              <h3 className="modal-title" id="summary-modal-title">{monthDetails.label} Analytics Report</h3>
              <button 
                type="button" 
                onClick={() => setIsSummaryModalOpen(false)} 
                className="modal-close-icon-btn" 
                aria-label="Close modal"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="modal-body-section">
              {/* Top key analytics grid */}
              <div className="summary-modal-metrics-grid">
                <div className="summary-modal-item-tile">
                  <span className="summary-modal-tile-label">Selected Month</span>
                  <p className="summary-modal-tile-value" style={{ color: 'var(--accent-color)' }}>{monthDetails.label}</p>
                </div>
                <div className="summary-modal-item-tile">
                  <span className="summary-modal-tile-label">Total Spent</span>
                  <p className="summary-modal-tile-value">{formatCurrency(totalSpend)}</p>
                </div>
                <div className="summary-modal-item-tile">
                  <span className="summary-modal-tile-label">Total Budget limit</span>
                  <p className="summary-modal-tile-value">{formatCurrency(budgetSettings.total)}</p>
                </div>
                <div className="summary-modal-item-tile">
                  <span className="summary-modal-tile-label">Surplus Saved</span>
                  <p className="summary-modal-tile-value" style={{ color: '#10B981' }}>{formatCurrency(amountLeft)}</p>
                </div>
              </div>

              {/* Category-wise Breakdown with individual budgets and ratios */}
              <div style={{ marginTop: '10px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>Category Allocations & Limits</h4>
                <div className="summary-modal-categories-breakdown">
                  
                  {/* Grocery */}
                  <div className="summary-modal-category-row">
                    <div className="summary-modal-cat-meta">
                      <strong>Grocery Spending</strong>
                      <span>{formatCurrency(monthDetails.categories.grocery)} of {formatCurrency(budgetSettings.grocery)}</span>
                    </div>
                    <div className="progress-bar-outer" style={{ height: '5px' }} aria-hidden="true">
                      <div 
                        className="progress-bar-inner" 
                        style={{ 
                          width: `${Math.min(calculatePercentage(monthDetails.categories.grocery, budgetSettings.grocery), 100)}%`,
                          backgroundColor: '#10B981'
                        }}
                      ></div>
                    </div>
                    <div className="summary-modal-cat-meta" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      <span>Ratio of total spend: {calculatePercentage(monthDetails.categories.grocery, totalSpend)}%</span>
                      <span>{calculatePercentage(monthDetails.categories.grocery, budgetSettings.grocery)}% used</span>
                    </div>
                  </div>

                  {/* Food */}
                  <div className="summary-modal-category-row" style={{ marginTop: '6px' }}>
                    <div className="summary-modal-cat-meta">
                      <strong>Food Spending</strong>
                      <span>{formatCurrency(monthDetails.categories.food)} of {formatCurrency(budgetSettings.food)}</span>
                    </div>
                    <div className="progress-bar-outer" style={{ height: '5px' }} aria-hidden="true">
                      <div 
                        className="progress-bar-inner" 
                        style={{ 
                          width: `${Math.min(calculatePercentage(monthDetails.categories.food, budgetSettings.food), 100)}%`,
                          backgroundColor: 'var(--accent-color)'
                        }}
                      ></div>
                    </div>
                    <div className="summary-modal-cat-meta" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      <span>Ratio of total spend: {calculatePercentage(monthDetails.categories.food, totalSpend)}%</span>
                      <span>{calculatePercentage(monthDetails.categories.food, budgetSettings.food)}% used</span>
                    </div>
                  </div>

                  {/* Fashion */}
                  <div className="summary-modal-category-row" style={{ marginTop: '6px' }}>
                    <div className="summary-modal-cat-meta">
                      <strong>Fashion Spending</strong>
                      <span>{formatCurrency(monthDetails.categories.fashion)} of {formatCurrency(budgetSettings.fashion)}</span>
                    </div>
                    <div className="progress-bar-outer" style={{ height: '5px' }} aria-hidden="true">
                      <div 
                        className="progress-bar-inner" 
                        style={{ 
                          width: `${Math.min(calculatePercentage(monthDetails.categories.fashion, budgetSettings.fashion), 100)}%`,
                          backgroundColor: '#6366F1'
                        }}
                      ></div>
                    </div>
                    <div className="summary-modal-cat-meta" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      <span>Ratio of total spend: {calculatePercentage(monthDetails.categories.fashion, totalSpend)}%</span>
                      <span>{calculatePercentage(monthDetails.categories.fashion, budgetSettings.fashion)}% used</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Extra computed metrics */}
              <div style={{ marginTop: '12px', padding: '12px', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span>Highest Spending Category:</span>
                  <strong style={{ color: 'var(--accent-color)' }}>{getHighestCategory(monthDetails.categories)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span>Weekly Total Spend Sum:</span>
                  <strong>{formatCurrency(monthDetails.weekly.reduce((a,b) => a+b, 0))}</strong>
                </div>
              </div>

              <div className="overview-insight-text">
                <strong>Insight Quote:</strong> {monthDetails.insights}
              </div>
            </div>

            <div className="modal-footer-section">
              <button 
                type="button" 
                onClick={() => setIsSummaryModalOpen(false)} 
                className="btn-accent"
                style={{ minWidth: '100px' }}
              >
                Close Report
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------
         ORDER BUILDER MODAL COMPONENT OVERLAY
         ------------------------------------------------------------------ */}
      {isOrderModalOpen && (
        <div 
          className="modal-overlay" 
          onClick={() => setIsOrderModalOpen(false)} 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="order-modal-title"
        >
          <div className="modal-content-panel" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            
            <div className="modal-header-section">
              <h3 className="modal-title" id="order-modal-title">
                {editingOrder ? 'Edit Order Details' : 'Log New Doorstep Order'}
              </h3>
              <button 
                type="button" 
                onClick={() => setIsOrderModalOpen(false)} 
                className="modal-close-icon-btn" 
                aria-label="Close modal"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <OrderFormContent 
              order={editingOrder} 
              onSave={handleSaveOrder} 
              onCancel={() => setIsOrderModalOpen(false)} 
            />

          </div>
        </div>
      )}
    </>
  );
}

// --------------------------------------------------------------------------
// CHILD COMPONENT: DYNAMIC DONUT CHART RENDERER
// --------------------------------------------------------------------------
function SpendDonutChart({ grocery, food, fashion }) {
  const total = grocery + food + fashion;

  // Circle geometry for standard stroke-dashoffset rendering
  const radius = 38;
  const circumference = 2 * Math.PI * radius; // ~238.76

  if (total === 0) {
    return (
      <div className="circular-chart-container" style={{ width: '150px', height: '150px', flexShrink: 0 }}>
        <svg viewBox="0 0 100 100" className="chart-svg-donut" aria-label="Donut spend breakdown empty">
          <circle cx="50" cy="50" r={radius} className="chart-track-circle" style={{ strokeWidth: '10px', stroke: '#E5E7EB' }} />
        </svg>
        <div className="chart-center-content" style={{ width: '110px', height: '110px' }}>
          <span className="chart-center-label" style={{ fontSize: '9px' }}>Total Spend</span>
          <span className="chart-center-amount" style={{ fontSize: '15px' }}>₹0</span>
          <span className="chart-center-badge" style={{ marginTop: '2px', fontSize: '8px', backgroundColor: '#F3F4F6', color: '#6B7280' }}>No Data</span>
        </div>
      </div>
    );
  }

  const gpct = grocery / total;
  const fpct = food / total;
  const fapct = fashion / total;

  const gLength = gpct * circumference;
  const fLength = fpct * circumference;
  const faLength = fapct * circumference;

  return (
    <div className="circular-chart-container" style={{ width: '150px', height: '150px', flexShrink: 0 }}>
      <svg viewBox="0 0 100 100" className="chart-svg-donut" aria-label="Donut spend breakdown">
        <circle cx="50" cy="50" r={radius} className="chart-track-circle" style={{ strokeWidth: '10px' }} />
        
        {/* Grocery segment - Green */}
        <circle 
          cx="50" 
          cy="50" 
          r={radius} 
          fill="none"
          stroke="#10B981"
          strokeWidth="10"
          strokeDasharray={`${gLength} ${circumference - gLength}`}
          strokeDashoffset="0"
        />

        {/* Food segment - Accent wine color */}
        <circle 
          cx="50" 
          cy="50" 
          r={radius} 
          fill="none"
          stroke="var(--accent-color)"
          strokeWidth="10"
          strokeDasharray={`${fLength} ${circumference - fLength}`}
          strokeDashoffset={-gLength}
        />

        {/* Fashion segment - Indigo/Blue */}
        <circle 
          cx="50" 
          cy="50" 
          r={radius} 
          fill="none"
          stroke="#6366F1"
          strokeWidth="10"
          strokeDasharray={`${faLength} ${circumference - faLength}`}
          strokeDashoffset={-(gLength + fLength)}
        />
      </svg>
      <div className="chart-center-content" style={{ width: '110px', height: '110px' }}>
        <span className="chart-center-label" style={{ fontSize: '9px' }}>Total Spend</span>
        <span className="chart-center-amount" style={{ fontSize: '15px' }}>{formatCurrency(total)}</span>
        <span className="chart-center-badge" style={{ marginTop: '2px', fontSize: '8px' }}>Categories</span>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// CHILD COMPONENT: BUDGET VALIDATION & INPUT FORM
// --------------------------------------------------------------------------
function BudgetFormContent({ currentSettings, onSave, onCancel }) {
  const [inputs, setInputs] = useState({
    total: currentSettings.total.toString(),
    grocery: currentSettings.grocery.toString(),
    food: currentSettings.food.toString(),
    fashion: currentSettings.fashion.toString()
  });

  const [errors, setErrors] = useState({
    total: '',
    grocery: '',
    food: '',
    fashion: ''
  });

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    // Clear validation error on type
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateAndSubmit = (e) => {
    e.preventDefault();
    let hasError = false;
    const nextErrors = { total: '', grocery: '', food: '', fashion: '' };

    const totalNum = parseFloat(inputs.total);
    const groceryNum = parseFloat(inputs.grocery);
    const foodNum = parseFloat(inputs.food);
    const fashionNum = parseFloat(inputs.fashion);

    // Validate Total Budget
    if (isNaN(totalNum) || totalNum <= 0) {
      nextErrors.total = 'Please enter a valid positive budget amount.';
      hasError = true;
    }

    // Validate Grocery Budget
    if (isNaN(groceryNum) || groceryNum <= 0) {
      nextErrors.grocery = 'Please enter a valid positive grocery budget.';
      hasError = true;
    }

    // Validate Food Budget
    if (isNaN(foodNum) || foodNum <= 0) {
      nextErrors.food = 'Please enter a valid positive food budget.';
      hasError = true;
    }

    // Validate Fashion Budget
    if (isNaN(fashionNum) || fashionNum <= 0) {
      nextErrors.fashion = 'Please enter a valid positive fashion budget.';
      hasError = true;
    }

    // Validate category sum does not exceed total budget as warning
    if (!hasError && (groceryNum + foodNum + fashionNum) > totalNum) {
      nextErrors.total = 'Warning: Sum of categories exceeds total monthly budget allocation.';
    }

    if (hasError) {
      setErrors(nextErrors);
      return;
    }

    onSave({
      total: totalNum,
      grocery: groceryNum,
      food: foodNum,
      fashion: fashionNum
    });
  };

  return (
    <form onSubmit={validateAndSubmit} style={{ display: 'contents' }}>
      <div className="modal-body-section">
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          Adjust your target budgets below. Your percentages, progress lines, and amount balances will recalculate instantly.
        </p>

        {/* Input: Total Budget */}
        <div className="form-group" style={{ marginTop: '8px' }}>
          <label className="form-label" htmlFor="input-total-budget">Total Monthly Budget</label>
          <div className="input-with-currency-wrapper">
            <span className="input-currency-prefix">₹</span>
            <input 
              id="input-total-budget"
              type="number" 
              className="input-field-modal"
              value={inputs.total}
              onChange={(e) => handleInputChange('total', e.target.value)}
              placeholder="e.g. 18000"
            />
          </div>
          {errors.total && <span className="input-error-msg">{errors.total}</span>}
        </div>

        {/* Input: Grocery */}
        <div className="form-group">
          <label className="form-label" htmlFor="input-grocery-budget">Grocery Target Budget</label>
          <div className="input-with-currency-wrapper">
            <span className="input-currency-prefix">₹</span>
            <input 
              id="input-grocery-budget"
              type="number" 
              className="input-field-modal"
              value={inputs.grocery}
              onChange={(e) => handleInputChange('grocery', e.target.value)}
              placeholder="e.g. 8000"
            />
          </div>
          {errors.grocery && <span className="input-error-msg">{errors.grocery}</span>}
        </div>

        {/* Input: Food */}
        <div className="form-group">
          <label className="form-label" htmlFor="input-food-budget">Food Target Budget</label>
          <div className="input-with-currency-wrapper">
            <span className="input-currency-prefix">₹</span>
            <input 
              id="input-food-budget"
              type="number" 
              className="input-field-modal"
              value={inputs.food}
              onChange={(e) => handleInputChange('food', e.target.value)}
              placeholder="e.g. 6000"
            />
          </div>
          {errors.food && <span className="input-error-msg">{errors.food}</span>}
        </div>

        {/* Input: Fashion */}
        <div className="form-group">
          <label className="form-label" htmlFor="input-fashion-budget">Fashion Target Budget</label>
          <div className="input-with-currency-wrapper">
            <span className="input-currency-prefix">₹</span>
            <input 
              id="input-fashion-budget"
              type="number" 
              className="input-field-modal"
              value={inputs.fashion}
              onChange={(e) => handleInputChange('fashion', e.target.value)}
              placeholder="e.g. 4000"
            />
          </div>
          {errors.fashion && <span className="input-error-msg">{errors.fashion}</span>}
        </div>

      </div>

      <div className="modal-footer-section">
        <button 
          type="button" 
          onClick={onCancel} 
          className="btn-secondary"
          style={{ padding: '10px 18px', fontSize: '13px' }}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn-accent"
          style={{ padding: '10px 18px', fontSize: '13px' }}
        >
          Save Budget
        </button>
      </div>
    </form>
  );
}

// --------------------------------------------------------------------------
// CHILD COMPONENT: ORDER CREATOR / BUILDER FORM
// --------------------------------------------------------------------------
function OrderFormContent({ order, onSave, onCancel }) {
  const isEditing = !!order;

  // Initialize state
  const [service, setService] = useState(order ? order.service : '');
  const [category, setCategory] = useState(order ? order.category : 'Grocery');
  const [date, setDate] = useState(order ? order.date : new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState(order ? [...order.items] : [{ name: '', price: '' }]);
  const [errors, setErrors] = useState({});

  // Auto-fill service suggestions based on selected category
  const serviceSuggestions = useMemo(() => {
    if (category === 'Grocery') return ['BigBasket', 'Zepto', 'Blinkit', 'Instamart'];
    if (category === 'Food') return ['Zomato', 'Swiggy', 'EatSure', 'Domino\'s'];
    if (category === 'Fashion') return ['Myntra', 'Ajio', 'Zara', 'H&M', 'Nykaa'];
    return [];
  }, [category]);

  // Handle adding an item row
  const handleAddItemRow = () => {
    setItems(prev => [...prev, { name: '', price: '' }]);
  };

  // Handle removing an item row
  const handleRemoveItemRow = (index) => {
    if (items.length <= 1) {
      setItems([{ name: '', price: '' }]);
    } else {
      setItems(prev => prev.filter((_, idx) => idx !== index));
    }
  };

  // Handle input changes for items
  const handleItemChange = (index, field, value) => {
    setItems(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
    if (errors.items) {
      setErrors(prev => ({ ...prev, items: '' }));
    }
  };

  // Compute calculated dynamic sum of all items in real time
  const computedTotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const val = parseFloat(item.price);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
  }, [items]);

  const validateAndSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    let hasError = false;

    if (!service.trim()) {
      nextErrors.service = 'Service or merchant name is required.';
      hasError = true;
    }

    if (!date) {
      nextErrors.date = 'Please pick a valid delivery date.';
      hasError = true;
    }

    // Validate items
    const validItems = [];
    const itemErrors = [];
    let itemsInvalid = false;

    items.forEach((item, idx) => {
      const nameVal = item.name.trim();
      const priceVal = parseFloat(item.price);
      const rowErr = {};

      if (!nameVal) {
        rowErr.name = 'Required';
        itemsInvalid = true;
      }
      if (isNaN(priceVal) || priceVal <= 0) {
        rowErr.price = 'Invalid';
        itemsInvalid = true;
      }

      itemErrors[idx] = rowErr;
      if (!itemsInvalid) {
        validItems.push({ name: nameVal, price: priceVal });
      }
    });

    if (itemsInvalid) {
      nextErrors.items = 'Please fill out all item names and positive prices.';
      nextErrors.itemRows = itemErrors;
      hasError = true;
    }

    if (hasError) {
      setErrors(nextErrors);
      return;
    }

    // Dynamic icons detection keyword scanner based on entered items
    const icons = getIconsForItems(validItems);

    const updatedOrder = {
      id: order ? order.id : `order-${Date.now()}`,
      service: service.trim(),
      category,
      date,
      amount: computedTotal,
      icons,
      items: validItems
    };

    onSave(updatedOrder);
  };

  return (
    <form onSubmit={validateAndSubmit} style={{ display: 'contents' }}>
      <div className="modal-body-section" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: '1.5' }}>
          Enter the order details below. Items and categories will influence your real-time spend indices immediately.
        </p>

        {/* Category Choice Grid */}
        <div className="form-group">
          <label className="form-label">Category</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '4px' }}>
            {['Grocery', 'Food', 'Fashion'].map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategory(cat);
                    // Prepopulate merchant if empty
                    if (!service) {
                      setService('');
                    }
                  }}
                  className={active ? "btn-accent" : "btn-secondary"}
                  style={{ 
                    padding: '8px', 
                    fontSize: '12px', 
                    fontWeight: '700',
                    border: active ? 'none' : '1px solid var(--border-color)',
                    backgroundColor: active ? 'var(--accent-color)' : 'transparent',
                    color: active ? '#FFFFFF' : 'var(--text-secondary)'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Service/Merchant Name Input */}
        <div className="form-group" style={{ marginTop: '12px' }}>
          <label className="form-label" htmlFor="input-order-service">Merchant / Service Name</label>
          <input 
            id="input-order-service"
            type="text" 
            className="input-field-modal"
            value={service}
            onChange={(e) => {
              setService(e.target.value);
              if (errors.service) setErrors(prev => ({ ...prev, service: '' }));
            }}
            placeholder="e.g. Zomato, Zepto, Myntra"
            list="service-suggestions-datalist"
          />
          <datalist id="service-suggestions-datalist">
            {serviceSuggestions.map(s => <option key={s} value={s} />)}
          </datalist>
          {errors.service && <span className="input-error-msg">{errors.service}</span>}
        </div>

        {/* Date Selector */}
        <div className="form-group">
          <label className="form-label" htmlFor="input-order-date">Delivery Date</label>
          <input 
            id="input-order-date"
            type="date" 
            className="input-field-modal"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              if (errors.date) setErrors(prev => ({ ...prev, date: '' }));
            }}
          />
          {errors.date && <span className="input-error-msg">{errors.date}</span>}
        </div>

        {/* Order Items Section */}
        <div className="form-group" style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label className="form-label" style={{ margin: '0', fontWeight: '700' }}>Order Items list</label>
            <button 
              type="button" 
              onClick={handleAddItemRow}
              className="btn-mini-outline"
              style={{ padding: '2px 8px', fontSize: '11px', fontWeight: '700' }}
            >
              + Add Item
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {items.map((item, idx) => {
              const rowErr = errors.itemRows?.[idx] || {};
              return (
                <div key={idx} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <div style={{ flex: '2', display: 'flex', flexDirection: 'column' }}>
                    <input 
                      type="text" 
                      className="input-field-modal"
                      style={{ padding: '8px', fontSize: '12px', border: rowErr.name ? '1px solid #DC2626' : '1px solid var(--border-color)' }}
                      placeholder="Item name (e.g. Milk, Shirt, Pizza)"
                      value={item.name}
                      onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                    />
                  </div>
                  <div style={{ flex: '1', display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>₹</span>
                    <input 
                      type="number" 
                      className="input-field-modal"
                      style={{ padding: '8px', fontSize: '12px', border: rowErr.price ? '1px solid #DC2626' : '1px solid var(--border-color)' }}
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveItemRow(idx)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: '#9CA3AF', 
                      cursor: 'pointer', 
                      padding: '4px',
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}
                    aria-label={`Delete item row ${idx + 1}`}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
          {errors.items && <span className="input-error-msg" style={{ display: 'block', marginTop: '6px' }}>{errors.items}</span>}
        </div>

        {/* Dynamically Recalculated Order Total Box */}
        <div style={{ 
          marginTop: '16px', 
          padding: '12px', 
          backgroundColor: 'var(--bg-main)', 
          borderRadius: '8px', 
          border: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Computed Order Total:</span>
          <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--accent-color)' }}>
            ₹{computedTotal.toLocaleString('en-IN')}
          </span>
        </div>

      </div>

      <div className="modal-footer-section">
        <button 
          type="button" 
          onClick={onCancel} 
          className="btn-secondary"
          style={{ padding: '10px 18px', fontSize: '13px' }}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn-accent"
          style={{ padding: '10px 18px', fontSize: '13px' }}
        >
          {isEditing ? 'Save Changes' : 'Log Order'}
        </button>
      </div>
    </form>
  );
}
