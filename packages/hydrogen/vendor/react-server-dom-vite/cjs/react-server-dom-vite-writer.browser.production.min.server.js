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
function p(a, d) {
  a.enqueue(d);
  return 0 < a.desiredSize;
}
var q = new TextEncoder();
function r(a, d) {
  'function' === typeof a.error ? a.error(d) : a.close();
}
var t = JSON.stringify,
  u = Symbol.for('react.module.reference'),
  v = Symbol.for('react.element'),
  w = Symbol.for('react.fragment'),
  x = Symbol.for('react.forward_ref'),
  y = Symbol.for('react.memo'),
  z = Symbol.for('react.lazy'),
  A = Array.isArray,
  B =
    h.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher;
function F(a) {
  console.error(a);
}
function G(a, d, c) {
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
      onError: void 0 === c ? F : c,
      toJSON: function (a, b) {
        return H(e, this, a, b);
      },
    };
  e.pendingChunks++;
  a = I(e, a);
  b.push(a);
  return e;
}
function J(a, d, c, b) {
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
        return J(a.type, d, c, b);
    }
  }
  throw Error('Unsupported server component type: ' + K(a));
}
function I(a, d) {
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
function K(a) {
  switch (typeof a) {
    case 'string':
      return JSON.stringify(10 >= a.length ? a : a.substr(0, 10) + '...');
    case 'object':
      if (A(a)) return '[...]';
      a = N(a);
      return 'Object' === a ? '{...}' : a;
    case 'function':
      return 'function';
    default:
      return String(a);
  }
}
function P(a, d) {
  if (A(a)) {
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
          : c + K(e);
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
    c = f === d && 'object' === typeof k && null !== k ? c + P(k) : c + K(k);
  }
  return c + '}';
}
function H(a, d, c, b) {
  switch (b) {
    case v:
      return '$';
    case z:
      throw Error('React Lazy Components are not yet supported on the server.');
  }
  for (; 'object' === typeof b && null !== b && b.$$typeof === v; ) {
    var e = b;
    try {
      b = J(e.type, e.key, e.ref, e.props);
    } catch (m) {
      if ('object' === typeof m && null !== m && 'function' === typeof m.then)
        return (
          a.pendingChunks++,
          (a = I(a, b)),
          (d = a.ping),
          m.then(d, d),
          '@' + a.id.toString(16)
        );
      Q(a, m);
      a.pendingChunks++;
      d = a.nextChunkId++;
      R(a, d, m);
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
          C = t(l),
          D = 'M' + g.toString(16) + ':' + C + '\n';
        var E = q.encode(D);
        a.completedModuleChunks.push(E);
        f.set(e, g);
        return d[0] === v && '1' === c
          ? '@' + g.toString(16)
          : '$' + g.toString(16);
      } catch (m) {
        return (
          a.pendingChunks++,
          (d = a.nextChunkId++),
          R(a, d, m),
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
function Q(a, d) {
  a = a.onError;
  a(d);
}
function S(a, d) {
  null !== a.destination
    ? ((a.status = 2), r(a.destination, d))
    : ((a.status = 1), (a.fatalError = d));
}
function R(a, d, c) {
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
  var d = B.current,
    c = T;
  B.current = U;
  T = a.cache;
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
          l = J(g.type, g.key, g.ref, g.props);
        }
        var C = f.id,
          D = t(l, k.toJSON),
          E = 'J' + C.toString(16) + ':' + D + '\n';
        var m = q.encode(E);
        k.completedJSONChunks.push(m);
      } catch (n) {
        if (
          'object' === typeof n &&
          null !== n &&
          'function' === typeof n.then
        ) {
          var L = f.ping;
          n.then(L, L);
        } else Q(k, n), R(k, f.id, n);
      }
    }
    null !== a.destination && V(a, a.destination);
  } catch (n) {
    Q(a, n), S(a, n);
  } finally {
    (B.current = d), (T = c);
  }
}
function V(a, d) {
  for (var c = a.completedModuleChunks, b = 0; b < c.length; b++)
    if ((a.pendingChunks--, !p(d, c[b]))) {
      a.destination = null;
      b++;
      break;
    }
  c.splice(0, b);
  c = a.completedJSONChunks;
  for (b = 0; b < c.length; b++)
    if ((a.pendingChunks--, !p(d, c[b]))) {
      a.destination = null;
      b++;
      break;
    }
  c.splice(0, b);
  c = a.completedErrorChunks;
  for (b = 0; b < c.length; b++)
    if ((a.pendingChunks--, !p(d, c[b]))) {
      a.destination = null;
      b++;
      break;
    }
  c.splice(0, b);
  0 === a.pendingChunks && d.close();
}
function W() {
  throw Error('This Hook is not supported in Server Components.');
}
function X() {
  if (!T)
    throw Error('Refreshing the cache is not supported in Server Components.');
}
var T = null,
  U = {
    useMemo: function (a) {
      return a();
    },
    useCallback: function (a) {
      return a;
    },
    useDebugValue: function () {},
    useDeferredValue: W,
    useTransition: W,
    getCacheForType: function (a) {
      if (!T)
        throw Error('Reading the cache is only supported while rendering.');
      var d = T.get(a);
      void 0 === d && ((d = a()), T.set(a, d));
      return d;
    },
    readContext: W,
    useContext: W,
    useReducer: W,
    useRef: W,
    useState: W,
    useInsertionEffect: W,
    useLayoutEffect: W,
    useImperativeHandle: W,
    useEffect: W,
    useId: W,
    useMutableSource: W,
    useSyncExternalStore: W,
    useCacheRefresh: function () {
      return X;
    },
  };
exports.renderToReadableStream = function (a, d) {
  var c = G(a, {}, d ? d.onError : void 0),
    b = new ReadableStream({
      start: function () {
        M(c);
      },
      pull: function (a) {
        if (b.locked)
          if (1 === c.status) (c.status = 2), r(a, c.fatalError);
          else if (2 !== c.status && null === c.destination) {
            c.destination = a;
            try {
              V(c, a);
            } catch (f) {
              Q(c, f), S(c, f);
            }
          }
      },
      cancel: function () {},
    });
  return b;
};
