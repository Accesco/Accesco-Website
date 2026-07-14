'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingCart, 
  Utensils, 
  Shirt, 
  Clock, 
  UserCheck, 
  TrendingUp, 
  Lock, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  ArrowRight,
  Sparkles,
  DollarSign,
  Eye,
  Activity,
  Compass,
  ArrowUpRight,
  Plus,
  Trash2,
  ListFilter
} from 'lucide-react';
import Image from "next/image";
import { useRouter } from 'next/navigation';
export default function XpenseIntro() {
  // Page routing state ('intro' | 'meter')
  const [currentView, setCurrentView] = useState('intro');
const router = useRouter();
  // --- Landing Page Interactive States ---
  const [activeTab, setActiveTab] = useState('Track'); // 'Track' | 'Budget' | 'Insights'
  const [viewDetails, setViewDetails] = useState(false);
  const [budgetLimit, setBudgetLimit] = useState(18000);
  
  // Ref for scrolling to the dashboard
  const dashboardRef = useRef(null);

  // --- Initial Data ---
  const [categories, setCategories] = useState([
    { id: 'grocery', name: 'Grocery', amount: 5200, icon: 'ShoppingCart', color: '#cccccc' },
    { id: 'food', name: 'Food', amount: 4150, icon: 'Utensils', color: '#ffffff' },
    { id: 'fashion', name: 'Fashion', amount: 3100, icon: 'Shirt', color: '#555555' }
  ]);

  const [extraCategories, setExtraCategories] = useState([
    { id: 'entertainment', name: 'Entertainment', amount: 1500, icon: 'Sparkles', color: '#888888' },
    { id: 'utilities', name: 'Utilities', amount: 2400, icon: 'RefreshCw', color: '#444444' }
  ]);

  // Transaction history for the interactive app view
  const [transactions, setTransactions] = useState([
    { id: 1, title: 'Weekly Groceries', amount: 2300, category: 'grocery', date: '2026-07-04' },
    { id: 2, title: 'Dinner at Bistro', amount: 1850, category: 'food', date: '2026-07-03' },
    { id: 3, title: 'Designer Shoes', amount: 3100, category: 'fashion', date: '2026-07-01' },
    { id: 4, title: 'Organic Veggies', amount: 2900, category: 'grocery', date: '2026-06-30' },
    { id: 5, title: 'Lunch Delivery', amount: 2300, category: 'food', date: '2026-06-28' },
    { id: 6, title: 'Electricity Bill', amount: 2400, category: 'utilities', date: '2026-06-25' },
    { id: 7, title: 'Cinema Tickets', amount: 1500, category: 'entertainment', date: '2026-06-24' }
  ]);

  // Add Transaction form state
  const [newTxTitle, setNewTxTitle] = useState('');
  const [newTxAmount, setNewTxAmount] = useState('');
  const [newTxCategory, setNewTxCategory] = useState('grocery');

  // Calculate totals dynamically
  const activeTotal = categories.reduce((sum, item) => sum + item.amount, 0);
  const extraTotal = extraCategories.reduce((sum, item) => sum + item.amount, 0);
  const overallTotal = activeTotal + (viewDetails ? extraTotal : 0);

  // Budget calculations
  const percentageUsed = Math.min(Math.round((overallTotal / budgetLimit) * 100), 100);

  // SVG circular calculations
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentageUsed / 100) * circumference;

  // Handle CTA button click
 const handleExploreClick = () => {
  router.push('/xpense-meter');
};

  // Helper to render lucide icons dynamically
  const getIcon = (iconName, className = '') => {
    switch (iconName) {
      case 'ShoppingCart': return <ShoppingCart className={className} size={18} />;
      case 'Utensils': return <Utensils className={className} size={18} />;
      case 'Shirt': return <Shirt className={className} size={18} />;
      case 'Clock': return <Clock className={className} size={22} />;
      case 'UserCheck': return <UserCheck className={className} size={22} />;
      case 'TrendingUp': return <TrendingUp className={className} size={22} />;
      case 'Lock': return <Lock className={className} size={14} />;
      case 'RefreshCw': return <RefreshCw className={className} size={14} />;
      case 'Sparkles': return <Sparkles className={className} size={18} />;
      default: return <Sparkles className={className} size={18} />;
    }
  };

  // Switch to the full interactive dashboard app
const navigateToDashboard = () => {
  router.push('/xpense-meter');
};
  // Sync state between transaction list and categories when in active dashboard mode
  useEffect(() => {
    const categoryTotals = {
      grocery: 0,
      food: 0,
      fashion: 0,
      entertainment: 0,
      utilities: 0
    };

    transactions.forEach(tx => {
      if (categoryTotals[tx.category] !== undefined) {
        categoryTotals[tx.category] += Number(tx.amount);
      }
    });

    setCategories(prev => prev.map(cat => ({
      ...cat,
      amount: categoryTotals[cat.id] || 0
    })));

    setExtraCategories(prev => prev.map(cat => ({
      ...cat,
      amount: categoryTotals[cat.id] || 0
    })));
  }, [transactions]);

  // Handle adding custom transaction in full dashboard app
  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!newTxTitle.trim() || !newTxAmount) return;

    const amountNum = Math.abs(Number(newTxAmount));
    const newTx = {
      id: Date.now(),
      title: newTxTitle,
      amount: amountNum,
      category: newTxCategory,
      date: new Date().toISOString().split('T')[0]
    };

    setTransactions([newTx, ...transactions]);
    setNewTxTitle('');
    setNewTxAmount('');
  };

  // Handle deleting a transaction
  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(tx => tx.id !== id));
  };

  // Render full dashboard app view
  if (currentView === 'meter') {
    return (
      <div className="xpense-page-wrapper" style={{ backgroundColor: '#0c0d12', color: '#ffffff', display: 'block', minHeight: '100vh', padding: '1.5rem' }}>
        <div className="xpense-container" style={{ maxWidth: '1200px' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #444 0%, #000 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Activity size={20} color="#ffffff" />
              </div>
              <div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, letterSpacing: '-0.02em', color: '#ffffff' }}>Xpense Meter</h1>
                <p style={{ fontSize: '0.75rem', color: '#888892', margin: 0 }}>Smart Personal Finance Sandbox</p>
              </div>
            </div>
            
           
          </div>

          <div className="xpense-layout" style={{ gridTemplateColumns: '1.2fr 1.8fr' }}>
            
            {/* Left Column: Stats & Add Transaction */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Financial Summary Ring Card */}
              <div className="black-card-inner" style={{ padding: '1.75rem', minHeight: 'auto', background: '#13141b' }}>
                <h2 className="card-title" style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={16} color="#ffffff" /> Budget Monitoring
                </h2>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginTop: '1.25rem' }}>
                  <div className="radial-ring-wrapper" style={{ width: '100px', height: '100px' }}>
                    <svg className="radial-svg" width="100" height="100" viewBox="0 0 90 90">
                      <circle className="radial-bg-circle" cx="45" cy="45" r="36" style={{ stroke: '#22232a' }} />
                      <circle 
                        className="radial-progress-circle" 
                        cx="45" 
                        cy="45" 
                        r="36" 
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        style={{ stroke: percentageUsed > 85 ? '#ef4444' : '#ffffff' }}
                      />
                    </svg>
                    <div className="radial-text-content">
                      <span className="radial-percentage-num">{percentageUsed}%</span>
                      <span className="radial-percentage-lbl">used</span>
                    </div>
                  </div>

                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#888892', margin: 0 }}>Current Spending</p>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '2px 0', fontFamily: 'JetBrains Mono', color: '#ffffff' }}>
                      ₹{overallTotal.toLocaleString()}
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: '#888892', margin: 0 }}>
                      of ₹{budgetLimit.toLocaleString()} monthly limit
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#888892', marginBottom: '0.5rem' }}>
                    <span>Adjust Target Budget</span>
                    <span style={{ fontWeight: '700', color: '#ffffff' }}>₹{budgetLimit.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="5000" 
                    max="50000" 
                    step="1000"
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#ffffff', cursor: 'pointer', height: '4px', background: '#22232a', borderRadius: '2px' }}
                  />
                </div>
              </div>

              {/* Add Transaction Form */}
              <div className="black-card-inner" style={{ padding: '1.75rem', minHeight: 'auto', background: '#13141b' }}>
                <h2 className="card-title" style={{ fontSize: '1rem', marginBottom: '1rem' }}>Log Spending</h2>
                
                <form onSubmit={handleAddTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#888892', display: 'block', marginBottom: '0.4rem' }}>Transaction Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Starbucks, H&M, Groceries"
                      value={newTxTitle}
                      onChange={(e) => setNewTxTitle(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', background: '#1c1d24', border: '1px solid #2d2e38', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#888892', display: 'block', marginBottom: '0.4rem' }}>Amount (₹)</label>
                      <input 
                        type="number" 
                        placeholder="0.00"
                        value={newTxAmount}
                        onChange={(e) => setNewTxAmount(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', background: '#1c1d24', border: '1px solid #2d2e38', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', outline: 'none', fontFamily: 'JetBrains Mono' }}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#888892', display: 'block', marginBottom: '0.4rem' }}>Category</label>
                      <select 
                        value={newTxCategory}
                        onChange={(e) => setNewTxCategory(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', background: '#1c1d24', border: '1px solid #2d2e38', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', outline: 'none', height: '41px' }}
                      >
                        <option value="grocery">Grocery</option>
                        <option value="food">Food</option>
                        <option value="fashion">Fashion</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="utilities">Utilities</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="glossy-btn-main" 
                    style={{ fontSize: '0.95rem', padding: '0.75rem', borderRadius: '8px', margin: 0, marginTop: '0.5rem' }}
                  >
                    <Plus size={16} /> Add Transaction
                  </button>
                </form>
              </div>

            </div>

            {/* Right Column: Transaction History & Category Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Category Breakdown list */}
              <div className="black-card-inner" style={{ padding: '1.75rem', minHeight: 'auto', background: '#13141b' }}>
                <h2 className="card-title" style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>Category Distributions</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
                  {[...categories, ...extraCategories].map(cat => {
                    const pct = Math.min(Math.round((cat.amount / budgetLimit) * 100), 100);
                    return (
                      <div key={cat.id} style={{ background: '#1c1d24', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#888892', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            {getIcon(cat.icon, 'text-gray-400')}
                            {cat.name}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: '800', margin: '4px 0', fontFamily: 'JetBrains Mono', color: '#ffffff' }}>
                          ₹{cat.amount.toLocaleString()}
                        </h4>
                        <div style={{ width: '100%', height: '4px', background: '#2e2f38', borderRadius: '2px', overflow: 'hidden', marginTop: '0.5rem' }}>
                          <div style={{ width: `${pct}%`, height: '100%', backgroundColor: cat.color || '#ffffff' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Real-time Ledger */}
              <div className="black-card-inner" style={{ padding: '1.75rem', flexGrow: 1, minHeight: 'auto', background: '#13141b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h2 className="card-title" style={{ fontSize: '1rem' }}>Spending Ledger</h2>
                  <span style={{ fontSize: '0.725rem', color: '#888892', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <ListFilter size={12} /> {transactions.length} Total records
                  </span>
                </div>

                <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingRight: '0.25rem' }}>
                  {transactions.map(tx => (
                    <div 
                      key={tx.id} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '0.75rem 1rem', 
                        background: '#1c1d24', 
                        borderRadius: '12px', 
                        border: '1px solid rgba(255,255,255,0.03)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '50%', 
                          background: '#24252f', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: '#ffffff' 
                        }}>
                          {tx.category === 'grocery' && <ShoppingCart size={14} />}
                          {tx.category === 'food' && <Utensils size={14} />}
                          {tx.category === 'fashion' && <Shirt size={14} />}
                          {tx.category === 'entertainment' && <Sparkles size={14} />}
                          {tx.category === 'utilities' && <RefreshCw size={14} />}
                        </div>
                        <div>
                          <p style={{ fontSize: '0.85rem', fontWeight: '600', margin: 0, color: '#ffffff' }}>{tx.title}</p>
                          <p style={{ fontSize: '0.7rem', color: '#888892', margin: 0 }}>{tx.date} • {tx.category.toUpperCase()}</p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', fontFamily: 'JetBrains Mono', color: '#ffffff' }}>
                          -₹{tx.amount.toLocaleString()}
                        </span>
                        <button 
                          onClick={() => handleDeleteTransaction(tx.id)}
                          style={{ background: 'transparent', border: 'none', color: '#888892', cursor: 'pointer', display: 'flex', padding: '4px' }}
                          title="Delete Transaction"
                        >
                          <Trash2 size={14} className="hover:text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {transactions.length === 0 && (
                    <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#888892', fontSize: '0.85rem' }}>
                      No spend transactions registered. Add one above!
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    );
  }

  // Render original Landing Page
  return (
    <div className="xpense-page-wrapper">
      <div className="xpense-container">
        <div className="xpense-layout">
          
          {/* LEFT HERO CARD */}
          <div className="left-hero-card">
            <div>
 <h1 className="hero-heading">
  <div className="hero-heading-top">
    <span>Introducing</span>

    <Image
      src="/images/asterik.png"
      alt=""
      width={30}
      height={30}
      className="hero-asterisk"
    />
  </div>

  <div>Xpense Meter!</div>
</h1>
              <p className="hero-subtitle">
                Your smart spending companion for Grocery, Food & Fashion - all in one place.
              </p>
              
              <div className="features-list">
                <div className="feature-item">
                  <div className="feature-icon-box">
                    <Clock size={22} strokeWidth={2.2} />
                  </div>
                  <div className="feature-text">
                    <h3 className="feature-title">See</h3>
                    <p className="feature-desc">Where your money goes</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon-box">
                    <UserCheck size={22} strokeWidth={2.2} />
                  </div>
                  <div className="feature-text">
                    <h3 className="feature-title">Act</h3>
                    <p className="feature-desc">Your patterns and trends</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon-box">
                    <TrendingUp size={22} strokeWidth={2.2} />
                  </div>
                  <div className="feature-text">
                    <h3 className="feature-title">Understand</h3>
                    <p className="feature-desc">Stay on budget, every month</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button onClick={handleExploreClick} className="glossy-btn-main" id="cta-explore">
                Explore Xpense Meter
              </button>

              <div className="left-card-footer">
                <span className="footer-item">
                  <Lock size={14} /> 100% Secure & Private
                </span>
                <span className="footer-item">
                  <RefreshCw size={14} /> Auto-categorized spending
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT DASHBOARD PREVIEW */}
          <div className="right-dashboard-card" ref={dashboardRef}>
            
            {/* Header / Navigation bar */}
            <div className="dashboard-header">
              <div className="header-text-group">
                <span className="header-title-main">Smarter spending starts here</span>
                <span className="header-sub-main">Track. Understand, Take Control</span>
              </div>
              
              <div className="tabs-pill-container" id="tab-controls">
                {['Track', 'Budget', 'Insights'].map((tab) => (
                  <button
                    key={tab}
                    className={`tab-pill-btn ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Dashboard Inner Grid */}
            <div className="dashboard-grid-content">
              
              {/* LEFT INNER BLACK CARD */}
              <div className={`black-card-inner ${activeTab === 'Track' ? 'focus-tab-element' : ''}`}>
                <div className="card-top-header">
                  <h3 className="card-title">Track all your spending</h3>
                  <p className="card-desc">
                    {activeTab === 'Track' && "Automatically tracks your Grocery, Food & Fashion spends in one place."}
                    {activeTab === 'Budget' && "Monitor category breakdowns relative to your overall monthly spend limits."}
                    {activeTab === 'Insights' && "Smart algorithms separate static food runs from dynamic shopping sprees."}
                  </p>
                </div>

                <div className="spends-section-layout">
                  <div className="spends-list">
                    {categories.map((cat) => (
                      <div className="spend-list-item" key={cat.id}>
                        <div className="spend-item-left">
                          <div className="spend-icon-box">
                            {getIcon(cat.icon)}
                          </div>
                          <span className="spend-category-name">{cat.name}</span>
                        </div>
                        <span className="spend-amount">₹{cat.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Vertical Bar Chart */}
                  <div className="bar-chart-container">
                    <div className="bars-row">
                      <div className="chart-bar mid" style={{ height: '32px' }} />
                      <div className="chart-bar high" style={{ height: '50px' }} />
                      <div className="chart-bar low" style={{ height: '22px' }} />
                    </div>
                    <span className="chart-labels-text">High / Mid / Low</span>
                  </div>
                </div>

                {/* Details Expander Area */}
                {viewDetails && (
                  <div className="expanded-details-container">
                    {extraCategories.map((cat) => (
                      <div className="spend-list-item" key={cat.id} style={{ paddingLeft: '8px' }}>
                        <div className="spend-item-left">
                          <div className="spend-icon-box" style={{ width: '32px', height: '32px' }}>
                            {getIcon(cat.icon)}
                          </div>
                          <span className="spend-category-name" style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{cat.name}</span>
                        </div>
                        <span className="spend-amount" style={{ fontSize: '0.8rem', color: '#e5e7eb' }}>₹{cat.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}

                <hr className="dashboard-divider" />

                <div>
                  <div className="spend-total-row">
                    <span className="total-text-label">Total spent</span>
                    <span className="total-spent-val" id="total-spent-count">
                      ₹{overallTotal.toLocaleString()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button 
                      className="glossy-btn-silver"
                      onClick={() => setViewDetails(!viewDetails)}
                    >
                      {viewDetails ? 'Hide details' : 'View details'}
                    </button>
                    
                    {activeTab === 'Budget' && (
                      <div style={{ width: '60%', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <label style={{ fontSize: '0.65rem', color: '#9ca3af', textAlign: 'right' }}>Set Slider Budget</label>
                        <input 
                          type="range" 
                          min="10000" 
                          max="30000" 
                          step="500" 
                          value={budgetLimit}
                          onChange={(e) => setBudgetLimit(Number(e.target.value))}
                          style={{ width: '100%', accentColor: '#ffffff', height: '3px' }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <hr className="dashboard-divider" style={{ margin: '0.75rem 0' }} />

                <p className="card-footer-small-desc">
                  <span>(12) categories auto-sorted</span>
                  <span className="card-footer-link" onClick={navigateToDashboard}>View summary</span>
                </p>
              </div>

              {/* RIGHT INNER BLACK CARD */}
              <div className={`black-card-inner ${activeTab !== 'Track' ? 'focus-tab-element' : ''}`}>
                <div className="card-top-header">
                  <h3 className="card-title">Stay on budget</h3>
                  <p className="card-desc">
                    We help you stay on track with smart budget monitoring and real-time insights.
                  </p>
                </div>

                {/* Progress Circle & Details */}
                <div className="budget-radial-section">
                  <div className="budget-radial-info">
                    <span className="budget-val-label">
                      of <span className="budget-val-total">₹{budgetLimit.toLocaleString()}</span>
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>monthly budget</span>
                  </div>

                  <div className="radial-ring-wrapper">
                    <svg className="radial-svg" width="90" height="90" viewBox="0 0 90 90">
                      <circle className="radial-bg-circle" cx="45" cy="45" r="36" />
                      <circle 
                        className="radial-progress-circle" 
                        cx="45" 
                        cy="45" 
                        r="36" 
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                      />
                    </svg>
                    <div className="radial-text-content">
                      <span className="radial-percentage-num">{percentageUsed}%</span>
                      <span className="radial-percentage-lbl">used</span>
                    </div>
                  </div>
                </div>

                {/* Horizontal Bar */}
                <div className="horizontal-progress-track">
                  <div className="horizontal-progress-fill" style={{ width: `${percentageUsed}%` }} />
                </div>

                {/* Smart Insight Box */}
                <div className="insight-box-card">
                  {activeTab === 'Track' && (
                    <>
                      <p className="insight-text-bold">Food spending is stable this week.</p>
                      <p className="insight-text-sub">You spent ₹150 less than last week.</p>
                    </>
                  )}
                  {activeTab === 'Budget' && (
                    <>
                      <p className="insight-text-bold">Excellent control on Fashion!</p>
                      <p className="insight-text-sub">82% of clothing budget remains untouched.</p>
                    </>
                  )}
                  {activeTab === 'Insights' && (
                    <>
                      <p className="insight-text-bold">Weekend Spike detected in Food.</p>
                      <p className="insight-text-sub">Ordering on Friday drove up weekly average by 12%.</p>
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="action-buttons-row">
                  <button className="glossy-btn-outline highlighted">
                    On track <Check size={12} style={{ marginLeft: '2px' }} />
                  </button>
                  <button onClick={navigateToDashboard} className="glossy-btn-outline">
                    Go to Xpense Meter <ArrowRight size={12} style={{ marginLeft: '2px' }} />
                  </button>
                </div>

                <hr className="dashboard-divider" style={{ margin: '0.5rem 0' }} />

                {/* Setup Row */}
                <div className="setup-bottom-row">
                  <div className="setup-ring-0">
                    0%
                  </div>
                  <div className="setup-text-box">
                    <span className="setup-title">Setup Complete</span>
                    <span className="setup-subtitle">Set budget in under 1 min.</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}