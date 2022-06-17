import type { SessionStorageAdapter } from '../session/session';
import type { CookieOptions } from '../Cookie/Cookie';
/** The `CookieSessionStorage` component is the default session storage mechanism for Hydrogen.
 */
export declare const CookieSessionStorage: (name: string, options: CookieOptions) => () => SessionStorageAdapter;
