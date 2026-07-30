'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AccescoHeader from '@/components/AccescoHeader';
import { useAuth } from '@/app/components/AuthProvider';
import {
  getPaymentMethods,
  savePaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod,
} from '@/lib/paymentMethodService';
import '@/app/profile/profile.css';

export default function PaymentMethodsPage() {
  const { user } = useAuth();
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upi'); // 'upi' | 'card'

  // Form State
  const [upiId, setUpiId] = useState('');
  const [cardBrand, setCardBrand] = useState('Visa');
  const [lastFour, setLastFour] = useState('');
  const [expiry, setExpiry] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);
      try {
        const data = await getPaymentMethods(user.uid);
        setMethods(data);
      } catch (err) {
        console.error('Failed to load payment methods:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const handleAddPaymentMethod = async (e) => {
    e.preventDefault();
    if (!user?.uid) {
      setError('Please log in to save payment methods.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      if (activeTab === 'upi') {
        if (!upiId.trim() || !upiId.includes('@')) {
          throw new Error('Please enter a valid UPI ID (e.g. name@upi)');
        }
        await savePaymentMethod(user.uid, {
          type: 'upi',
          upiId: upiId.trim(),
          isDefault: methods.length === 0,
        });
        setUpiId('');
      } else {
        if (!/^\d{4}$/.test(lastFour.trim())) {
          throw new Error('Please enter a valid 4-digit card number end.');
        }
        if (!/^\d{2}\/\d{2}$/.test(expiry.trim())) {
          throw new Error('Please enter expiry as MM/YY (e.g. 12/28)');
        }
        await savePaymentMethod(user.uid, {
          type: 'card',
          brand: cardBrand,
          lastFour: lastFour.trim(),
          expiry: expiry.trim(),
          token: `tok_rzp_${Date.now()}`,
          isDefault: methods.length === 0,
        });
        setLastFour('');
        setExpiry('');
      }

      // Reload methods
      const refreshed = await getPaymentMethods(user.uid);
      setMethods(refreshed);
    } catch (err) {
      setError(err.message || 'Failed to save payment method.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!user?.uid) return;
    try {
      await deletePaymentMethod(user.uid, id);
      setMethods((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleSetDefault = async (id) => {
    if (!user?.uid) return;
    try {
      await setDefaultPaymentMethod(user.uid, id);
      setMethods((prev) =>
        prev.map((m) => ({
          ...m,
          isDefault: m.id === id,
        }))
      );
    } catch (err) {
      console.error('Set default failed:', err);
    }
  };

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
      <AccescoHeader />

      <main style={{ maxWidth: '900px', margin: '30px auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Link href="/profile" style={{ textDecoration: 'none', color: '#6b7280', fontSize: '14px' }}>
            &larr; Back to Profile
          </Link>
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', marginBottom: '6px' }}>
          Saved Payment Methods
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
          Manage your saved UPI handles and tokenized debit/credit cards securely.
        </p>

        {/* Form Container */}
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Add New Payment Method</h2>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={() => { setActiveTab('upi'); setError(''); }}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                background: activeTab === 'upi' ? '#7A0042' : '#ffffff',
                color: activeTab === 'upi' ? '#ffffff' : '#374151',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              UPI ID
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('card'); setError(''); }}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                background: activeTab === 'card' ? '#7A0042' : '#ffffff',
                color: activeTab === 'card' ? '#ffffff' : '#374151',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Credit / Debit Card Token
            </button>
          </div>

          {error && (
            <div style={{ color: '#dc2626', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleAddPaymentMethod}>
            {activeTab === 'upi' ? (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  UPI ID (VPA) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9876543210@paytm or name@okaxis"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                  }}
                />
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Card Brand
                  </label>
                  <select
                    value={cardBrand}
                    onChange={(e) => setCardBrand(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                    }}
                  >
                    <option value="Visa">Visa</option>
                    <option value="Mastercard">Mastercard</option>
                    <option value="RuPay">RuPay</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Last 4 Digits *
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="e.g. 4242"
                    value={lastFour}
                    onChange={(e) => setLastFour(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Expiry (MM/YY) *
                  </label>
                  <input
                    type="text"
                    placeholder="12/28"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                    }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: '#7A0042',
                color: '#ffffff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isSubmitting ? 'Saving...' : 'Save Payment Method'}
            </button>
          </form>
        </div>

        {/* Methods List */}
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Your Saved Payment Methods</h2>

          {loading ? (
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Loading payment methods...</p>
          ) : methods.length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: '14px' }}>No saved payment methods yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {methods.map((method) => (
                <div
                  key={method.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    background: method.isDefault ? '#fdf2f8' : '#ffffff',
                  }}
                >
                  <div>
                    {method.type === 'upi' ? (
                      <div>
                        <strong style={{ fontSize: '14px', color: '#111827' }}>UPI: {method.upiId}</strong>
                        {method.isDefault && (
                          <span style={{ marginLeft: '8px', fontSize: '11px', background: '#7A0042', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>
                            Default
                          </span>
                        )}
                      </div>
                    ) : (
                      <div>
                        <strong style={{ fontSize: '14px', color: '#111827' }}>
                          {method.brand} ending in {method.lastFour}
                        </strong>
                        <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '8px' }}>
                          (Exp: {method.expiry})
                        </span>
                        {method.isDefault && (
                          <span style={{ marginLeft: '8px', fontSize: '11px', background: '#7A0042', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>
                            Default
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    {!method.isDefault && (
                      <button
                        onClick={() => handleSetDefault(method.id)}
                        style={{ background: 'none', border: '1px solid #d1d5db', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(method.id)}
                      style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
