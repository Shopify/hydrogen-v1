import React from 'react';
import {useRouteParams} from '@shopify/hydrogen/client';

export default function ClientParams() {
  const {handle} = useRouteParams();
  return <h1 id="clientParams">Client Component: {handle}</h1>;
}
