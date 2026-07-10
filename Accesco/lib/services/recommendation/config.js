export const SWIPE_CONFIG = {
  LEARNING_RATE: 0.12,          // Step size for preference changes (eta)
  DECAY_RATE: 0.01,             // Passive daily weight reduction for unobserved attributes (lambda)
  
  BATCH_SIZE: 10,               // Number of interactions stored in memory before database write
  DECK_SIZE: 12,                // Total card pool size served per request
  PREFETCH_THRESHOLD: 4,        // Trigger target for background fetch
  MAX_OFFLINE_QUEUE_LIMIT: 30,  // Maximum uncommitted interactions stored during network disconnects
  MAX_RETRIES: 5,               // Maximum number of retries for sync requests
  
  WEIGHTS: {
    TAG: 0.35,
    CATEGORY: 0.20,
    BRAND: 0.15,
    COLOR: 0.10,
    PRICE: 0.10,
    MATERIAL: 0.05,
    FRESHNESS: 0.05
  },
  
  MULTIPLIERS: {
    DISLIKE: -1.0,
    LIKE: 1.0,
    SUPERLIKE: 1.8
  },
  
  FRESHNESS_DECAY: 0.05,        // Daily decay coefficient for newly uploaded products (gamma)
  MAX_INTERACTION_AGE_DAYS: 90, // Days of user swipe logs to cache for exclusion calculations
  ANIMATION_SWIPE_LIMIT: 120    // Drag distance in pixels before triggering active swipe transition
};