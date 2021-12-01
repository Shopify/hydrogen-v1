import {FunctionComponent} from 'react';

interface ClientMarkerMeta {
  name: string;
  id: string;
  component: FunctionComponent;
  named: boolean;
}

export function wrapInClientMarker(meta: ClientMarkerMeta) {
  const {component: Component} = meta;

  if (
    !Component ||
    (typeof Component !== 'function' &&
      !Object.prototype.hasOwnProperty.call(Component, 'render'))
  ) {
    // This is not a React component, return it as is.
    return Component;
  }

  Object.defineProperty(Component, '$$moduleReference', {
    enumerable: true,
    value: {
      $$typeof: Symbol.for('react.module.reference'),
      filepath: meta.id,
      name: meta.name,
      named: meta.named,
    },
  });

  return Component;
}
