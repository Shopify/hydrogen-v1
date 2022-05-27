import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useRouter} from '../../foundation/Router/BrowserRouter.client';
import {createPath} from 'history';
import {useNavigate} from '../../foundation/useNavigate/useNavigate';
import {RSC_PATHNAME} from '../../constants';
import {useInternalServerProps} from '../../foundation/useServerProps/use-server-props';

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
  /** Whether to prefetch the link source when the user signals intent. Defaults to `true`. For more information, refer to [Prefetching a link source](https://shopify.dev/custom-storefronts/hydrogen/framework/routes#prefetching-a-link-source). */
  prefetch?: boolean;
}

/**
 * The `Link` component is used to navigate between routes. Because it renders an underlying `<a>` element, all
 * properties available to the `<a>` element are also available to the `Link` component.
 * For more information, refer to the [`<a>` element documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes).
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function Link(props, forwardedRef) {
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

          navigate(to, {
            replace,
            clientState,
          });
        }
      },
      [
        reloadDocument,
        target,
        _replace,
        to,
        clientState,
        onClick,
        location,
        navigate,
      ]
    );

    const [setIntersectionRef, isVisible] = useIntersection({
      rootMargin: '200px',
    });

    const setRef = useCallback(
      (node: HTMLAnchorElement) => {
        setIntersectionRef(node);

        if (forwardedRef) {
          if (typeof forwardedRef === 'function') {
            forwardedRef(node);
          } else if (typeof forwardedRef === 'object') {
            forwardedRef.current = node;
          }
        }
      },
      [forwardedRef, setIntersectionRef]
    );

    useEffect(() => {
      startTransition(() => {
        if (isVisible && prefetch) {
          setMaybePrefetch(true);
        }
      });
    }, [prefetch, startTransition, isVisible]);

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
          ref={setRef}
          onClick={internalClick}
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
  const {getProposedLocationServerProps} = useInternalServerProps();
  const {location} = useRouter();

  const newPath = createPath({pathname});

  if (pathname.startsWith('http') || newPath === createPath(location)) {
    return null;
  }

  const newLocation = new URL(newPath, window.location.href);
  const proposedServerState = getProposedLocationServerProps({
    pathname: newLocation.pathname,
    search: newLocation.search,
  });
  const href =
    `${RSC_PATHNAME}?state=` +
    encodeURIComponent(JSON.stringify(proposedServerState));

  return <link rel="prefetch" as="fetch" href={href} />;
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

const hasIntersectionObserver = typeof IntersectionObserver !== 'undefined';

interface Identifier {
  rootMargin: string;
}

interface Observer {
  id: ObserverOptions;
  observer: IntersectionObserver;
  elements: Map<Element, ObserveCallback>;
}

interface ObserverOptions {
  rootMargin: string;
}

type ObserveCallback = (isVisible: boolean) => void;

const observers: Map<Identifier, Observer> = new Map();

function useIntersection<T extends Element>(
  options: ObserverOptions
): [(element: T | null) => void, boolean] {
  const isDisabled = !hasIntersectionObserver;
  const unobserve = useRef<Function>();
  const [visible, setVisible] = useState(false);

  /**
   * Using the functional version of React refs which is called when the element changes,
   * is mounted, and is unmounted.
   */
  const setRef = useCallback(
    (node: T | null) => {
      if (unobserve.current) {
        unobserve.current();
        unobserve.current = undefined;
      }

      if (isDisabled || visible) return;

      if (node) {
        unobserve.current = observe(
          node,
          (isVisible) => isVisible && setVisible(isVisible),
          options
        );
      }
    },
    [isDisabled, options, visible]
  );

  return [setRef, visible];
}

function observe(
  element: Element,
  callback: ObserveCallback,
  options: ObserverOptions
) {
  const {observer, elements, id} = getOrCreateObserver(options);
  elements.set(element, callback);
  observer.observe(element);

  return function unobserve(): void {
    elements.delete(element);
    observer.unobserve(element);

    if (elements.size === 0) {
      observer.disconnect();
      observers.delete(id);
    }
  };
}

function getOrCreateObserver(options: ObserverOptions) {
  let instance = observers.get(options);

  if (instance) return instance;

  const elements = new Map<Element, ObserveCallback>();
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const callback = elements.get(entry.target);
        const isVisible = entry.isIntersecting || entry.intersectionRatio > 0;

        if (callback && isVisible) {
          callback(isVisible);
        }
      }
    }
  }, options);

  observers.set(
    options,
    (instance = {
      id: options,
      elements,
      observer,
    })
  );

  return instance;
}
