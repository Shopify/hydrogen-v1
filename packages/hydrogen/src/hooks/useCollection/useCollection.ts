import {useContext} from 'react';
import {CollectionContext} from '../../components';

export function useCollection() {
  const context = useContext(CollectionContext);

  return context;
}
