import React from 'react';
import {Script} from './Script.client.js';
import {useLoadScript} from './useLoadScript.client.js';

export default function Test() {
  const loaded = useLoadScript({
    strategy: 'beforeHydration',
    id: 'test',
    src: 'https://www.googletagmanager.com/gtag/js?id=UA-123456789-1',
  });
  return (
    <>
      <Script strategy="beforeHydration">
        {`console.log('🎉 Inline code inside <Script children/> works');`}
      </Script>

      <Script strategy="afterHydration" target="head">
        {`console.log('🎉 Inline code inside <Script children/> works');`}
      </Script>
    </>
  );
}
