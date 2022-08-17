import React from 'react';
import {
  HelmetProps as HeadProps,
  Helmet,
  HelmetData as HeadData,
} from 'react-helmet-async';
import {useEnvContext} from '../ssr-interop.js';

const clientHeadData = new HeadData({});

export function Head({
  children,
  ...props
}: HeadProps & {children: React.ReactNode}) {
  const headData = useEnvContext((req) => req.ctx.head, clientHeadData);

  return (
    // @ts-ignore
    <Helmet {...props} helmetData={headData}>
      {children}
    </Helmet>
  );
}
