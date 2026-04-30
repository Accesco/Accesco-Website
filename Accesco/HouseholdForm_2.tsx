'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Supabase client
// Replace these with your actual values from the login-auth.js file
// or import from your shared @/lib/supabase if that file exists in the project
// ---------------------------------------------------------------------------
const SUPABASE_URL = 'https://nfdrnbikwzfmijrqmoqt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_dVvOYAqamp2BGoI8zvyB5g_NfCSkQ6b';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type DietaryPreference =
  | 'vegetarian'
  | 'vegan'
  | 'keto'
  | 'diabetic-friendly'
  | 'gluten-free'
  | 'low-sodium';

type Gender = 'male' | 'female' | 'other' | '';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | '';

type HouseholdMember = {
  age: number | '';
  gender: Gender;
  weightRange: string;
  activityLevel: ActivityLevel;
  dietaryPreferences: DietaryPreference[];
};

type HealthProfileResponse = {
  version?: string;
  user_id?: string;
  householdSummary?: {
    totalCalories?: number;
    macroSplit?: {
      protein?: number;
      carbs?: number;
      fats?: number;
    };
  };
  members?: Array<{
    calories?: number;
    macros?: {
      protein?: number;
      carbs?: number;
      fats?: number;
    };
    micronutrients?: string[];
    alerts?: string[];
  }>;
  alerts?: string[];
  error?: string;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const dietaryOptions: DietaryPreference[] = [
  'vegetarian',
  'vegan',
  'keto',
  'diabetic-friendly',
  'gluten-free',
  'low-sodium',
];

const initialMember: HouseholdMember = {
  age: '',
  gender: '',
  weightRange: '',
  activityLevel: '',
  dietaryPreferences: [],
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function HouseholdForm() {
  const [members, setMembers] = useState<HouseholdMember[]>([initialMember]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<HealthProfileResponse | null>(null);

  // --- member helpers -------------------------------------------------------

  const updateMember = <K extends keyof HouseholdMember>(
    index: number,
    field: K,
    value: HouseholdMember[K]
  ) => {
    setMembers((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
  };

  const toggleDietaryPreference = (index: number, preference: DietaryPreference) => {
    setMembers((prev) =>
      prev.map((m, i) => {
        if (i !== index) return m;
        const exists = m.dietaryPreferences.includes(preference);
        return {
          ...m,
          dietaryPreferences: exists
            ? m.dietaryPreferences.filter((p) => p !== preference)
            : [...m.dietaryPreferences, preference],
        };
      })
    );
  };

  const addMember = () =>
    setMembers((prev) => [...prev, { ...initialMember }]);

  const removeMember = (index: number) =>
    setMembers((prev) => prev.filter((_, i) => i !== index));

  // --- validation -----------------------------------------------------------

  const validateMembers = (): string | null => {
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m.age || !m.gender || !m.activityLevel || !m.weightRange) {
        return `Member ${i + 1}: please fill in age, gender, weight range, and activity level.`;
      }
      if (Number(m.age) <= 0 || Number(m.age) > 120) {
        return `Member ${i + 1}: age must be between 1 and 120.`;
      }
    }
    return null;
  };

  // --- submit ---------------------------------------------------------------

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // 1. validate form fields
      const validationError = validateMembers();
      if (validationError) throw new Error(validationError);

      // 2. get Supabase session — this works because Supabase stores the
      //    session in localStorage after login-auth.js completes OAuth flow
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;

      if (!session) {
        throw new Error('You are not logged in. Please log in and try again.');
      }

      const token  = session.access_token; // JWT — sent to backend for verification
      const userId = session.user.id;      // UUID — used as primary key in DB

      // 3. call the nutrition engine
      const res = await fetch('/api/health-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // backend verifies this
        },
        body: JSON.stringify({
          household: members,
          user_id: userId, // backend keys the Firebase record by this
        }),
      });

      const data: HealthProfileResponse = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to submit household health data');
      }

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to submit household health data'
      );
    } finally {
      setLoading(false);
    }
  };

  // --- render ---------------------------------------------------------------

  return (
    <section className="household-health-section">
      <div className="household-health-header">
        <span className="household-health-kicker">Household Health Setup</span>
        <h2>Share your household&apos;s nutrition profile</h2>
        <p>Add each household member and submit the profile.</p>
      </div>

      <div className="household-health-list">
        {members.map((member, index) => (
          <article key={`member-${index}`} className="household-member-card">
            <div className="household-member-header">
              <div>
                <p className="household-member-label">Member {index + 1}</p>
                <h3>Health inputs</h3>
              </div>
              <button
                type="button"
                className="secondary-button danger-button"
                onClick={() => removeMember(index)}
                disabled={members.length === 1 || loading}
              >
                Remove Member
              </button>
            </div>

            <div className="household-grid">
              <label className="household-field">
                <span>Age</span>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={member.age}
                  onChange={(e) =>
                    updateMember(
                      index,
                      'age',
                      e.target.value === '' ? '' : Number(e.target.value)
                    )
                  }
                  placeholder="25"
                />
              </label>

              <label className="household-field">
                <span>Gender</span>
                <select
                  value={member.gender}
                  onChange={(e) =>
                    updateMember(index, 'gender', e.target.value as Gender)
                  }
                >
                  <option value="">Select gender</option>
                  <option value="male">male</option>
                  <option value="female">female</option>
                  <option value="other">other</option>
                </select>
              </label>

              <label className="household-field">
                <span>Weight range (kg)</span>
                <input
                  type="text"
                  value={member.weightRange}
                  onChange={(e) =>
                    updateMember(index, 'weightRange', e.target.value)
                  }
                  placeholder="60-70"
                />
              </label>

              <label className="household-field">
                <span>Activity level</span>
                <select
                  value={member.activityLevel}
                  onChange={(e) =>
                    updateMember(
                      index,
                      'activityLevel',
                      e.target.value as ActivityLevel
                    )
                  }
                >
                  <option value="">Select activity level</option>
                  <option value="sedentary">sedentary</option>
                  <option value="light">light</option>
                  <option value="moderate">moderate</option>
                  <option value="active">active</option>
                </select>
              </label>
            </div>

            <div className="household-preferences">
              <span className="household-preferences-label">
                Dietary preferences
              </span>
              <div className="household-checkbox-grid">
                {dietaryOptions.map((preference) => (
                  <label key={preference} className="checkbox-chip">
                    <input
                      type="checkbox"
                      checked={member.dietaryPreferences.includes(preference)}
                      onChange={() => toggleDietaryPreference(index, preference)}
                    />
                    <span>{preference}</span>
                  </label>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="household-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={addMember}
          disabled={loading}
        >
          Add Member
        </button>
        <button
          type="button"
          className="primary-button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Household Profile'}
        </button>
      </div>

      {error ? (
        <p className="status-message error-message">{error}</p>
      ) : null}

      {result ? (
        <div className="result-panel">
          <div className="result-header">
            <h3>Nutrition profile</h3>
            {result.version ? (
              <span className="result-version">v{result.version}</span>
            ) : null}
          </div>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      ) : null}

      <style jsx>{`
        .household-health-section {
          background: #ffffff;
          border: 1px solid #d9e3dc;
          border-radius: 24px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          box-shadow: 0 14px 40px rgba(20, 61, 34, 0.08);
        }

        .household-health-header h2 {
          margin: 8px 0 10px;
          color: #143d22;
          font-size: clamp(1.5rem, 3vw, 2rem);
        }

        .household-health-header p {
          margin: 0;
          color: #4a5f52;
          line-height: 1.6;
        }

        .household-health-kicker {
          display: inline-flex;
          align-items: center;
          padding: 6px 12px;
          border-radius: 999px;
          background: #edf8f0;
          color: #2f7d32;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .household-health-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .household-member-card {
          border: 1px solid #e3ebe5;
          border-radius: 20px;
          padding: 20px;
          background: #fbfdfb;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .household-member-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .household-member-label {
          margin: 0 0 4px;
          color: #2f7d32;
          font-size: 0.9rem;
          font-weight: 700;
        }

        .household-member-header h3 {
          margin: 0;
          color: #143d22;
          font-size: 1.1rem;
        }

        .household-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .household-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          color: #183b22;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .household-field input,
        .household-field select {
          border: 1px solid #cfdacf;
          border-radius: 12px;
          padding: 12px 14px;
          font: inherit;
          color: #183b22;
          background: #ffffff;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .household-field input:focus,
        .household-field select:focus {
          border-color: #2f7d32;
          box-shadow: 0 0 0 3px rgba(47, 125, 50, 0.15);
        }

        .household-preferences {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .household-preferences-label {
          color: #183b22;
          font-weight: 700;
        }

        .household-checkbox-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }

        .checkbox-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #d8e5da;
          border-radius: 12px;
          padding: 12px;
          background: #ffffff;
          color: #274331;
          cursor: pointer;
        }

        .checkbox-chip input {
          accent-color: #2f7d32;
        }

        .household-actions {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .primary-button,
        .secondary-button {
          border: none;
          border-radius: 12px;
          padding: 12px 18px;
          font: inherit;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s ease, opacity 0.2s ease, background 0.2s ease;
        }

        .primary-button {
          background: #2f7d32;
          color: #ffffff;
        }

        .secondary-button {
          background: #eef5ef;
          color: #21432a;
        }

        .danger-button {
          background: #fff0f0;
          color: #a33232;
        }

        .primary-button:hover,
        .secondary-button:hover {
          transform: translateY(-1px);
        }

        .primary-button:disabled,
        .secondary-button:disabled {
          cursor: not-allowed;
          opacity: 0.6;
          transform: none;
        }

        .status-message {
          margin: 0;
          padding: 12px 14px;
          border-radius: 12px;
          font-weight: 600;
        }

        .error-message {
          background: #fff1f1;
          color: #ac2f2f;
          border: 1px solid #f1cccc;
        }

        .result-panel {
          border-radius: 18px;
          background: #112118;
          color: #eaf5ec;
          padding: 18px;
          overflow: hidden;
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .result-header h3 {
          margin: 0;
          font-size: 1rem;
        }

        .result-version {
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
          padding: 4px 10px;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .result-panel pre {
          margin: 0;
          white-space: pre-wrap;
          word-break: break-word;
          font-size: 0.9rem;
          line-height: 1.6;
        }

        @media (max-width: 900px) {
          .household-grid,
          .household-checkbox-grid {
            grid-template-columns: 1fr;
          }

          .household-health-section,
          .household-member-card {
            padding: 18px;
          }

          .household-member-header {
            flex-direction: column;
          }

          .household-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </section>
  );
}
