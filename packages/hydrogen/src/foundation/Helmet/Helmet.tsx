import React from 'react';
import {
  HelmetData,
  HelmetProps,
  Helmet as ActualHelmet,
} from 'react-helmet-async';
import {useServerRequest} from '../ServerRequestProvider';

export function Helmet({
  children,
  ...props
}: HelmetProps & {children: React.ReactNode}) {
  // @ts-ignore
  const context = import.meta.env.SSR ? useServerRequest().ctx : {};
  const helmetData = new HelmetData(context);

  return (
    // @ts-ignore
    <ActualHelmet {...props} helmetData={helmetData}>
      {children}
    </ActualHelmet>
  );
}
