import React, {ReactNode, useMemo, useState, useCallback} from 'react';
import {LocalizationContext, Localization} from './LocalizationContext.client';
import {ServerStateContextValue} from '../../foundation/ServerStateProvider';
import {useServerState} from '../../foundation/useServerState';

export interface LocalizationClientProviderProps {
  children: ReactNode;
  localization: Localization;
}

export default function LocalizationClientProvider({
  localization,
  children,
}: LocalizationClientProviderProps) {
  const {setServerState} = useServerState() as ServerStateContextValue;
  const [country, setCountry] = useState<Localization['country']>(
    localization.country
  );

  const setter = useCallback(
    (country: Localization['country']) => {
      setCountry(country);
      setServerState('country', country);
    },
    [setServerState]
  );

  const contextValue = useMemo(() => {
    return {
      country,
      setCountry: setter,
    };
  }, [country, setter]);

  return (
    <LocalizationContext.Provider value={contextValue}>
      {children}
    </LocalizationContext.Provider>
  );
}
