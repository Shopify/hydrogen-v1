import React, {FunctionComponent} from 'react';
import {createObject} from '../../utilities/object';

interface ClientMarker {
  id: string;
  name: string;
  named: boolean;
  component: FunctionComponent;
}

export const MODULE_TAG = Symbol.for('react.module.reference');

export function wrapInClientMarker({id, name, named, component}: ClientMarker) {
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
  const render = {
    [name]: (props: any) =>
      React.createElement(
        React.Fragment,
        null,
        React.createElement(
          'script',
          {'data-rsc-id': id},
          `preloadRSC(document.currentScript)`
        ),
        React.createElement(component, props)
      ),
  }[name];

  const componentRef = createObject({
    // React accesses the `render` function directly when encountring this type
    $$typeof: Symbol.for('react.forward_ref'),
    render,
  });

  const rscDescriptor = createObject({
    // This custom type is checked in RSC renderer
    $$typeof_rsc: Symbol.for('react.module.reference'),
    filepath: id,
    name: named ? name : 'default',
  });

  return new Proxy(componentRef, {
    get: (target, prop) =>
      // 1. Let React access the element/ref and type in SSR
      (target as any)[prop] ??
      // 2. Check descriptor properties for RSC requests
      (rscDescriptor as any)[prop] ??
      // 3. Fallback to custom component properties such as `Image.Fragment`
      (component as any)[prop],
  });
}
