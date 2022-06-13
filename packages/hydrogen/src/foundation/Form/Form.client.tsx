import React, {FormEvent, useCallback, useRef, useState} from 'react';
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
  const formRef = useRef<HTMLFormElement>(null);
  const {setRscResponseFromApiRoute} = useInternalServerProps();
  const [_, startTransition] = (React as any).useTransition();
  const [loading, setLoading] = useState(false);

  const submit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      onSubmit && onSubmit(e);
      if (e.defaultPrevented) return;

      setLoading(true);
      e.preventDefault();
      const multiFormData = new FormData(formRef.current!);
      const formBody: Array<string> = [];

      multiFormData.forEach((value, key) => {
        formBody.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`
        );
      });

      startTransition(() => {
        const response = createFromFetch(
          fetch(action, {
            method,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
              'Hydrogen-Client': 'Form-Action',
            },
            body: formBody.join('&'),
          })
        );

        setRscResponseFromApiRoute(response);
        setLoading(false);
      });
    },
    [onSubmit, startTransition, action, method, setRscResponseFromApiRoute]
  );

  return (
    <form
      action={action}
      method={method}
      onSubmit={submit}
      ref={formRef}
      encType={enctype}
      noValidate={noValidate}
      {...props}
    >
      {children instanceof Function ? children(loading) : children}
    </form>
  );
}
