import React from 'react';
import {useParams} from '@shopify/hydrogen';
import ClientParams from '../components/ClientParams.client';

export default function ServerParams() {
  const {handle} = useParams();
  return (
    <>
      <h1 id="serverParams">Server Component: {handle}</h1>
      <ClientParams />
    </>
  );
}
