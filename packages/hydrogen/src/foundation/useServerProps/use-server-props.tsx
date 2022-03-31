import {useContext} from 'react';
import {
  ServerPropsContext,
  ServerPropsContextValue,
  InternalServerPropsContextValue,
} from '../ServerPropsProvider/ServerPropsProvider';

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
 * | `setPersistedServerState` | A function used to modify server state that should persist between navigations.                                                                       |
 * | `pending`        | Whether a [transition is pending](https://github.com/reactwg/react-18/discussions/41). |
 *
 */
export function useServerProps(): ServerPropsContextValue {
  const internalServerPropsContext =
    useContext<InternalServerPropsContextValue>(ServerPropsContext);

  if (!internalServerPropsContext) {
    return {} as ServerPropsContextValue;
  }

  return {
    serverProps: internalServerPropsContext.serverProps,
    setServerProps: internalServerPropsContext.setServerProps,
    pending: internalServerPropsContext.pending,
  };
}

/**
 * Internal-only hook to manage server state, including to set location server state
 * @internal
 */
export function useInternalServerProps(): InternalServerPropsContextValue {
  return (
    useContext<InternalServerPropsContextValue>(ServerPropsContext) ??
    ({} as InternalServerPropsContextValue)
  );
}
