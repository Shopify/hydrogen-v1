import React from 'react';
import type {ScriptProps} from './loadScript';

/*
  Adds an inline <script> tag before react hydrates on the client.

  This strategy is helpful for adding global window variables
  such window.dataLayer, window._learnq etc, or pre-hydration
  event listeners, mutation observers, etc.

  Because these scripts are executed before hydration, you should
  avoid scripts that perform DOM manipulations as this will negatively impact
  impact performance and create hydration mismatch errors.

  Its also possible to inline external scripts via the `src` property,
  but this is not recommended because the default script tag config
  is render blocking as it defaults defer and async to false
  in order to ensure that it runs before hydration.

  For optimal performance most scripts should be loaded via the
  `afterHydration` on `onIdle` strategies.

  Usage examples:

  // inline script via dangerouslySetInnerHTML
  <Script
    id="inline-dangerouslySetInnerHTML"
    strategy="beforeHydration"
    dangerouslySetInnerHTML={{
      __html: `
        console.log("🕰 Inline code inside <Script dangerouslySetInnerHTML/> works");
        window._learnq = window._learnq || {};
      `,
    }}
  />

  // inline script via children
  <Script id="beforeHydration-children" strategy="beforeHydration">
    {`console.log('🎉 Inline code inside <Script children/> works');`}
    {`window.dataLayer = window.dataLayer || [];`}
  </Script>

  // inline external script via src
  <Script
    src="/scripts/cdn?script=before-hydration-script.js"
    id="inline-before-hydration-script"
    strategy="beforeHydration"
  />

  TODO:
    - lint/ts should prevent using:
      - `target`
      - `module`
      - `onReady`
      - `onLoad`
      - `onError` as these would be ignored
*/
export function loadScriptBeforeHydration(props: ScriptProps): JSX.Element {
  const {id = '', src: srcProp = null} = props;
  const src = typeof srcProp === 'string' ? srcProp : undefined;
  delete props.strategy;
  delete props.target;
  delete props.onReady;
  delete props.onLoad;
  delete props.onError;

  const isInlineScript =
    !src &&
    (props.children !== undefined || props.dangerouslySetInnerHTML?.__html);

  if (isInlineScript) {
    delete props.src;
    let js = '';

    if (props.children) {
      js =
        typeof props.children === 'string'
          ? props.children
          : Array.isArray(props.children)
          ? props.children.join('')
          : '';
      delete props.children;
    } else if (props.dangerouslySetInnerHTML) {
      js = props.dangerouslySetInnerHTML.__html.trim();
      delete props.dangerouslySetInnerHTML;
    }

    return (
      <script
        id={id}
        key={id + js.slice(0, 24)}
        {...props}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{__html: js}}
        data-strategy="beforeHydration"
      />
    );
  }

  // src provided, default to async and defer false,
  // because this should happen before hydration
  return (
    <script
      {...props}
      key={(id ?? '') + (src ?? '')}
      id={id}
      src={src}
      async={false}
      defer={false} // if the user wants defer or async they should use onIdle or afterHydration strategies
      data-strategy="beforeHydration"
    />
  );
}
