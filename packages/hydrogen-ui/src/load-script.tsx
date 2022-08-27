import {useState, useEffect} from 'react';

const SCRIPTS_LOADED: Record<string, Promise<boolean>> = {};

export function loadScript(
  src: string,
  options?: {module?: boolean; in?: 'head' | 'body'}
): Promise<boolean> {
  const isScriptLoaded: Promise<boolean> = SCRIPTS_LOADED[src];

  if (isScriptLoaded) {
    return isScriptLoaded;
  }

  const promise = new Promise<boolean>((resolve, reject) => {
    const script = document.createElement('script');
    if (options?.module) {
      script.type = 'module';
    } else {
      script.type = 'text/javascript';
    }
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      reject(false);
    };
    if (options?.in === 'head') {
      document.head.appendChild(script);
    } else {
      document.body.appendChild(script);
    }
  });

  SCRIPTS_LOADED[src] = promise;

  return promise;
}

type LoadScriptParams = Parameters<typeof loadScript>;

/**
 * The `useLoadScript` hook loads an external script tag in the browser. It allows React components to lazy-load large third-party dependencies.
 */
export function useLoadScript(
  url: LoadScriptParams[0],
  options?: LoadScriptParams[1]
): ScriptState {
  const [status, setStatus] = useState<ScriptState>('loading');
  const stringifiedOptions = JSON.stringify(options);

  useEffect(() => {
    async function loadScriptWrapper() {
      try {
        setStatus('loading');
        await loadScript(url, options);
        setStatus('done');
      } catch (error) {
        setStatus('error');
      }
    }

    loadScriptWrapper();
  }, [url, stringifiedOptions, options]);

  return status;
}

type ScriptState = 'loading' | 'done' | 'error';
