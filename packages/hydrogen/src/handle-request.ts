import type {HandleRequest} from './entry-server';

export const handleRequest: HandleRequest = (request, options) => {
  const actualHandleRequest = options.entrypoint.default || options.entrypoint;
  return actualHandleRequest(request, options);
};

export default handleRequest;
