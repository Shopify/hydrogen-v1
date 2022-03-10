import React, {
  createContext,
  ReactNode,
  useMemo,
  useCallback,
  // @ts-ignore
  useTransition,
  useState,
  useEffect,
} from 'react';

declare global {
  // eslint-disable-next-line no-var
  var __DEV__: boolean;
}

const PRIVATE_PROPS = ['request', 'response'] as const;

export interface LocationServerState {
  pathname: string;
  search: string;
}

export interface ServerState {
  [key: string]: any;
}

type ServerStateInput =
  | ((prev: ServerState) => Partial<ServerState>)
  | Partial<ServerState>
  | string;

export interface ServerStateSetter {
  (
    input: ServerStateInput,
    propValue?: any // Value when using string input
  ): void;
}

interface BaseServerStateContextValue {
  pending: boolean;
  setPersistedServerState: ServerStateSetter;
}

export interface InternalServerStateContextValue
  extends BaseServerStateContextValue {
  setLocationServerState: ServerStateSetter;
  setUserServerState: ServerStateSetter;
  userServerState: ServerState;
  locationServerState: LocationServerState;
}

export interface ServerStateContextValue extends BaseServerStateContextValue {
  serverState: ServerState;
  setServerState: ServerStateSetter;
}

export const ServerStateContext =
  createContext<InternalServerStateContextValue>(null as any);

interface ServerStateProviderProps {
  initialServerState: LocationServerState;
  setServerStateForRsc: React.Dispatch<
    React.SetStateAction<LocationServerState>
  >;
  children: ReactNode;
}

export function ServerStateProvider({
  initialServerState,
  setServerStateForRsc,
  children,
}: ServerStateProviderProps) {
  const [locationServerState, setLocationServerState] =
    useState<LocationServerState>(initialServerState);
  const [userServerState, setUserServerState] = useState<ServerState>({});
  const [persistedServerState, setPersistedServerState] = useState<ServerState>(
    {}
  );

  const [pending, startTransition] = useTransition();

  const setUserServerStateCallback = useCallback<ServerStateSetter>(
    (input, propValue) => {
      setUserServerState((prev) => getNewValue(prev, input, propValue));
    },
    []
  );

  const setPersistedServerStateCallback = useCallback<ServerStateSetter>(
    (input, propValue) => {
      setPersistedServerState((prev) => getNewValue(prev, input, propValue));
    },
    []
  );

  const setLocationServerStateCallback = useCallback<ServerStateSetter>(
    (input, propValue) => {
      // Flush the existing user server state when location changes, leaving only the persisted state
      setUserServerState({});
      setLocationServerState((prev) => getNewValue(prev, input, propValue));
    },
    []
  );

  function getNewValue(prev: any, input: ServerStateInput, propValue: any) {
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
  }

  const resolvedServerStateForRsc = useMemo(() => {
    return {
      ...userServerState,
      ...locationServerState,
      ...persistedServerState,
    };
  }, [userServerState, locationServerState, persistedServerState]);

  const resolvedUserServerState = useMemo(() => {
    return {
      ...userServerState,
      ...persistedServerState,
    };
  }, [userServerState, persistedServerState]);

  useEffect(() => {
    startTransition(() => {
      setServerStateForRsc(resolvedServerStateForRsc);
    });
    return () => {};
  }, [resolvedServerStateForRsc]);

  const value = useMemo(
    () => ({
      pending,
      locationServerState: locationServerState,
      userServerState: resolvedUserServerState,
      setUserServerState: setUserServerStateCallback,
      setPersistedServerState: setPersistedServerStateCallback,
      setLocationServerState: setLocationServerStateCallback,
    }),
    [
      pending,
      locationServerState,
      resolvedUserServerState,
      setUserServerStateCallback,
      setPersistedServerStateCallback,
      setLocationServerStateCallback,
    ]
  );

  return (
    <ServerStateContext.Provider value={value}>
      {children}
    </ServerStateContext.Provider>
  );
}
