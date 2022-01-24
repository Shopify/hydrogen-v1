import {loadScript} from '../../utilities/script_loader';
import {useState, useEffect} from 'react';

type LoadScriptParams = Parameters<typeof loadScript>;
export function useLoadScript(
  url: LoadScriptParams[0],
  options?: LoadScriptParams[1]
) {
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
