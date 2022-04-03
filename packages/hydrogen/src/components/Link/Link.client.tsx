import React, {useCallback, useEffect, useState} from 'react';
import {useRouter} from '../../foundation/Router/BrowserRouter.client';
import {createPath} from 'history';
import {useNavigate} from '../../foundation/useNavigate/useNavigate';
import {useServerState} from '../../foundation/useServerState';
import {RSC_PATHNAME} from '../../constants';

export interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  /** The destination URL that the link points to. This is the `href` attribute of the underlying `<a>` element. */
  to: string;
  /** Whether to update the state object or URL of the current history entry. Refer to the [history.replaceState documentation](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState). */
  replace?: boolean;
  /** The custom client state with the navigation. */
  clientState?: any;
  /** Whether to reload the whole document on navigation. */
  reloadDocument?: boolean;
  /** Whether to prefetch the link source when the user signals intent. Defaults to `true`. For more information, refer to [Prefetching a link source](/custom-storefronts/hydrogen/framework/routes#prefetching-a-link-source). */
  prefetch?: boolean;
}

/**
 * The `Link` component is used to navigate between routes. Because it renders an underlying `<a>` element, all
 * properties available to the `<a>` element are also available to the `Link` component.
 * For more information, refer to the [`<a>` element documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes).
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function Link(props, ref) {
    const navigate = useNavigate();
    const {location} = useRouter();
    const [_, startTransition] = (React as any).useTransition();

    /**
     * Inspired by Remix's Link component
     */
    const [shouldPrefetch, setShouldPrefetch] = useState(false);
    const [maybePrefetch, setMaybePrefetch] = useState(false);

    const {
      reloadDocument,
      target,
      replace: _replace,
      to,
      onClick,
      clientState,
      prefetch = true,
    } = props;

    const internalClick = useCallback(
      (e) => {
        if (onClick) onClick(e);
        if (
          !reloadDocument && // do regular browser stuff
          e.button === 0 && // Ignore everything but left clicks
          (!target || target === '_self') && // Let browser handle "target=_blank"
          !isModifiedEvent(e) // Ignore modifier key clicks
        ) {
          e.preventDefault();

          // If the URL hasn't changed, the regular <a> will do a replace
          const replace =
            !!_replace || createPath(location) === createPath({pathname: to});

          navigate(props.to, {
            replace,
            clientState,
          });
        }
      },
      [reloadDocument, target, _replace, to, clientState, onClick, location]
    );

    const signalPrefetchIntent = () => {
      /**
       * startTransition to yield to more important updates
       */
      startTransition(() => {
        if (prefetch) {
          setMaybePrefetch(true);
        }
      });
    };

    const cancelPrefetchIntent = () => {
      /**
       * startTransition to yield to more important updates
       */
      startTransition(() => {
        if (prefetch) {
          setMaybePrefetch(false);
        }
      });
    };

    /**
     * Wrapping `maybePrefetch` inside useEffect allows the user to quickly graze over
     * a link without triggering a prefetch.
     */
    useEffect(() => {
      if (maybePrefetch) {
        const id = setTimeout(() => {
          setShouldPrefetch(true);
        }, 100);

        return () => {
          clearTimeout(id);
        };
      }
    }, [maybePrefetch]);

    const onMouseEnter = composeEventHandlers(
      props.onMouseEnter,
      signalPrefetchIntent
    );
    const onMouseLeave = composeEventHandlers(
      props.onMouseLeave,
      cancelPrefetchIntent
    );
    const onFocus = composeEventHandlers(props.onFocus, signalPrefetchIntent);
    const onBlur = composeEventHandlers(props.onBlur, cancelPrefetchIntent);
    const onTouchStart = composeEventHandlers(
      props.onTouchStart,
      signalPrefetchIntent
    );

    return (
      <>
        <a
          {...without(props, [
            'to',
            'replace',
            'clientState',
            'reloadDocument',
            'prefetch',
          ])}
          ref={ref}
          onClick={internalClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onFocus={onFocus}
          onBlur={onBlur}
          onTouchStart={onTouchStart}
          href={props.to}
        >
          {props.children}
        </a>
        {shouldPrefetch && <Prefetch pathname={to} />}
      </>
    );
  }
);

function Prefetch({pathname}: {pathname: string}) {
  const {getProposedServerState} = useServerState();
  const {location} = useRouter();

  const newPath = createPath({pathname});

  if (pathname.startsWith('http') || newPath === createPath(location)) {
    return null;
  }

  const newLocation = new URL(newPath, window.location.href);
  const proposedServerState = getProposedServerState({
    pathname: newLocation.pathname,
    search: newLocation.search || undefined,
  });
  const href =
    `${RSC_PATHNAME}?state=` +
    encodeURIComponent(JSON.stringify(proposedServerState));

  return <link rel="prefetch" as="fetch" href={href} />;
}

/**
 * Credit: Remix's <Link> component.
 */
export function composeEventHandlers<
  EventType extends React.SyntheticEvent | Event
>(
  theirHandler: ((event: EventType) => any) | undefined,
  ourHandler: (event: EventType) => any
): (event: EventType) => any {
  return (event) => {
    theirHandler?.(event);
    if (!event.defaultPrevented) {
      ourHandler(event);
    }
  };
}

function isModifiedEvent(event: React.MouseEvent) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

function without(obj: Record<string, any>, props: Array<string>) {
  const newObj: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    if (!props.includes(key)) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}
