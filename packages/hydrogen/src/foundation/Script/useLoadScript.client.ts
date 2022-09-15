import {useState, useEffect} from 'react';
import {useUrl} from '../useUrl/useUrl.js';
import {loadScript, PrevPathCache} from './loadScript.js';
import {loadScriptOnIdle} from './loadScriptOnIdle.js';
import {ScriptState, UseScriptProps} from './types.js';

export function useLoadScript(options: UseScriptProps) {
  const {pathname} = useUrl();
  const [status, setStatus] = useState<ScriptState>('loading');
  const optionString = JSON.stringify(options);
  const key = (options?.id ?? '') + (options?.src ?? '');
  const prevPathname = PrevPathCache.get(key);
  const pathChanged = prevPathname ? pathname !== prevPathname : false;
  const reloadOnNav = options?.reload && pathChanged;

  useEffect(() => {
    if (!PrevPathCache.has(key)) {
      PrevPathCache.set(key, pathname);
    }

    if (status !== 'loading') {
      return;
    }

    async function loadScriptWrapper() {
      let loaded;
      try {
        if (options?.load === 'afterHydration') {
          loaded = await loadScript(options);
        } else if (options?.load === 'onIdle') {
          loaded = await loadScriptOnIdle(options);
        }
        if (loaded) {
          setStatus('done');
        }
      } catch (error) {
        setStatus('error');
      }
    }

    loadScriptWrapper();
  }, [optionString, options, status, pathname]);

  // if reload === true, reload on path change
  useEffect(() => {
    if (!reloadOnNav) return;
    setStatus('loading');
  }, [reloadOnNav, options]);

  return status;
}
