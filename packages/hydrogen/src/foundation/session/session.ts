import {Logger} from '../../utilities/log';
import {wrapPromise} from '../../utilities/suspense';
import type {ServerComponentResponse} from '../../framework/Hydration/ServerComponentResponse.server';
import type {ServerComponentRequest} from '../../framework/Hydration/ServerComponentRequest.server';

export type SessionSyncApi = {
  name: string;
  get: () => Record<string, string>;
  set: (value: Record<string, string>) => void;
};

export type SessionApi = {
  get: () => Promise<Record<string, string>>;
  set: (key: string, value: string) => Promise<void>;
  destroy: () => Promise<void>;
};

export type SessionStorageAdapter = {
  name: string;
  get: (request: Request) => Promise<Record<string, string>>;
  set: (request: Request, value: Record<string, string>) => Promise<string>;
  destroy: (request: Request) => Promise<string>;
};

export function getSyncSessionApi(
  request: ServerComponentRequest,
  componentResponse: ServerComponentResponse,
  log: Logger,
  session?: SessionStorageAdapter
) {
  type ThrowablePromise = {
    read: () => any;
  };

  const sessionPromises: {[key: string]: ThrowablePromise} = {};

  return session
    ? ({
        name: session.name,
        get() {
          if (!sessionPromises.getPromise) {
            sessionPromises.getPromise = wrapPromise(session.get(request));
          }
          return sessionPromises.getPromise.read();
        },
        async set(value: Record<string, string>) {
          componentResponse.headers.append(
            'Set-Cookie',
            await session.set(request, value)
          );
        },
      } as SessionSyncApi)
    : emptySyncSessionImplementation(log);
}

export const emptySessionImplementation = function (log: Logger) {
  return {
    name: 'no-session',
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
    set() {
      log.warn('No session adapter has been configured!');
      return;
    },
  };
};
