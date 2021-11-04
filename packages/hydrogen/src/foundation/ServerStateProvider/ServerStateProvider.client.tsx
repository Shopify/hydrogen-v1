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

/**
 * This is a workaround to support exposing context from within a server component
 * exported from Hydrogen.
 */
declare global {
  var __serverStateContext: any;
}
export const ServerStateContext =
  globalThis.__serverStateContext || createContext<any>(null);

globalThis.__serverStateContext = ServerStateContext;

interface Props {
  serverState: Record<string, any>;
  setServerState: React.Dispatch<
    React.SetStateAction<{
      page: string;
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
      input: () => void | Record<string, any> | string,
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
        // Support callback-style setState
        if (typeof input === 'function') {
          // @ts-ignore
          return setServerState(input);
        }

        // Support a simple object, and spread it into the existing object.
        if (typeof input === 'object') {
          return setServerState((prev) => ({
            ...prev,
            // @ts-ignore
            ...input,
          }));
        }

        // Support a key, value as well.
        if (typeof input === 'string') {
          return setServerState((prev) => ({
            ...prev,
            [input]: value,
          }));
        }
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
