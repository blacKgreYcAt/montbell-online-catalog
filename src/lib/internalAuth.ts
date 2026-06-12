/**
 * Internal version authentication utilities
 */

const INTERNAL_AUTH_KEY = 'montbell_internal_auth_token';
const CORRECT_PASSWORD = 'FUTAI12012403';

export function isInternalAuthValid(): boolean {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem(INTERNAL_AUTH_KEY);
  return token === CORRECT_PASSWORD;
}

export function setInternalAuth(password: string): boolean {
  if (password === CORRECT_PASSWORD) {
    localStorage.setItem(INTERNAL_AUTH_KEY, password);
    return true;
  }
  return false;
}

export function clearInternalAuth(): void {
  localStorage.removeItem(INTERNAL_AUTH_KEY);
}

export function validatePassword(password: string): boolean {
  return password === CORRECT_PASSWORD;
}
