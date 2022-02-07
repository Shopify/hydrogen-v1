/**
 * @license React
 * react-server-dom-vite-writer.browser.production.min.server.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';
var h = require('react');
function n(a, d) {
  a.enqueue(d);
  return 0 < a.desiredSize;
}
var q = new TextEncoder();
function r(a, d) {
  'function' === typeof a.error ? a.error(d) : a.close();
}
var t = JSON.stringify,
  u = Symbol.for('react.module.reference'),
  v = 60103,
  w = 60107,
  x = 60112,
  y = 60115,
  z = 60116;
if ('function' === typeof Symbol && Symbol.for) {
  var A = Symbol.for;
  v = A('react.element');
  w = A('react.fragment');
  x = A('react.forward_ref');
  y = A('react.memo');
  z = A('react.lazy');
}
var B = Array.isArray,
  C =
    h.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher;
function G(a) {
  console.error(a);
}
function H(a, d, c) {
  var b = [],
    e = {
      status: 0,
      fatalError: null,
      destination: null,
      bundlerConfig: d,
      cache: new Map(),
      nextChunkId: 0,
      pendingChunks: 0,
      pingedSegments: b,
      completedModuleChunks: [],
      completedJSONChunks: [],
      completedErrorChunks: [],
      writtenSymbols: new Map(),
      writtenModules: new Map(),
      onError: void 0 === c ? G : c,
      toJSON: function (a, b) {
        return I(e, this, a, b);
      },
    };
  e.pendingChunks++;
  a = J(e, a);
  b.push(a);
  return e;
}
function K(a, d, c, b) {
  if (null !== c && void 0 !== c)
    throw Error(
      'Refs cannot be used in server components, nor passed to client components.'
    );
  if ('function' === typeof a) return a(b);
  if ('string' === typeof a) return [v, a, d, b];
  if ('symbol' === typeof a) return a === w ? b.children : [v, a, d, b];
  if (null != a && 'object' === typeof a) {
    if ((a.$$typeof_rsc || a.$$typeof) === u) return [v, a, d, b];
    switch (a.$$typeof) {
      case x:
        return (a = a.render), a(b, void 0);
      case y:
        return K(a.type, d, c, b);
    }
  }
  throw Error('Unsupported server component type: ' + L(a));
}
function J(a, d) {
  var c = {
    id: a.nextChunkId++,
    model: d,
    ping: function () {
      var b = a.pingedSegments;
      b.push(c);
      1 === b.length && M(a);
    },
  };
  return c;
}
function N(a) {
  return Object.prototype.toString
    .call(a)
    .replace(/^\[object (.*)\]$/, function (a, c) {
      return c;
    });
}
function O(a) {
  var d = JSON.stringify(a);
  return '"' + a + '"' === d ? a : d;
}
function L(a) {
  switch (typeof a) {
    case 'string':
      return JSON.stringify(10 >= a.length ? a : a.substr(0, 10) + '...');
    case 'object':
      if (B(a)) return '[...]';
      a = N(a);
      return 'Object' === a ? '{...}' : a;
    case 'function':
      return 'function';
    default:
      return String(a);
  }
}
function P(a, d) {
  if (B(a)) {
    for (var c = '[', b = 0; b < a.length; b++) {
      0 < b && (c += ', ');
      if (6 < b) {
        c += '...';
        break;
      }
      var e = a[b];
      c =
        '' + b === d && 'object' === typeof e && null !== e
          ? c + P(e)
          : c + L(e);
    }
    return c + ']';
  }
  c = '{';
  b = Object.keys(a);
  for (e = 0; e < b.length; e++) {
    0 < e && (c += ', ');
    if (6 < e) {
      c += '...';
      break;
    }
    var f = b[e];
    c += O(f) + ': ';
    var k = a[f];
    c = f === d && 'object' === typeof k && null !== k ? c + P(k) : c + L(k);
  }
  return c + '}';
}
function I(a, d, c, b) {
  switch (b) {
    case v:
      return '$';
    case z:
      throw Error('React Lazy Components are not yet supported on the server.');
  }
  for (; 'object' === typeof b && null !== b && b.$$typeof === v; ) {
    var e = b;
    try {
      b = K(e.type, e.key, e.ref, e.props);
    } catch (m) {
      if ('object' === typeof m && null !== m && 'function' === typeof m.then)
        return (
          a.pendingChunks++,
          (a = J(a, b)),
          (d = a.ping),
          m.then(d, d),
          '@' + a.id.toString(16)
        );
      R(a, m);
      a.pendingChunks++;
      d = a.nextChunkId++;
      S(a, d, m);
      return '@' + d.toString(16);
    }
  }
  if (null === b) return null;
  if ('object' === typeof b) {
    if ((b.$$typeof_rsc || b.$$typeof) === u) {
      e = b.filepath + '#' + b.name;
      var f = a.writtenModules,
        k = f.get(e);
      if (void 0 !== k)
        return d[0] === v && '1' === c
          ? '@' + k.toString(16)
          : '$' + k.toString(16);
      try {
        var l = {id: b.filepath, name: b.name};
        a.pendingChunks++;
        var g = a.nextChunkId++,
          D = t(l),
          E = 'M' + g.toString(16) + ':' + D + '\n';
        var F = q.encode(E);
        a.completedModuleChunks.push(F);
        f.set(e, g);
        return d[0] === v && '1' === c
          ? '@' + g.toString(16)
          : '$' + g.toString(16);
      } catch (m) {
        return (
          a.pendingChunks++,
          (d = a.nextChunkId++),
          S(a, d, m),
          '$' + d.toString(16)
        );
      }
    }
    return b;
  }
  if ('string' === typeof b)
    return (a = '$' === b[0] || '@' === b[0] ? '$' + b : b), a;
  if (
    'boolean' === typeof b ||
    'number' === typeof b ||
    'undefined' === typeof b
  )
    return b;
  if ('function' === typeof b) {
    if (/^on[A-Z]/.test(c))
      throw Error(
        'Event handlers cannot be passed to client component props. Remove ' +
          (O(c) +
            ' from these props if possible: ' +
            P(d) +
            '\nIf you need interactivity, consider converting part of this to a client component.')
      );
    throw Error(
      "Functions cannot be passed directly to client components because they're not serializable. Remove " +
        (O(c) +
          ' (' +
          (b.displayName || b.name || 'function') +
          ') from this object, or avoid the entire object: ' +
          P(d))
    );
  }
  if ('symbol' === typeof b) {
    l = a.writtenSymbols;
    g = l.get(b);
    if (void 0 !== g) return '$' + g.toString(16);
    g = b.description;
    if (Symbol.for(g) !== b)
      throw Error(
        'Only global symbols received from Symbol.for(...) can be passed to client components. The symbol Symbol.for(' +
          (b.description + ') cannot be found among global symbols. Remove ') +
          (O(c) + ' from this object, or avoid the entire object: ' + P(d))
      );
    a.pendingChunks++;
    d = a.nextChunkId++;
    c = t(g);
    c = 'S' + d.toString(16) + ':' + c + '\n';
    c = q.encode(c);
    a.completedModuleChunks.push(c);
    l.set(b, d);
    return '$' + d.toString(16);
  }
  if ('bigint' === typeof b)
    throw Error(
      'BigInt (' +
        b +
        ') is not yet supported in client component props. Remove ' +
        (O(c) + ' from this object or use a plain number instead: ' + P(d))
    );
  throw Error(
    'Type ' +
      typeof b +
      ' is not supported in client component props. Remove ' +
      (O(c) + ' from this object, or avoid the entire object: ' + P(d))
  );
}
function R(a, d) {
  a = a.onError;
  a(d);
}
function T(a, d) {
  null !== a.destination
    ? ((a.status = 2), r(a.destination, d))
    : ((a.status = 1), (a.fatalError = d));
}
function S(a, d, c) {
  var b = '';
  try {
    if (c instanceof Error) {
      var e = String(c.message);
      b = String(c.stack);
    } else e = 'Error: ' + c;
  } catch (f) {
    e = 'An error occurred but serializing the error message failed.';
  }
  c = {message: e, stack: b};
  d = 'E' + d.toString(16) + ':' + t(c) + '\n';
  d = q.encode(d);
  a.completedErrorChunks.push(d);
}
function M(a) {
  var d = C.current,
    c = U;
  C.current = V;
  U = a.cache;
  try {
    var b = a.pingedSegments;
    a.pingedSegments = [];
    for (var e = 0; e < b.length; e++) {
      var f = b[e];
      var k = a;
      try {
        for (
          var l = f.model;
          'object' === typeof l && null !== l && l.$$typeof === v;

        ) {
          var g = l;
          f.model = l;
          l = K(g.type, g.key, g.ref, g.props);
        }
        var D = f.id,
          E = t(l, k.toJSON),
          F = 'J' + D.toString(16) + ':' + E + '\n';
        var m = q.encode(F);
        k.completedJSONChunks.push(m);
      } catch (p) {
        if (
          'object' === typeof p &&
          null !== p &&
          'function' === typeof p.then
        ) {
          var Q = f.ping;
          p.then(Q, Q);
        } else R(k, p), S(k, f.id, p);
      }
    }
    null !== a.destination && W(a, a.destination);
  } catch (p) {
    R(a, p), T(a, p);
  } finally {
    (C.current = d), (U = c);
  }
}
function W(a, d) {
  for (var c = a.completedModuleChunks, b = 0; b < c.length; b++)
    if ((a.pendingChunks--, !n(d, c[b]))) {
      a.destination = null;
      b++;
      break;
    }
  c.splice(0, b);
  c = a.completedJSONChunks;
  for (b = 0; b < c.length; b++)
    if ((a.pendingChunks--, !n(d, c[b]))) {
      a.destination = null;
      b++;
      break;
    }
  c.splice(0, b);
  c = a.completedErrorChunks;
  for (b = 0; b < c.length; b++)
    if ((a.pendingChunks--, !n(d, c[b]))) {
      a.destination = null;
      b++;
      break;
    }
  c.splice(0, b);
  0 === a.pendingChunks && d.close();
}
function X() {
  throw Error('This Hook is not supported in Server Components.');
}
function Y() {
  if (!U)
    throw Error('Refreshing the cache is not supported in Server Components.');
}
var U = null,
  V = {
    useMemo: function (a) {
      return a();
    },
    useCallback: function (a) {
      return a;
    },
    useDebugValue: function () {},
    useDeferredValue: X,
    useTransition: X,
    getCacheForType: function (a) {
      if (!U)
        throw Error('Reading the cache is only supported while rendering.');
      var d = U.get(a);
      void 0 === d && ((d = a()), U.set(a, d));
      return d;
    },
    readContext: X,
    useContext: X,
    useReducer: X,
    useRef: X,
    useState: X,
    useInsertionEffect: X,
    useLayoutEffect: X,
    useImperativeHandle: X,
    useEffect: X,
    useId: X,
    useMutableSource: X,
    useSyncExternalStore: X,
    useCacheRefresh: function () {
      return Y;
    },
  };
exports.renderToReadableStream = function (a, d) {
  var c = H(a, {}, d ? d.onError : void 0),
    b = new ReadableStream({
      start: function () {
        M(c);
      },
      pull: function (a) {
        if (b.locked)
          if (1 === c.status) (c.status = 2), r(a, c.fatalError);
          else if (2 !== c.status) {
            c.destination = a;
            try {
              W(c, a);
            } catch (f) {
              R(c, f), T(c, f);
            }
          }
      },
      cancel: function () {},
    });
  return b;
};
