'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AccescoHeader from '@/components/AccescoHeader';
import { useAuth } from '@/app/components/AuthProvider';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import '@/app/profile/profile.css';

export default function PaymentHistoryPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPaymentHistory() {
      setLoading(true);
      try {
        let history = [];

        // Read from local storage as initial fallback
        const grokly = JSON.parse(localStorage.getItem('grokly_orders') || '[]');
        const swadishtt = JSON.parse(localStorage.getItem('swadishtt-orders') || '[]');
        const instastyle = JSON.parse(localStorage.getItem('instastyle_orders') || '[]');

        const combinedLocal = [...grokly, ...swadishtt, ...instastyle].map(o => ({
          id: o.id || `ord_${Date.now()}`,
          orderId: o.id,
          amount: o.total || o.totals?.total || 0,
          method: (o.paymentMethod || 'upi').toUpperCase(),
          status: o.paymentStatus || (o.status === 'CANCELLED' ? 'FAILED' : 'PAID'),
          venture: o.venture || (o.id?.startsWith('SW') ? 'Swadishtt' : o.id?.startsWith('INS') ? 'InstaStyle' : 'Grokly'),
          date: o.placedAt || o.createdAt || new Date().toISOString(),
          refundStatus: o.refundStatus || 'N/A',
        }));

        history = [...combinedLocal];

        // Fetch from Firestore if user is authenticated
        if (user?.uid) {
          try {
            const payRef = collection(db, 'payments');
            const q = query(payRef, where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
            const snap = await getDocs(q);
            const fsPayments = [];
            snap.forEach(docSnap => {
              const data = docSnap.data();
              fsPayments.push({
                id: docSnap.id,
                orderId: data.orderId || docSnap.id,
                amount: data.amount || 0,
                method: (data.method || 'upi').toUpperCase(),
                status: data.status || 'PAID',
                venture: data.venture || 'General',
                date: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
                refundStatus: data.refundStatus || 'N/A',
              });
            });

            if (fsPayments.length > 0) {
              history = [...fsPayments, ...history.filter(h => !fsPayments.some(fp => fp.orderId === h.orderId))];
            }
          } catch (fsErr) {
            console.warn('Firestore payment query notice:', fsErr);
          }
        }

        setPayments(history);
      } catch (err) {
        console.error('Failed to load payment history:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPaymentHistory();
  }, [user]);

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
      <AccescoHeader />

      <main style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Link href="/profile" style={{ textDecoration: 'none', color: '#6b7280', fontSize: '14px' }}>
            &larr; Back to Profile
          </Link>
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', marginBottom: '6px' }}>
          Payment History
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
          Track past payments, download tax invoices, and retry failed transactions.
        </p>

        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb', overflowX: 'auto' }}>
          {loading ? (
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Loading payment records...</p>
          ) : payments.length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: '14px' }}>No payment records found.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb', color: '#374151' }}>
                  <th style={{ padding: '12px 8px' }}>Date</th>
                  <th style={{ padding: '12px 8px' }}>Order ID</th>
                  <th style={{ padding: '12px 8px' }}>Venture</th>
                  <th style={{ padding: '12px 8px' }}>Amount</th>
                  <th style={{ padding: '12px 8px' }}>Method</th>
                  <th style={{ padding: '12px 8px' }}>Status</th>
                  <th style={{ padding: '12px 8px' }}>Invoice</th>
                  <th style={{ padding: '12px 8px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => {
                  const isPaid = p.status === 'PAID' || p.status === 'SUCCESS';
                  const isFailed = p.status === 'FAILED';

                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px 8px', color: '#6b7280' }}>
                        {new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '12px 8px', fontWeight: 600 }}>#{p.orderId}</td>
                      <td style={{ padding: '12px 8px', color: '#374151', textTransform: 'capitalize' }}>{p.venture}</td>
                      <td style={{ padding: '12px 8px', fontWeight: 700 }}>₹{p.amount}</td>
                      <td style={{ padding: '12px 8px', color: '#4b5563' }}>{p.method}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 700,
                            background: isPaid ? '#dcfce7' : isFailed ? '#fee2e2' : '#fef3c7',
                            color: isPaid ? '#15803d' : isFailed ? '#b91c1c' : '#b45309',
                          }}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        {isPaid ? (
                          <span style={{ color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => alert(`Invoice for order #${p.orderId} generated.`)}>
                            Download PDF
                          </span>
                        ) : (
                          <span style={{ color: '#9ca3af' }}>N/A</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        {isFailed ? (
                          <button
                            onClick={() => alert(`Redirecting to retry payment for order #${p.orderId}`)}
                            style={{ background: '#7A0042', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                          >
                            Retry Payment
                          </button>
                        ) : (
                          <Link href={`/services/${p.venture?.toLowerCase().includes('swad') ? 'swadisht' : p.venture?.toLowerCase().includes('insta') ? 'instastyle' : 'grokly'}/order-tracking?id=${p.orderId}`} style={{ color: '#7A0042', fontWeight: 600, textDecoration: 'none' }}>
                            Track &rarr;
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
