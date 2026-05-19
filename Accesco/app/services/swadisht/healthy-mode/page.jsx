// NOTE for Adhiti Jii:
// Currently the form only collects data for a single member.
// nutrition_engine.py already supports multiple household members.
// 
// To add multi-member support:
// 1. Replace single healthProfile state with an array of members
// 2. Add an "Add Member" button that appends a new empty member to the array
// 3. Render one form section per member
// 4. On submit, send the full array as { profile: members }
//
// route.js already maps each member correctly before sending to the Python backend.
// No changes needed in route.js or test_server.py for this.



'use client';

/**
 * Healthy Mode Page
 * @page /services/swadisht/healthy-mode
 * @description Calorie, nutrition & vitamin-aware meal recommendations
 */

import { useEffect, useState } from 'react';
import { useSwadishtt } from '../contexts/SwadishttContext';
import SwadishttHeader from '../components/SwadishttHeader';
import styles from './healthy-mode.module.css';

// ---------------------------------------------------------------------------
// Activity level mapping — her dropdown uses low/moderate/high
// your nutrition_engine expects sedentary/moderate/active
// ---------------------------------------------------------------------------
const ACTIVITY_MAP = {
  low:      'sedentary',
  moderate: 'moderate',
  high:     'active',
};

// ---------------------------------------------------------------------------
// HealthyModeContent
// ---------------------------------------------------------------------------
function HealthyModeContent() {
  const { addToCart } = useSwadishtt();

  const [showHealthForm, setShowHealthForm]       = useState(true);
  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [healthInsights, setHealthInsights]       = useState(null);
  const [loadingInsights, setLoadingInsights]     = useState(false);
  const [error, setError]                         = useState(null);

  const [healthProfile, setHealthProfile] = useState({
    age:           '',
    gender:        '',
    weightRange:   '',
    activityLevel: '',
    preferences:   [],
  });

  // ── Restore saved profile from localStorage on mount ──
  useEffect(() => {
    try {
      const saved = localStorage.getItem('swadishtt-health-profile');
      if (saved) {
        setHealthProfile(JSON.parse(saved));
        setShowHealthForm(false);
      }
    } catch (e) {
      console.error('Profile restore error:', e);
    }
  }, []);

  // ── Re-fetch insights whenever goal or profile changes ──
  useEffect(() => {
    if (showHealthForm) return;

    const fetchInsights = async () => {
      setLoadingInsights(true);
      setError(null);
      try {
        const res  = await fetch('/api/health-profile', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile: healthProfile }),
        });
        const data = await res.json();
        setHealthInsights(data);
      } catch (e) {
        console.error('Health insights error:', e);
        setError('Failed to fetch nutrition data. Is the backend running?');
      } finally {
        setLoadingInsights(false);
      }
    };

    fetchInsights();
  }, [showHealthForm, healthProfile]);

  // ── Form handlers ──
  const handleInput = (field, value) =>
    setHealthProfile((prev) => ({ ...prev, [field]: value }));

  const handlePreferenceToggle = (pref) =>
    setHealthProfile((prev) => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter((p) => p !== pref)
        : [...prev.preferences, pref],
    }));

  // ── Submit → POST to Next.js API route → forwarded to your FastAPI ──
  const handleSubmit = async () => {
    setSubmittingProfile(true);
    setError(null);
    try {
      const res  = await fetch('/api/health-profile', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: healthProfile }),
      });
      const data = await res.json();
      localStorage.setItem('swadishtt-health-profile', JSON.stringify(healthProfile));
      setHealthInsights(data);
      setShowHealthForm(false);
    } catch (e) {
      console.error('Submit error:', e);
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmittingProfile(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className={styles.pageContent}>
      <SwadishttHeader />

      <div className={styles.hero}>
        <div className={styles.healthTopBar}>
          <button
            className={styles.exitHealthBtn}
            onClick={() => {
              localStorage.setItem('swadishtt-health-mode', JSON.stringify(false));
              window.location.href = '/services/swadisht/profile';
            }}
          >
            Health Mode ON
          </button>
        </div>
        <h1 className={styles.heroTitle}>Healthy Mode</h1>
        <p className={styles.heroSub}>
          Calorie-aware, nutrition-tracked meals tailored to your health goals
        </p>
      </div>

      <div className={styles.container}>

        {/* ── Health Profile Form ── */}
        {showHealthForm ? (
          <div className={styles.formOverlay}>
            <section className={styles.healthFormCard}>

              <div className={styles.formHeader}>
                <div className={styles.formHeaderTop}>
                  <span className={styles.formBadge}>Health Mode Setup</span>
                  <button
                    type="button"
                    className={styles.closeFormBtn}
                    onClick={() => setShowHealthForm(false)}
                  >
                    ×
                  </button>
                </div>
                <h2>Share your nutrition profile</h2>
                <p>Tell us your lifestyle and food preferences so we can suggest better meals.</p>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Age</label>
                  <input
                    type="number"
                    placeholder="25"
                    value={healthProfile.age}
                    onChange={(e) => handleInput('age', e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Gender</label>
                  <select
                    value={healthProfile.gender}
                    onChange={(e) => handleInput('gender', e.target.value)}
                  >
                    <option value="">Select gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Weight range (kg)</label>
                  <input
                    placeholder="60-70"
                    value={healthProfile.weightRange}
                    onChange={(e) => handleInput('weightRange', e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Activity level</label>
                  <select
                    value={healthProfile.activityLevel}
                    onChange={(e) => handleInput('activityLevel', e.target.value)}
                  >
                    <option value="">Select activity level</option>
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className={styles.preferenceSection}>
                <h3>Dietary preferences</h3>
                <div className={styles.preferenceGrid}>
                  {['vegetarian', 'vegan', 'keto', 'diabetic-friendly', 'gluten-free', 'low-sodium'].map((item) => (
                    <label key={item} className={styles.preferenceOption}>
                      <input
                        type="checkbox"
                        checked={healthProfile.preferences.includes(item)}
                        onChange={() => handlePreferenceToggle(item)}
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {error && <p style={{ color: 'red', marginTop: '8px' }}>{error}</p>}

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.submitHealthBtn}
                  onClick={handleSubmit}
                  disabled={submittingProfile}
                >
                  {submittingProfile ? 'Submitting...' : 'Submit Health Profile'}
                </button>
              </div>

            </section>
          </div>

        ) : (
          /* ── Post-submit: show results ── */
          <>
            <div className={styles.healthActionRow}>
              <button
                type="button"
                className={styles.editProfileBtn}
                onClick={() => setShowHealthForm(true)}
              >
                Edit Health Profile
              </button>
            </div>

            {loadingInsights ? (
              <p className={styles.insightLoading}>Preparing your health insights...</p>
            ) : error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : healthInsights ? (
              <section className={styles.insightCard}>
                <span className={styles.insightBadge}>API Connected</span>
                <pre>{JSON.stringify(healthInsights, null, 2)}</pre>
              </section>
            ) : null}
          </>
        )}

      </div>
    </div>
  );
}

export default function HealthyModePage() {
  return <HealthyModeContent />;
}
