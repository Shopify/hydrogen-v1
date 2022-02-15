import type {RenderType} from './log';

export function findQueryName(key: string) {
  const decodeKey = decodeURIComponent(key);
  const match = decodeKey.match(/query ([^\s\()]*)\s?(|\(\{)/);
  if (match && match.length > 1) {
    return match[1];
  }
  return '<unknown>';
}

export function parseUrl(type: RenderType, url: string) {
  return type === 'rsc'
    ? decodeURIComponent(url.substring(url.indexOf('=') + 1))
    : url;
}
