import {parseJSON} from '../../utilities/parse.js';
import {log} from '../../utilities/log/index.js';

type ResponseSyncInit = [string, ResponseInit, string];

export class ResponseSync extends Response {
  bodyUsed = true;
  #text: string;
  #json: any;
  url: string;

  constructor(init: ResponseSyncInit) {
    super(init[0], init[1]);
    this.#text = init[0];
    this.url = init[2];
  }

  // @ts-expect-error Changing inherited types
  text() {
    return this.#text;
  }

  json() {
    try {
      return (this.#json ??= parseJSON(this.#text));
    } catch (e: any) {
      if (!this.ok) {
        throw new Error(
          `Request to ${this.url} failed with ${this.status} and the response body is not parseable.\nMake sure to handle the error state when using fetchSync.`
        );
      } else throw e;
    }
  }

  /**
   * @deprecated Access response properties at the top level instead.
   */
  get response() {
    if (__HYDROGEN_DEV__) {
      log.warn(
        `Property 'response' is deprecated from the result of 'fetchSync'.` +
          ` Access response properties at the top level instead.`
      );
    }

    return this;
  }

  static async toSerializable(response: Response) {
    return [
      await response.text(),
      {
        status: response.status,
        statusText: response.statusText,
        headers: Array.from(response.headers.entries()),
      },
      response.url,
    ] as ResponseSyncInit;
  }
}
