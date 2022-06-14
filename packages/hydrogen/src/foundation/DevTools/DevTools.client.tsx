import React, {useState, useEffect, useCallback} from 'react';
import {useLifecycleEventListener} from '@shopify/react-performance';
import {Interface, Panels} from './components';

export function DevTools({dataFromServer}: {dataFromServer: any}) {
  const [open, setOpen] = useState(false);
  const toggleOpen = useCallback(() => {
    setOpen((state) => !state);
  }, []);
  const [hasMounted, setHasMounted] = useState(false);
  const [data, setData] = useState(dataFromServer);

  useLifecycleEventListener(({type, start, duration}) => {
    setData((prevData: any) => {
      return {...prevData, [type]: {start, duration}};
    });
  });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (hasMounted) {
    return (
      <Interface open={open} onClose={toggleOpen} onOpen={toggleOpen}>
        <Panels {...data} />
      </Interface>
    );
  }

  return null;
}
