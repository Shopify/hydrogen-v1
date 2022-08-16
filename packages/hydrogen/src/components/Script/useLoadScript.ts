import {useState, useEffect} from 'react';
import {useUrl} from '../../foundation/useUrl/useUrl.js';
import {loadScript, type ScriptProps} from './loadScript.js';
import {loadScriptOnIdle} from './loadScriptOnIdle.js';

export type ScriptState = 'loading' | 'done' | 'error';

let prevPathname = '';

// TODO: async won't work with `onIdle` strategy
export function useLoadScript(options: ScriptProps) {
  const {pathname} = useUrl();
  const [status, setStatus] = useState<ScriptState>('loading');
  const stringifiedOptions = JSON.stringify(options);
  const pathChanged = prevPathname ? pathname !== prevPathname : false;
  const reloadOnNav = options?.reload && pathChanged;

  useEffect(() => {
    prevPathname = pathname;

    if (status !== 'loading') {
      return;
    }

    async function loadScriptWrapper() {
      try {
        // TODO:
        const loaded = await loadScript(options);
        if (loaded) {
          setStatus('done');
        }
      } catch (error) {
        setStatus('error');
      }
    }

    loadScriptWrapper();
  }, [stringifiedOptions, options, status, pathname]);

  // if reload === true, reload on path change
  useEffect(() => {
    if (!reloadOnNav) return;
    setStatus('loading');
  }, [reloadOnNav, options]);

  return status;
}
