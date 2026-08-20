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
import { useAuth } from '@/app/components/AuthProvider';
import { updateUserFieldsInFirebase } from '@/lib/userService';
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
  const { addToCart, cart } = useSwadishtt();

  const [showHealthForm, setShowHealthForm]       = useState(true);
  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [healthInsights, setHealthInsights]       = useState(null);
  const [loadingInsights, setLoadingInsights]     = useState(false);
  const [error, setError]                         = useState(null);

const emptyMember = {
  age: '',
  gender: '',
  weightRange: '',
  activityLevel: '',
  preferences: [],
};

const [members, setMembers] = useState([emptyMember]);
  const consumedCalories = cart?.reduce(
  (sum, item) => sum + (item.calories || 0),
  0
) || 0;

const consumedProtein = cart?.reduce(
  (sum, item) => sum + (item.protein || 0),
  0
) || 0;

const consumedCarbs = cart?.reduce(
  (sum, item) => sum + (item.carbs || 0),
  0
) || 0;

const consumedFats = cart?.reduce(
  (sum, item) => sum + (item.fats || 0),
  0
) || 0;

const targetCal = healthInsights?.householdSummary?.totalCalories || 2000;
const progressPercent = targetCal > 0 ? Math.min(Math.round((consumedCalories / targetCal) * 100), 100) : 0;

  const { user, userData } = useAuth();

  // ── Restore saved profile from Firestore/AuthProvider on mount ──
  useEffect(() => {
    if (userData?.healthProfile) {
      setMembers(userData.healthProfile);
      setShowHealthForm(false);
    }
  }, [userData]);

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
          body: JSON.stringify({ profile: getMappedMembers() }),
        });
        const data = await res.json();
        setHealthInsights(data);
      } catch (e) {
  console.error(e);
  setError(e.message || 'Something went wrong');
}finally {
        setLoadingInsights(false);
      }
    };

    fetchInsights();
  }, [showHealthForm, members]);

  // ── Form handlers ──
  const handleInput = (index, field, value) => {
  setMembers((prev) =>
    prev.map((member, i) =>
      i === index ? { ...member, [field]: value } : member
    )
  );
};

  const handlePreferenceToggle = (index, pref) => {
  setMembers((prev) =>
    prev.map((member, i) =>
      i === index
        ? {
            ...member,
            preferences: member.preferences.includes(pref)
              ? member.preferences.filter((p) => p !== pref)
              : [...member.preferences, pref],
          }
        : member
    )
  );
};
const addMember = () => {
  setMembers((prev) => [...prev, emptyMember]);
};

  // ── Submit → POST to Next.js API route → forwarded to your FastAPI ──
  const getMappedMembers = () => {
  const activityMap = {
    low: 'sedentary',
    moderate: 'moderate',
    high: 'active',
  };

  return members.map((member) => ({
    age: member.age,
    gender: member.gender,
    weightRange: member.weightRange,
    activityLevel: activityMap[member.activityLevel] || member.activityLevel,
    dietaryPreferences: member.preferences || [],
  }));
};
  const handleSubmit = async () => {
    setSubmittingProfile(true);
    setError(null);
    try {
      const res  = await fetch('/api/health-profile', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: getMappedMembers() }),
      });
      const data = await res.json();
      if (user?.uid) {
        await updateUserFieldsInFirebase(user.uid, { healthProfile: members });
      }
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

              {members.map((member, index) => (
  <div key={index} className={styles.memberBlock}>
    <h3>Family Member {index + 1}</h3>

    <div className={styles.formGrid}>
      <div className={styles.formGroup}>
        <label>Age</label>
        <input
          type="number"
          placeholder="25"
          value={member.age}
          onChange={(e) => handleInput(index, 'age', e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Gender</label>
        <select
          value={member.gender}
          onChange={(e) => handleInput(index, 'gender', e.target.value)}
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
          value={member.weightRange}
          onChange={(e) => handleInput(index, 'weightRange', e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Activity level</label>
        <select
          value={member.activityLevel}
          onChange={(e) => handleInput(index, 'activityLevel', e.target.value)}
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
              checked={member.preferences.includes(item)}
              onChange={() => handlePreferenceToggle(index, item)}
            />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </div>
  </div>
))}

<button
  type="button"
  className={styles.addMemberBtn}
  onClick={addMember}
>
  + Add Another Family Member
</button>

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
              <section className={styles.trackerCard}>
                <div className={styles.trackerHeader}>
                  <div>
                    <h2 className={styles.trackerTitle}>Today’s Intake</h2>
                    <p className={styles.trackerGoal}>Based on your health profile</p>
                  </div>

                  <div className={styles.trackerNumbers}>
                    <span className={styles.consumed}>
                      {consumedCalories}
                    </span>
                    <span className={styles.trackerSep}>/</span>
                    <span className={styles.total}>
                      {targetCal}
                    </span>
                    <span className={styles.calLabel}>cal</span>
                  </div>
                </div>

                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className={styles.trackerStats}>
                  <div className={styles.trackerStat}>
                    <span className={styles.statValue}>
                      {consumedProtein}g
                    </span>
                    <span className={styles.statLabel}>
                      Protein / {healthInsights?.householdSummary?.macroSplit?.protein}g
                    </span>
                  </div>

                  <div className={styles.trackerStat}>
                    <span className={styles.statValue}>
                      {consumedCarbs}g
                    </span>
                    <span className={styles.statLabel}>
                      Carbs / {healthInsights?.householdSummary?.macroSplit?.carbs}g
                    </span>
                  </div>

                  <div className={styles.trackerStat}>
                    <span className={styles.statValue}>
                      {consumedFats}g
                    </span>
                    <span className={styles.statLabel}>
                      Fats / {healthInsights?.householdSummary?.macroSplit?.fats}g
                    </span>
                  </div>
                </div>

                {healthInsights?.members?.length > 0 && (
                  <div className={styles.memberCaloriesList}>
                    {healthInsights.members.map((member, index) => (
                      <div key={index} className={styles.memberCaloriesCard}>
                        <span>Family Member {index + 1}</span>
                        <strong>{member.calories} cal</strong>
                      </div>
                    ))}
                  </div>
                )}
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
