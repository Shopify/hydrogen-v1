import React, {
  createContext,
  ReactNode,
  useMemo,
  useCallback,
  // @ts-ignore
  useTransition,
} from 'react';

export interface ServerStateContextValue {
  serverState: Record<string, any>;
  setServerState(
    input: (() => void) | Record<string, any> | string,
    value?: string | Record<string, any>
  ): void;
  pending: any;
}

export const ServerStateContext = createContext<any>(null);

interface Props {
  serverState: Record<string, any>;
  setServerState: React.Dispatch<
    React.SetStateAction<{
      pathname: string;
      search: string;
      [key: string]: any; // Allow custom properties
    }>
  >;
  children: ReactNode;
}

export function ServerStateProvider({
  serverState,
  setServerState,
  children,
}: Props) {
  const [pending, startTransition] = useTransition();

  const setServerStateCallback = useCallback(
    (
      input: ((prev: any) => any) | Record<string, any> | string,
      value?: string | Record<string, any>
    ) => {
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
            newValue = {[input]: value};
          } else {
            newValue = input;
          }

          if (import.meta.env.DEV) {
            if ('request' in newValue || 'response' in newValue) {
              console.warn(
                `Custom "request" and "response" properties in server state are ignored. Use a different name.`
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
