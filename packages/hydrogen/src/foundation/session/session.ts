import {Logger} from '../../utilities/log';
import {wrapPromise} from '../../utilities/suspense';
import type {HydrogenResponse} from '../HydrogenResponse/HydrogenResponse.server';
import type {HydrogenRequest} from '../HydrogenRequest/HydrogenRequest.server';
import type {SessionStorageAdapter} from './session-types';

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
