import React from 'react';
import {
  HelmetProps,
  Helmet as ActualHelmet,
  HelmetData,
} from 'react-helmet-async';
import {useEnvContext} from '../ssr-interop';

const clientHelmetData = new HelmetData({});

export function Helmet({
  children,
  ...props
}: HelmetProps & {children: React.ReactNode}) {
  const helmetData = useEnvContext((req) => req.ctx.helmet, clientHelmetData);

  return (
    // @ts-ignore
    <ActualHelmet {...props} helmetData={helmetData}>
      {children}
    </ActualHelmet>
  );
}
