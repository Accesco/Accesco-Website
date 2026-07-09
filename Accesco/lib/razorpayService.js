/**
 * Razorpay client helper — shared across Grokly, InstaStyle, and Swadisht checkouts.
 *
 * Flow:
 *  1. loadRazorpayScript() — loads checkout.js once
 *  2. Backend creates a Razorpay order (/api/razorpay/create-order)
 *  3. openRazorpayCheckout() — opens the payment popup (UPI/Card/Netbanking)
 *  4. Backend verifies the payment signature (/api/razorpay/verify-payment)
 *     before the order is considered paid — never trust the frontend alone.
 */

let scriptPromise = null;

export function loadRazorpayScript() {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  return scriptPromise;
}

/**
 * Creates a Razorpay order on the backend for the given amount.
 * @param {number} amount - amount in rupees (converted to paise server-side)
 * @param {string} [receipt] - your own order id, useful for reconciliation
 */
export async function createRazorpayOrder(amount, receipt) {
  const res = await fetch('/api/razorpay/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, receipt }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Failed to create payment order');
  return data; // { orderId, amount, currency, keyId }
}

/**
 * Verifies a completed payment's signature on the backend.
 */
export async function verifyRazorpayPayment(payload) {
  const res = await fetch('/api/razorpay/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || !data.verified) throw new Error(data?.error || 'Payment verification failed');
  return data;
}

/**
 * Opens the Razorpay checkout popup and resolves once the payment is placed
 * AND verified server-side. Rejects if the user cancels or verification fails.
 *
 * @param {object} opts
 * @param {number} opts.amount - amount in rupees
 * @param {string} [opts.receipt] - your own order id
 * @param {string} [opts.name] - shown in the popup header (e.g. "Grokly")
 * @param {string} [opts.description] - shown in the popup
 * @param {{name?:string, email?:string, contact?:string}} [opts.prefill]
 * @param {object} [opts.theme] - e.g. { color: '#0c831f' }
 */
export async function payWithRazorpay({ amount, receipt, name, description, prefill, theme }) {
  const loaded = await loadRazorpayScript();
  if (!loaded) throw new Error('Failed to load Razorpay. Check your internet connection.');

  const order = await createRazorpayOrder(amount, receipt);

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name: name || 'Accesco Living',
      description: description || 'Order payment',
      prefill: prefill || {},
      theme: theme || { color: '#7A0042' },
      handler: async (response) => {
        try {
          const verified = await verifyRazorpayPayment(response);
          resolve({
            paymentId: verified.paymentId,
            orderId: response.razorpay_order_id,
          });
        } catch (err) {
          reject(err);
        }
      },
      modal: {
        ondismiss: () => reject(new Error('Payment cancelled')),
      },
    });

    rzp.on('payment.failed', (resp) => {
      reject(new Error(resp?.error?.description || 'Payment failed'));
    });

    rzp.open();
  });
}
