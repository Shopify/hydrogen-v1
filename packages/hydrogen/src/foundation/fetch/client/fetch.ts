import {wrapPromise} from '../../../utilities';
import {FetchResponse} from '../types';

export function fetch(url: string, options?: RequestInit): FetchResponse {
  async function runFetch(): Promise<[string, Response]> {
    const response = await globalThis.fetch(url, options);
    const text = await response.text();

    return [text, response];
  }

  const [text, response] = wrapPromise(runFetch()).read();

  return {
    response,
    json: () => JSON.parse(text),
    text: () => text,
  };
}
