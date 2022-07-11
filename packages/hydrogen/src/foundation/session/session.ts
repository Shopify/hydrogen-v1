import {Logger} from '../../utilities/log/index.js';
import {wrapPromise} from '../../utilities/suspense.js';
import type {HydrogenResponse} from '../HydrogenResponse/HydrogenResponse.server.js';
import type {HydrogenRequest} from '../HydrogenRequest/HydrogenRequest.server.js';

export type SessionSyncApi = {
  get: () => Record<string, string>;
};

export type SessionApi = {
  get: () => Promise<Record<string, string>>;
  set: (key: string, value: string) => Promise<void>;
  destroy: () => Promise<void>;
};

export type SessionStorageAdapter = {
  get: (request: Request) => Promise<Record<string, string>>;
  set: (request: Request, value: Record<string, string>) => Promise<string>;
  destroy: (request: Request) => Promise<string>;
};

export function getSyncSessionApi(
  request: HydrogenRequest,
  componentResponse: HydrogenResponse,
  log: Logger,
  session?: SessionStorageAdapter
) {
  type ThrowablePromise = {
    read: () => any;
  };

  const sessionPromises: {[key: string]: ThrowablePromise} = {};

  return session
    ? {
        get() {
          if (!sessionPromises.getPromise) {
            sessionPromises.getPromise = wrapPromise(session.get(request));
          }
          return sessionPromises.getPromise.read();
        },
      }
    : emptySyncSessionImplementation(log);
}

export const emptySessionImplementation = function (log: Logger) {
  return {
    async get() {
      log.warn('No session adapter has been configured!');
      return {};
    },
    async set(key: string, value: string) {
      log.warn('No session adapter has been configured!');
    },
    async destroy() {
      log.warn('No session adapter has been configured!');
      return;
    },
  };
};

export const emptySyncSessionImplementation = function (log: Logger) {
  return {
    get() {
      log.warn('No session adapter has been configured!');
      return {};
    },
  };
};
