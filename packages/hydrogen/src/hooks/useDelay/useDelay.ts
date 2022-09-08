import {useServerRequest} from '../../foundation/ServerRequestProvider/index.js';
import {wrapPromise} from '../../utilities/index.js';

export const useDelay = function (data: any, time: number) {
  if (!__HYDROGEN_DEV__) return data;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const serverRequest = useServerRequest();
  const key = JSON.stringify(data);

  if (!serverRequest.ctx.throttledRequests[key]) {
    serverRequest.ctx.throttledRequests[key] = wrapPromise(
      new Promise((resolve) => setTimeout(resolve, time))
    );
  }
  serverRequest.ctx.throttledRequests[key].read();

  return data;
};
