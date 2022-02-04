import React, {FC, useCallback} from 'react';
import {useRouter} from '../Router';
import {useServerState} from '../../foundation/useServerState';

interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  replace?: boolean;
  clientState?: any;
  to: string;
  reloadDocument?: boolean;
  serverState?: Record<string, string>;
}

export const Link: FC<LinkProps> = function Link(props) {
  const navigate = useNavigate();

  const onClick = useCallback(
    (e) => {
      if (!props.reloadDocument) {
        e.preventDefault();
        navigate(props.to, {
          replace: props.replace,
          reloadDocument: props.reloadDocument,
          clientState: props.clientState,
        });
      }
    },
    [props]
  );

  return (
    <a onClick={onClick} href={props.to} {...props}>
      {props.children}
    </a>
  );
};

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
