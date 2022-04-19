import {useRouter} from '../Router/BrowserRouter.client';

type NavigationOptions = {
  /** Whether to update the state object or URL of the current history entry. Defaults to false. */
  replace?: boolean;

  /** Whether to reload the whole document on navigation. */
  reloadDocument?: boolean;

  /** The custom client state with the navigation. */
  clientState?: any;
};

/**
 * The useNavigate hook imperatively navigates between routes.
 */
export function useNavigate() {
  const router = useRouter();

  return (
    path: string,
    options: NavigationOptions = {replace: false, reloadDocument: false}
  ) => {
    // @todo wait for RSC and then change focus for a11y?
    if (options?.replace)
      router.history.replace(path, options?.clientState || {});
    else router.history.push(path, options?.clientState || {});
  };
}
