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

            return (
              <div key={tx.id} className="tx-item">
                <div className="tx-left">
                  <div className={`tx-icon ${isFreeDel ? 'credit' : tx.type}`}>
                    <i className={isFreeDel ? 'ri-truck-line' : tx.type === 'credit' ? 'ri-arrow-down-line' : 'ri-arrow-up-line'} />
                  </div>
                  <div className="tx-details">
                    <span className="tx-title">{tx.title}</span>
                    <span className="tx-date">{tx.date}</span>
                  </div>
                </div>
                <span className={`tx-amount ${isFreeDel ? 'credit' : tx.type}`}>
                  {isFreeDel
                    ? '🚚 Free Delivery'
                    : typeof tx.amount === 'number'
                    ? `${tx.type === 'credit' ? '+' : '-'}₹${tx.amount}`
                    : String(tx.amount).startsWith('₹') || String(tx.amount).startsWith('+') || String(tx.amount).startsWith('-')
                    ? tx.amount
                    : `✨ ${tx.amount}`}
                </span>
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
