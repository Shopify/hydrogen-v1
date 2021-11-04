import React, {FunctionComponent, useContext} from 'react';
import {HydrationContext} from '../Hydration/HydrationContext.server';
import {renderReactProps} from '../Hydration/react-utils';

interface Props {
  name: string;
  id: string;
  props: any;
  component: FunctionComponent;
  named: boolean;
}

export function ClientMarker({
  name,
  id,
  props: allProps,
  component: Component,
  named,
}: Props) {
  const isHydrating = useContext(HydrationContext);

  if (!isHydrating) return <Component {...allProps} />;

  let {children, ...props} = allProps;

  /**
   * Convert props that happen to be React components to actual
   * objects representing DOM elements. This is because we
   * serialize props to JSON below, and React element Functions
   * cannot be serialized.
   */
  props = renderReactProps(props);

  /**
   * Components ending in *Provider are special components to
   * Hydrogen's RSC implementation. They are rendered during
   * the hydration process in the state tree even though they
   * don't output any DOM. This is key to supporting crossing
   * the server/client context boundary.
   */
  const shouldRenderDuringHydration = name.endsWith('Provider');

  return (
    <span
      data-client-component={name}
      data-id={id}
      data-props={JSON.stringify(props)}
      data-named={named}
    >
      {shouldRenderDuringHydration ? (
        <Component {...allProps}>{children}</Component>
      ) : (
        children
      )}
    </span>
  );
}
