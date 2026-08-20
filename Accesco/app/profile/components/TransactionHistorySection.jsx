'use client';

export default function TransactionHistorySection({ transactions = [] }) {
  return (
    <div className="tx-history-section">
      <div className="tx-history-header">
        <i className="ri-history-line" style={{ color: '#a81c5a', fontSize: '1.1rem' }} />
        <span>Wallet & Coupon Transaction History</span>
      </div>

      {transactions && transactions.length > 0 ? (
        <div className="tx-history-list">
          {transactions.map((tx) => {
            const isFreeDel =
              tx.title?.includes('FREEDEL') ||
              tx.code === 'FREEDEL' ||
              tx.amount === 'Free Delivery' ||
              tx.amount === 'Free Delivery Pass' ||
              String(tx.title).toLowerCase().includes('freedel');

            const isSwadisht50 =
              tx.code === 'SWADISHT50' ||
              tx.title?.includes('SWADISHT50') ||
              String(tx.title).toLowerCase().includes('swadisht50');

            const isDiscount =
              isSwadisht50 ||
              tx.type === 'discount' ||
              tx.benefitType === 'food_discount' ||
              tx.benefitType === 'grocery_discount' ||
              (typeof tx.amount === 'string' && tx.amount.toLowerCase().includes('discount'));

            const iconClass = isFreeDel
              ? 'credit'
              : isDiscount
              ? 'discount'
              : tx.type || 'credit';

            const iconName = isFreeDel
              ? 'ri-truck-line'
              : isDiscount
              ? 'ri-coupon-3-line'
              : tx.type === 'credit'
              ? 'ri-arrow-down-line'
              : 'ri-arrow-up-line';

            let displayAmount;
            if (isFreeDel) {
              displayAmount = 'Free Delivery';
            } else if (isSwadisht50) {
              displayAmount = 'Food Delivery Discount: ₹50';
            } else if (typeof tx.amount === 'string') {
              displayAmount = tx.amount;
            } else if (typeof tx.amount === 'number') {
              displayAmount = `${tx.type === 'credit' ? '+' : '-'}₹${tx.amount}`;
            } else {
              displayAmount = String(tx.amount || '');
            }

            return (
              <div key={tx.id} className="tx-item">
                <div className="tx-left">
                  <div className={`tx-icon ${iconClass}`}>
                    <i className={iconName} />
                  </div>
                  <div className="tx-details">
                    <span className="tx-title">{tx.title}</span>
                    <span className="tx-date">{tx.date}</span>
                  </div>
                </div>
                <span className={`tx-amount ${iconClass}`}>{displayAmount}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', fontStyle: 'italic', marginTop: '8px' }}>
          No transactions recorded yet. Redeem a coupon code or top up your wallet to get started!
        </p>
      )}
    </div>
  );
}
