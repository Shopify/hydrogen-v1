import {useEffect} from 'react';
import {loadScriptOnIdle} from './loadScriptOnIdle.js';
import {loadScript, PrevPathCache} from './loadScript.js';
import {PostHydrationProps} from './types.js';

/**
  The `ScriptPostHydration` component handles scripts with load strategies:
    - afterHydration,
    - onIdle
    - inWorker
**/
export function ScriptPostHydration(props: PostHydrationProps): null {
  const {id, src = '', load = 'afterHydration'} = props;
  const key = (id ?? '') + (src ?? '');

  // Load script based on delayed loading load
  useEffect(() => {
    if (load === 'afterHydration' || load === 'inWorker') {
      loadScript(props);
    } else if (load === 'onIdle') {
      loadScriptOnIdle(props);
    }
  }, [props, load]);

  // keep track or url changes to know when to reload scripts
  useEffect(() => {
    if (!props.reload) return;
    return () => {
      if (window.location.pathname !== PrevPathCache.get(key)) {
        PrevPathCache.set(key, window.location.pathname);
      }
    };
  }, [key, props.reload]);

  return null;
}
