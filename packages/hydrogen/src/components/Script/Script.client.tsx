/**
  The `Script` component renders a <script /> tag
**/
/*
  TODO:
  eslint-rule for beforeHydration strategy  `\`next/script\`'s \`beforeHydration\` strategy should not be used outside of \`pages/_document.js\`. See: ${url}`
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
import {loadScriptBeforeHydration} from './loadScriptBeforeHydration.js';
import {loadScriptOnIdle} from './loadScriptOnIdle.js';
import {loadScript, LoadCache, type ScriptProps} from './loadScript.js';

export function Script(props: ScriptProps): JSX.Element | null {
  const {
    id,
    src = '',
    // onLoad = () => {},
    onReady = null,
    strategy = 'afterHydration',
    // onError,
  } = props;
  const key = (id ?? '') + (src ?? '');

  // Run onReady if script has loaded before but component is re-mounted
  useEffect(() => {
    const hasLoaded = key && LoadCache.has(key);
    if (!onReady) return;
    if (!hasLoaded) return;
    onReady();
  }, [onReady, key]);

  // Load script based on delayed loading strategy
  useEffect(() => {
    (async () => {
      if (strategy === 'beforeHydration') return;
      // default strategy
      if (strategy === 'afterHydration') {
        await loadScript(props);
      } else if (strategy === 'onIdle') {
        loadScriptOnIdle(props);
      }
    })();
  }, [props, strategy]);

  // Load script with an eager strategy
  return strategy === 'beforeHydration'
    ? loadScriptBeforeHydration({id, src, ...props})
    : null;
}
