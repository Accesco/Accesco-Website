'use client';

export default function RedeemCodeSection({
  promoInput,
  setPromoInput,
  promoMessage,
  setPromoMessage,
  handleRedeem,
  coupons,
}) {
  return (
    <div className="settings-card profile-panel-card">
      <div className="settings-card-header">
        <span>Redeem Voucher or Promo Code</span>
      </div>

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
                onClick={() => {
                  setPromoInput(c.code);
                  setPromoMessage({
                    type: 'success',
                    text: `Code '${c.code}' selected. Click Redeem to apply!`,
                  });
                }}
              >
                Apply
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
