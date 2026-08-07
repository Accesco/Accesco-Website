'use client';

import { useEffect } from 'react';

export default function CartError({ error, reset }) {
  useEffect(() => {
    console.error('[Cart Error Boundary]:', error);
  }, [error]);

  return (
    <div style={{ padding: '60px 20px', textAlign: 'center' }}>
      <h2>Something went wrong in your cart!</h2>
      <button
        onClick={() => reset()}
        style={{
          marginTop: '16px',
          padding: '10px 20px',
          backgroundColor: '#111827',
          color: '#ffffff',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Try again
      </button>
    </div>
  );
}
