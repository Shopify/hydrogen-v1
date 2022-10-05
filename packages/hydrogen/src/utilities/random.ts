/*
 * Generate a UUID using crypto and fallback to Math.random if crypto is not available.
 */
export function generateUUID() {
  if (typeof crypto !== 'undefined' && !!crypto.randomUUID) {
    return crypto.randomUUID();
  } else {
    return `weak-${Math.random().toString(16).substring(2)}`;
  }
}
