import React, {FunctionComponent} from 'react';
import {createObject} from '../../utilities/object';

interface ClientMarkerMeta {
  name: string;
  id: string;
  component: FunctionComponent;
  named: boolean;
}

export function wrapInClientMarker(meta: ClientMarkerMeta) {
  const {component: Component, name} = meta;

  if (
    !Component ||
    (typeof Component !== 'function' &&
      !Object.prototype.hasOwnProperty.call(Component, 'render'))
  ) {
    // This is not a React component, return it as is.
    return Component;
  }

  // Use object syntax here to make sure the function name
  // comes from the meta params for better error stacks.
  const render = {
    [name]: (props: any) => <Component {...props} />,
  }[name];

  const componentRef = createObject({
    // React accesses the `render` function directly when encountring this type
    $$typeof: Symbol.for('react.forward_ref'),
    render,
  });

  const rscDescriptor = createObject({
    // This custom type is checked in RSC renderer
    $$typeof_rsc: Symbol.for('react.module.reference'),
    filepath: meta.id,
    name: meta.name,
    named: meta.named,
  });

  return new Proxy(componentRef, {
    get: (target, prop) =>
      // 1. Let React access the element/ref and type in SSR
      (target as any)[prop] ??
      // 2. Check descriptor properties for RSC requests
      (rscDescriptor as any)[prop] ??
      // 3. Fallback to custom component properties such as `Image.Fragment`
      (Component as any)[prop],
  });
}
