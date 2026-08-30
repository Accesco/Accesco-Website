import TransactionHistorySection from './TransactionHistorySection';

export default function RedeemCodeSection({
  promoInput,
  setPromoInput,
  promoMessage,
  setPromoMessage,
  handleRedeem,
  coupons,
  walletBalance = 0,
  transactions = [],
  hasFreeDelivery = false,
}) {
  return (
    <div className="settings-card profile-panel-card">
      <div className="settings-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Redeem Voucher or Promo Code</span>
        <div
          className="wallet-balance-badge"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#fdf2f8',
            color: '#a81c5a',
            border: '1px solid #fbcfe8',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '600',
          }}
        >
          <i className="ri-wallet-3-line" style={{ fontSize: '1rem' }} />
          <span>Wallet Balance: <strong>₹{walletBalance}</strong></span>
        </div>
      </div>

      {hasFreeDelivery && (
        <div
          style={{
            margin: '16px 16px 0 16px',
            padding: '12px 16px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#15803d',
            fontWeight: '600',
            fontSize: '0.88rem',
          }}
        >
          <i className="ri-truck-line" style={{ fontSize: '1.2rem', color: '#16a34a' }} />
          <span>Active Perk: <strong>Free Delivery Pass Active</strong> (Enjoy 0 delivery fee across all services!)</span>
        </div>
      )}

      <form className="redeem-box-form" onSubmit={handleRedeem}>
        <p className="panel-subhead">Have a coupon code or gift card?</p>
        <div className="redeem-input-wrap">
          <input
            type="text"
            placeholder="Enter coupon code (e.g. ACCESCO20)"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
          />
          <button type="submit" className="panel-btn-primary">
            Redeem Code
          </button>
        </div>
        {promoMessage.text && (
          <p className={`promo-alert ${promoMessage.type}`}>{promoMessage.text}</p>
        )}
      </form>

      <div className="coupons-sub-section">
        <p className="panel-subhead">Available Accesco Offers</p>
        {coupons.length > 0 ? (
          <div className="coupons-grid">
            {coupons.map((c) => (
              <div key={c.code} className="coupon-card">
                <div className="coupon-left">
                  <span className="coupon-code-badge">{c.code}</span>
                  <strong>{c.title}</strong>
                  <small>{c.disc} · {c.expiry}</small>
                </div>
                <button
                  type="button"
                  className="btn-text"
                  onClick={() => handleRedeem(null, c.code)}
                >
                  Apply
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#666', fontSize: '0.9rem', fontStyle: 'italic', marginTop: '8px' }}>
            🎉 All available offer codes have been applied! Check back later for new offers.
          </p>
        )}
      </div>

      <TransactionHistorySection transactions={transactions} />
    </div>
  );
}
