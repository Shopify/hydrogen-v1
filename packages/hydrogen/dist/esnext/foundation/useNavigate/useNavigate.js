import { useRouter } from '../Router/BrowserRouter.client';
/**
 * The useNavigate hook imperatively navigates between routes.
 */
export function useNavigate() {
    const router = useRouter();
    return (path, options = { replace: false, reloadDocument: false }) => {
        const state = {
            ...options?.clientState,
            scroll: options?.scroll ?? true,
        };
        // @todo wait for RSC and then change focus for a11y?
        if (options?.replace) {
            router.history.replace(path, state);
        }
        else {
            router.history.push(path, state);
        }
    };
}
