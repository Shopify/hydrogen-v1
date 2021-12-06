import React, {
  createContext,
  ReactNode,
  useMemo,
  useCallback,
  // @ts-ignore
  useTransition,
} from 'react';

declare global {
  // eslint-disable-next-line no-var
  var __DEV__: boolean;
}

const PRIVATE_PROPS = ['request', 'response'] as const;

export interface ServerState {
  pathname: string;
  search: string;
  [key: string]: any;
}

export interface ServerStateSetter {
  (
    input:
      | ((prev: ServerState) => Partial<ServerState>)
      | Partial<ServerState>
      | string,
    propValue?: any // Value when using string input
  ): void;
}

export interface ServerStateContextValue {
  pending: boolean;
  serverState: ServerState;
  setServerState: ServerStateSetter;
}

export const ServerStateContext = createContext<ServerStateContextValue>(
  null as any
);

interface ServerStateProviderProps {
  serverState: ServerState;
  setServerState: React.Dispatch<React.SetStateAction<ServerState>>;
  children: ReactNode;
}

export function ServerStateProvider({
  serverState,
  setServerState,
  children,
}: ServerStateProviderProps) {
  const [pending, startTransition] = useTransition();

  const setServerStateCallback = useCallback<ServerStateSetter>(
    (input, propValue) => {
      /**
       * By wrapping this state change in a transition, React renders the new state
       * concurrently in a new "tree" instead of Suspending and showing the (blank)
       * fallback. This is preferred behavior, though we may want to revisit how
       * we make this decision globally for the developer - and consider providing
       * the `pending` flag also provided by the hook to display in the UI.
       */
      startTransition(() => {
        return setServerState((prev) => {
          let newValue: Record<string, any>;

          if (typeof input === 'function') {
            newValue = input(prev);
          } else if (typeof input === 'string') {
            newValue = {[input]: propValue};
          } else {
            newValue = input;
          }

          if (__DEV__) {
            const privateProp = PRIVATE_PROPS.find((prop) => prop in newValue);
            if (privateProp) {
              console.warn(
                `Custom "${privateProp}" property in server state is ignored. Use a different name.`
              );
            }
          }

          return {
            ...prev,
            ...newValue,
          };
        });
      });
    },
    [setServerState, startTransition]
  );

  const value = useMemo(
    () => ({
      pending,
      serverState,
      setServerState: setServerStateCallback,
    }),
    [serverState, setServerStateCallback, pending]
  );

  return (
    <ServerStateContext.Provider value={value}>
      {children}
    </ServerStateContext.Provider>
  );
}
