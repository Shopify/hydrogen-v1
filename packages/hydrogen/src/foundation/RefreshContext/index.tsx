import {createContext, useContext} from 'react';

export const RefreshContext = createContext<any>(null);

export function useRefreshCache() {
  return useContext(RefreshContext);
}
