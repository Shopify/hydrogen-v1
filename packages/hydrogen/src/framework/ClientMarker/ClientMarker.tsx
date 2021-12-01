import {FunctionComponent} from 'react';

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
  const wrappedComponent = {
    [name]: (props: any) => <Component {...props} />,
  }[name];

  return {
    // React access the `render` function directly when encountring this type
    $$typeof: Symbol.for('react.forward_ref'),
    render: wrappedComponent,

    // RSC checks this hack instead of $$typeof
    _$$typeof: Symbol.for('react.module.reference'),
    // RSC payload
    filepath: meta.id,
    name: meta.name,
    named: meta.named,
  };
}
