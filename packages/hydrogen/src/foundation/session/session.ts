import {Logger} from '../../utilities/log';
import {useServerRequest} from '../ServerRequestProvider';
import {wrapPromise} from '../../utilities/wrapPromise/wrapPromise';
import {ServerComponentResponse} from '../../framework/Hydration/ServerComponentResponse.server';
import {ServerComponentRequest} from '../../framework/Hydration/ServerComponentRequest.server';

export type SessionSyncApi = {
  get: () => Record<string, string>;
  set: (key: string, value: string) => void;
  destroy: () => void;
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
    ? {
        get() {
          if (!sessionPromises.getPromise) {
            sessionPromises.getPromise = wrapPromise(session.get(request));
          }
          return sessionPromises.getPromise.read();
        },

        set(key: string, value: string) {
          if (!sessionPromises['set' + key + value]) {
            sessionPromises['set' + key + value] = wrapPromise(
              new Promise<string>(async (resolve, reject) => {
                const data = await session.get(request);
                data[key] = value;
                const cookieToSet = await session.set(request, data);
                resolve(cookieToSet);
              })
            );
          }
          const cookieToSet = sessionPromises['set' + key + value].read();
          componentResponse.headers.set('Set-Cookie', cookieToSet);
        },

        destroy() {
          if (!sessionPromises.destroyPromise) {
            sessionPromises.destroyPromise = wrapPromise(
              new Promise<string>(async (resolve, reject) => {
                const cookieToSet = await session.destroy(request);
                resolve(cookieToSet);
              })
            );
          }
          const cookieToSet = sessionPromises.destroyPromise.read();
          componentResponse.headers.set('Set-Cookie', cookieToSet);
        },
      }
    : emptySyncSessionImplementation(log);
}

export const useSession = function () {
  const request = useServerRequest();
  return request.ctx.session;
};

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
    set(key: string, value: string) {
      log.warn('No session adapter has been configured!');
    },
    destroy() {
      log.warn('No session adapter has been configured!');
      return;
    },
  };
};
