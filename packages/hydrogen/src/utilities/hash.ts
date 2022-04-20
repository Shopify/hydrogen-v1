import {QueryKey} from '../types';

export function hashKey(key: QueryKey): string {
  const rawKey = key instanceof Array ? key : [key];

  /**
   * TODO: Smarter hash
   */
  return rawKey.map((k) => JSON.stringify(k)).join('');
}
