import React, {useCallback} from 'react';
import {useRouter} from '../../foundation/Router/BrowserRouter.client';
import {createPath} from 'history';
import {useNavigate} from '../../foundation/useNavigate/useNavigate';

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
    const {
      reloadDocument,
      target,
      replace: _replace,
      to,
      onClick,
      clientState,
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

    return (
      <a
        {...without(props, ['to', 'replace', 'clientState', 'reloadDocument'])}
        ref={ref}
        onClick={internalClick}
        href={props.to}
      >
        {props.children}
      </a>
    );
  }
);

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
