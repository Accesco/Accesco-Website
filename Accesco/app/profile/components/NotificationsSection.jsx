'use client';

export default function NotificationsSection({ notifSettings, setNotifSettings }) {
  return (
    <div className="settings-card profile-panel-card">
      <div className="settings-card-header">
        <span>Notification Preferences</span>
      </div>

      <div className="notif-toggle-list">
        <div className="notif-row">
          <div>
            <strong>Order Tracking & Live Updates</strong>
            <small>Receive SMS and App notifications for order status changes</small>
          </div>
          <input
            type="checkbox"
            checked={notifSettings.orderUpdates}
            onChange={() =>
              setNotifSettings((p) => ({ ...p, orderUpdates: !p.orderUpdates }))
            }
          />
        </div>

        <div className="notif-row">
          <div>
            <strong>WhatsApp Notifications</strong>
            <small>Receive digital bills and delivery updates via WhatsApp</small>
          </div>
          <input
            type="checkbox"
            checked={notifSettings.whatsappAlerts}
            onChange={() =>
              setNotifSettings((p) => ({ ...p, whatsappAlerts: !p.whatsappAlerts }))
            }
          />
        </div>

        <div className="notif-row">
          <div>
            <strong>Promotional Offers & Discounts</strong>
            <small>Get notified about weekly deals and exclusive discounts</small>
          </div>
          <input
            type="checkbox"
            checked={notifSettings.promoOffers}
            onChange={() =>
              setNotifSettings((p) => ({ ...p, promoOffers: !p.promoOffers }))
            }
          />
        </div>
      </div>
    </div>
  );
}
