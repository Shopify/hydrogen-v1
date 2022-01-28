/** @license React vundefined
 * react-server-dom-vite-client-proxy.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createElement} from 'react';

globalThis.__COMPONENT_INDEX = {};

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function isReactComponent(component, name) {
  if (component) {
    return (
      // Workaround for hooks
      !/^use[A-Z]/.test(name) &&
      (typeof component === 'function' ||
        typeof component.render === 'function' ||
        component.$$typeof === Symbol.for('react.element'))
    );
  }

  return false;
}

function wrapInClientProxy(_ref) {
  var id = _ref.id,
    name = _ref.name,
    named = _ref.named,
    component = _ref.component;

  if (!isReactComponent(component, name)) {
    // This is not a React component, return it as is.
    return component;
  } // Use object syntax here to make sure the function name
  // comes from the meta params for better error stacks.

  var render = _defineProperty({}, name, function (props) {
    return createElement(component, props);
  })[name];

  {
    render.displayName = name;
  } // React accesses the `render` function directly when encountring this type

  var componentRef = Object.create(null);
  componentRef.$$typeof = Symbol.for('react.forward_ref');
  componentRef.render = render; // This custom type is checked in RSC renderer

  var rscDescriptor = Object.create(null);
  rscDescriptor.$$typeof_rsc = Symbol.for('react.module.reference');
  rscDescriptor.filepath = id;
  rscDescriptor.name = named ? name : 'default';

  if (!__COMPONENT_INDEX[id]) {
    // Store a loader function to find components during SSR when consuming RSC
    __COMPONENT_INDEX[id] = () =>
      Promise.resolve({[rscDescriptor.name]: component});
  }

  return new Proxy(componentRef, {
    get: function (target, prop) {
      return (
        // 1. Let React access the element/ref and type in SSR
        target[prop] || // 2. Check descriptor properties for RSC requests
        rscDescriptor[prop] || // 3. Fallback to custom component properties such as `ImageComponent.Fragment`
        component[prop]
      );
    },
  });
}

export {wrapInClientProxy};
