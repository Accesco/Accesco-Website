'use client';

import { memo } from 'react';
import { formatETA } from '@/lib/etaEngine';

/**
 * Delivery progress card — distance, ETA, speed, traffic, last update.
 */
function DeliveryProgress({ telemetry, className = '' }) {
  if (!telemetry) {
    return (
      <div className={`tracking-delivery-progress ${className}`}>
        <p className="tracking-delivery-empty">Waiting for live updates…</p>
      </div>
    );
  }

  const {
    remainingDistance,
    remainingETA,
    currentSpeed,
    traffic,
    updatedAt,
    orderStatus,
  } = telemetry;

  const updatedLabel = updatedAt
    ? new Date(updatedAt).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : '—';

  return (
    <div className={`tracking-delivery-progress ${className}`}>
      <div className="tracking-delivery-grid">
        <div className="tracking-delivery-metric">
          <span className="tracking-delivery-label">Distance left</span>
          <strong>
            {remainingDistance != null
              ? `${Number(remainingDistance).toFixed(2)} km`
              : '—'}
          </strong>
        </div>
        <div className="tracking-delivery-metric">
          <span className="tracking-delivery-label">ETA</span>
          <strong className="tracking-delivery-eta">
            {remainingETA != null ? formatETA(remainingETA) : '—'}
          </strong>
        </div>
        <div className="tracking-delivery-metric">
          <span className="tracking-delivery-label">Speed</span>
          <strong>
            {currentSpeed != null ? `${Math.round(currentSpeed)} km/h` : '—'}
          </strong>
        </div>
        <div className="tracking-delivery-metric">
          <span className="tracking-delivery-label">Traffic</span>
          <strong>
            {traffic != null ? `×${Number(traffic).toFixed(1)}` : '—'}
          </strong>
        </div>
      </div>
      <div className="tracking-delivery-footer">
        <span>{orderStatus?.replace(/_/g, ' ') ?? 'Live'}</span>
        <span>Updated {updatedLabel}</span>
      </div>
    </div>
  );
}

export default memo(DeliveryProgress);
