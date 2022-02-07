import React from 'react';
import {
  HelmetProps,
  Helmet as ActualHelmet,
  HelmetData,
} from 'react-helmet-async';
import {useServerRequest} from '../ServerRequestProvider';
import {META_ENV_SSR} from '../../utilities/meta-env-ssr';

export type RealHelmetData = {context: {helmet: HelmetData}};

const clientHelmetData = new HelmetData({}) as unknown as RealHelmetData;

export function Helmet({
  children,
  ...props
}: HelmetProps & {children: React.ReactNode}) {
  // @ts-ignore
  const helmetData = META_ENV_SSR
    ? useServerRequest().ctx.helmet
    : clientHelmetData;

  return (
    // @ts-ignore
    <ActualHelmet {...props} helmetData={helmetData}>
      {children}
    </ActualHelmet>
  );
}
