import React, {ReactNode, useMemo, useState, useCallback} from 'react';
import {LocalizationContext, Localization} from './LocalizationContext.client';
import {useServerState} from '../../foundation/useServerState';

export default function LocalizationClientProvider({
  localization,
  children,
}: {
  children: ReactNode;
  localization: Localization;
}) {
  const {setPersistedServerState} = useServerState();
  const [country, setCountry] = useState<Localization['country']>(
    localization.country
  );

  const setter = useCallback(
    (country: Localization['country']) => {
      setCountry(country);
      setPersistedServerState('country', country);
    },
    [setPersistedServerState]
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
