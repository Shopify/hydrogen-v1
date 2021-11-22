/** The `isClient` utility is a function that returns a boolean indicating
 * if the code was run on the client.
 */
export function isClient() {
  return typeof window !== 'undefined';
}
