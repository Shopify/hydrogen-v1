import {
  ScriptProps,
  ScriptTarget,
  ScriptResponse,
  ScriptCacheProps,
} from './types.js';

// Don't spread these props in the rendered <script />
const ignoreProps = [
  'children',
  'dangerouslySetInnerHTML',
  'onError',
  'onLoad',
  'onReady',
  'load',
  'target',
  'reload',
];

const DOMAttributeNames: Record<string, string> = {
  acceptCharset: 'accept-charset',
  className: 'class',
  htmlFor: 'for',
  httpEquiv: 'http-equiv',
  noModule: 'noModule',
};

// Caches
export const PrevPathCache = new Map<string, string>(); // path
export const LoadCache = new Set<string>(); // script loading/loaded cache
export const ScriptCache = new Map<string, ScriptCacheProps>(); // script instances cache

/*
  Injects a <script /> in the DOM based on one of these loading strategies:
    - afterHydration,
    - beforeHydration and
    - inWorker
*/
export async function loadScript(
  props: ScriptProps
): Promise<ScriptResponse | void> {
  const {
    children = '',
    dangerouslySetInnerHTML,
    id,
    onError = () => {},
    onLoad,
    onReady = null,
    src,
    load = 'afterHydration', // default loading strategy
    target = 'body',
    reload = false,
  } = props;

  const key = (id ?? '') + (src ?? '');
  const pathname = window.location.pathname;
  const prevPathname = PrevPathCache.get(key);
  const pathChanged = prevPathname ? pathname !== prevPathname : false;
  const reloadOnNavigation = pathChanged && reload;
  const hasLoaded = key && LoadCache.has(key);

  // track last pathname
  PrevPathCache.set(key, pathname);

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
        // remove script from the target on the next available frame
        requestAnimationFrame(removeScript(target, scriptCache.script));
        LoadCache.delete(key);
        ScriptCache.delete(key);
      }
    }
  }

  // a script with a src is already instantiated, load it
  if (ScriptCache.has(key)) {
    // set script as loading...
    LoadCache.add(key);

    // Init async injection onLoad since the script has started loading
    const scriptCache = ScriptCache.get(key);
    if (scriptCache?.promise) {
      return scriptCache.promise;
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
    marks this script to be loaded by partytown inWorker
  */
  if (load === 'inWorker') {
    script.setAttribute('type', 'text/partytown');
  }

  // mark script as loaded
  if (src) {
    script.setAttribute('data-loaded', load);
  } else {
    script.setAttribute('data-loaded', 'inline');
  }

  // A promise to track onLoad, onError events
  const loadPromise = new Promise<ScriptResponse>(function (resolve, reject) {
    // add event listeners
    script.onload = function (event) {
      if (onLoad) {
        onLoad.call(this, event);
      }
      // Run onReady for the first time after load event
      if (onReady) {
        onReady.call(this, event);
      }
      resolve({status: true, event});
    };

    script.onerror = function (event) {
      reject({status: false, event});
    };
  }).catch(function (error) {
    // error handling
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

/*
  Inject script in the DOM
*/
function appendScript(target: ScriptTarget, script: HTMLScriptElement) {
  let appended = false;
  return function () {
    if (!appended) {
      document[target].appendChild(script);
      appended = true;
    }
  };
}

/*
  Remove a script from the DOM
*/
function removeScript(target: ScriptTarget, script: HTMLScriptElement) {
  let removed = false;
  return function () {
    if (!removed) {
      document[target].removeChild(script);
      removed = true;
    }
  };
}
