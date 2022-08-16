import {Link, useUrl} from '@shopify/hydrogen';
import {Script} from '@shopify/hydrogen/experimental';
import ScriptCallbacks from '../../components/ScriptCallbacks.client';
import ScriptLoadScript from '../../components/ScriptLoadScript.client';
import ScriptUseLoadScript from '../../components/ScriptUseLoadScript.client';
import HydrationComplete from '../../components/Hydration/HydrationComplete.server';

// Page with various uses of Script
// filter logs: /💨|💦|🌊|🕰|🔂|🧪|📦|🔥|🙆|url|------------------------------------------------------------/
export default function ScriptPage({params}) {
  const url = useUrl();
  return (
    // <ScriptProfiler>
    <>
      <HydrationComplete />

      <h1>Script {params.handle}</h1>

      {/* error  */}
      <ScriptCallbacks
        src="/scripts/cdn?script=missing-script.js"
        id="callback-error-script"
        target="body"
        strategy="onIdle"
      />

      <ScriptCallbacks
        src="/scripts/cdn?script=callback-script.js"
        id="callback-success-script"
        target="body"
        strategy="onIdle"
      />

      {/* in the head  */}
      <ScriptHead />

      <ScriptsBeforeHydration />

      <ScriptsAfterHydration />

      <ScriptsOnIdle />

      <ScriptLoadScript strategy="onIdle" />

      <ScriptUseLoadScript reload={true} strategy="onIdle" />

      <ScriptReload handle={params.handle} />

      <br />
      <Link to={`/scripts/${randomHandle(url)}`}>Simulate navigation</Link>

      <hr />

      {/* <Script
        src="/test-module-script.js"
        type="module"
        id="test-module-body"
        nonce="test-script-nonce"
        target="body"
      />

      <Script
        src="https://www.google-analytics.com/analytics.js"
        id="analytics-head"
        nonce="anlytics-11"
        data-test="analytics"
        target="head"
      />

      <Script
        src="https://www.google-analytics.com/analytics.js"
        id="analytics-body"
        nonce="analytics-12"
        data-test="analytics"
        target="body"
      />

      <Script
        src="https://cdn.dynamicyield.com/api/8777639/api_dynamic.js"
        id="dy-head"
        nonce="dy-11"
        target="body"
        strategy="onIdle"
      />

      <Script
        src="https://cdn.dynamicyield.com/api/8777639/api_static.js"
        id="dy-body"
        nonce="dy-12"
        target="body"
        strategy="onIdle"
      />
      <Script
        id="dy-body"
        nonce="dy-12"
        target="body"
        // strategy="onIdle" // doesn't work with inline scripts
        dangerouslySetInnerHTML={{
          __html: `
            console.log('✅ Loaded inline dy in the body');
            window.dy = window.dy || {};
          `,
        }}
      /> */}
    </>
  );
}

function randomHandle(url) {
  const handles = [
    'snowboard',
    'the-full-stack',
    'shopify-aurora',
    'the-h2-snowboard',
    'mail-it-in-freestyle-snowboard',
    'the-oxygen',
    'the-liquid',
    'the-hero-snowboard',
  ];
  const handle = handles[Math.floor(Math.random() * handles.length)];

  // don't want to get stuck on the same handle
  if (url.pathname.includes(handle)) {
    return randomHandle(url);
  }
  return handle;
}

function ScriptHead() {
  return (
    <>
      <section className="head-script">
        <p>Loading script in the head...</p>
      </section>
      <Script src="/scripts/cdn?script=head-script.js" id="head-script" />
    </>
  );
}

function ScriptsBeforeHydration() {
  return (
    <>
      {/*
        `beforeHydration` strategy examples
      */}
      <Script
        id="beforeHydration-dangerouslySetInnerHTML"
        strategy="beforeHydration"
        dangerouslySetInnerHTML={{
          __html: `
            console.log("💨 Inline <Script beforeHydration dangerouslySetInnerHTML/> injected _learnq");
            window._learnq = window._learnq || {};
          `,
        }}
        target="head"
        data-test="head-script"
      />

      <Script id="beforeHydration-children" strategy="beforeHydration">
        {`console.log('💨 Inline <Script beforeHydration children/> injected dataLayer');`}
        {`window.dataLayer = window.dataLayer || [];`}
      </Script>

      <Script
        src="/scripts/cdn?script=before-hydration-script.js"
        id="beforeHydration-src"
        strategy="beforeHydration"
      />
    </>
  );
}

function ScriptsAfterHydration() {
  return (
    <>
      {/*
        `afterHydration` strategy examples
      */}
      <section className="after-hydration">
        Loading afterHydration script via Script tag
      </section>

      <Script
        id="afterHydration-dangerouslySetInnerHTML"
        strategy="afterHydration"
        dangerouslySetInnerHTML={{
          __html: `
            console.log("🌊 Inline <Script afterHydration dangerouslySetInnerHTML/>");
          `,
        }}
      />

      <Script id="afterHydration-children" strategy="afterHydration">
        {`console.log('🌊 Inline <Script afterHydration children/>');`}
      </Script>

      <Script
        src="/scripts/cdn?script=after-hydration-script.js"
        id="after-hydration-script"
        strategy="afterHydration"
      />
    </>
  );
}

function ScriptsOnIdle() {
  return (
    <>
      {/*
        `onIdle` strategy examples
      */}
      <section className="on-idle-hydration">
        <p>Loading on-idle-hydration script...</p>
      </section>

      <Script
        id="onIdle-dangerouslySetInnerHTML"
        strategy="onIdle"
        dangerouslySetInnerHTML={{
          __html: `
            console.log("🕰 Inline <Script onIdle dangerouslySetInnerHTML/>");
          `,
        }}
      />

      <Script id="onIdle-children" strategy="onIdle">
        {`console.log('🕰 Inline <Script onIdle children/>');`}
      </Script>

      <Script
        src="/scripts/cdn?script=on-idle-script.js"
        id="on-idle-hydration-script"
        strategy="onIdle"
      />
    </>
  );
}

function ScriptReload({handle}) {
  return (
    <>
      <section className="after-hydration-reload-script" data-handle={handle}>
        <p>Loading script that need to be loaded on every navigation...</p>
      </section>
      <Script
        src="/scripts/cdn?script=after-hydration-reload-script.js"
        id="after-hydration-reload-script"
        target="body"
        reload={true}
      />
    </>
  );
}
