import React, {FormEvent, useCallback, useState} from 'react';
// @ts-ignore
import {createFromFetch} from '@shopify/hydrogen/vendor/react-server-dom-vite';
import {useInternalServerProps} from '../useServerProps/use-server-props';

interface FormProps {
  action: string;
  method?: string;
  children?: Array<React.ReactNode>;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  enctype?: string;
  noValidate?: boolean;
}

export function Form({
  action,
  method,
  children,
  onSubmit,
  enctype = 'application/x-www-form-urlencoded',
  noValidate,
  ...props
}: FormProps) {
  const {setRscResponseFromApiRoute} = useInternalServerProps();
  const [_, startTransition] = (React as any).useTransition();
  const [loading, setLoading] = useState(false);

  const submit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      onSubmit && onSubmit(e);
      if (e.defaultPrevented) return;

      setLoading(true);
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);

      // @ts-expect-error
      // It is valid to pass a FormData instance to a URLSearchParams constructor
      const formBody = new URLSearchParams(formData);

      startTransition(() => {
        fetch(action, {
          method,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'Hydrogen-Client': 'Form-Action',
          },
          body: formBody,
        }).then((fetchResponse) => {
          const rscPathname = fetchResponse.headers.get(
            'Hydrogen-RSC-Pathname'
          );
          if (rscPathname !== window.location.pathname) {
            window.history.pushState(null, '', rscPathname);
          }
          const rscResponse = createFromFetch(Promise.resolve(fetchResponse));
          setRscResponseFromApiRoute({
            url: method + action,
            response: rscResponse,
          });
          setLoading(false);
        });
      });
    },
    [onSubmit, startTransition, action, method, setRscResponseFromApiRoute]
  );

  return (
    <form
      action={action}
      method={method}
      onSubmit={submit}
      encType={enctype}
      noValidate={noValidate}
      {...props}
    >
      {children instanceof Function ? children(loading) : children}
    </form>
  );
}
