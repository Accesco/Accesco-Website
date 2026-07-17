'use client';

import { memo } from 'react';
import {
  ORDER_TIMELINE,
  STATUS_META,
  resolveTimelineStatus,
} from '@/lib/trackingHelpers';

/**
 * Vertical order timeline with completed / current / pending states.
 */
function OrderTimeline({
  orderStatus,
  liveOrderStatus,
  className = '',
}) {
  const timelineStatus = resolveTimelineStatus(orderStatus, liveOrderStatus);
  const stepIndex = ORDER_TIMELINE.indexOf(timelineStatus);

  return (
    <div className={`tracking-timeline ${className}`}>
      {ORDER_TIMELINE.map((step, i) => {
        const done = stepIndex >= 0 && i < stepIndex;
        const active = i === stepIndex;
        const pending = stepIndex >= 0 && i > stepIndex;
        const meta = STATUS_META[step] || { label: step, desc: '' };

        return (
          <div
            key={step}
            className={`tracking-timeline-item ${
              done ? 'completed' : active ? 'current' : pending ? 'pending' : ''
            }`}
          >
            <div className="tracking-timeline-rail">
              <div className="tracking-timeline-dot">
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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
              {i < ORDER_TIMELINE.length - 1 && (
                <div className="tracking-timeline-line" />
              )}
            </div>
            <div className="tracking-timeline-content">
              <p className="tracking-timeline-label">{meta.label}</p>
              {active && meta.desc && (
                <p className="tracking-timeline-desc">{meta.desc}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default memo(OrderTimeline);
