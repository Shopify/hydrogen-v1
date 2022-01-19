import {useServerState} from '@shopify/hydrogen/client';
import {useCallback, useEffect, useRef} from 'react';

export default function ({
  action,
  method,
  children,
  enctype = 'application/x-www-form-urlencoded',
}) {
  const formRef = useRef();
  const {setServerState} = useServerState();

  const submit = useCallback(
    async (e) => {
      e.preventDefault();
      const formData = new FormData();
      const oFormData = new FormData(formRef.current);

      for (let key of oFormData.keys()) {
        for (let value of oFormData.getAll(key)) {
          formData.set(key, value);
        }
      }

      await fetch(action, {
        method,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      setServerState('', '');
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
