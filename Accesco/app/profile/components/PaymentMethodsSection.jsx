import TransactionHistorySection from './TransactionHistorySection';

export default function PaymentMethodsSection({
  walletBalance,
  showAddMoney,
  setShowAddMoney,
  addAmount,
  setAddAmount,
  handleAddMoney,
  addMoneyNotice = '',
  upiList,
  showAddUpi,
  setShowAddUpi,
  newUpi,
  setNewUpi,
  handleAddUpi,
  cardsList = [],
  transactions = [],
}) {
  return (
    <div className="settings-card profile-panel-card">
      <div className="settings-card-header">
        <span>Accesco Wallet & Payment Options</span>
      </div>

      <div className="wallet-banner-card">
        <div className="wallet-info">
          <span className="wallet-title">Accesco Pay Wallet</span>
          <h3 className="wallet-balance">₹{walletBalance}</h3>
          <p className="wallet-sub">Instant 1-click checkout across Grokly, Swadishtt & InstaStyle</p>
        </div>
        <button
          type="button"
          className="panel-btn-primary"
          onClick={() => setShowAddMoney(!showAddMoney)}
        >
          + Add Money
        </button>
      </div>

      {showAddMoney && (
        <form className="inline-add-box" onSubmit={handleAddMoney}>
          <input
            type="number"
            placeholder="Enter amount (₹)"
            value={addAmount}
            onChange={(e) => setAddAmount(e.target.value)}
            required
          />
          <button type="submit" className="panel-btn-primary">
            Top Up Wallet
          </button>
        </form>
      )}

      {addMoneyNotice && (
        <p style={{ margin: '8px 16px 0', color: '#a81c5a', fontSize: '0.88rem', fontStyle: 'italic' }}>
          {addMoneyNotice}
        </p>
      )}

      <div className="payment-sub-section">
        <div className="sub-section-header">
          <span>Saved UPI IDs</span>
          <button type="button" className="panel-btn-secondary btn-sm" onClick={() => setShowAddUpi(!showAddUpi)}>
            + Add UPI
          </button>
        </div>

        {showAddUpi && (
          <form className="inline-add-box" onSubmit={handleAddUpi}>
            <input
              type="text"
              placeholder="e.g. username@upi"
              value={newUpi}
              onChange={(e) => setNewUpi(e.target.value)}
              required
            />
            <button type="submit" className="panel-btn-primary">
              Save UPI
            </button>
          </form>
        )}

        {upiList.length === 0 ? (
          <p className="empty-panel-substate">No saved UPI IDs yet. Click "+ Add UPI" to add your VPA ID.</p>
        ) : (
          <div className="upi-list">
            {upiList.map((upi, index) => (
              <div key={index} className="upi-item">
                <div className="upi-info">
                  <i className="ri-bank-card-line" />
                  <span>{upi}</span>
                </div>
                <span className="upi-badge">Verified</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="payment-sub-section">
        <div className="sub-section-header">
          <span>Saved Cards</span>
        </div>
        {cardsList.length === 0 ? (
          <p className="empty-panel-substate">No saved credit or debit cards yet.</p>
        ) : (
          <div className="upi-list">
            {cardsList.map((card, idx) => (
              <div key={idx} className="card-item">
                <i className="ri-visa-line card-icon" />
                <div className="card-info">
                  <strong>•••• •••• •••• {card.last4}</strong>
                  <small>Expires {card.expiry} · {card.bank}</small>
                </div>
                {card.isPrimary && <span className="card-badge">Primary</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      <TransactionHistorySection transactions={transactions} />
    </div>
  );
}
