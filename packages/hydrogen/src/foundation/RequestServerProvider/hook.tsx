import {useContext} from 'react';
import {RequestProviderProps} from './types';
import {RequestContext} from './RequestContext';

/**
 * Returns the unique identifier for the current rendering request
 */
export function useRequest(): RequestProviderProps {
  const context = useContext(RequestContext);

  if (!context) {
    throw new Error('No Request Context found');
  }

  return context;
}
