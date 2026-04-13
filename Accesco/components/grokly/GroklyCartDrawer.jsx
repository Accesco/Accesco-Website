'use client';

const fallbackImg = (name) => `https://placehold.co/120x120/e8f5e9/0c831f?text=${encodeURIComponent(name[0])}`;

export default function GroklyCartDrawer({ cart, products, onClose, onInc, onDec, onCheckout, onClearCart }) {
  const items = Object.entries(cart)
    .map(([id, q]) => ({ p: products.find((x) => x.id === id), q }))
    .filter((x) => x.p);

  const total = items.reduce((s, { p, q }) => s + p.price * q, 0);
  const savings = items.reduce((s, { p, q }) => s + (p.mrp - p.price) * q, 0);
  const count = items.reduce((s, { q }) => s + q, 0);
  const delivFee = total >= 199 ? 0 : 19;
  const handlingFee = 2;
  const grandTotal = total + delivFee + handlingFee;

  return (
    <div id="cart-overlay" className="open" onClick={onClose}>
      <div id="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Zepto-style Header */}
        <div className="cd-head">
          <div className="cd-head-left">
            <div className="cd-title">My Cart</div>
            <div className="cd-sub">{count} item{count !== 1 ? "s" : ""} • ₹{total}</div>
          </div>
          <div className="cd-head-actions">
            {count > 0 && (
              <button 
                className="cd-clear" 
                onClick={onClearCart}
                title="Clear cart"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            )}
            <button className="cd-close" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Zepto-style Delivery Banner */}
        {count > 0 && (
          <div className={`cd-deliv-banner ${delivFee === 0 ? 'free' : 'pending'}`}>
            <div className="cd-deliv-icon">
              {delivFee === 0 ? "✓" : "⚡"}
            </div>
            <div className="cd-deliv-text">
              {delivFee === 0 ? (
                <>
                  <strong>Yay! Free delivery</strong>
                  <span>Your order qualifies for free delivery</span>
                </>
              ) : (
                <>
                  <strong>Add ₹{199 - total} more for free delivery</strong>
                  <span>Save ₹{delivFee} on delivery charges</span>
                </>
              )}
            </div>
          </div>
        )}

        <div id="cd-body" style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
          {count === 0 ? (
            <div className="cd-empty">
              <div className="cd-empty-illustration">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                  <circle cx="60" cy="60" r="50" fill="#f0faf2" stroke="#c6f6d5" strokeWidth="2"/>
                  <path d="M40 50 L50 60 L40 70 M80 50 L70 60 L80 70" stroke="#0c831f" strokeWidth="3" strokeLinecap="round"/>
                  <circle cx="60" cy="85" r="3" fill="#0c831f"/>
                </svg>
              </div>
              <div className="cd-empty-title">Your cart is empty</div>
              <div className="cd-empty-sub">Add items to get started with your order</div>
              <button className="cd-empty-btn" onClick={onClose}>
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Zepto-style Items List */}
              <div className="cd-items">
                {items.map(({ p, q }) => (
                  <div className="ci" key={p.id}>
                    <div className="ci-img-wrap">
                      <img className="ci-img" src={p.img} alt={p.name}
                        onError={(e) => { e.target.src = fallbackImg(p.name); }} />
                    </div>
                    <div className="ci-info">
                      <div className="ci-name">{p.name}</div>
                      <div className="ci-unit">{p.unit}</div>
                      <div className="ci-price-row">
                        <div className="ci-price">
                          <span className="ci-price-current">₹{p.price}</span>
                          {p.mrp > p.price && (
                            <span className="ci-price-mrp">₹{p.mrp}</span>
                          )}
                        </div>
                        {p.disc > 0 && (
                          <div className="ci-discount">{p.disc}% OFF</div>
                        )}
                      </div>
                    </div>
                    <div className="ci-qty">
                      <button className="ci-qbtn" onClick={() => onDec(p.id)}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                      <span className="ci-qnum">{q}</span>
                      <button className="ci-qbtn" onClick={() => onInc(p.id)}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M6 2V10M2 6H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Zepto-style Bill Details */}
              <div className="cd-bill">
                <div className="cd-bill-title">Bill Details</div>
                <div className="cd-bill-row">
                  <span className="cd-bill-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                    </svg>
                    Items total
                  </span>
                  <span className="cd-bill-value">₹{total}</span>
                </div>
                <div className="cd-bill-row">
                  <span className="cd-bill-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                      <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    Delivery fee
                  </span>
                  <span className={`cd-bill-value ${delivFee === 0 ? 'free' : ''}`}>
                    {delivFee === 0 ? 'FREE' : `₹${delivFee}`}
                  </span>
                </div>
                <div className="cd-bill-row">
                  <span className="cd-bill-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 7h-9M14 17H5M6 3v4M10 17v4M14 7v4M18 17v4"/>
                    </svg>
                    Handling fee
                  </span>
                  <span className="cd-bill-value">₹{handlingFee}</span>
                </div>
                {savings > 0 && (
                  <div className="cd-bill-savings">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    You're saving ₹{savings} on this order
                  </div>
                )}
                <div className="cd-bill-divider"></div>
                <div className="cd-bill-row total">
                  <span className="cd-bill-label">Grand Total</span>
                  <span className="cd-bill-value">₹{grandTotal}</span>
                </div>
              </div>

              {/* Zepto-style Checkout Button */}
              <div className="cd-checkout-wrap">
                <button className="cd-checkout" onClick={onCheckout}>
                  <div className="cd-checkout-left">
                    <div className="cd-checkout-amount">₹{grandTotal}</div>
                    <div className="cd-checkout-sub">TOTAL</div>
                  </div>
                  <div className="cd-checkout-right">
                    <span>Proceed to Checkout</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
