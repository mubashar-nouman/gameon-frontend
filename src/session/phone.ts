/**
 * Pakistani mobile numbers, national format: 03XX XXXXXXX — 10 digits after
 * the leading zero, always starting with 3. We store and display the national
 * part; +92 is fixed in the UI.
 */

export const DIAL_CODE = '+92';

/** Digits after the leading 0, e.g. 3001234567. */
const NATIONAL_LENGTH = 10;

/** Strips everything that is not a digit. */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Accepts what people actually paste — 0300…, 92300…, +92 300…, 300… — and
 * reduces it all to the 10-digit national number.
 */
export function toNational(input: string): string {
  let d = digitsOnly(input);
  if (d.startsWith('92')) d = d.slice(2);
  if (d.startsWith('0')) d = d.slice(1);
  return d.slice(0, NATIONAL_LENGTH);
}

/** 3001234567 -> "300 1234567", the grouping used on local SIM packaging. */
export function formatNational(national: string): string {
  const d = toNational(national);
  if (d.length <= 3) return d;
  return `${d.slice(0, 3)} ${d.slice(3)}`;
}

export function isValidNational(national: string): boolean {
  const d = toNational(national);
  return d.length === NATIONAL_LENGTH && d.startsWith('3');
}

/** Full E.164 form for display and storage: +923001234567. */
export function toE164(national: string): string {
  return `${DIAL_CODE}${toNational(national)}`;
}

/** Masked for the OTP screen: +92 300 ***4567. */
export function maskForOtp(national: string): string {
  const d = toNational(national);
  if (d.length < NATIONAL_LENGTH) return `${DIAL_CODE} ${formatNational(d)}`;
  return `${DIAL_CODE} ${d.slice(0, 3)} ***${d.slice(6)}`;
}

export const OTP_LENGTH = 6;

/** Mocked verification: any 6 digits pass until a backend exists. */
export function isValidOtp(code: string): boolean {
  return digitsOnly(code).length === OTP_LENGTH;
}
