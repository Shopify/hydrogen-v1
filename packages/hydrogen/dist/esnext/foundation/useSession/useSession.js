import { useServerRequest } from '../ServerRequestProvider';
/** The `useSession` hook reads session data in server components. */
export const useSession = function () {
    const request = useServerRequest();
    const session = request.ctx.session?.get() || {};
    return session;
};
