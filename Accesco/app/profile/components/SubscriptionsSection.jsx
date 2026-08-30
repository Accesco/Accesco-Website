'use client';

import Link from 'next/link';

export default function SubscriptionsSection({ subscriptions, toggleSub }) {
  return (
    <div className="settings-card profile-panel-card">
      <div className="settings-card-header">
        <span>Accesco Subscriptions ({subscriptions.length})</span>
      </div>

      {subscriptions.length === 0 ? (
        <div className="empty-panel-state">
          <i className="ri-file-list-3-line empty-panel-icon" />
          <h4>No Active Subscriptions</h4>
          <p>Save up to 20% on daily essentials like Grokly Fresh Milk or Swadishtt Daily Meal Boxes by setting up recurring subscriptions.</p>
          <Link href="/services/grokly" className="panel-btn-primary">
            Explore Subscription Plans
          </Link>
        </div>
      ) : (
        <div className="subscriptions-list">
          {subscriptions.map((sub) => (
            <div key={sub.id} className="subscription-card">
              <div className="sub-main">
                <div className="sub-header-row">
                  <strong>{sub.name}</strong>
                  <span className={`sub-status-badge ${sub.status.toLowerCase()}`}>
                    {sub.status}
                  </span>
                </div>
                <p className="sub-meta">
                  {sub.schedule} · <strong>{sub.price}</strong>
                </p>
              </div>
              <button
                type="button"
                className="panel-btn-secondary"
                onClick={() => toggleSub(sub.id)}
              >
                {sub.status === 'Active' ? 'Pause Sub' : 'Resume Sub'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
