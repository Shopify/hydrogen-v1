---
gid: 5848138c-3dbb-11ed-b878-0242ac120002
title: Script
description: The Script component renders a script tag
---

<aside class="note beta">
<h4>Experimental feature</h4>

<p>Hydrogen Script is an experimental feature. As a result, functionality is subject to change. You can provide feedback on this feature by <a href="https://github.com/Shopify/hydrogen/issues">submitting an issue in GitHub</a>.</p>

</aside>

The `Script` component is an enhanced HTML [`<script>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) element. Script enables efficient loading third-party scripts by offering different loading strategies within the application lifecycle.

## Example code

Load google analytics only after react has finished hydrating on the client. "afterHydration" is the default loading strategy

{% codeblock file, filename: 'App.server.jsx' %}
```tsx
import {Script} from '@shopify/hydrogen';

export default function App() {
  return (
    <>
      //...
      <Script src="https://www.google-analytics.com/analytics.js" />
    </>
  )
}
```
{% endcodeblock %}

## Props

You can customize the behavior of the component with the following props

| Name           | Type                                             | Description                                                                                                                                                                                          |
| -------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `target`           | <code>"head" \| "body" (default)</code>      | The target DOM element where the script should be inserted. This feature is only available to non-inline loading strategies such as "afterHydration", "inWorker" and "onIdle"  |
| `id`            | <code>string (required)</code>                              | A unique identifier for the script. The id will be used as the key of the script. |
| `src`            | <code>string</code>                              | A URL string. This string can be an absolute path or a relative path depending on the location of the third-party script. The `src` prop is required if `dangerouslySetInnerHTML` or `children` are not used |
| `dangerouslySetInnerHTML` | <code>string</code> | Any valid javascript code |
| `children` | <code>string \| string[]</code> | Any valid javascript code |
| `load`          | <code>"beforeHydration" \| "afterHydration" (default) \| "inWorker" \| "onIdle"</code>| The loading strategy. See Loading strategies for more info. |
| `reload`         | <code>boolean (default false)</code> | Scripts rendered with this option will be reloaded after every page navigation (if available on the next route). This option is only available in "afterHydration" and "onIdle" loading strategies. |
| `onLoad`       | <code>(script) => void</code> | A callback that fires when a script is loaded. This callback is only available in "afterHydration" and "onIdle" loading strategies |
| `onReady`         | <code>(script) => void</code> | A callback that fires when a script is successfully loaded and run. This callback is only available in "afterHydration" and "onIdle" loading strategies  |
| `onError`         | <code>(script) => void</code> | A callback that fires when a script fail to load. This callback is only available in "afterHydration" and "onIdle" loading strategies |


## Loading strategies

### `beforeHydration`

These scripts are inlined and hence considered render-blocking. This strategy is mainly recommended for scripts aiming to set global `window` properties, configurations or event listeners. These scripts can only be included in `App.server.tsx`. This ensures that they are run on any initial route.

{% codeblock file, filename: 'App.server.jsx' %}
```jsx
/* App.server.tsx */
import {Script} from '@shopify/hydrogen';

export default function App() {
  return (
    <>
      // via dangerouslySetInnerHTML
      <Script
        id="bh-dangerously"
        load="beforeHydration"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
          `,
        }}
      />

      // or via children prop
      <Script id="bh-children" load="beforeHydration">
        {`window.dataLayer = window.dataLayer || [];`}
      </Script>

      // or via src — not recommended as this would block the main thread.
      // use afterHydration or onIdle instead to improve performance
      <Script
        id="bh-src"
        load="beforeHydration"
        src="//example.com/script.js"
      />
    </>
  )
}
```
{% endcodeblock %}

### `afterHydration`

These scripts are loaded, injected and run after react has finished hydrating on the client (via a useEffect). In addition, these scripts include additional props to further customize their behavior `target`, `reload`, `onLoad`, `onReady` and `onError` callbacks.

{% codeblock file, filename: 'Component.client.jsx' %}
```jsx
import {Script} from '@shopify/hydrogen';

function Component() {
  return (
    <>
      // with children
      <Script
        id="oi-children-reload"
        load="afterHydration"
        reload={true}
      >
        {`console.log('Loaded after hydration!. Will re-execute if navigating to another route that also renders <Component />.`}
      </Script>

      // with a src
      <Script
        id="oi-src"
        load="afterHydration"
        src="//example.com/script.js"
      />

      // with a src and with reload
      <Script
        id="oi-src-reload"
        src="//example.com/script.js"
        load="afterHydration"
        reload={true}
      />

      // with callbacks
      <Script
        id="oi-src-cbs"
        src="//example.com/script.js"
        load="afterHydration"
        onLoad={() => {
          console.log('🌕 onLoad event');
        }}
        onReady={() => {
          console.log('🟢 onReady event');
        }}
        onError={(error) => {
          console.error('🔴 onError event', error);
        }}
      />
    </>
  )
}
```
{% endcodeblock %}

### `onIdle`

These scripts are loaded, injected and run when the main thread is idle (via requestIdleCallback). In addition, these scripts include additional props to further customize their behavior `target`, `reload`, `onLoad`, `onReady` and `onError` callbacks.

{% codeblock file, filename: 'Component.client.jsx' %}
```jsx
import {Script} from '@shopify/hydrogen';

function Component() {
  return (
    <>
      // with children
      <Script
        id="oi-children-reload"
        load="onIdle"
        reload={true}
      >
        {`console.log('Loaded when on idle!. Will re-execute if navigating to another route that also renders <Component />.`}
      </Script>

      // with a src
      <Script
        id="oi-src"
        load="onIdle"
        src="//example.com/script.js"
      />

      // with a src and with reload
      <Script
        id="oi-src-reload"
        src="//example.com/script.js"
        load="onIdle"
        reload={true}
      />

      // with callbacks
      <Script
        id="oi-src-cbs"
        src="//example.com/script.js"
        load="onIdle"
        onLoad={() => {
          console.log('🌕 onLoad event');
        }}
        onReady={() => {
          console.log('🟢 onReady event');
        }}
        onError={(error) => {
          console.error('🔴 onError event', error);
        }}
      />
    </>
  )
}
```
{% endcodeblock %}

### `inWorker`

These scripts are run outside the main thread by leveraging a [Partytown](https://partytown.builder.io/) web worker. To enable support for this strategy follow these steps:

##### 1. Install partytown

```terminal
yarn add @builder.io/partytown
```

##### 2. Add partytown copylib script

{% codeblock file, filename: 'package.json' %}
```
{
  ...
  "scripts": {
    "dev": "npm run partytown && shopify hydrogen dev",
    "build": "npm run partytown && shopify hydrogen build",
    "partytown": "partytown copylib public/~partytown",
    ...
  }
}
```
{% endcodeblock %}

##### 3. Import `Partytown` and enable atomic mode

{% codeblock file, filename: 'App.server.tsx' %}
```jsx
import {Script} from '@shopify/hydrogen';
import {partytownSnippet} from '@builder.io/partytown/integration';

/*
  Set the required response headers to enable partytown atomics
  @see: https://partytown.builder.io/atomics
*/
function enablePartytownAtomic(response) {
  response.headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
}

export default function App({request, response}) {
  enablePartytownAtomic(response);

  return (
    <>
      // Initialize and configure partytown
      <Script id="partytown-snippet" load="onIdle">
        {partytownSnippet({
          forward: ['forwardedTestFn'],
          resolveUrl(url, location, type) {
            // Some 3rd party libs/resources like https://www.googletagmanager.com/gtm.js
            // require a reverse proxy to handle CORS via when loaded via Web Worker
            const isScriptReq = type === 'script';
            const isProxyReq = url.href.includes('/reverse-proxy');
            const isCorsReq =
              url.href.includes('cors=true') || url.href.includes('gtm.js');

            if (isScriptReq && isCorsReq && !isProxyReq) {
              const proxyUrl = new URL(location.origin + '/reverse-proxy');
              proxyUrl.searchParams.append('libUrl', url.href);
              return proxyUrl;
            }
            return url;
          },
        })}
      </Script>
      <ShopifyProvider countryCode={countryCode}>
        ....
    </>
  )
}
```
{% endcodeblock %}

#### 4. Add a reverse proxy (optional)

The following reverse proxy can be integrated to provide the correct CORS headers for libraries that require them when loaded within a web worker. For more information please check [proxying-requests](https://partytown.builder.io/proxying-requests)

{% codeblock file, filename: '/src/routes/reverse-proxy.server.js' %}
```jsx
/*
  Reverse proxies partytown libs that require CORS. Used by Partytown resolveUrl
  @see: https://partytown.builder.io/proxying-requests
  @see: https://developers.cloudflare.com/workers/examples/cors-header-proxy/
*/

// The endpoint you want the CORS reverse proxy to be on
const PROXY_ENDPOINT = '/reverse-proxy';

export async function api(request) {
  const url = new URL(request.url);
  const isProxyReq = url.pathname.startsWith(PROXY_ENDPOINT);
  const isGet = request.method === 'GET';

  if (isProxyReq && isGet) {
    // Handle requests to the API server
    return handleRequest(request);
  } else {
    return new Response(null, {
      status: 405,
      statusText: 'Only proxy requests are allowed',
    });
  }
}

async function handleRequest(request) {
  const url = new URL(request.url);
  // The target lib url
  let libUrl = url.searchParams.get('libUrl');

  if (libUrl == null) {
    libUrl = request.url.href;
  }

  try {
    let response = await fetch(libUrl);
    const body = await response.arrayBuffer();
    const contentType = response.headers.get('content-type');
    const cacheControl = response.headers.get('cache-control');

    // Recreate the response so you can modify the headers
    response = new Response(body, {
      headers: {
        'content-type': contentType,
        'Access-Control-Allow-Origin': url.origin,
        'cache-control': `${cacheControl}`,
        Vary: 'Origin', // Append to/Add Vary header so browser will cache response correctly
      },
      status: 200,
    });

    return response;
  } catch (error) {
    return new Response(error, {status: 500});
  }
}
```
{% endcodeblock %}

#### 5. Add inWorker scripts
{% codeblock file, filename: 'App.server.tsx' %}
```jsx
export default function App() {
  return (
    <>
     // Loading google analytics.js via a web worker
      <Script
        id="inWorker-analytics"
        load="inWorker"
        src="https://www.google-analytics.com/analytics.js?cors=true"
      />

      // Loading google gtm.js via a web worker
      <Script
        id="inWorker-gtm"
        load="inWorker"
        src="https://www.googletagmanager.com/gtm.js?id=GTM-XYZ12345"
      />
    </>
  )
}
```
{% endcodeblock %}

## Related components

- [`useScript`](https://shopify.dev/api/hydrogen/hooks/primitive/usescript)
