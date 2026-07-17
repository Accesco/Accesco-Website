'use client';

import { memo } from 'react';
import {
  DELIVERY_STAGES,
  getDeliveryStageIndex,
} from '@/lib/trackingHelpers';

/**
 * Horizontal delivery progress stages (Swiggy/Blinkit style).
 */
function DeliveryProgressBar({ orderStatus, className = '' }) {
  const activeIndex = getDeliveryStageIndex(orderStatus);

  return (
    <div className={`tracking-progress-bar ${className}`}>
      {DELIVERY_STAGES.map((stage, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;
        const pending = i > activeIndex;

        return (
          <div
            key={stage.key}
            className={`tracking-progress-stage ${
              done ? 'done' : active ? 'active' : pending ? 'pending' : ''
            }`}
          >
            <div className="tracking-progress-dot">
              {done ? (
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2.5 7L5.5 10L11.5 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <span>{i + 1}</span>
              )}
            </div>
            <span className="tracking-progress-label">{stage.label}</span>
            {i < DELIVERY_STAGES.length - 1 && (
              <div
                className={`tracking-progress-connector ${
                  done ? 'done' : ''
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default memo(DeliveryProgressBar);
