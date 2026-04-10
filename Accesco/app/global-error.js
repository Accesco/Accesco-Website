'use client';

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body style={{ margin: 0, fontFamily: 'Inter, sans-serif', background: '#fff' }}>
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px' }}>
          <div style={{ maxWidth: '620px', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '10px' }}>A critical error occurred</h2>
            <p style={{ marginBottom: '10px', color: '#555' }}>
              Please refresh the page. If the issue continues, contact support.
            </p>
            <p style={{ marginBottom: '18px', color: '#777', fontSize: '14px' }}>
              {error?.message || 'Unknown error'}
            </p>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                border: 'none',
                borderRadius: '8px',
                padding: '10px 16px',
                background: '#171411',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
