import React from 'react';
import {useParams} from '@shopify/hydrogen/client';

export default function ClientParams() {
  const {handle} = useParams();
  return <h1 id="clientParams">Client Component: {handle}</h1>;
}
