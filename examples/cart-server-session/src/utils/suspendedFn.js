import {wrapPromise} from '~/utils/wrapPromise';

/*
  Makes any async function Suspense friendly on .server components.
*/
export function suspendedFn(fn) {
  let state = {
    status: 'pending',
    response: undefined,
  };

  return (props) => {
    const promise = wrapPromise(fn(props), state);
    try {
      const p = promise.read();
      // reset state on success
      state = {
        status: 'pending',
        response: undefined,
      };
      return p;
    } catch (e) {
      // loop until promise is resolved
      throw e;
    }
  };
}
