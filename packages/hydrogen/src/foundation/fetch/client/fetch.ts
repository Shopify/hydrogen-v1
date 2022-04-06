import {suspend} from '../../../utilities/suspense';
import type {FetchResponse} from '../types';

export function fetch(url: string, options?: RequestInit): FetchResponse {
  const [text, response] = suspend([url, options], async () => {
    const response = await globalThis.fetch(url, options);
    const text = await response.text();

    return [text, response] as [string, Response];
  });

  return {
    response,
    json: () => JSON.parse(text),
    text: () => text,
  };
}
