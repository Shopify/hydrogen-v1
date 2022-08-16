import {useState, useEffect} from 'react';
import {useUrl} from '../useUrl/useUrl.js';
import {loadScript, type PostHydrationProps} from './loadScript.js';
import {loadScriptOnIdle} from './loadScriptOnIdle.js';

export type ScriptState = 'loading' | 'done' | 'error';

let prevPathname = '';

type UseScriptProps = {
  /* because the hook form is stateful we don't accept `beforeHydration` */
  strategy?: Exclude<
    PostHydrationProps['strategy'],
    'beforeHydration' | 'worker'
  >;
} & PostHydrationProps;

export function useLoadScript(options: UseScriptProps) {
  const {pathname} = useUrl();
  const [status, setStatus] = useState<ScriptState>('loading');
  const optionString = JSON.stringify(options);
  const pathChanged = prevPathname ? pathname !== prevPathname : false;
  const reloadOnNav = options?.reload && pathChanged;

  useEffect(() => {
    prevPathname = pathname;

    if (status !== 'loading') {
      return;
    }

    async function loadScriptWrapper() {
      let loaded;
      try {
        if (options?.strategy === 'afterHydration') {
          loaded = await loadScript(options);
        } else if (options?.strategy === 'onIdle') {
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
