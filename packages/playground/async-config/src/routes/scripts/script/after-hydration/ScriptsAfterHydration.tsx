import React from 'react';
import {Script} from '@shopify/hydrogen/experimental';
import ScriptCallbacks from '../../../../components/ScriptCallbacks.client';

export function ScriptsAfterHydration() {
  return (
    <>
      {/*
        `afterHydration` load examples
      */}
      <div>
        <section className="after-hydration">
          Loading afterHydration script via Script tag...
        </section>

        <section className="after-hydration-reload-script">
          Loading afterHydration script via Script tag...
        </section>

        <Script
          src="/scripts/cdn?script=after-hydration-script.js"
          id="after-hydration-script-src"
          load="afterHydration"
        />

        <Script
          src="/scripts/cdn?script=after-hydration-reload-script.js"
          id="after-hydration-script-src-reload"
          load="afterHydration"
          reload={true}
        />
      </div>

      <Script
        id="after-hydration-script-inline-dangerouslySetInnerHTML"
        load="afterHydration"
        dangerouslySetInnerHTML={{
          __html: `
            console.log("🌊 Inline <Script afterHydration dangerouslySetInnerHTML/>");
          `,
        }}
      />

      <Script id="after-hydration-script-inline-children" load="afterHydration">
        {`console.log('🌊 Inline <Script afterHydration children/>');`}
      </Script>

      <Script
        id="after-hydration-script-inline-children-reload"
        load="afterHydration"
        target="body"
        reload={true}
      >
        {`console.log('🌊 Inline reload code inside <Script children/> works');`}
      </Script>

      {/* ready  callback */}
      <ScriptCallbacks
        id="after-hydration-script-callback-success"
        src="/scripts/cdn?script=callback-script.js"
        load="afterHydration"
      />

      {/* error callback */}
      <ScriptCallbacks
        src="/scripts/cdn?script=missing-script.js"
        id="after-hydration-script-callback-error"
        load="afterHydration"
      />
    </>
  );
}
