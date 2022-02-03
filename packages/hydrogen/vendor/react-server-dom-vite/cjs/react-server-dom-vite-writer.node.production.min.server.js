/**
 * @license React
 * react-server-dom-vite-writer.node.production.min.server.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';
var h = require('react'),
  n = JSON.stringify,
  q = Symbol.for('react.module.reference'),
  r = 60103,
  t = 60107,
  u = 60112,
  v = 60115,
  w = 60116;
if ('function' === typeof Symbol && Symbol.for) {
  var x = Symbol.for;
  r = x('react.element');
  t = x('react.fragment');
  u = x('react.forward_ref');
  v = x('react.memo');
  w = x('react.lazy');
}
var y = Array.isArray,
  z =
    h.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher;
function A(a) {
  console.error(a);
}
function D(a, c, d) {
  var b = [],
    e = {
      status: 0,
      fatalError: null,
      destination: null,
      bundlerConfig: c,
      cache: new Map(),
      nextChunkId: 0,
      pendingChunks: 0,
      pingedSegments: b,
      completedModuleChunks: [],
      completedJSONChunks: [],
      completedErrorChunks: [],
      writtenSymbols: new Map(),
      writtenModules: new Map(),
      onError: void 0 === d ? A : d,
      toJSON: function (a, b) {
        return E(e, this, a, b);
      },
    };
  e.pendingChunks++;
  a = F(e, a);
  b.push(a);
  return e;
}
function G(a, c, d, b) {
  if (null !== d && void 0 !== d)
    throw Error(
      'Refs cannot be used in server components, nor passed to client components.'
    );
  if ('function' === typeof a) return a(b);
  if ('string' === typeof a) return [r, a, c, b];
  if ('symbol' === typeof a) return a === t ? b.children : [r, a, c, b];
  if (null != a && 'object' === typeof a) {
    if ((a.$$typeof_rsc || a.$$typeof) === q) return [r, a, c, b];
    switch (a.$$typeof) {
      case u:
        return (a = a.render), a(b, void 0);
      case v:
        return G(a.type, c, d, b);
    }
  }
  throw Error('Unsupported server component type: ' + H(a));
}
function I(a, c) {
  var d = a.pingedSegments;
  d.push(c);
  1 === d.length &&
    setImmediate(function () {
      return J(a);
    });
}
function F(a, c) {
  var d = {
    id: a.nextChunkId++,
    model: c,
    ping: function () {
      return I(a, d);
    },
  };
  return d;
}
function K(a) {
  return Object.prototype.toString
    .call(a)
    .replace(/^\[object (.*)\]$/, function (a, d) {
      return d;
    });
}
function L(a) {
  var c = JSON.stringify(a);
  return '"' + a + '"' === c ? a : c;
}
function H(a) {
  switch (typeof a) {
    case 'string':
      return JSON.stringify(10 >= a.length ? a : a.substr(0, 10) + '...');
    case 'object':
      if (y(a)) return '[...]';
      a = K(a);
      return 'Object' === a ? '{...}' : a;
    case 'function':
      return 'function';
    default:
      return String(a);
  }
}
function N(a, c) {
  if (y(a)) {
    for (var d = '[', b = 0; b < a.length; b++) {
      0 < b && (d += ', ');
      if (6 < b) {
        d += '...';
        break;
      }
      var e = a[b];
      d =
        '' + b === c && 'object' === typeof e && null !== e
          ? d + N(e)
          : d + H(e);
    }
    return d + ']';
  }
  d = '{';
  b = Object.keys(a);
  for (e = 0; e < b.length; e++) {
    0 < e && (d += ', ');
    if (6 < e) {
      d += '...';
      break;
    }
    var f = b[e];
    d += L(f) + ': ';
    var k = a[f];
    d = f === c && 'object' === typeof k && null !== k ? d + N(k) : d + H(k);
  }
  return d + '}';
}
function E(a, c, d, b) {
  switch (b) {
    case r:
      return '$';
    case w:
      throw Error('React Lazy Components are not yet supported on the server.');
  }
  for (; 'object' === typeof b && null !== b && b.$$typeof === r; ) {
    var e = b;
    try {
      b = G(e.type, e.key, e.ref, e.props);
    } catch (m) {
      if ('object' === typeof m && null !== m && 'function' === typeof m.then)
        return (
          a.pendingChunks++,
          (a = F(a, b)),
          (c = a.ping),
          m.then(c, c),
          '@' + a.id.toString(16)
        );
      O(a, m);
      a.pendingChunks++;
      c = a.nextChunkId++;
      P(a, c, m);
      return '@' + c.toString(16);
    }
  }
  if (null === b) return null;
  if ('object' === typeof b) {
    if ((b.$$typeof_rsc || b.$$typeof) === q) {
      e = b.filepath + '#' + b.name;
      var f = a.writtenModules,
        k = f.get(e);
      if (void 0 !== k)
        return c[0] === r && '1' === d
          ? '@' + k.toString(16)
          : '$' + k.toString(16);
      try {
        var l = {id: b.filepath, name: b.name};
        a.pendingChunks++;
        var g = a.nextChunkId++,
          B = n(l);
        var C = 'M' + g.toString(16) + ':' + B + '\n';
        a.completedModuleChunks.push(C);
        f.set(e, g);
        return c[0] === r && '1' === d
          ? '@' + g.toString(16)
          : '$' + g.toString(16);
      } catch (m) {
        return (
          a.pendingChunks++,
          (c = a.nextChunkId++),
          P(a, c, m),
          '$' + c.toString(16)
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
    if (/^on[A-Z]/.test(d))
      throw Error(
        'Event handlers cannot be passed to client component props. Remove ' +
          (L(d) +
            ' from these props if possible: ' +
            N(c) +
            '\nIf you need interactivity, consider converting part of this to a client component.')
      );
    throw Error(
      "Functions cannot be passed directly to client components because they're not serializable. Remove " +
        (L(d) +
          ' (' +
          (b.displayName || b.name || 'function') +
          ') from this object, or avoid the entire object: ' +
          N(c))
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
          (L(d) + ' from this object, or avoid the entire object: ' + N(c))
      );
    a.pendingChunks++;
    c = a.nextChunkId++;
    d = n(g);
    d = 'S' + c.toString(16) + ':' + d + '\n';
    a.completedModuleChunks.push(d);
    l.set(b, c);
    return '$' + c.toString(16);
  }
  if ('bigint' === typeof b)
    throw Error(
      'BigInt (' +
        b +
        ') is not yet supported in client component props. Remove ' +
        (L(d) + ' from this object or use a plain number instead: ' + N(c))
    );
  throw Error(
    'Type ' +
      typeof b +
      ' is not supported in client component props. Remove ' +
      (L(d) + ' from this object, or avoid the entire object: ' + N(c))
  );
}
function O(a, c) {
  a = a.onError;
  a(c);
}
function Q(a, c) {
  null !== a.destination
    ? ((a.status = 2), a.destination.destroy(c))
    : ((a.status = 1), (a.fatalError = c));
}
function P(a, c, d) {
  var b = '';
  try {
    if (d instanceof Error) {
      var e = String(d.message);
      b = String(d.stack);
    } else e = 'Error: ' + d;
  } catch (f) {
    e = 'An error occurred but serializing the error message failed.';
  }
  d = {message: e, stack: b};
  c = 'E' + c.toString(16) + ':' + n(d) + '\n';
  a.completedErrorChunks.push(c);
}
function J(a) {
  var c = z.current,
    d = R;
  z.current = S;
  R = a.cache;
  try {
    var b = a.pingedSegments;
    a.pingedSegments = [];
    for (var e = 0; e < b.length; e++) {
      var f = b[e];
      var k = a;
      try {
        for (
          var l = f.model;
          'object' === typeof l && null !== l && l.$$typeof === r;

        ) {
          var g = l;
          f.model = l;
          l = G(g.type, g.key, g.ref, g.props);
        }
        var B = f.id,
          C = n(l, k.toJSON);
        var m = 'J' + B.toString(16) + ':' + C + '\n';
        k.completedJSONChunks.push(m);
      } catch (p) {
        if (
          'object' === typeof p &&
          null !== p &&
          'function' === typeof p.then
        ) {
          var M = f.ping;
          p.then(M, M);
        } else O(k, p), P(k, f.id, p);
      }
    }
    null !== a.destination && T(a, a.destination);
  } catch (p) {
    O(a, p), Q(a, p);
  } finally {
    (z.current = c), (R = d);
  }
}
function T(a, c) {
  'function' === typeof c.cork && c.cork();
  try {
    for (var d = a.completedModuleChunks, b = 0; b < d.length; b++)
      if ((a.pendingChunks--, !c.write(d[b]))) {
        a.destination = null;
        b++;
        break;
      }
    d.splice(0, b);
    var e = a.completedJSONChunks;
    for (b = 0; b < e.length; b++)
      if ((a.pendingChunks--, !c.write(e[b]))) {
        a.destination = null;
        b++;
        break;
      }
    e.splice(0, b);
    var f = a.completedErrorChunks;
    for (b = 0; b < f.length; b++)
      if ((a.pendingChunks--, !c.write(f[b]))) {
        a.destination = null;
        b++;
        break;
      }
    f.splice(0, b);
  } finally {
    'function' === typeof c.uncork && c.uncork();
  }
  'function' === typeof c.flush && c.flush();
  0 === a.pendingChunks && c.end();
}
function U(a) {
  setImmediate(function () {
    return J(a);
  });
}
function V(a, c) {
  if (1 === a.status) (a.status = 2), c.destroy(a.fatalError);
  else if (2 !== a.status) {
    a.destination = c;
    try {
      T(a, c);
    } catch (d) {
      O(a, d), Q(a, d);
    }
  }
}
function W() {
  throw Error('This Hook is not supported in Server Components.');
}
function X() {
  if (!R)
    throw Error('Refreshing the cache is not supported in Server Components.');
}
var R = null,
  S = {
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
      if (!R)
        throw Error('Reading the cache is only supported while rendering.');
      var c = R.get(a);
      void 0 === c && ((c = a()), R.set(a, c));
      return c;
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
function Y(a, c) {
  return function () {
    return V(c, a);
  };
}
exports.renderToPipeableStream = function (a, c) {
  var d = D(a, {}, c ? c.onError : void 0),
    b = !1;
  U(d);
  return {
    pipe: function (a) {
      if (b)
        throw Error(
          'React currently only supports piping to one writable stream.'
        );
      b = !0;
      V(d, a);
      a.on('drain', Y(a, d));
      return a;
    },
  };
};
