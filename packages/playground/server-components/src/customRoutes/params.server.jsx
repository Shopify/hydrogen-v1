import React from 'react';
import {useRouteParams} from '@shopify/hydrogen';
import ClientParams from '../components/ClientParams.client';

export default function ServerParams() {
  const {handle} = useRouteParams();
  return (
    <>
      <h1 id="serverParams">Server Component: {handle}</h1>
      <ClientParams />
    </>
  );
}
