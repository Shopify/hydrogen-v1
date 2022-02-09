/**
 * This file is used for compatibility between browser and server environments.
 * The browser loads this file as is, without leaking server logic.
 * In the server, this file is transformed by Vite to inject server logic.
 * NOTE: Do not remove SSR comments in this file, it's used in Vite plugin
 */

import {useContext, Context} from 'react';
import type {ServerComponentRequest} from '../framework/Hydration/ServerComponentRequest.server';
//@SSR import {useServerRequest} from './ServerRequestProvider';

// This is replaced by Vite to import.meta.env.SSR
export const META_ENV_SSR = false;

type ServerGetter<T> = (request: ServerComponentRequest) => T;

const reactContextType = Symbol.for('react.context');

export function useEnvContext<T>(
  serverGetter: ServerGetter<T>,
  clientPayload?: any
) {
  //@SSR if (META_ENV_SSR) return serverGetter(useServerRequest());

  return clientPayload && clientPayload.$$typeof === reactContextType
    ? useContext(clientPayload as Context<T>)
    : (clientPayload as T);
}
