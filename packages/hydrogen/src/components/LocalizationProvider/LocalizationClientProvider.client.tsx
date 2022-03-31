import React, {ReactNode, useMemo, useState, useCallback} from 'react';
import {LocalizationContext, Localization} from './LocalizationContext.client';
import {useServerProps} from '../../foundation/useServerProps';

export default function LocalizationClientProvider({
  localization,
  children,
}: {
  children: ReactNode;
  localization: Localization;
}) {
  const {setServerProps} = useServerProps();
  const [country, setCountry] = useState<Localization['country']>(
    localization.country
  );

  const setter = useCallback(
    (country: Localization['country']) => {
      setCountry(country);
      setServerProps('country', country);
    },
    [setServerProps]
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
