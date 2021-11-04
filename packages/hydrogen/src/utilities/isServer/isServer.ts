import {isClient} from '../isClient';

/** The `isServer` utility is a function that returns a `boolean` indicating
 * if the code was run on the server.
 * ## Arguments
 * None
 * ## Return type
 * A `boolean` indicating if the code was run on the server.
 */
export function isServer() {
  return !isClient();
}
