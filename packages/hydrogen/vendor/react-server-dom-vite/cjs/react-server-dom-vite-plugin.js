/**
 * @license React
 * react-server-dom-vite-plugin.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

'use strict';

var esModuleLexer = require('es-module-lexer');
var MagicString = require('magic-string');
var vite = require('vite');
var fs = require('fs');
var path = require('path');

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = o[Symbol.iterator]();
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

var rscViteFileRE = /\/react-server-dom-vite.js/;
var noProxyRE = /[&?]no-proxy($|&)/;
function ReactFlightVitePlugin() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$isServerComponen = _ref.isServerComponentImporterAllowed,
      isServerComponentImporterAllowed = _ref$isServerComponen === void 0 ? function (importer) {
    return false;
  } : _ref$isServerComponen,
      _ref$isClientComponen = _ref.isClientComponent,
      isClientComponent = _ref$isClientComponen === void 0 ? function (id) {
    return /\.client\.[jt]sx?($|\?)/.test(id);
  } : _ref$isClientComponen,
      findClientComponentsForClientBuild = _ref.findClientComponentsForClientBuild;

  var config;
  var server;
  var invalidateTimeout;
  var absoluteImporterPath;

  function invalidateImporter() {
    clearTimeout(invalidateTimeout);
    invalidateTimeout = setTimeout(function () {
      return server.watcher.emit('change', absoluteImporterPath);
    }, 100);
  }

  function wrapIfClientComponent(id) {
    var handle = function (isClient) {
      if (!isClient) return null;

      if (server) {
        var moduleNode = server.moduleGraph.getModuleById(id);

        if (!moduleNode.__isClientComponent) {
          moduleNode.__isClientComponent = true;
          if (absoluteImporterPath) invalidateImporter();
        }
      }

      return proxyClientComponent(id.split('?')[0]);
    };

    var tmp = isClientComponent(id);
    return typeof tmp === 'boolean' ? handle(tmp) : tmp.then(handle);
  }

  return {
    name: 'vite-plugin-react-server-components',
    enforce: 'pre',
    configureServer: function (_server) {
      server = _server;
    },
    configResolved: function (_config) {
      config = _config; // By pushing this plugin at the end of the existing array,
      // we enforce running it *after* Vite resolves import.meta.glob.

      config.plugins.push(hashImportsPlugin);
    },
    resolveId: function (source, importer) {
      if (!importer) return null;
      /**
       * Throw errors when non-Server Components try to load Server Components.
       */

      if (/\.server(\.[jt]sx?)?$/.test(source) && !(/(\.server\.[jt]sx?|index\.html)$/.test(importer) || isServerComponentImporterAllowed(importer, source))) {
        throw new Error("Cannot import " + source + " from \"" + importer + "\". " + 'By react-server convention, .server.js files can only be imported from other .server.js files. ' + 'That way nobody accidentally sends these to the client by indirectly importing it.');
      }
    },
    load: function (id) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (!options.ssr || !shouldCheckClientComponent(id)) return;

      if (server) {
        var mod = server.moduleGraph.idToModuleMap.get(id.replace('/@fs', ''));

        if (mod && mod.importers) {
          if (Array.from(mod.importers).every(function (impMod) {
            return noProxyRE.test(impMod.id);
          })) {
            // This module is only imported from client components
            // so we don't need to create a module reference
            return;
          }
        }
      }

      return wrapIfClientComponent(id);
    },
    transform: function (code, id) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      /**
       * In order to allow dynamic component imports from RSC, we use Vite's import.meta.glob.
       * This hook replaces the glob placeholders with resolved paths to all client components.
       *
       * NOTE: Glob import paths MUST be relative to the importer file in
       * order to get the `?v=xxx` querystring from Vite added to the import URL.
       * If the paths are relative to the root instead, Vite won't add the querystring
       * and we will have duplicated files in the browser (with duplicated contexts, etc).
       */
      if (rscViteFileRE.test(id)) {
        var INJECTING_RE = /\{\s*__INJECTED_CLIENT_IMPORTERS__[:\s]*null[,\s]*\}\s*;/;
        var s = new MagicString(code);
        id = id.split('?')[0];

        if (options && options.ssr) {
          // In SSR, directly use components already discovered by RSC
          // instead of globs to avoid bundling unused components.
          s.replace(INJECTING_RE, 'globalThis.__COMPONENT_INDEX');
          return {
            code: s.toString(),
            map: s.generateMap({
              file: id,
              source: id
            })
          };
        }

        var injectGlobs = function (clientComponents) {
          var importerPath = path.dirname(id);
          var importers = clientComponents.map(function (absolutePath) {
            return vite.normalizePath(path.relative(importerPath, absolutePath));
          });
          var injectedGlobs = "Object.assign(Object.create(null), " + importers.map(function (glob) {
            return (// Mark the globs to modify the result after Vite resolves them.
              "/* HASH_BEGIN */ " + ("import.meta.glob('" + vite.normalizePath(glob) + "') /* HASH_END */")
            );
          }).join(', ') + ");";
          s.replace(INJECTING_RE, injectedGlobs);
          return {
            code: s.toString(),
            map: s.generateMap({
              file: id,
              source: id
            })
          };
        };

        if (config.command === 'serve') {
          absoluteImporterPath = id;
          return injectGlobs(findClientComponentsForDev(server));
        }

        if (!findClientComponentsForClientBuild) {
          throw new Error('[react-server-dom-vite] Parameter findClientComponentsForClientBuild is required for client build');
        }

        var tmp = findClientComponentsForClientBuild(config);
        return Array.isArray(tmp) ? injectGlobs(tmp) : tmp.then(injectGlobs);
      }
    }
  };
}

var btoa = function (hash) {
  return (// eslint-disable-next-line react-internal/safe-string-coercion
    Buffer.from(String(hash), 'binary').toString('base64')
  );
}; // Quick, lossy hash function: https://stackoverflow.com/a/8831937/4468962
// Prevents leaking path information in the browser, and minifies RSC responses.


function hashCode(value) {
  var hash = 0;

  for (var i = 0; i < value.length; i++) {
    var char = value.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash;
  }

  return btoa(hash).replace(/=+/, '');
}

var getComponentFilename = function (filepath) {
  return filepath.split('/').pop().split('.').shift();
};

var getComponentId = function (filepath) {
  return getComponentFilename(filepath) + "-" + hashCode(filepath);
};
async function proxyClientComponent(filepath, src) {
  var DEFAULT_EXPORT = 'default'; // Modify the import ID to avoid infinite wraps

  var importFrom = filepath + "?no-proxy";
  await esModuleLexer.init;

  if (!src) {
    src = await fs.promises.readFile(filepath, 'utf-8');
  }

  var _await$transformWithE = await vite.transformWithEsbuild(src, filepath),
      code = _await$transformWithE.code;

  var _parse = esModuleLexer.parse(code),
      exportStatements = _parse[1];

  var proxyCode = "import {wrapInClientProxy} from 'react-server-dom-vite/client-proxy';\n" + ("import * as allImports from '" + importFrom + "';\n\n"); // Wrap components in Client Proxy

  exportStatements.forEach(function (key) {
    var isDefault = key === DEFAULT_EXPORT;
    var componentName = isDefault ? getComponentFilename(filepath) : key;
    proxyCode += "export " + (isDefault ? DEFAULT_EXPORT : "const " + componentName + " =") + " wrapInClientProxy({ name: '" + componentName + "', id: '" + getComponentId(filepath) + "', value: allImports['" + key + "'], isDefault: " + // eslint-disable-next-line react-internal/safe-string-coercion
    String(isDefault) + " });\n";
  });
  return proxyCode;
}

function shouldCheckClientComponent(id) {
  return /\.[jt]sx?($|\?)/.test(id) && !noProxyRE.test(id);
}

function findClientComponentsForDev(server) {
  var clientComponents = []; // eslint-disable-next-line no-for-of-loops/no-for-of-loops

  var _iterator = _createForOfIteratorHelper(server.moduleGraph.fileToModulesMap.values()),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var set = _step.value;
      var clientModule = Array.from(set).find(function (moduleNode) {
        return moduleNode.__isClientComponent;
      });
      if (clientModule) clientComponents.push(clientModule.file);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return clientComponents;
}

var hashImportsPlugin = {
  name: 'vite-plugin-react-server-components-hash-imports',
  enforce: 'post',
  transform: function (code, id) {
    // Turn relative import paths to lossy hashes
    if (rscViteFileRE.test(id)) {
      var s = new MagicString(code);
      s.replace(/\/\*\s*HASH_BEGIN\s*\*\/\s*([^]+?)\/\*\s*HASH_END\s*\*\//gm, function (_, imports) {
        return imports.trim().replace(/"([^"]+?)":/gm, function (__, relativePath) {
          var absolutePath = path.resolve(path.dirname(id.split('?')[0]), relativePath);
          return "\"" + getComponentId(vite.normalizePath(absolutePath)) + "\":";
        });
      });
      return {
        code: s.toString(),
        map: s.generateMap({
          file: id,
          source: id
        })
      };
    }
  }
}; // This can be used in custom findClientComponentsForClientBuild implementations

ReactFlightVitePlugin.findClientComponentsFromServer = findClientComponentsForDev;

module.exports = ReactFlightVitePlugin;
