import React from 'react';
import {Script} from './Script.client.js';
import {useLoadScript} from './useLoadScript.client.js';

export default function Test() {
  const loaded = useLoadScript({
    load: 'onIdle',
    id: 'test-script',
    dangerouslySetInnerHTML: {__html: 'test'},
  });

  return (
    <>
      <Script id="add" load="beforeHydration">
        {`console.log('🎉 Inline code inside <Script children/> works');`}
      </Script>

      <Script load="afterHydration" target="head">
        {`console.log('🎉 Inline code inside <Script children/> works');`}
      </Script>
    </>
  );
}
