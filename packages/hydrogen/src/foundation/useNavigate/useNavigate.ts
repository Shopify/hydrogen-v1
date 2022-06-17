import {useRouter} from '../Router/BrowserRouter.client';
import {useBasePath} from '../useRouteParams/RouteParamsProvider.client';

type NavigationOptions = {
  /** Whether to update the state object or URL of the current history entry. Defaults to false. */
  replace?: boolean;

  /** Whether to reload the whole document on navigation. */
  reloadDocument?: boolean;

  /** The custom client state with the navigation. */
  clientState?: any;

  /** Whether to emulate natural browser behavior and restore scroll position on navigation. Defaults to true. */
  scroll?: any;

  basePath?: string;
};

/**
 * The useNavigate hook imperatively navigates between routes.
 */
export function useNavigate() {
  const router = useRouter();
  const routeBasePath = useBasePath();

  return (
    path: string,
    options: NavigationOptions = {replace: false, reloadDocument: false}
  ) => {
    path = buildPath(options.basePath ?? routeBasePath, path);

    const state = {
      ...options?.clientState,
      scroll: options?.scroll ?? true,
    };

    // @todo wait for RSC and then change focus for a11y?
    if (options?.replace) {
      router.history.replace(path, state);
    } else {
      router.history.push(path, state);
    }
  };
}

export function buildPath(basePath: string, path: string) {
  let builtPath = path;
  if (basePath !== '/') {
    builtPath =
      path.charAt(0) === '/' && basePath.charAt(0) === '/'
        ? basePath + path.substring(1)
        : basePath + path;
  }
  return builtPath;
}
