export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-2GWXK710JN';

/**
 * Log pageview events to Google Analytics 4
 * @param {string} url
 */
export const pageview = (url) => {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

/**
 * Log custom events to Google Analytics 4
 * @param {Object} param0
 * @param {string} param0.action - Event name
 * @param {string} [param0.category] - Event category
 * @param {string} [param0.label] - Event label
 * @param {number} [param0.value] - Event value
 */
export const event = ({ action, category, label, value, ...rest }) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...rest,
    });
  }
};

/**
 * Track Add to Cart e-commerce event
 * @param {Object} item
 */
export const trackAddToCart = (item) => {
  event({
    action: 'add_to_cart',
    category: 'ecommerce',
    label: item?.name || item?.id || 'Product',
    items: [
      {
        item_id: item?.id || item?._id || '',
        item_name: item?.name || item?.title || '',
        price: Number(item?.price) || 0,
        quantity: item?.quantity || 1,
        item_category: item?.category || '',
      },
    ],
  });
};

/**
 * Track Remove from Cart e-commerce event
 * @param {Object} item
 */
export const trackRemoveFromCart = (item) => {
  event({
    action: 'remove_from_cart',
    category: 'ecommerce',
    label: item?.name || item?.id || 'Product',
    items: [
      {
        item_id: item?.id || item?._id || '',
        item_name: item?.name || item?.title || '',
        price: Number(item?.price) || 0,
        quantity: item?.quantity || 1,
        item_category: item?.category || '',
      },
    ],
  });
};

/**
 * Track Purchase e-commerce event
 * @param {Object} details
 */
export const trackPurchase = ({ transactionId, value, currency = 'INR', items = [] }) => {
  event({
    action: 'purchase',
    category: 'ecommerce',
    transaction_id: transactionId,
    value: value,
    currency: currency,
    items: items.map((item) => ({
      item_id: item?.id || item?._id || '',
      item_name: item?.name || item?.title || '',
      price: Number(item?.price) || 0,
      quantity: item?.quantity || 1,
    })),
  });
};

/**
 * Track Search query event
 * @param {string} searchTerm
 */
export const trackSearch = (searchTerm) => {
  event({
    action: 'search',
    category: 'engagement',
    search_term: searchTerm,
  });
};
