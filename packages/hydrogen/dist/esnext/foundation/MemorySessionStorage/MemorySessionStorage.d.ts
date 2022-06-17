import type { SessionStorageAdapter } from '../session/session';
import type { CookieOptions } from '../Cookie/Cookie';
/** The `MemorySessionStorage` component stores session data within Hydrogen runtime memory.
 */
export declare const MemorySessionStorage: (name: string, options: CookieOptions) => () => SessionStorageAdapter;
