/**
  The `Script` component renders a <script /> tag
**/
/*
  To test:
  - strips out `async` or `defer` attributes if `src` is not present
*/

// #see: https://stackoverflow.com/questions/2920129/can-i-run-javascript-before-the-whole-page-is-loaded
// @see: https://i.stack.imgur.com/FcAKu.png

import React, {type ScriptHTMLAttributes} from 'react';
import {logScriptPerformance} from './logScriptPerformance.js';

interface ErrorEventHandler {
  (
    event: Event | string,
    source?: string,
    fileno?: number,
    columnNumber?: number,
    error?: Error
  ): void;
}

export type ScriptState = 'loading' | 'done' | 'error';
export type ScriptTarget = 'head' | 'body';
export type ScriptStrategy =
  | 'beforeHydration'
  | 'afterHydration'
  | 'onIdle'
  | 'worker';

/* Ensure that either `src`, `children` or `dangerouslySetInnerHTML` is set, but not any combination of them */
type InlineProps =
  | {
      dangerouslySetInnerHTML: {__html: string};
      children?: never;
      src?: never;
    }
  | {
      children: React.ReactNode;
      dangerouslySetInnerHTML?: never;
      src?: never;
    }
  | {
      children?: never;
      dangerouslySetInnerHTML?: never;
      src: string;
    };

/* All scripts share these props */
type BaseProps = {
  children?: React.ReactNode;
  id?: string;
  src?: string;
} & InlineProps;

export type BeforeHydrationProps = {
  strategy: 'beforeHydration';
  [key: string]: any;
} & BaseProps &
  ScriptHTMLAttributes<HTMLScriptElement>;

export type PostHydrationProps = {
  onError?: (e: any) => void;
  /* Event emitted when the script is loaded */
  onLoad?: (e: any) => void;
  /* Event emitted when the script is ready */
  onReady?: (e?: any) => void;
  /* Simulates MPA architecture force reloading the script on every navigation */
  reload?: boolean;
  /* defines the loading mechanism in relation to the main loop */
  strategy?: Exclude<ScriptStrategy, 'beforeHydration'>;
  /* where to insert the script tag */
  target?: ScriptTarget;
} & BaseProps &
  ScriptHTMLAttributes<HTMLScriptElement>;

type StrategyProps = BeforeHydrationProps | PostHydrationProps;

export type ScriptProps = StrategyProps;

// Don't spread these props in the <script />
const ignoreProps = [
  'children',
  'dangerouslySetInnerHTML',
  'onError',
  'onLoad',
  'onReady',
  'strategy',
  'target',
  'reload',
];

interface ScriptResponse {
  /* whether the script was loaded */
  status: boolean;
  /* the onload/onerror event if one occurred */
  event: Event | string;
}

const DOMAttributeNames: Record<string, string> = {
  acceptCharset: 'accept-charset',
  className: 'class',
  htmlFor: 'for',
  httpEquiv: 'http-equiv',
  noModule: 'noModule',
};

type Timing = {
  start?: number;
  load?: number;
  ready?: number;
  error?: number;
};

type ScriptCacheProps = {
  script: HTMLScriptElement;
  promise: Promise<ScriptResponse>;
};

export const TimingCache = new Map<string, Timing>(); // script load times cache
export const ScriptCache = new Map<string, ScriptCacheProps>(); // script instances cache
export const PrevPathnameCache = new Map<string, string>(); // path
export const LoadCache = new Set<string>(); // script loading/loaded cache

/*
  Inject a <script /> in the DOM base on
  afterHydration, beforeHydration and worker strategies
*/
export async function loadScript(
  props: ScriptProps
): Promise<ScriptResponse | void> {
  const {
    children = '',
    dangerouslySetInnerHTML,
    id,
    onError,
    onLoad = () => {},
    onReady = null,
    src,
    strategy = 'afterHydration', // default strategy
    target = 'body',
    reload = false,
  } = props;

  const key = (id ?? '') + (src ?? '');
  const pathname = window.location.pathname;
  const prevPathname = PrevPathnameCache.get(key);
  const pathChanged = prevPathname ? pathname !== prevPathname : false;
  const reloadOnNavigation = pathChanged && reload;
  const hasLoaded = key && LoadCache.has(key);

  // track last pathname
  PrevPathnameCache.set(key, pathname);

  // Script has already loaded or started loading..
  if (hasLoaded) {
    if (!reloadOnNavigation) {
      return Promise.resolve({status: true, event: 'already loaded'});
    }

    // Reload script after every navigation.
    // We remove it from cache, so that it can be remounted
    if (ScriptCache.has(key)) {
      const scriptCache = ScriptCache.get(key);
      if (scriptCache?.script) {
        LoadCache.delete(key);
        ScriptCache.delete(key);
        TimingCache.delete(key);
        // remove script from the target on the next available frame
        requestAnimationFrame(removeScript(target, scriptCache.script));
      }
    }
  }

  if (!TimingCache.has(key)) {
    TimingCache.set(key, {start: performance.now()});
  }

  // a script with a src is already instantiated, load it
  if (ScriptCache.has(key)) {
    // set script as loading...
    LoadCache.add(key);

    // Init async injection onLoad since the script has started loading
    const scriptCache = ScriptCache.get(key);
    if (scriptCache?.promise) {
      return scriptCache.promise.then(onLoad, onError);
    } else {
      return Promise.resolve({
        status: false,
        event: 'Script load promise not found',
      });
    }
  }

  // Add script key to the loading cache...
  LoadCache.add(key);

  // create a new script tag
  const script = document.createElement('script');

  // if no `src` is passed, mark `async` and `defer` attributes as ignored
  // to avoid propagating them to the script tag on inlined scripts
  // @see: https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement
  if (!src) {
    ignoreProps.push('async', 'defer');
  }

  // if its an inline script
  if (dangerouslySetInnerHTML) {
    script.innerHTML = (dangerouslySetInnerHTML.__html || '').trim();
  } else if (children) {
    // if it has children <Script />
    script.textContent =
      typeof children === 'string'
        ? children
        : Array.isArray(children)
        ? children.join('')
        : '';
  }

  // Spread <Script /> props as <scrip /> attributes
  for (const [k, value] of Object.entries(props)) {
    if (value === undefined || ignoreProps.includes(k)) {
      continue;
    }

    // map react props to DOM attribute names
    const attr = DOMAttributeNames[k] || k.toLowerCase();
    script.setAttribute(attr, value);
  }

  /*
    marks this script to be loaded by partytown worker
    TDOD: should check if partytown is enabled
    TODO: cli should manage partytown adding
    TODO: partytown config should
  */
  if (strategy === 'worker') {
    script.setAttribute('type', 'text/partytown');
  }

  // inline scripts have no strategy
  if (src) {
    script.setAttribute('data-strategy', strategy);
  } else {
    script.setAttribute('data-strategy', 'inline');
  }

  const loadPromise = new Promise<ScriptResponse>((resolve, reject) => {
    if (TimingCache.has(key)) {
      TimingCache.set(key, {...TimingCache.get(key), load: performance.now()});
    }

    function onLoadHandler(this: GlobalEventHandlers, event: Event) {
      if (TimingCache.has(key)) {
        TimingCache.set(key, {
          ...TimingCache.get(key),
          ready: performance.now(),
        });
      }

      if (onLoad) {
        // onLoad.call(this, script);
        onLoad.call(this, event);
      }
      // Run onReady for the first time after load event
      if (onReady) {
        onReady.call(this, script);
      }
      // on dev, we warn users about slow scripts based on a 4G MB/s assumption
      import.meta.env.DEV && logScriptPerformance(key, src);
      resolve({status: true, event});
    }

    function onErrorHandler(event: ErrorEvent) {
      reject({status: false, event});
    }

    // add event listeners
    script.onload = onLoadHandler;
    script.onerror = onErrorHandler as ErrorEventHandler;
  }).catch(function (error) {
    if (TimingCache.has(key)) {
      TimingCache.set(key, {...TimingCache.get(key), error: performance.now()});
    }
    import.meta.env.DEV && logScriptPerformance(key, src);
    if (onError) {
      onError(error);
    }
    return Promise.reject(error);
  });

  // append script to the target on the next available frame
  requestAnimationFrame(appendScript(target, script));

  if (src && loadPromise) {
    ScriptCache.set(key, {promise: loadPromise, script});
    return loadPromise;
  }

  return Promise.resolve({status: true, event: 'inline script'});
}

function appendScript(target: ScriptTarget, script: HTMLScriptElement) {
  let appended = false;
  return function () {
    if (!appended) {
      document[target].appendChild(script);
      appended = true;
    }
  };
}

function removeScript(target: ScriptTarget, script: HTMLScriptElement) {
  let removed = false;
  return function () {
    if (!removed) {
      document[target].removeChild(script);
      removed = true;
    }
  };
}
