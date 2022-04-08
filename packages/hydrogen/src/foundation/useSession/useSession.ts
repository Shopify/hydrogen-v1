import {useServerRequest} from '../ServerRequestProvider';

export const useSession = function () {
  const request = useServerRequest();
  const session = request.ctx.session?.get();
  return session;
};
