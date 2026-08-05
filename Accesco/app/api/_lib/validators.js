const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+\d\s\-()]{7,20}$/;
const PINCODE_REGEX = /^\d{6}$/;

export function isValidEmail(email) {
  return typeof email === 'string' && EMAIL_REGEX.test(email);
}

export function isValidPhone(phone) {
  if (typeof phone !== 'string' || !PHONE_REGEX.test(phone)) return false;
  return phone.replace(/\D/g, '').length >= 7;
}

export function isValidPincode(pincode) {
  return typeof pincode === 'string' && PINCODE_REGEX.test(pincode);
}
