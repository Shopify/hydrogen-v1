import {loadScript} from '../../utilities/load_script';
import {useState, useEffect} from 'react';

type LoadScriptParams = Parameters<typeof loadScript>;

/**
 * The `useScriptLoader` hook loads an external script tag on the client-side.
 */
export function useLoadScript(
  url: LoadScriptParams[0],
  options?: LoadScriptParams[1]
): ScriptState {
  const [status, setStatus] = useState<ScriptState>('loading');

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
  }, [url, JSON.stringify(options)]);

  return status;
}

type ScriptState = 'loading' | 'done' | 'error';
