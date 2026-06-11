'use client';

export default function RiderInfo({
  rider,
  assignment,
}) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #eee',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '32px',
      }}
    >
      <h2
        style={{
          fontSize: '18px',
          fontWeight: 800,
          marginBottom: '20px',
        }}
      >
        Delivery Partner
      </h2>

      <div
        style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <img
          src={rider.profileImage}
          alt={rider.name}
          width={60}
          height={60}
          style={{
            borderRadius: '50%',
          }}
        />

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: '16px',
            }}
          >
            {rider.name}
          </div>

          <div style={{ color: '#666' }}>
            {rider.vehicleType}
          </div>
        </div>

        <span
          style={{
            background: '#E8F5E9',
            color: '#2E7D32',
            padding: '8px 12px',
            borderRadius: '999px',
            fontWeight: 600,
          }}
        >
          {rider.status}
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '10px',
        }}
      >
        <div>
          <strong>Phone:</strong> {rider.phone}
        </div>

        <div>
          <strong>Assignment Status:</strong>{' '}
          {assignment.status}
        </div>

        <div>
          <strong>Assigned At:</strong>{' '}
          {assignment.assignedAt}
        </div>
      </div>

      <a
        href={`tel:${rider.phone}`}
        style={{
          marginTop: '20px',
          display: 'inline-block',
          background: '#7A0042',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: '12px',
          textDecoration: 'none',
          fontWeight: 700,
        }}
      >
        Call Rider
      </a>
    </div>
  );
}   