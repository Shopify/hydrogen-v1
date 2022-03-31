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

export interface LocationServerProps {
  pathname: string;
  search: string;
}

export interface ServerProps {
  [key: string]: any;
}

type ServerPropsInput =
  | ((prev: ServerProps) => Partial<ServerProps>)
  | Partial<ServerProps>
  | string;

export interface ServerPropsSetter {
  (
    input: ServerPropsInput,
    propValue?: any // Value when using string input
  ): void;
}

interface BaseServerPropsContextValue {
  pending: boolean;
}

export interface InternalServerPropsContextValue
  extends BaseServerPropsContextValue {
  setLocationServerProps: ServerPropsSetter;
  setServerProps: ServerPropsSetter;
  serverProps: ServerProps;
  locationServerProps: LocationServerProps;
}

export interface ServerPropsContextValue extends BaseServerPropsContextValue {
  serverProps: ServerProps;
  setServerProps: ServerPropsSetter;
}

export const ServerPropsContext =
  createContext<InternalServerPropsContextValue>(null as any);

interface ServerPropsProviderProps {
  initialServerProps: LocationServerProps;
  setServerPropsForRsc: React.Dispatch<
    React.SetStateAction<LocationServerProps>
  >;
  children: ReactNode;
}

export function ServerPropsProvider({
  initialServerProps,
  setServerPropsForRsc,
  children,
}: ServerPropsProviderProps) {
  const [locationServerProps, setLocationServerProps] =
    useState<LocationServerProps>(initialServerProps);
  const [serverProps, setServerProps] = useState<ServerProps>({});

  const [pending, startTransition] = useTransition();

  const setServerPropsCallback = useCallback<ServerPropsSetter>(
    (input, propValue) => {
      setServerProps((prev) => getNewValue(prev, input, propValue));
    },
    []
  );

  const setLocationServerPropsCallback = useCallback<ServerPropsSetter>(
    (input, propValue) => {
      // Flush the existing user server state when location changes, leaving only the persisted state
      setServerProps({});
      setLocationServerProps((prev) => getNewValue(prev, input, propValue));
    },
    []
  );

  function getNewValue(prev: any, input: ServerPropsInput, propValue: any) {
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

  const resolvedServerPropsForRsc = useMemo(() => {
    return {
      ...serverProps,
      ...locationServerProps,
    };
  }, [serverProps, locationServerProps]);

  const resolvedServerProps = useMemo(() => {
    return {
      ...serverProps,
    };
  }, [serverProps]);

  useEffect(() => {
    startTransition(() => {
      setServerPropsForRsc(resolvedServerPropsForRsc);
    });
    return () => {};
  }, [resolvedServerPropsForRsc]);

  const value = useMemo(
    () => ({
      pending,
      locationServerProps: locationServerProps,
      serverProps: resolvedServerProps,
      setServerProps: setServerPropsCallback,
      setLocationServerProps: setLocationServerPropsCallback,
    }),
    [
      pending,
      locationServerProps,
      resolvedServerProps,
      setServerPropsCallback,
      setLocationServerPropsCallback,
    ]
  );

  return (
    <ServerPropsContext.Provider value={value}>
      {children}
    </ServerPropsContext.Provider>
  );
}
