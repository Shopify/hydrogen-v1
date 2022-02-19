import React from 'react';
import {
  HeadProps,
  Head as ActualHead,
  HeadData,
} from 'react-helmet-async';
import {useEnvContext} from '../ssr-interop';

const clientHeadData = new HeadData({});

export function Head({
  children,
  ...props
}: HeadProps & {children: React.ReactNode}) {
  const headData = useEnvContext((req) => req.ctx.head, clientHeadData);

  return (
    // @ts-ignore
    <ActualHead {...props} headData={headData}>
      {children}
    </ActualHead>
  );
}
