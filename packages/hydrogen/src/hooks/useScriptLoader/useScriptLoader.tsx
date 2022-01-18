import {loadScript} from '../../utilities/script_loader';
import {useState, useEffect, useMemo} from 'react';

type LoadScriptParams = Parameters<typeof loadScript>;
export function useScriptLoader(
  url: LoadScriptParams[0],
  options?: LoadScriptParams[1]
) {
  const [status, setStatus] = useState<ScriptState>('loading');
  const [reloadValue, reloadFn] = useState({});
  const forceReload = useMemo(() => reloadFn({}), []);

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
  }, [reloadValue, url, options]);

  return {status, forceReload};
}

type ScriptState = 'loading' | 'done' | 'error';
