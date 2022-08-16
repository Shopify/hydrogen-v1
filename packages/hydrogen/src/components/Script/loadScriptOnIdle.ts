import {requestIdleCallback} from '../../utilities/request-idle-callback-polyfill.js';
import {loadScript, type ScriptProps} from './loadScript.js';

/*
Avoid making changes to the DOM within your idle callback. By the time your callback is run
the current frame has already finished drawing, and all layout updates and computations
have been completed. If you make changes that affect layout, you may force a situation
in which the browser has to stop and do recalculations that would otherwise be unnecessary.

If your callback needs to change the DOM, it should use Window.requestAnimationFrame() to schedule that.
@see: https://developer.mozilla.org/en-US/docs/Web/API/Background_Tasks_API
TODO: write to the dom with a requestAnimationFrame inside loadScript
*/

/**
 * Avoid tasks whose run time can't be predicted. Your idle callback should avoid doing
 * anything that could take an unpredictable amount of time. For example, anything which
 * might affect layout should be avoided. You should also avoid resolving or rejecting
 * Promises, since that would invoke the handler for that promise's resolution or rejection
 * as soon as your callback returns.
 */

// Handles onIdle strategy
export function loadScriptOnIdle(props: ScriptProps) {
  if (document.readyState === 'complete') {
    requestIdleCallback((deadline) => {
      return loadScript(props)
        .then((script) => script)
        .catch((error) => error);
    });
  } else {
    window.addEventListener('load', () => {
      requestIdleCallback((deadline) => {
        console.log('requestIdleCallback:load');
        return loadScript(props)
          .then((script) => script)
          .catch((error) => error);
      });
    });
  }
}
