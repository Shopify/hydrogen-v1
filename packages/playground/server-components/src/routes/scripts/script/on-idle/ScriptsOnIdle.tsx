import React from 'react';
import {Script} from '@shopify/hydrogen/experimental';
import ScriptCallbacks from '../../../../components/ScriptCallbacks.client';
import ScriptUseLoadScript from '../../../../components/ScriptUseLoadScript.client';

export function ScriptsOnIdle() {
  return (
    <>
      {/*
        `onIdle` load examples
      */}
      <div>
        <section className="on-idle">
          onIdle script will be injected here once...
        </section>

        <section className="on-idle-reload-script">
          onIdle script will be injected here on each navigation...
        </section>

        <Script
          src="/scripts/cdn?script=on-idle-script.js"
          id="on-idle-script-src"
          load="onIdle"
        />

        <Script
          src="/scripts/cdn?script=on-idle-reload-script.js"
          id="on-idle-script-src-reload"
          load="onIdle"
          reload={true}
        />
      </div>

      <Script
        id="on-idle-script-inline-dangerouslySetInnerHTML"
        load="onIdle"
        dangerouslySetInnerHTML={{
          __html: `
            console.log("🏖 Inline <Script onIdle dangerouslySetInnerHTML/>");
          `,
        }}
      />

      <Script id="on-idle-script-inline-children" load="onIdle">
        {`console.log('🏖 Inline <Script onIdle children/>');`}
      </Script>

      <Script
        id="on-idle-script-inline-children-reload"
        load="onIdle"
        target="body"
        reload={true}
      >
        {`console.log('🏖🔂 Inline <Script onIdle reload children/> works');`}
      </Script>

      {/*  */}
      <ScriptUseLoadScript
        id="use-load-script-on-idle-reload"
        reload={true}
        load="onIdle"
        src="/scripts/cdn?script=use-load-script-on-idle-reload.js"
      />

      {/* ready  callback */}
      <ScriptCallbacks
        id="on-idle-script-callback-success"
        src="/scripts/cdn?script=callback-script.js"
        load="onIdle"
      />

      {/* error callback */}
      <ScriptCallbacks
        src="/scripts/cdn?script=missing-script.js"
        id="on-idle-script-callback-error"
        load="onIdle"
      />
    </>
  );
}
