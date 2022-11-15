import {RSC_PATHNAME} from '../constants.js';

export function parseJSON(json: any) {
  if (String(json).includes('__proto__')) return JSON.parse(json, noproto);
  return JSON.parse(json);
}
function noproto(k: string, v: string) {
  if (k !== '__proto__') return v;
}

export function parseState(url: URL) {
  try {
    const {pathname, search} = url;
    const state: Record<string, any> =
      pathname === RSC_PATHNAME
        ? parseJSON(url.searchParams.get('state') ?? '{}')
        : {pathname, search};

    return Object.fromEntries(
      Object.entries(state).map(([key, value]) => [
        decodeURIComponent(key ?? ''),
        decodeURIComponent(value ?? ''),
      ])
    );
  } catch {
    // Do not throw to prevent unhandled errors
  }
}
