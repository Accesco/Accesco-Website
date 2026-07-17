'use client';

import { memo } from 'react';
import { Phone, MessageCircle, Star, Package } from 'lucide-react';
import { formatStatusLabel } from '@/lib/trackingHelpers';

/**
 * Production rider card — photo, rating, deliveries, vehicle, call/chat.
 */
function RiderInfo({
  rider = {},
  assignment = {},
  telemetry,
  className = '',
}) {
  const name = rider.name || telemetry?.riderName || 'Delivery Partner';
  const phone = rider.phone || telemetry?.riderPhone || '';
  const vehicle = rider.vehicleType || rider.vehicle || 'Bike';
  const vehicleNumber = rider.vehicleNumber || rider.bikeNumber || '—';
  const rating = rider.rating ?? '4.8';
  const deliveries = rider.deliveries ?? '500+';
  const status = rider.status || formatStatusLabel(telemetry?.status) || 'On the way';
  const profileImage =
    rider.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7A0042&color=fff`;

  return (
    <div className={`tracking-rider-card ${className}`}>
      <h2 className="tracking-rider-title">Delivery Partner</h2>

      <div className="tracking-rider-profile">
        <img
          src={profileImage}
          alt={name}
          width={64}
          height={64}
          className="tracking-rider-avatar"
        />
        <div className="tracking-rider-info">
          <div className="tracking-rider-name">{name}</div>
          <div className="tracking-rider-vehicle">
            {vehicle} · {vehicleNumber}
          </div>
          <div className="tracking-rider-stats">
            <span>
              <Star size={14} fill="#F59E0B" stroke="#F59E0B" /> {rating}
            </span>
            <span>
              <Package size={14} /> {deliveries} deliveries
            </span>
          </div>
        </div>
        <span className="tracking-rider-status">{status}</span>
      </div>

      {assignment?.assignedAt && (
        <p className="tracking-rider-assigned">
          Assigned at {assignment.assignedAt}
        </p>
      )}

      <div className="tracking-rider-actions">
        {phone && (
          <a href={`tel:${phone.replace(/\s/g, '')}`} className="tracking-rider-btn call">
            <Phone size={18} />
            Call
          </a>
        )}
        <button type="button" className="tracking-rider-btn chat" disabled>
          <MessageCircle size={18} />
          Chat
        </button>
      </div>
    </div>
  );
}

export default memo(RiderInfo);
