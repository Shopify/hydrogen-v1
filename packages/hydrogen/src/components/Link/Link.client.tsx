import React, {useCallback} from 'react';
import {useRouter} from '../Router';
import {createPath} from 'history';

interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  replace?: boolean;
  clientState?: any;
  to: string;
  reloadDocument?: boolean;
}

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

type NavigationOptions = {
  replace?: boolean;
  reloadDocument?: boolean;
  clientState?: any;
};

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
