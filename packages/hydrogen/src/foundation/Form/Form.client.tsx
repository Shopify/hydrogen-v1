import React, {useCallback, useRef} from 'react';
// @ts-ignore
import {createFromFetch} from '@shopify/hydrogen/vendor/react-server-dom-vite';
import {useInternalServerProps} from '../useServerProps/use-server-props';

interface FormProps {
  action: string;
  method?: string;
  children?: Array<React.ReactNode>;
  enctype?: string;
}

export function Form({
  action,
  method,
  children,
  enctype = 'application/x-www-form-urlencoded',
}: FormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const {setRscResponseFromApiRoute} = useInternalServerProps();
  const [_, startTransition] = (React as any).useTransition();

  const submit = useCallback(
    async (e) => {
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
      });
    },
    [action, method, formRef]
  );

  return (
    <form
      action={action}
      method={method}
      onSubmit={submit}
      ref={formRef}
      encType={enctype}
    >
      {children}
    </form>
  );
}
