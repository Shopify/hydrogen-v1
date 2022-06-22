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
  var __HYDROGEN_DEV__: boolean;
}

const PRIVATE_PROPS = ['request', 'response'] as const;

export interface ServerState {
  pathname: string;
  search: string;
  [key: string]: any;
}

type ServerStateSetterInput =
  | ((prev: ServerState) => Partial<ServerState>)
  | Partial<ServerState>
  | string;

export interface ServerStateSetter {
  (
    input: ServerStateSetterInput,
    propValue?: any // Value when using string input
  ): void;
}

interface ProposedServerStateSetter {
  (
    input: ServerStateSetterInput,
    propValue?: any // Value when using string input
  ): ServerState;
}

export interface ServerStateContextValue {
  pending: boolean;
  serverState: ServerState;
  setServerState: ServerStateSetter;
  getProposedServerState: ProposedServerStateSetter;
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
        return setServerState((prev) =>
          getNewServerState(prev, input, propValue)
        );
      });
    },
    [setServerState, startTransition]
  );

  const getProposedServerStateCallback = useCallback<ProposedServerStateSetter>(
    (input, propValue) => {
      return getNewServerState(serverState, input, propValue);
    },
    [serverState]
  );

  function getNewServerState(
    prev: ServerState,
    input: ServerStateSetterInput,
    propValue?: any
  ) {
    let newValue: Record<string, any>;

    if (typeof input === 'function') {
      newValue = input(prev);
    } else if (typeof input === 'string') {
      newValue = {[input]: propValue};
    } else {
      newValue = input;
    }

    if (!newValue) return {...prev};

    if (__HYDROGEN_DEV__) {
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
  }

  const value = useMemo(
    () => ({
      pending,
      serverState,
      setServerState: setServerStateCallback,
      getProposedServerState: getProposedServerStateCallback,
    }),
    [
      serverState,
      getProposedServerStateCallback,
      setServerStateCallback,
      pending,
    ]
  );

  return (
    <ServerStateContext.Provider value={value}>
      {children}
    </ServerStateContext.Provider>
  );
}
