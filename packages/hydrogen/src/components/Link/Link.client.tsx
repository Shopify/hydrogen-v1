import React, {useCallback} from 'react';
import {useRouter} from '../Router';
import {createPath} from 'history';
import {useServerState} from '../../foundation/useServerState';

interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  replace?: boolean;
  clientState?: any;
  to: string;
  reloadDocument?: boolean;
  serverState?: Record<string, string>;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (props, ref) => {
    const navigate = useNavigate();
    const {location} = useRouter();
    const {
      reloadDocument,
      target,
      replace: _replace,
      to,
      onClick,
      serverState,
      clientState,
    } = props;

    const internalClick = useCallback(
      (e) => {
        if (onClick) onClick(e);
        if (
          !e.defaultPrevented && // the custom onClick handler might prevent default
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
            serverState,
            clientState,
          });
        }
      },
      [
        reloadDocument,
        target,
        _replace,
        to,
        serverState,
        clientState,
        onClick,
        location,
      ]
    );

    return (
      <a {...props} ref={ref} onClick={internalClick} href={props.to}>
        {props.children}
      </a>
    );
  }
);

type NavigationOptions = {
  replace?: boolean;
  reloadDocument?: boolean;
  serverState?: Record<string, string>;
  clientState?: any;
};

export function useNavigate() {
  const router = useRouter();
  const {setServerState} = useServerState();

  return (
    path: string,
    options: NavigationOptions = {replace: false, reloadDocument: false}
  ) => {
    // @todo wait for RSC and then change focus for a11y?
    if (options?.replace)
      router.history.replace(path, options?.clientState || {});
    else router.history.push(path, options?.clientState || {});

    setServerState({
      pathname: path,
      ...(options.serverState || {}),
    });
  };
}

function isModifiedEvent(event: React.MouseEvent) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
