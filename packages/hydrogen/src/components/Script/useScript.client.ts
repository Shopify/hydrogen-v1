import {useState, useEffect} from 'react';
import {useUrl} from '../../foundation/useUrl/useUrl.js';
import {loadScript, PrevPathCache} from './loadScript.js';
import {loadScriptOnIdle} from './loadScriptOnIdle.js';
import {ScriptState, UseScriptProps} from './types.js';

export function useScript(props: UseScriptProps) {
  const {pathname} = useUrl();
  const [status, setStatus] = useState<ScriptState>('loading');
  const optionString = JSON.stringify(props);
  const key = (props?.id ?? '') + (props?.src ?? '');
  const prevPathname = PrevPathCache.get(key);
  const pathChanged = prevPathname ? pathname !== prevPathname : false;
  const reloadOnNav = props?.reload && pathChanged;

  // afterHydration loader
  useEffect(() => {
    if (props?.load !== 'afterHydration' || status !== 'loading') {
      return;
    }

    // @ts-ignore — UseScriptProps is a valid subset of ScriptProps
    loadScript(props)
      .then((loaded) => {
        if (!loaded?.status) {
          throw new Error(`Failed to load script ${key}`);
        }
        setStatus('done');
      })
      .catch(() => {
        setStatus('error');
      });
  }, [key, optionString, props, status, pathname]);

  // onIdle loader
  useEffect(() => {
    if (props?.load !== 'onIdle' || status !== 'loading') {
      return;
    }

    try {
      loadScriptOnIdle(props, (ready) => {
        if (ready) {
          setStatus('done');
        }
      });
    } catch (error) {
      setStatus('error');
    }
  }, [key, optionString, props, status, pathname]);

  // if reload === true, reload on path change
  useEffect(() => {
    if (!reloadOnNav) return;
    setStatus('loading');
  }, [reloadOnNav, props]);

  return status;
}
