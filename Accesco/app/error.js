'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Route error boundary:', error);
  }, [error]);

  return (
    <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: '24px' }}>
      <div style={{ maxWidth: '560px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '10px' }}>Something went wrong</h2>
        <p style={{ marginBottom: '18px', color: '#555' }}>
          The page hit an unexpected error. Please try again.
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
          Try again
        </button>
      </div>
    </div>
  );
}
