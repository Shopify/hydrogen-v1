import React, {FunctionComponent, useContext} from 'react';
import {HydrationContext} from '../Hydration/HydrationContext.server';
import {renderReactProps} from '../Hydration/react-utils';

interface ClientMarkerMeta {
  name: string;
  id: string;
  component: FunctionComponent;
  named: boolean;
}

export function wrapInClientMarker(meta: ClientMarkerMeta) {
  const {component, name} = meta;

  if (
    !component ||
    (typeof component !== 'function' &&
      !Object.prototype.hasOwnProperty.call(component, 'render'))
  ) {
    // This is not a React component, return it as is.
    return component;
  }

  // Use object syntax here to make sure the function name
  // comes from the meta params for better error stacks.
  const wrappedComponent = {
    [name]: (props: any) => <ClientMarker {...{props, meta}} />,
  }[name];

  // Relay component properties such as `Image.Fragment`
  for (const [key, value] of Object.entries(component)) {
    Object.defineProperty(wrappedComponent, key, {
      enumerable: true,
      value,
    });
  }

  return wrappedComponent;
}

function ClientMarker({
  props: allProps,
  meta: {name, id, component: Component, named},
}: {
  meta: ClientMarkerMeta;
  props: any;
}) {
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
