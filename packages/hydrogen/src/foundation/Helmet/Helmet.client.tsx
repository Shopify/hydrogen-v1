import React from 'react';
import {
  HelmetProps,
  Helmet as ActualHelmet,
  HelmetData,
} from 'react-helmet-async';
import {useEnvContext} from '../ssr-interop';

export type RealHelmetData = {context: {helmet: HelmetData}};

const clientHelmetData = new HelmetData({}) as unknown as RealHelmetData;

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
