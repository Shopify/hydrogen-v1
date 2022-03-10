import {useContext} from 'react';
import {
  ServerStateContext,
  ServerStateContextValue,
} from '../ServerStateProvider';
import {InternalServerStateContextValue} from '../ServerStateProvider/ServerStateProvider';

/**
 * The `useServerState` hook allows you to [manage server state](/custom-storefronts/hydrogen/framework/server-state) when using Hydrogen as a React Server Component framework.
 *
 * ## Return value
 *
 * The `useServerState` hook returns an object with the following keys:
 *
 * | Key            | Description                                                                                                   |
 * | -------------- | ------------------------------------------------------------------------------------------------------------- |
 * | `serverState`    | The current server state.                                                                                      |
 * | `setServerState` | A function used to modify server state.                                                                       |
 * | `pending`        | Whether a [transition is pending](https://github.com/reactwg/react-18/discussions/41). |
 *
 */
export function useServerState(): ServerStateContextValue {
  const internalServerStateContext =
    useContext<InternalServerStateContextValue>(ServerStateContext);

  if (!internalServerStateContext) {
    return {} as ServerStateContextValue;
  }

  return {
    serverState: internalServerStateContext.userServerState,
    setServerState: internalServerStateContext.setUserServerState,
    setPersistedServerState: internalServerStateContext.setPersistedServerState,
    pending: internalServerStateContext.pending,
  };
}

/**
 * Internal-only hook to manage server state, including to set location server state
 * @internal
 */
export function useInternalServerState(): InternalServerStateContextValue {
  return (
    useContext<InternalServerStateContextValue>(ServerStateContext) ??
    ({} as InternalServerStateContextValue)
  );
}
