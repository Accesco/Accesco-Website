'use client';

import { memo } from 'react';
import { formatETA } from '@/lib/etaEngine';
import { formatStatusLabel } from '@/lib/trackingHelpers';

/**
 * Live telemetry strip above the map.
 */
function ETAWidget({ telemetry }) {
  if (!telemetry) return null;

  const {
    remainingETA,
    remainingDistance,
    currentSpeed,
    heading,
    status,
    orderStatus,
    traffic,
    updatedAt,
  } = telemetry;

  const updatedLabel = updatedAt
    ? new Date(updatedAt).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : '—';

  return (
    <div className="tracking-eta-widget">
      <div className="tracking-eta-cell">
        <span className="tracking-eta-label">ETA</span>
        <span className="tracking-eta-value">
          {remainingETA != null ? formatETA(remainingETA) : '—'}
        </span>
      </div>
      <div className="tracking-eta-cell">
        <span className="tracking-eta-label">Distance</span>
        <span className="tracking-eta-value">
          {remainingDistance != null
            ? `${Number(remainingDistance).toFixed(2)} km`
            : '—'}
        </span>
      </div>
      <div className="tracking-eta-cell">
        <span className="tracking-eta-label">Speed</span>
        <span className="tracking-eta-value">
          {currentSpeed != null ? `${Math.round(currentSpeed)} km/h` : '—'}
        </span>
      </div>
      <div className="tracking-eta-cell">
        <span className="tracking-eta-label">Heading</span>
        <span className="tracking-eta-value">
          {heading != null ? `${Math.round(heading)}°` : '—'}
        </span>
      </div>
      <div className="tracking-eta-cell">
        <span className="tracking-eta-label">Traffic</span>
        <span className="tracking-eta-value">
          {traffic != null ? `×${Number(traffic).toFixed(1)}` : '—'}
        </span>
      </div>
      <div className="tracking-eta-cell">
        <span className="tracking-eta-label">Status</span>
        <span className="tracking-eta-value">
          {formatStatusLabel(orderStatus || status)}
        </span>
      </div>
      <div className="tracking-eta-cell">
        <span className="tracking-eta-label">Updated</span>
        <span className="tracking-eta-value">{updatedLabel}</span>
      </div>
    </div>
  );
}

export default memo(ETAWidget);
