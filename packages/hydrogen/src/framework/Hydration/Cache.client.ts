// @ts-nocheck
import {
  createElement,
  Fragment,
  ReactElement,
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
  // useLayoutEffect,
  // useRef,
  // useState,
} from 'react';
import {wrapPromise} from '../../utilities';
import importClientComponent from './client-imports';

const cache = new Map();
const moduleCache = new Map();

const listeners: (readonly [string, (response: any) => any])[] = [];
export function subscribe(key: string, cb: (response: any) => any) {
  const item = [key, cb] as const;
  listeners.push(item);
  return () => {
    const index = listeners.indexOf(item);
    listeners.splice(index, 1);
  };
}

export function refresh(key: string) {
  const response = createFromFetch(
    fetch('/react?state=' + encodeURIComponent(key))
  );
  cache.set(key, response);

  listeners.forEach(([k, cb]) => {
    if (k === key) {
      cb(response);
    }
  });
}

/**
 * Much of this is borrowed from React's demo implementation:
 * @see https://github.com/reactjs/server-components-demo/blob/main/src/Cache.client.js
 *
 * Note that we'd want to add some other constraints and controls around caching here.
 */
export function useServerResponse(state: any) {
  const key = JSON.stringify(state);
  let [response, setResponse] = useState(cache.get(key));
  const firstResponse = useRef();

  useEffect(() => {
    const unsubscribe = subscribe(key, (newResponse) =>
      setResponse(newResponse)
    );
    return unsubscribe;
  }, [key]);

  if (!response) {
    const cachedResponse = createFromFetch(
      fetch('/react?state=' + encodeURIComponent(key))
    );
    cache.set(key, cachedResponse);
    return cachedResponse;
  }

  return response;
}

/**
 * Similar to the RSC demo, `createFromFetch` wraps around a fetch call and throws
 * promise events to the Suspense boundary until the content has loaded.
 */
function createFromFetch(fetchPromise: Promise<any>) {
  return wrapPromise(
    fetchPromise
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Hydration request failed: ${response.statusText}`);
        }
        return response.text();
      })
      .then((payload) => {
        return convertHydrationResponseToReactComponents(payload);
      })
      .catch((e) => {
        console.error(e);
      })
  );
}

export async function convertHydrationResponseToReactComponents(
  response: string
): Promise<ReactElement> {
  const manifest = createManifestFromWirePayload(response);

  /**
   * Eager-load all the modules referenced in the manifest. Otherwise,
   * Hydration errors crop up and show in the console.
   */
  const modules = await eagerLoadModules(manifest);

  function isReactTuple(item: any) {
    return item instanceof Array && item.length === 4 && item[0] === '$';
  }

  function isReactTupleOrString(item: any) {
    return typeof item === 'string' || isReactTuple(item);
  }

  function isReactTupleOrArrayOfTuples(item: any) {
    return isReactTupleOrString(item) || isReactTupleOrString(item[0]);
  }

  function wireSyntaxToReactElement(item: any, key?: number) {
    if (typeof item === 'string') return item;
    if (typeof item !== 'object') return null;

    // Assume it's an array of tuples, defined in the component as a fragment.
    if (!isReactTuple(item)) {
      return createElement(Fragment, {
        children: item.map(wireSyntaxToReactElement),
      });
    }

    let [, type, , props] = item;
    const allProps = {...props};

    /**
     * Convert all props (including children) that may be serialized as tuples
     * or arrays of tuples into React elements.
     */
    Object.entries(allProps).map(([key, prop]) => {
      if (prop instanceof Array && isReactTupleOrArrayOfTuples(prop)) {
        /**
         * - Array of children tuples
         * - ...or a list of children, combo of strings and tuples, produced by dangerouslySetInnerHtml
         */
        if (prop.every(isReactTupleOrString)) {
          allProps[key] = prop.map(wireSyntaxToReactElement);
          /**
           * - Single tuple
           */
        } else {
          allProps[key] = wireSyntaxToReactElement(prop);
        }
      }
    });

    /**
     * If the type is a module and not a React Symbol, reference the component
     * listed in the manifest as `M<number>` and lazy-load it.
     * `lazy()` throws Suspense promises until the component has loaded.
     */
    if (type.startsWith('@')) {
      const module = manifest[type.replace('@', 'M')];
      const mod = modules[type.replace('@', 'M')];
      type = module.named ? mod[module.name] : mod.default;
    }

    return createElement(type, {...allProps, key});
  }

  /**
   * The manifest is listed as `J0` for some reason. This is how React does it.
   * Maybe this is to support for additional model trees like `J1`?
   *
   * Regardless, this is guaranteed to exist from our server response.
   */
  return wireSyntaxToReactElement(manifest.J0) as ReactElement;
}

interface WireManifest {
  J0: any;
  [key: string]: any;
}

function createManifestFromWirePayload(payload: string): WireManifest {
  return payload.split('\n').reduce((memo, row) => {
    const [key, ...values] = row.split(':');

    if (key) {
      memo[key] = JSON.parse(values.join(':'));
    }

    return memo;
  }, {} as Record<string, any>) as WireManifest;
}

async function eagerLoadModules(manifest: WireManifest) {
  const modules = await Promise.all(
    Object.entries(manifest)
      .map(async ([key, module]) => {
        if (!key.startsWith('M')) return;

        // fake cache to make new imports every time (for HMR)
        const mod = await import(
          /* @vite-ignore */ `${module.id}?v=${Date.now()}`
        );

        return mod;
      })
      .filter(Boolean)
  );

  return Object.keys(manifest)
    .filter((key) => key.startsWith('M'))
    .map((key, idx) => [key, modules[idx]])
    .reduce((memo, item) => {
      memo[item[0]] = item[1];
      return memo;
    }, {} as any);
}
