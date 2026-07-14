'use client'

import { useState, useEffect } from 'react'
import './calculator.css'
import AccescoHeader from '@/components/AccescoHeader'

export default function CalculatorPage() {
  const [income, setIncome] = useState('')
  const [rent, setRent] = useState('')
  const [city, setCity] = useState('Mumbai')
  const [lifestyle, setLifestyle] = useState('middle')
  const [headCount, setHeadCount] = useState(1)
  const [showResults, setShowResults] = useState(false)
  const [incomeError, setIncomeError] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)

  // Calculated values
  const [needs, setNeeds] = useState({ rent: 0, grocery: 0, transport: 0, bills: 0 })
  const [wants, setWants] = useState({ shopping: 0, dining: 0, entertainment: 0 })
  const [savings, setSavings] = useState(0)
  const [savingsGoal, setSavingsGoal] = useState('')

  const calculateBudget = async () => {
    const incomeNum = parseFloat(income) || 0
    const rentNum = parseFloat(rent) || 0

    if (incomeNum < 500) {
      setIncomeError(true)
      return
    }
    setIncomeError(false)
    setIsCalculating(true)

    const lifestyleMultipliers = {
      frugal: { needs: 0.45, wants: 0.25, savings: 0.30 },
      middle: { needs: 0.50, wants: 0.30, savings: 0.20 },
      luxury: { needs: 0.45, wants: 0.40, savings: 0.15 }
    }

    const multiplier = lifestyleMultipliers[lifestyle]
    
    // Calculate needs (50% of income)
    const totalNeeds = incomeNum * multiplier.needs
    const remainingNeeds = totalNeeds - rentNum
    
    const calculatedNeeds = {
      rent: rentNum,
      grocery: Math.round(remainingNeeds * 0.40 * headCount),
      transport: Math.round(remainingNeeds * 0.35),
      bills: Math.round(remainingNeeds * 0.25)
    }

    // Calculate wants (30% of income)
    const totalWants = incomeNum * multiplier.wants
    const calculatedWants = {
      shopping: Math.round(totalWants * 0.40),
      dining: Math.round(totalWants * 0.35),
      entertainment: Math.round(totalWants * 0.25)
    }

    // Calculate savings (20% of income)
    const calculatedSavings = Math.round(incomeNum * multiplier.savings)

    setNeeds(calculatedNeeds)
    setWants(calculatedWants)
    setSavings(calculatedSavings)
    setShowResults(true)
  }

  const needsTotal = Object.values(needs).reduce((a, b) => a + b, 0)
  const wantsTotal = Object.values(wants).reduce((a, b) => a + b, 0)

  const showToast = (message) => {
    // Simple toast notification
    alert(message)
  }

  return (
    <>
      <AccescoHeader />
      <div className="calculator-page">
        <div className="calculator-hero">
          <img 
            src="/images/skip-the-line.jpg" 
            alt="Accesco Living - Skip the Line" 
            className="calculator-hero-img"
            onError={(e) => {
              e.currentTarget.src = '/images/accesco_original.png';
              e.currentTarget.style.padding = '20px';
              e.currentTarget.style.background = 'linear-gradient(135deg, #7A0042, #1A0A0F)';
            }}
          />
        </div>
        <div className="calc-wrap">
          {/* Main Grid */}
        <div className="calc-grid">
          {/* Left Sidebar - Input Form */}
          <aside className="card card-lg">
            <div>
              <span className="pill">Financial Setup</span>
              <h2 style={{ marginTop: '12px' }}>Set your income & preferences</h2>
              <div className="muted">We'll suggest a balanced plan for needs, wants and savings.</div>
            </div>

            <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Income Input */}
              <div>
                <label className="muted-sm">Total Monthly Income</label>
                <div className="money" style={{ marginTop: '8px' }}>
                  <div className="symbol">₹</div>
                  <input
                    type="number"
                    className="field"
                    placeholder="50000"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                  />
                </div>
                {incomeError && (
                  <div className="error-text">Minimum income ₹500 required.</div>
                )}
              </div>

              {/* Rent Input */}
              <div>
                <label className="muted-sm">Fixed Rent / EMI (Optional)</label>
                <div className="money" style={{ marginTop: '8px' }}>
                  <div className="symbol">₹</div>
                  <input
                    type="number"
                    className="field"
                    placeholder="15000"
                    value={rent}
                    onChange={(e) => setRent(e.target.value)}
                  />
                </div>
              </div>

              {/* City and Lifestyle */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="muted-sm">City</label>
                  <input
                    type="text"
                    className="field"
                    placeholder="Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{ marginTop: '8px' }}
                  />
                </div>
                <div>
                  <label className="muted-sm">Lifestyle</label>
                  <select
                    className="field"
                    value={lifestyle}
                    onChange={(e) => setLifestyle(e.target.value)}
                    style={{ marginTop: '8px' }}
                  >
                    <option value="frugal">Student/Frugal</option>
                    <option value="middle">Working Professional</option>
                    <option value="luxury">High Comfort</option>
                  </select>
                </div>
              </div>

              {/* Household Size */}
              <div>
                <label className="muted-sm">Household Size</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                  <i className="fa-solid fa-users" style={{ color: 'var(--accent)' }}></i>
                  <input
                    type="number"
                    className="field"
                    min="1"
                    value={headCount}
                    onChange={(e) => setHeadCount(parseInt(e.target.value) || 1)}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              {/* Calculate Button */}
              <button onClick={calculateBudget} className="btn btn-primary" style={{ marginTop: '8px' }}>
                CALCULATE PLAN
                <i className="fa-solid fa-arrow-right" style={{ fontSize: '14px' }}></i>
              </button>
            </div>
          </aside>

          {/* Right Side - Results */}
          <section>
            {/* Stats Cards */}
            <div className="card" style={{ marginBottom: '12px' }}>
              <div className="stats">
                <div className="stat">
                  <div className="label">Needs</div>
                  <div className="value">₹{needsTotal.toLocaleString('en-IN')}</div>
                </div>
                <div className="stat">
                  <div className="label">Wants</div>
                  <div className="value" style={{ color: 'var(--accent)' }}>
                    ₹{wantsTotal.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="stat">
                  <div className="label">Savings</div>
                  <div className="value" style={{ color: '#16a34a' }}>
                    ₹{savings.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            {/* Breakdown Cards */}
            {showResults && (
              <div className="breakdown">
                {/* Needs Card */}
                <div className="break-card">
                  <div className="break-top">
                    <h3>NEEDS</h3>
                    <i className="fa-solid fa-house-chimney" style={{ color: '#777' }}></i>
                  </div>
                  <div className="break-items">
                    <div className="break-item">
                      <div className="muted-sm">RENT</div>
                      <input
                        type="number"
                        className="break-input"
                        value={needs.rent}
                        onChange={(e) => setNeeds({ ...needs, rent: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="break-item">
                      <div className="muted-sm">GROCERY</div>
                      <input
                        type="number"
                        className="break-input"
                        value={needs.grocery}
                        onChange={(e) => setNeeds({ ...needs, grocery: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="break-item">
                      <div className="muted-sm">TRANSPORT</div>
                      <input
                        type="number"
                        className="break-input"
                        value={needs.transport}
                        onChange={(e) => setNeeds({ ...needs, transport: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="break-item">
                      <div className="muted-sm">BILLS</div>
                      <input
                        type="number"
                        className="break-input"
                        value={needs.bills}
                        onChange={(e) => setNeeds({ ...needs, bills: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                </div>

                {/* Wants Card */}
                <div className="break-card">
                  <div className="break-top">
                    <h3 style={{ color: 'var(--accent)' }}>WANTS</h3>
                    <i className="fa-solid fa-bag-shopping" style={{ color: '#7A0042' }}></i>
                  </div>
                  <div className="break-items">
                    <div className="break-item">
                      <div className="muted-sm">SHOPPING</div>
                      <input
                        type="number"
                        className="break-input"
                        value={wants.shopping}
                        onChange={(e) => setWants({ ...wants, shopping: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="break-item">
                      <div className="muted-sm">DINING</div>
                      <input
                        type="number"
                        className="break-input"
                        value={wants.dining}
                        onChange={(e) => setWants({ ...wants, dining: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="break-item">
                      <div className="muted-sm">ENTERTAIN</div>
                      <input
                        type="number"
                        className="break-input"
                        value={wants.entertainment}
                        onChange={(e) => setWants({ ...wants, entertainment: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                </div>

                {/* Savings Card */}
                <div className="break-card">
                  <div className="break-top">
                    <h3 style={{ color: '#166534' }}>SAVINGS</h3>
                    <i className="fa-solid fa-piggy-bank" style={{ color: '#16a34a' }}></i>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div className="inv-large">₹{savings.toLocaleString('en-IN')}</div>
                    <div className="muted-sm">Monthly Surplus</div>
                  </div>
                  <div style={{ marginTop: '12px', borderTop: '1px solid #f1f1f1', paddingTop: '12px' }}>
                    <input
                      type="text"
                      className="field"
                      placeholder="E.g. Buy a Car"
                      value={savingsGoal}
                      onChange={(e) => setSavingsGoal(e.target.value)}
                    />
                    <button
                      onClick={() => showToast(`Goal set: ${savingsGoal || 'No goal'}`)}
                      className="btn"
                      style={{
                        width: '100%',
                        marginTop: '10px',
                        background: '#16a34a',
                        color: '#fff',
                        borderRadius: '12px',
                        fontWeight: 800
                      }}
                    >
                      Plan Goal
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* AI Features Highlight */}
        <div style={{ 
          marginTop: '60px', 
          padding: '40px 20px', 
          background: 'rgba(122, 0, 66, 0.03)', 
          borderRadius: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px'
        }}>
          {[
            { title: 'Smart Categorization', desc: 'AI-powered automatic expense sorting' },
            { title: 'Predictive Budgeting', desc: 'Forecast spending patterns accurately' },
            { title: 'Goal Tracking', desc: 'Achieve financial milestones faster' },
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ width: '14px', minWidth: '14px', height: '14px', borderRadius: '999px', marginTop: '6px', background: '#7A0042' }} />
              <div>
                <h3 style={{ margin: '0 0 8px', fontFamily: 'Sora', fontSize: '1.1rem', fontWeight: 800, color: '#1A0A0F' }}>{f.title}</h3>
                <p style={{ margin: 0, fontFamily: 'DM Sans', fontSize: '0.95rem', color: '#6B5B65', lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FontAwesome Icons */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        rel="stylesheet"
      />
    </div>
    </>
  )
}
