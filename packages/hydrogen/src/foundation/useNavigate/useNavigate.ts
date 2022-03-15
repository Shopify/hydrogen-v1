import {useRouter} from '../Router/BrowserRouter.client';

type NavigationOptions = {
  /** Whether to update the state object or URL of the current history entry. Default to false */
  replace?: boolean;

  /** Whether to reload the whole document on navigation */
  reloadDocument?: boolean;

  /** The custom client state with the navigation */
  clientState?: any;
};

/**
 * The useNavigate hook imperatively navigates between routes. Consider using the useNavigate hook only where appropriate. Generally, you should use the Link component instead, because it provides standard browser accessibility functionality, like cmd+click and right-click to open. useNavigate is only available in client components.
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
