/**
  The `Script` component renders a <script /> tag
**/
/*
  TODO:
  eslint-rule for beforeHydration load  `\`next/script\`'s \`beforeHydration\` strategy should not be used outside of \`pages/_document.js\`. See: ${url}`
  @see: /next.js/packages/eslint-plugin-next/lib/rules/no-before-interactive-script-outside-document.js

  eslint-rule warns when used inside .server — can't use callbacks onError, onLoad, onReady

  // TESTS:
    - strips out `async` or `defer` attributes if `src` is not present


  next.js docs
  docs/basic-features/script.md
  <script
    data-partytown-config
    dangerouslySetInnerHTML={{
      __html: `
        partytown = {
          lib: "/_next/static/~partytown/",
          debug: true
        };
      `,
    }}
  />
*/
import {useEffect} from 'react';
import {loadScriptOnIdle} from './loadScriptOnIdle.js';
import {loadScript, LoadCache, ScriptCache} from './loadScript.js';
import {PostHydrationProps} from './types.js';

export function ScriptPostHydration(props: PostHydrationProps): null {
  const {id, src = '', onReady = null, load = 'afterHydration'} = props;
  const key = (id ?? '') + (src ?? '');

  // Run onReady if script has loaded before but component is re-mounted
  useEffect(() => {
    const hasLoaded = key && LoadCache.has(key);
    if (!onReady) return;
    if (!hasLoaded) return;
    const cachedScript = ScriptCache.get(key);
    if (!cachedScript) return;
    onReady(cachedScript.script);
  }, [key, onReady]);

  // Load script based on delayed loading load
  useEffect(() => {
    (async () => {
      if (load === 'afterHydration') {
        await loadScript(props);
      } else if (load === 'onIdle') {
        loadScriptOnIdle(props);
      }
    })();
  }, [props, load]);

  return null;
}
