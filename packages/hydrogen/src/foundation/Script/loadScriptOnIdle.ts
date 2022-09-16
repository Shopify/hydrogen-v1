import {requestIdleCallback} from '../../utilities/request-idle-callback-polyfill.js';
import {loadScript} from './loadScript.js';
import type {ScriptProps} from './types.js';

type IdleCallbackHandle = number;

const IdleCallbackCache = new Map<string, IdleCallbackHandle>();
const IdleLoadingCache = new Map<string, boolean>();

/*
  Injects a <script /> in the DOM based on the `onIdle` loading strategy
  using requestIdleCallback/shim
*/
export function loadScriptOnIdle(
  props: ScriptProps,
  cb: (status: boolean) => void = () => {}
): any {
  const key = props.id ?? '' + props.src ?? '';
  const isReload = props.reload ?? false;

  // if we are already loaded a script via onIdle callback early exit
  if (IdleLoadingCache.get(key)) {
    return cb(false);
  }

  /*
    If we are not loading and have and exiting idle callback and
    we are not reloading we mark it as loaded.
    if we are forcing `reload` we can early exit and mark it as loaded.

    Otherwise, we need to cancel the ongoing idle callback
  */
  if (IdleCallbackCache.has(key)) {
    if (isReload) {
      IdleCallbackCache.delete(key);
      IdleLoadingCache.delete(key);
      return loadScriptOnIdle(props, cb);
    }
    return cb(true);
  } else {
    if (document.readyState === 'complete') {
      const idleCallback = requestIdleCallback(async (deadline) => {
        // @ts-ignore - a cached cb handle exists on after the callback
        cancelIdleCallback(IdleCallbackCache.get(key));
        const response = await loadScript(props);

        // script no longer loading e.g ready
        IdleLoadingCache.set(key, false);
        if (response?.status) {
          cb(true);
        } else {
          cb(false);
        }
      });
      // set asset as loading and cache it
      IdleLoadingCache.set(key, true);
      // cache callback handle for this asset
      IdleCallbackCache.set(key, idleCallback);
      return cb(false);
    } else {
      window.addEventListener('load', () => {
        return requestIdleCallback(() => {
          return loadScript(props);
        });
      });
    }
  }
}
