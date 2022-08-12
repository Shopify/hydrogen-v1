/**
  The `Script` component renders a <script /> tag
**/
import {useEffect, type ScriptHTMLAttributes} from 'react';
import {requestIdleCallback} from '../../utilities/request-idle-callback-polyfill.js';

export const DOMAttributeNames: Record<string, string> = {
  acceptCharset: 'accept-charset',
  className: 'class',
  htmlFor: 'for',
  httpEquiv: 'http-equiv',
  noModule: 'noModule',
};

/*
  if `dangerouslySetInnerHTML` is set, we need to:
  - not allow src
  - not allow strategy="lazyOnload"
*/

export interface ScriptProps extends ScriptHTMLAttributes<HTMLScriptElement> {
  children?: React.ReactNode;
  id?: string;
  onError?: (e: any) => void;
  onLoad?: (e: any) => void;
  onReady?: () => void | null;
  strategy?: 'afterInteractive' | 'lazyOnload' | 'beforeInteractive' | 'worker';
  target?: 'head' | 'body';
}

// Don't spread these in the <script />
const ignoreProps = [
  'children',
  'dangerouslySetInnerHTML',
  'onError',
  'onLoad',
  'onReady',
  'strategy',
  'target',
];

const ScriptCache = new Map();
const LoadCache = new Set();

// Handles afterInteractive, beforeInteractive and worker strategies
function loadScript(props: ScriptProps): void {
  const {
    children = '',
    dangerouslySetInnerHTML,
    id,
    onError,
    onLoad = () => {},
    onReady = null,
    src,
    strategy = 'afterInteractive',
    target = 'body',
  } = props;

  const cacheKey = id || src;

  // Script has already loaded
  if (cacheKey && LoadCache.has(cacheKey)) {
    return;
  }

  // Contents of this script are already loading/loaded
  if (ScriptCache.has(src)) {
    LoadCache.add(cacheKey);
    // Execute onLoad since the script loading has begun
    ScriptCache.get(src).then(onLoad, onError);
    return;
  }

  const script = document.createElement('script');

  const loadPromise = new Promise<void>((resolve, reject) => {
    script.addEventListener('load', function (e) {
      resolve();
      if (onLoad) {
        onLoad.call(this, e);
      }
      // Run onReady for the first time after load event
      if (onReady) {
        onReady();
      }
    });
    script.addEventListener('error', function (e) {
      reject(e);
    });
  }).catch(function (e) {
    if (onError) {
      onError(e);
    }
  });

  if (src) {
    ScriptCache.set(src, loadPromise);
  }
  LoadCache.add(cacheKey);

  if (dangerouslySetInnerHTML) {
    script.innerHTML = dangerouslySetInnerHTML.__html || '';
  } else if (children) {
    script.textContent =
      typeof children === 'string'
        ? children
        : Array.isArray(children)
        ? children.join('')
        : '';
  } else if (src) {
    script.src = src;
  }

  for (const [k, value] of Object.entries(props)) {
    if (value === undefined || ignoreProps.includes(k)) {
      continue;
    }

    const attr = DOMAttributeNames[k] || k.toLowerCase();
    script.setAttribute(attr, value);
  }

  // mark this script to be loaded by partytown
  if (strategy === 'worker') {
    script.setAttribute('type', 'text/partytown');
  }

  script.setAttribute('data-strategy', strategy);

  document[target].appendChild(script);
}

// Handles lazyOnload strategy
function loadLazyScript(props: ScriptProps) {
  if (document.readyState === 'complete') {
    requestIdleCallback(() => loadScript(props));
  } else {
    window.addEventListener('load', () => {
      requestIdleCallback(() => loadScript(props));
    });
  }
}

export function Script(props: ScriptProps): JSX.Element | null {
  const {
    id,
    src = '',
    onLoad = () => {},
    onReady = null,
    strategy = 'afterInteractive',
    onError,
    ...restProps
  } = props;

  useEffect(() => {
    const cacheKey = id || src;

    // Run onReady if script has loaded before but component is re-mounted
    if (onReady && cacheKey && LoadCache.has(cacheKey)) {
      onReady();
    }
  }, [onReady, id, src]);

  // Load script based on loading strategy
  useEffect(() => {
    console.log('strategy', strategy, props);
    if (strategy === 'afterInteractive') {
      loadScript(props);
    } else if (strategy === 'lazyOnload') {
      loadLazyScript(props);
    }
  }, [props, strategy]);

  return null;
}
