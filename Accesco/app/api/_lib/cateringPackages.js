/**
 * Server-authoritative catering packages catalog.
 * Defines trusted prices and exact 70% minimum advance amounts.
 * All amounts are in INR rupees (can be converted to paise via * 100).
 */

export const SERVER_CATERING_PACKAGES = {
  'cp-small': {
    id: 'cp-small',
    name: 'Small Gathering',
    price: 2999,
    minAdvance: 2100, // 70% of 2999 rounded to standard INR rule (₹2,100)
  },
  'cp-birthday': {
    id: 'cp-birthday',
    name: 'Birthday Celebration',
    price: 4999,
    minAdvance: 3500, // 70% of 4999 rounded to standard INR rule (₹3,500)
  },
  'cp-office': {
    id: 'cp-office',
    name: 'Office Lunch Pack',
    price: 3499,
    minAdvance: 2450, // 70% of 3499 rounded to standard INR rule (₹2,450)
  },
  'cp-wedding': {
    id: 'cp-wedding',
    name: 'Mini Wedding Pack',
    price: 9999,
    minAdvance: 7000, // 70% of 9999 rounded to standard INR rule (₹7,000)
  },
};

/**
 * Validates a catering payment amount against package limits.
 */
export function validateCateringPaymentAmount(packageId, amount) {
  const pkg = SERVER_CATERING_PACKAGES[packageId];
  if (!pkg) {
    return { valid: false, error: 'Invalid or unknown catering package.' };
  }

  const numAmount = Number(amount);
  if (!Number.isFinite(numAmount) || !Number.isInteger(numAmount) || numAmount <= 0) {
    return { valid: false, error: 'Payment amount must be a positive whole number in INR.' };
  }

  if (numAmount < pkg.minAdvance) {
    return {
      valid: false,
      error: `Minimum payment required is ₹${pkg.minAdvance.toLocaleString()} (70% of ₹${pkg.price.toLocaleString()}).`,
    };
  }

  if (numAmount > pkg.price) {
    return {
      valid: false,
      error: `Payment amount cannot exceed total package price of ₹${pkg.price.toLocaleString()}.`,
    };
  }

  return { valid: true, pkg, amount: numAmount };
}
