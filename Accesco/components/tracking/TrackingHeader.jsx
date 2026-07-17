/**
 * @fileoverview Branded order tracking page header showing metadata and connection status.
 *
 * @module components/tracking/TrackingHeader
 */

import { memo } from 'react';
import { getTrackingProvider } from '@/services/trackingService';

/**
 * Standard status styling map.
 */
const badgeClasses = {
  PLACED: 'tracking-badge-placed',
  CONFIRMED: 'tracking-badge-placed',
  PREPARING: 'tracking-badge-preparing',
  PACKED: 'tracking-badge-preparing',
  RIDER_ASSIGNED: 'tracking-badge-preparing',
  PICKED_UP: 'tracking-badge-preparing',
  OUT_FOR_DELIVERY: 'tracking-badge-out',
  ARRIVING: 'tracking-badge-arriving',
  DELIVERED: 'tracking-badge-delivered',
};

/**
 * Branded Order Status Tracking Header.
 *
 * @param {object} props
 * @param {string} props.orderId
 * @param {string} props.orderStatus
 * @param {boolean} [props.isOffline=false]
 * @returns {React.ReactElement} Header view
 */
function TrackingHeader({ orderId, orderStatus, isOffline = false }) {
  const provider = getTrackingProvider();
  const statusKey = (orderStatus || 'PLACED').toUpperCase();
  const badgeClass = badgeClasses[statusKey] || 'tracking-badge-placed';
  const displayStatus = (orderStatus || 'Placed')
    .toString()
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="tracking-header-card">
      <div className="tracking-header-info">
        <h2>Order #{orderId?.split('-')[1]?.toUpperCase() || orderId || '—'}</h2>
        <div className="tracking-header-meta">
          <span>Tracking Mode: </span>
          <strong style={{ textTransform: 'capitalize' }}>{provider}</strong>
          {isOffline && (
            <span style={{ color: '#ef4444', marginLeft: '12px', fontWeight: 'bold' }}>
              ● Disconnected (Reconnecting…)
            </span>
          )}
        </div>
      </div>
      <span className={`tracking-header-badge ${badgeClass}`}>
        {displayStatus}
      </span>
    </div>
  );
}

export default memo(TrackingHeader);
