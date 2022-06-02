import React, {
  createContext,
  ReactNode,
  useMemo,
  useCallback,
  // @ts-ignore
  useTransition,
  useState,
} from 'react';

declare global {
  // eslint-disable-next-line no-var
  var __HYDROGEN_DEV__: boolean;
  // eslint-disable-next-line no-var
  var __HYDROGEN_TEST__: boolean;
}

const PRIVATE_PROPS = ['request', 'response'] as const;

export interface LocationServerProps {
  pathname: string;
  search: string;
}

export interface ServerProps {
  [key: string]: any;
}

type ServerPropsSetterInput =
  | ((prev: ServerProps) => Partial<ServerProps>)
  | Partial<ServerProps>
  | string;

export interface ServerPropsSetter {
  (
    input: ServerPropsSetterInput,
    propValue?: any // Value when using string input
  ): void;
}

interface ProposedServerPropsSetter {
  (
    input: ServerPropsSetterInput,
    propValue?: any // Value when using string input
  ): LocationServerProps;
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
  getProposedLocationServerProps: ProposedServerPropsSetter;
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
      startTransition(() => {
        setServerProps((prev) => getNewValue(prev, input, propValue));
        setServerPropsForRsc((prev) => getNewValue(prev, input, propValue));
      });
    },
    [setServerProps, setServerPropsForRsc]
  );

  const setLocationServerPropsCallback = useCallback<ServerPropsSetter>(
    (input, propValue) => {
      // Flush the existing user server state when location changes, leaving only the persisted state
      startTransition(() => {
        setServerPropsForRsc((prev) => getNewValue(prev, input, propValue));
        setServerProps({});
        setLocationServerProps((prev) => getNewValue(prev, input, propValue));
      });
    },
    [setServerProps, setServerPropsForRsc, setLocationServerProps]
  );

  const getProposedLocationServerPropsCallback =
    useCallback<ProposedServerPropsSetter>(
      (input, propValue) => {
        return getNewValue(locationServerProps, input, propValue);
      },
      [locationServerProps]
    );

  function getNewValue(
    prev: any,
    input: ServerPropsSetterInput,
    propValue: any
  ) {
    let newValue: Record<string, any>;

    if (typeof input === 'function') {
      newValue = input(prev);
    } else if (typeof input === 'string') {
      newValue = {[input]: propValue};
    } else {
      newValue = input;
    }

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
      locationServerProps,
      serverProps,
      setServerProps: setServerPropsCallback,
      setLocationServerProps: setLocationServerPropsCallback,
      getProposedLocationServerProps: getProposedLocationServerPropsCallback,
    }),
    [
      pending,
      locationServerProps,
      serverProps,
      setServerPropsCallback,
      setLocationServerPropsCallback,
      getProposedLocationServerPropsCallback,
    ]
  );

  return (
    <ServerPropsContext.Provider value={value}>
      {children}
    </ServerPropsContext.Provider>
  );
}
