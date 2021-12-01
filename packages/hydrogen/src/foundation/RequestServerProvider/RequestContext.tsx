import {createContext} from 'react';
import {RequestProviderProps} from './types';

export const RequestContext = createContext<RequestProviderProps | null>({
  requestId: '0',
});
