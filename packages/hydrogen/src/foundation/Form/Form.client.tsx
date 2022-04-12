import React, {useCallback, useRef} from 'react';
// @ts-ignore
import {createFromFetch} from '@shopify/hydrogen/vendor/react-server-dom-vite';
import {useServerState} from '../useServerState';

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
  const {setApiResponse} = useServerState();
  const [_, startTransition] = (React as any).useTransition();

  const submit = useCallback(
    async (e) => {
      e.preventDefault();
      const formData = new FormData(formRef.current!);

      startTransition(() => {
        const response = createFromFetch(
          fetch(action, {
            method,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Hydrogen: 'Form-Action',
            },
            body: formData,
          })
        );

        setApiResponse(response);
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
