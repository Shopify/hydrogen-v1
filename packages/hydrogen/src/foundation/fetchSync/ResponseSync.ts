import {parseJSON} from '../../utilities/parse.js';
import {log} from '../../utilities/log/index.js';

type ResponseSyncInit = [string, ResponseInit];

export class ResponseSync extends Response {
  bodyUsed = true;
  #text: string;
  #json: any;

  constructor(init: ResponseSyncInit) {
    super(...init);
    this.#text = init[0];
  }

  // @ts-expect-error Changing inherited types
  text() {
    return this.#text;
  }

  json() {
    return (this.#json ??= parseJSON(this.#text));
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
    ] as ResponseSyncInit;
  }
}
