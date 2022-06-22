import {useRequestContext} from '@shopify/hydrogen';

export default function RequestContext() {
  const defaultContext = useRequestContext();
  const scopedContext = useRequestContext('scope');

  return (
    <>
      <h1>Request Context</h1>

      <div>
        <div id="default-context">{JSON.stringify(defaultContext)}</div>
        <div id="scoped-context">{JSON.stringify(scopedContext)}</div>
      </div>
    </>
  );
}
