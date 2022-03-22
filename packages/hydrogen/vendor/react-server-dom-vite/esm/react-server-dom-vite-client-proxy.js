/**
* @license React
 * react-server-dom-vite-client-proxy.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createElement } from 'react';

// eslint-disable-next-line no-unused-vars

/*global globalThis*/
// This is a store of components discovered during RSC
// to load them later when consuming the response in SSR.
globalThis.__COMPONENT_INDEX = {};

function isReactComponent(component, name, isNamed) {
  if (!component) return false;
  return typeof component === 'function' && (!isNamed || /^[A-Z]/.test(name)) || typeof component.render === 'function' || component.$$typeof === Symbol.for('react.element');
} // A ClientProxy behaves as a module reference for the Flight
// runtime (RSC) and as a real component for the Fizz runtime (SSR).
// Note that this is not used in browser environments.


function wrapInClientProxy(_ref) {
  var id = _ref.id,
      name = _ref.name,
      named = _ref.named,
      component = _ref.component;

  if (!isReactComponent(component, name, named)) {
    // This is not a React component, do not wrap it.
    return component;
  }

  var render = function (props) {
    return createElement(component, props);
  };

  Object.defineProperty(render, 'name', {
    value: name
  });

  {
    render.displayName = name;
  } // Fizz runtime accesses the `render` method directly when encountering a forward_ref


  var componentRef = Object.create(null);
  componentRef.$$typeof = Symbol.for('react.forward_ref');
  componentRef.render = render; // Flight runtime will check this custom typeof to decide wether this is a module ref

  var moduleRef = Object.create(null);
  moduleRef.$$typeof_rsc = Symbol.for('react.module.reference');
  moduleRef.filepath = id;
  moduleRef.name = named ? name : 'default'; // Store component in a global index during RSC to use them later in SSR

  globalThis.__COMPONENT_INDEX[id] = Object.defineProperty(globalThis.__COMPONENT_INDEX[id] || Object.create(null), moduleRef.name, {
    value: component,
    writable: true
  });
  return new Proxy(componentRef, {
    get: function (target, prop) {
      return (// 1. Let React access the element/ref and type in SSR
        target[prop] || // 2. Check module properties for RSC requests
        moduleRef[prop] || // 3. Fallback to custom component properties such as `ImageComponent.Fragment`
        component[prop]
      );
    }
  });
}

export { wrapInClientProxy };
