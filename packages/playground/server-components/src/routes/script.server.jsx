import {Suspense} from 'react';
import {Script} from '@shopify/hydrogen';

// Page with various uses of Script
export default function ScriptPage() {
  return (
    <>
      <h1>Scripts</h1>

      <ol>
        <li>
          <p>
            Load <code>{`<Script />`}</code> as {`afterInteractive`} in the{' '}
            <code>{`<head />`}</code>
          </p>
        </li>
        <li>
          <p>
            Load <code>{`<Script />`}</code> as {`afterInteractive`} in the{' '}
            <code>{`<body />`}</code>
          </p>
        </li>
        <li>
          <p>
            Load <code>{`<Script />`}</code> as {`lazyOnload`} in the{' '}
            <code>{`<head />`}</code>
          </p>
        </li>
        <li>
          <p>
            Load <code>{`<Script />`}</code> as {`lazyOnload`} in the{' '}
            <code>{`<body />`}</code>
          </p>
        </li>
        <li>
          <p>
            Load inline script <code>{`<Script />`}</code> as {`lazyOnload`} in
            <code>{`<body />`}</code>
          </p>
        </li>
      </ol>

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
        strategy="lazyOnload"
      />

      <Script
        src="https://cdn.dynamicyield.com/api/8777639/api_static.js"
        id="dy-body"
        nonce="dy-12"
        target="body"
        strategy="lazyOnload"
      />
      <Script
        id="dy-body"
        nonce="dy-12"
        target="body"
        // strategy="lazyOnload" // doesn't work with inline scripts
        dangerouslySetInnerHTML={{
          __html: `
            console.log('✅ Loaded inline dy in the body');
            window.dy = window.dy || {};
          `,
        }}
      />
    </>
  );
}
