import React from 'react';
import {
  HelmetProps,
  Helmet as ActualHelmet,
  HelmetData,
} from 'react-helmet-async';
import {useServerRequest} from '../ServerRequestProvider';

const clientHelmetData = new HelmetData({});

export function Helmet({
  children,
  ...props
}: HelmetProps & {children: React.ReactNode}) {
  const helmetData = import.meta.env.SSR
    ? useServerRequest().ctx.helmet
    : clientHelmetData;

  return (
    // @ts-ignore
    <ActualHelmet {...props} helmetData={helmetData}>
      {children}
    </ActualHelmet>
  );
}
