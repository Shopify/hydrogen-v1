import type { SessionStorageAdapter } from '../session/session';
import type { CookieOptions } from '../Cookie/Cookie';
import { Logger } from '../../utilities/log';
/** The `FileSessionStorage` component persists session data to the file system.
 */
export declare const FileSessionStorage: (name: string, dir: string, cookieOptions: CookieOptions) => (log: Logger) => SessionStorageAdapter;
